
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { path, method = 'GET' } = await req.json()
    
    const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDZmOTk0OS1lNGVjLTRjOGUtODNmNC1mMTRhZGRjNGNlZWIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2NjU5NTA2fQ.oBiLr2WzPuCvkl5qeeVM9YLwHlRevjNnmdp6QjX5l5E'
    const N8N_BASE_URL = 'https://develms.app.n8n.cloud/api/v1'
    
    const url = `${N8N_BASE_URL}${path}`
    
    console.log(`Making request to n8n: ${method} ${url}`)
    
    const response = await fetch(url, {
      method,
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`n8n API error: ${response.status} - ${errorText}`)
      return new Response(
        JSON.stringify({ error: `n8n API error: ${response.status}`, details: errorText }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
