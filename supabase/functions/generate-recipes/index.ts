
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
    const prompt = `Give me a JSON array of 100 objects, each object being a unique Indian traditional food recipe. Each object should have: id (1-100), title, ingredients (array of strings), description, and cookingTime (as string, e.g. "30 min"). Please do NOT include any explanation before or after the JSON, just return pure JSON.`;

    // Try OpenAI first
    let recipes;
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
        recipes = JSON.parse(result.choices[0].message.content);
      } catch (_) { /* Fallback below if needed */ }
    }

    // Try Gemini if OpenAI failed
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
      // Gemini returns text
      try {
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        recipes = JSON.parse(text);
      } catch (_) { /* Fallback to google */ }
    }

    // Try Google Vertex AI (if user provided)
    if (!recipes && googleApiKey) {
      // Not a real endpoint; add your real API call for production
      recipes = [];
    }

    // If we couldn't get AI, fallback to empty
    if (!recipes) recipes = [];

    return new Response(JSON.stringify(recipes), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
