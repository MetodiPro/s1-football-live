import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TeamStanding {
  position: number;
  team: {
    id: number;
    name: string;
    crest?: string;
    shortName?: string;
  };
  playedGames: number;
  form?: string;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface SerieAStandings {
  standings: TeamStanding[];
  season: {
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
}

export const useSerieAStandings = () => {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [season, setSeason] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching Serie A standings...');
      
      const { data, error: functionError } = await supabase.functions.invoke('football-data', {
        body: { 
          endpoint: 'competitions/SA/standings' 
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Serie A Standings Response:', data);

      // Football-Data API returns standings in this structure
      const standingsData = data.standings?.[0]?.table || [];
      
      setStandings(standingsData);
      setSeason(data.season);

    } catch (err) {
      console.error('Error fetching Serie A standings:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare la classifica della Serie A');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  return {
    standings,
    season,
    loading,
    error,
    refetch: fetchStandings
  };
};