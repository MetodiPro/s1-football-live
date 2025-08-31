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
    const { endpoint } = await req.json();
    
    console.log(`Making request to API-Football: ${endpoint}`);

    // Get API key from Supabase secrets with detailed logging
    console.log('Attempting to read API_FOOTBALL_KEY from environment...');
    const apiKey = Deno.env.get('API_FOOTBALL_KEY');
    
    // Debug: List all available environment variables (without values)
    console.log('Available env variables:', Object.keys(Deno.env.toObject()));
    
    if (!apiKey) {
      console.error('❌ API_FOOTBALL_KEY secret not found in environment');
      throw new Error('API-Football key not configured in secrets');
    }
    
    console.log('✅ API key loaded successfully, length:', apiKey.length);

    const response = await fetch(`https://v3.football.api-sports.io/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-apisports-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API-Football error response:', errorText);
      throw new Error(`API-Football error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API-Football response received successfully');
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in api-football function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Errore nel recupero dati da API-Football'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});