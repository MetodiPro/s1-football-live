import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduleMatch {
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
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

export const useSerieASchedule = () => {
  const [matches, setMatches] = useState<ScheduleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async (matchday?: number) => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = 'competitions/SA/matches';
      if (matchday) {
        endpoint += `?matchday=${matchday}`;
      }

      console.log(`Fetching Serie A schedule: ${endpoint}`);
      
      const { data, error: functionError } = await supabase.functions.invoke('football-data', {
        body: { endpoint }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Serie A Schedule Response:', data);

      setMatches(data.matches || []);

    } catch (err) {
      console.error('Error fetching Serie A schedule:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare il calendario della Serie A');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return {
    matches,
    loading,
    error,
    refetch: fetchSchedule
  };
};