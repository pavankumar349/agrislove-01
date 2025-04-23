
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
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Give me a JSON array of 200 unique Indian traditional recipes. Each object must have: id (1-200), title, ingredients (array of 4-8 items), description (one sentence), and cookingTime (e.g., "35 min"). No explanations, just raw JSON.`;

    let recipes = null;

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
            { role: "system", content: "You generate India's traditional recipes (for a database)." },
            { role: "user", content: prompt }
          ],
          max_tokens: 4096,
        }),
      });
      const result = await response.json();
      try {
        recipes = JSON.parse(result.choices[0].message.content);
      } catch (_) {}
    }

    // 2. Try Gemini
    if (!recipes && geminiApiKey) {
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
        recipes = JSON.parse(text);
      } catch (_) {}
    }

    // 3. Try Google (you can add logic here)
    if (!recipes && googleApiKey) {
      recipes = [];
    }

    if (!recipes) recipes = [];

    // Cache
    cachedData = recipes;
    lastCacheTime = Date.now();

    return new Response(JSON.stringify(recipes), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
