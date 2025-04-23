
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
    // Get the crop name from the request if provided
    let cropName;
    try {
      const body = await req.json();
      cropName = body.cropName;
    } catch (e) {
      // No specific crop requested
    }

    // Prompt for AI
    const prompt = cropName 
      ? `Give me detailed fertilizer recommendations for ${cropName} cultivation. Include information about NPK ratios, organic options, application timing, and dosage. Return as a JSON object with these fields: cropName, organicFertilizers (array), chemicalFertilizers (array), applicationTiming, dosagePerAcre, specialNotes. Return ONLY valid JSON, no explanations or markdown.`
      : `Give me a JSON array of 50 objects, each representing fertilizer recommendations for a different crop. Each object should have these fields: cropName, organicFertilizers (array), chemicalFertilizers (array), applicationTiming, dosagePerAcre, specialNotes. Only include major Indian crops. Return ONLY valid JSON array, no explanations or markdown.`;

    // Try OpenAI first
    let fertilizers;
    if (openAIApiKey) {
      console.log("Attempting to use OpenAI for fertilizer recommendations");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant that generates structured data about agricultural fertilizers." },
            { role: "user", content: prompt }
          ],
          max_tokens: 4096
        })
      });
      const result = await response.json();
      try {
        fertilizers = cropName
          ? JSON.parse(result.choices[0].message.content)
          : JSON.parse(result.choices[0].message.content);
        console.log("Successfully generated fertilizer recommendations with OpenAI");
      } catch (e) {
        console.error("Error parsing OpenAI response:", e);
        /* fallback below if needed */
      }
    }

    // Try Gemini if OpenAI failed
    if (!fertilizers && geminiApiKey) {
      console.log("Attempting to use Gemini for fertilizer recommendations");
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
        // Extract JSON from Gemini's response which might include markdown code blocks
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text];
        fertilizers = JSON.parse(jsonMatch[1] || text);
        console.log("Successfully generated fertilizer recommendations with Gemini");
      } catch (e) {
        console.error("Error parsing Gemini response:", e);
      }
    }

    // Fallback to static data if API calls fail
    if (!fertilizers) {
      console.log("Using fallback static data for fertilizer recommendations");
      if (cropName) {
        fertilizers = {
          cropName: cropName,
          organicFertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
          chemicalFertilizers: ["NPK 10-26-26", "Urea"],
          applicationTiming: "Apply base fertilizer 2 weeks before sowing, top dressing during vegetative growth",
          dosagePerAcre: "Organic: 5-10 tonnes/acre, Chemical: 100-150 kg/acre",
          specialNotes: "Adjust based on soil test results. Foliar application of micronutrients may be needed."
        };
      } else {
        fertilizers = [
          {
            cropName: "Rice",
            organicFertilizers: ["Farmyard Manure", "Green Manure", "Compost"],
            chemicalFertilizers: ["NPK 10:26:26", "Urea", "DAP"],
            applicationTiming: "Basal application during land preparation, top dressing at tillering and panicle initiation",
            dosagePerAcre: "Organic: 5-8 tonnes/acre, Chemical: 100-150 kg/acre",
            specialNotes: "Split nitrogen application recommended. Zinc sulfate application beneficial."
          },
          {
            cropName: "Wheat",
            organicFertilizers: ["Farmyard Manure", "Compost", "Vermicompost"],
            chemicalFertilizers: ["NPK 12:32:16", "Urea"],
            applicationTiming: "50% at sowing, 25% at first irrigation, 25% at second irrigation",
            dosagePerAcre: "Organic: 4-6 tonnes/acre, Chemical: 100-120 kg/acre",
            specialNotes: "Sulfur application improves grain quality and yield."
          },
          {
            cropName: "Cotton",
            organicFertilizers: ["Farmyard Manure", "Compost", "Neem Cake"],
            chemicalFertilizers: ["NPK 20:10:10", "Ammonium Sulfate"],
            applicationTiming: "Basal application before sowing, top dressing at flowering and boll formation",
            dosagePerAcre: "Organic: 5-10 tonnes/acre, Chemical: 80-100 kg/acre",
            specialNotes: "Foliar sprays of micronutrients during square formation increase yield."
          }
        ];
      }
    }

    return new Response(JSON.stringify(fertilizers), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in generate-fertilizer function:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
