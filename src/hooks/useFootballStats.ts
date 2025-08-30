import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FootballStats {
  liveMatches: number;
  competitions: number;
  todaysGames: number;
}

export const useFootballStats = () => {
  const [stats, setStats] = useState<FootballStats>({
    liveMatches: 0,
    competitions: 0,
    todaysGames: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch matches from yesterday to tomorrow to get comprehensive data
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dateFrom = yesterday.toISOString().split('T')[0];
      const dateTo = tomorrow.toISOString().split('T')[0];
      
      const { data, error: functionError } = await supabase.functions.invoke('football-data', {
        body: { 
          endpoint: `matches?dateFrom=${dateFrom}&dateTo=${dateTo}` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const matches = data.matches || [];
      
      // Calculate real statistics
      const liveMatches = matches.filter((match: any) => match.status === 'IN_PLAY').length;
      
      // Get unique competitions
      const competitions = new Set(matches.map((match: any) => match.competition.id)).size;
      
      // Get today's games
      const todayStr = today.toISOString().split('T')[0];
      const todaysGames = matches.filter((match: any) => {
        const matchDate = new Date(match.utcDate).toISOString().split('T')[0];
        return matchDate === todayStr;
      }).length;

      setStats({
        liveMatches,
        competitions,
        todaysGames
      });

    } catch (err) {
      console.error('Error fetching football stats:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare le statistiche');
      // Set zeros on error instead of fake data
      setStats({
        liveMatches: 0,
        competitions: 0,
        todaysGames: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};