
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Predefined agricultural knowledge prompts to enhance the chatbot's agricultural knowledge
const agriculturalKnowledgePrompt = `You are an agricultural assistant with expertise in both modern and traditional farming practices. 
You have knowledge about:
- Various crop types and their growing conditions
- Soil types and soil health management
- Organic and traditional pest control methods
- Sustainable farming practices
- Traditional and indigenous agricultural knowledge
- Weather impacts on agriculture
- Fertilizers and soil amendments
- Crop rotation and companion planting
- Water conservation techniques
- Harvest and post-harvest handling

When answering, prioritize sustainable and eco-friendly approaches. Include traditional wisdom where applicable.
For technical questions, provide practical, actionable advice that farmers can implement.
If you're uncertain, acknowledge limitations rather than providing potentially harmful advice.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from environment variable
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
      throw new Error('Neither GEMINI_API_KEY nor OPENAI_API_KEY environment variable is set');
    }

    const { message } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let response;
    
    // Try Gemini first, fall back to OpenAI if needed
    if (GEMINI_API_KEY) {
      try {
        response = await callGeminiApi(GEMINI_API_KEY, message);
      } catch (error) {
        console.error('Gemini API error:', error);
        if (OPENAI_API_KEY) {
          console.log('Falling back to OpenAI API');
          response = await callOpenAiApi(OPENAI_API_KEY, message);
        } else {
          throw error;
        }
      }
    } else {
      response = await callOpenAiApi(OPENAI_API_KEY, message);
    }

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in agriculture-chatbot function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function callGeminiApi(apiKey: string, message: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: agriculturalKnowledgePrompt },
            { text: `User query: ${message}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Gemini API error: ${data.error?.message || 'Unknown error'}`);
  }

  // Extract text from Gemini response
  return data.candidates[0].content.parts[0].text;
}

async function callOpenAiApi(apiKey: string, message: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: agriculturalKnowledgePrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1024
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
  }

  return data.choices[0].message.content;
}
