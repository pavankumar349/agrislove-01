
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const { state, district } = await req.json();
    
    if (!state) {
      return new Response(
        JSON.stringify({ error: 'State is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const prompt = `Generate realistic weather forecast data for agricultural purposes for ${district ? district + ', ' : ''}${state}, India for the next 5 days. 
    
    The response should be in this exact JSON format:
    {
      "weatherData": [
        {
          "state": "${state}",
          "district": "${district || 'General'}",
          "temperature": [realistic temperature in Celsius],
          "humidity": [realistic humidity percentage],
          "rainfall": [realistic rainfall in mm],
          "forecast": [short weather description like "Partly Cloudy", "Rainy", "Sunny"],
          "forecast_date": [date in YYYY-MM-DD format starting from today]
        },
        ... 4 more entries for consecutive days
      ]
    }
    
    Make the data as realistic as possible based on the typical weather patterns for this region at this time of year. Include appropriate seasonal variations and ensure the data is agriculturally relevant.
    
    ONLY return the JSON, no other text.`;

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
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
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse JSON from the text
    let weatherData;
    try {
      // Find JSON in the response (the model sometimes includes surrounding text)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        weatherData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract JSON from response');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('Raw response:', generatedText);
      throw new Error('Failed to parse weather data from Gemini response');
    }
    
    // Store in Supabase database for future use
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseServiceKey && weatherData.weatherData) {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.0');
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Insert weather data into database
      for (const day of weatherData.weatherData) {
        await supabase.from('weather_data').upsert({
          state: day.state,
          district: day.district,
          temperature: day.temperature,
          humidity: day.humidity,
          rainfall: day.rainfall,
          forecast: day.forecast,
          forecast_date: day.forecast_date
        }, { onConflict: 'state,district,forecast_date' });
      }
    }

    return new Response(
      JSON.stringify(weatherData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in generate-weather function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
