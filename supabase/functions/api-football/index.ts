import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint } = await req.json();
    
    console.log(`Making request to API-Football: ${endpoint}`);

    // Get API key from Supabase secrets
    const apiKey = Deno.env.get('API_FOOTBALL_KEY');
    
    if (!apiKey) {
      console.error('API_FOOTBALL_KEY secret not found');
      throw new Error('API-Football key not configured in secrets');
    }
    
    console.log('API key loaded successfully');

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