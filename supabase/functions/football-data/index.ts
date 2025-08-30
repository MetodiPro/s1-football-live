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
    const footballDataApiKey = Deno.env.get('FOOTBALL_DATA_API_KEY');

    if (!footballDataApiKey) {
      console.error('FOOTBALL_DATA_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Making request to Football-Data API: ${endpoint}`);

    const response = await fetch(`https://api.football-data.org/v4/${endpoint}`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': footballDataApiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Football-Data API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: `API request failed: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched data from Football-Data API`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in football-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});