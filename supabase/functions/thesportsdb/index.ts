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
    
    console.log(`Making request to TheSportsDB: ${endpoint}`);

    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TheSportsDB error response:', errorText);
      throw new Error(`TheSportsDB error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('TheSportsDB response received successfully');
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in thesportsdb function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Errore nel recupero dati da TheSportsDB'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});