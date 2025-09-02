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
      console.log('Raw scorers data:', data.response); // Debug log
      
      // If group stage hasn't started yet, show no players
      // Check if we have any actual group stage matches played
      const hasGroupStageStarted = data.response.some((item: any) => {
        const stats = item.statistics[0];
        return stats && stats.games && stats.games.appearences > 0 && 
               !stats.league?.round?.toLowerCase().includes('qualifying');
      });

      if (!hasGroupStageStarted) {
        console.log('Group stage not started yet, showing no players');
        setScorers([]);
        setError(null);
        setLoading(apiLoading);
        return;
      }

      // If group stage has started, filter properly
      const filteredPlayers = data.response.filter((item: any) => {
        const stats = item.statistics[0];
        if (!stats || !stats.games || stats.games.appearences === 0) return false;
        
        // Exclude any qualifying rounds data
        const round = stats.league?.round?.toLowerCase() || '';
        return !round.includes('qualifying') && 
               !round.includes('preliminary') && 
               !round.includes('play-off') &&
               stats.league && stats.league.id === 2;
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
      console.log('Raw assists data:', data.response); // Debug log
      
      // If group stage hasn't started yet, show no players
      const hasGroupStageStarted = data.response.some((item: any) => {
        const stats = item.statistics[0];
        return stats && stats.games && stats.games.appearences > 0 && 
               !stats.league?.round?.toLowerCase().includes('qualifying');
      });

      if (!hasGroupStageStarted) {
        console.log('Group stage not started yet, showing no assists players');
        setAssists([]);
        setError(null);
        setLoading(apiLoading);
        return;
      }

      // If group stage has started, filter properly
      const filteredPlayers = data.response.filter((item: any) => {
        const stats = item.statistics[0];
        if (!stats || !stats.games || stats.games.appearences === 0) return false;
        
        // Exclude any qualifying rounds data
        const round = stats.league?.round?.toLowerCase() || '';
        return !round.includes('qualifying') && 
               !round.includes('preliminary') && 
               !round.includes('play-off') &&
               stats.league && stats.league.id === 2;
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