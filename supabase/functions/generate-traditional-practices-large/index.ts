
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
const googleApiKey = Deno.env.get("GOOGLE_API_KEY");

let cachedData: any[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION_MS = 1000 * 60 * 30; // 30 minutes

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Return cache if available and fresh
    if (cachedData && Date.now() - lastCacheTime < CACHE_DURATION_MS) {
      return new Response(JSON.stringify(cachedData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const prompt = `Give me a JSON array of 200 unique traditional Indian crops/practices. Each object must have: id (1-200), title, description (one line), category (one of: technique, irrigation, pest control, soil care, crop), and season ("Winter", "Summer", "Monsoon", or "Year-round"). No explanations, just JSON.`;

    let practices = null;

    // 1. Try OpenAI
    if (openAIApiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You generate structured traditional agricultural practices/crops for India." },
            { role: "user", content: prompt }
          ],
          max_tokens: 4096,
        }),
      });
      const result = await response.json();
      try {
        practices = JSON.parse(result.choices[0].message.content);
      } catch (_) {}
    }

    // 2. Try Gemini
    if (!practices && geminiApiKey) {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });
      const result = await response.json();
      try {
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        practices = JSON.parse(text);
      } catch (_) {}
    }

    // 3. Try Google (if set)
    if (!practices && googleApiKey) {
      practices = [];
    }

    if (!practices) practices = [];

    // Cache
    cachedData = practices;
    lastCacheTime = Date.now();

    return new Response(JSON.stringify(practices), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
