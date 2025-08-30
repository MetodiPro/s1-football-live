import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MatchDetails {
  id: number;
  homeTeam: {
    name: string;
    crest?: string;
  };
  awayTeam: {
    name: string;
    crest?: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime?: {
      home: number | null;
      away: number | null;
    };
  };
  status: string;
  utcDate: string;
  competition: {
    name: string;
    emblem?: string;
  };
  venue?: string;
  referee?: string;
  goals?: Array<{
    minute: number;
    scorer?: {
      name: string;
    };
    team: 'HOME_TEAM' | 'AWAY_TEAM';
    type: string;
  }>;
  lineups?: {
    homeTeam: {
      formation?: string;
      lineup: Array<{
        name: string;
        position: string;
      }>;
    };
    awayTeam: {
      formation?: string;
      lineup: Array<{
        name: string;
        position: string;
      }>;
    };
  };
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

      console.log(`Fetching match details for ID: ${matchId}`);
      
      const { data, error: functionError } = await supabase.functions.invoke('football-data', {
        body: { 
          endpoint: `matches/${matchId}` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Match details API Response:', data);
      setMatchDetails(data);
    } catch (err) {
      console.error('Error fetching match details:', err);
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