
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
const googleApiKey = Deno.env.get("GOOGLE_API_KEY");

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
    // Prompt for AI
    const prompt = `Give me a JSON array of 100 objects, each object being a unique traditional crop. Each object must have: id (1-100), title (crop name), description (brief about history & usage), category (type), and season (best growing season). Do NOT add any explanations, just output raw JSON array.`;

    // Try OpenAI first
    let crops;
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
            { role: "system", content: "You are a helpful assistant that generates structured data." },
            { role: "user", content: prompt }
          ],
          max_tokens: 4096
        })
      });
      const result = await response.json();
      try {
        crops = JSON.parse(result.choices[0].message.content);
      } catch (_) { /* fallback below if needed */ }
    }

    // Try Gemini if OpenAI failed
    if (!crops && geminiApiKey) {
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
        crops = JSON.parse(text);
      } catch (_) { /* fallback to google */ }
    }

    if (!crops && googleApiKey) {
      crops = [];
    }

    if (!crops) crops = [];

    return new Response(JSON.stringify(crops), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
