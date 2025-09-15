import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { areaTerapeutica, farmaco, molecula } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const prompt = `Analiza la siguiente información de un medicamento y clasifica a qué área médica principal pertenece. 
    
    Área Terapéutica: ${areaTerapeutica || 'No especificada'}
    Fármaco: ${farmaco || 'No especificado'}  
    Molécula: ${molecula || 'No especificada'}
    
    Clasifica ÚNICAMENTE en una de estas categorías exactas:
    - breast (cáncer de mama, tratamientos mamarios)
    - lung (cáncer de pulmón, enfermedades respiratorias)
    - GI (gastroenterología, sistema digestivo)
    - GU (genitourinario, urología, nefrología)
    - cardio (cardiología, cardiovascular)
    - neuro (neurología, sistema nervioso)
    - onco (oncología general, otros cánceres)
    - immuno (inmunología, reumatología)
    - endo (endocrinología, diabetes, hormonas)
    - derma (dermatología)
    - other (otros casos no clasificables)
    
    Responde ÚNICAMENTE con una palabra: la categoría correspondiente.`;

    console.log('Calling Gemini API for area classification');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 10
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}` }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    const classifiedArea = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || 'other';
    
    console.log('Area classification result:', classifiedArea);

    return new Response(
      JSON.stringify({ area: classifiedArea }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});