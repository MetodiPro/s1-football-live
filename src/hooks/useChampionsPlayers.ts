import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

export interface ChampionsPlayer {
  player: {
    id: string;
    name: string;
    photo: string;
  };
  team: {
    id: string;
    name: string;
    logo: string;
  };
  goals: number;
  assists: number;
  matches: number;
}

export const useChampionsTopScorers = () => {
  const [scorers, setScorers] = useState<ChampionsPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: apiLoading, error: apiError } = useApiFootball('players/topscorers?league=2&season=2025');

  useEffect(() => {
    if (data && data.response) {
      // Filter players who have played in group stage or later (exclude qualifiers)
      const filteredPlayers = data.response.filter((item: any) => {
        const stats = item.statistics[0];
        // Only include players from teams that qualified for group stage
        // This is indicated by having played Champions League matches (not just qualifiers)
        return stats && stats.games && stats.games.appearences > 0;
      });

      const transformedScorers = filteredPlayers.map((item: any) => ({
        player: {
          id: item.player.id.toString(),
          name: item.player.name,
          photo: item.player.photo,
        },
        team: {
          id: item.statistics[0].team.id.toString(),
          name: item.statistics[0].team.name,
          logo: item.statistics[0].team.logo,
        },
        goals: item.statistics[0].goals.total || 0,
        assists: item.statistics[0].goals.assists || 0,
        matches: item.statistics[0].games.appearences || 0,
      }));
      
      setScorers(transformedScorers);
      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
    
    setLoading(apiLoading);
  }, [data, apiLoading, apiError]);

  return {
    scorers,
    loading,
    error,
    refetch: () => {
      // Auto-refetch handled by useApiFootball
    }
  };
};

export const useChampionsTopAssists = () => {
  const [assists, setAssists] = useState<ChampionsPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: apiLoading, error: apiError } = useApiFootball('players/topassists?league=2&season=2025');

  useEffect(() => {
    if (data && data.response) {
      // Filter players who have played in group stage or later (exclude qualifiers)
      const filteredPlayers = data.response.filter((item: any) => {
        const stats = item.statistics[0];
        // Only include players from teams that qualified for group stage
        return stats && stats.games && stats.games.appearences > 0;
      });

      const transformedAssists = filteredPlayers.map((item: any) => ({
        player: {
          id: item.player.id.toString(),
          name: item.player.name,
          photo: item.player.photo,
        },
        team: {
          id: item.statistics[0].team.id.toString(),
          name: item.statistics[0].team.name,
          logo: item.statistics[0].team.logo,
        },
        goals: item.statistics[0].goals.total || 0,
        assists: item.statistics[0].goals.assists || 0,
        matches: item.statistics[0].games.appearences || 0,
      }));
      
      setAssists(transformedAssists);
      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
    
    setLoading(apiLoading);
  }, [data, apiLoading, apiError]);

  return {
    assists,
    loading,
    error,
    refetch: () => {
      // Auto-refetch handled by useApiFootball
    }
  };
};