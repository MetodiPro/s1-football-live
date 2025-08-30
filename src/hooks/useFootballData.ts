import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Match {
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
  };
  status: string;
  utcDate: string;
  competition: {
    name: string;
    emblem?: string;
  };
}

export interface FootballDataResponse {
  matches: Match[];
}

export const useFootballData = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch matches from Serie A italiana (competition ID: SA)
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dateFrom = yesterday.toISOString().split('T')[0];
      const dateTo = tomorrow.toISOString().split('T')[0];
      
      console.log(`Fetching Serie A matches from ${dateFrom} to ${dateTo}`);
      
      const { data, error: functionError } = await supabase.functions.invoke('football-data', {
        body: { 
          endpoint: `competitions/SA/matches?dateFrom=${dateFrom}&dateTo=${dateTo}` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Serie A API Response:', data);
      console.log('Number of Serie A matches found:', data.matches?.length || 0);

      setMatches(data.matches || []);
    } catch (err) {
      console.error('Error fetching Serie A data:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare le partite della Serie A');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches
  };
};