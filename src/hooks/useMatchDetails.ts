import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MatchDetails {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  homeTeam: {
    id: number;
    name: string;
    crest?: string;
    shortName?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    crest?: string;
    shortName?: string;
  };
  score: {
    winner: string | null;
    duration: string;
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
  };
  referees?: Array<{
    id: number;
    name: string;
    type: string;
    nationality: string;
  }>;
}

export const useMatchDetails = (matchId: string) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchDetails = async () => {
    if (!matchId) {
      setError('ID partita mancante');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching match details for ID: ${matchId} from Football-Data`);
      
      const { data, error: functionError } = await supabase.functions.invoke('football-data', {
        body: { endpoint: `matches/${matchId}` }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message);
      }

      if (data.error) {
        console.error('API error:', data.error);
        throw new Error(data.error);
      }

      console.log('Match details from Football-Data:', data);

      if (!data) {
        throw new Error('Partita non trovata');
      }

      setMatchDetails(data);

    } catch (err) {
      console.error('Error fetching match details from Football-Data:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare i dettagli della partita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  return {
    matchDetails,
    loading,
    error,
    refetch: fetchMatchDetails
  };
};