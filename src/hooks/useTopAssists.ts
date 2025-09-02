import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

export interface TopAssist {
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
  assists: number;
  goals: number;
  matches: number;
}

export const useTopAssists = () => {
  const [assists, setAssists] = useState<TopAssist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: apiLoading, error: apiError } = useApiFootball('players/topassists?league=135&season=2025');

  useEffect(() => {
    if (data && data.response) {
      const transformedAssists = data.response.map((item: any) => ({
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
        assists: item.statistics[0].goals.assists || 0,
        goals: item.statistics[0].goals.total || 0,
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