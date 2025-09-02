import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

export interface TeamStatistic {
  team: {
    id: string;
    name: string;
    logo: string;
  };
  possession: number;
  shotsOnGoal: number;
  totalShots: number;
  corners: number;
  foulsDrawn: number;
  foulsCommitted: number;
  expectedGoals: number;
  matches: number;
}

export const useTeamStatistics = () => {
  const [statistics, setStatistics] = useState<TeamStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all teams first, then we'll aggregate their stats
  const { data, loading: apiLoading, error: apiError } = useApiFootball('teams?league=135&season=2025');

  useEffect(() => {
    if (data && data.response) {
      // For now, we'll create mock data based on the teams
      // In a real scenario, you'd need to fetch individual team statistics
      const transformedStats = data.response.map((item: any, index: number) => ({
        team: {
          id: item.team.id.toString(),
          name: item.team.name,
          logo: item.team.logo,
        },
        possession: Math.floor(Math.random() * 30) + 40, // Mock data 40-70%
        shotsOnGoal: Math.floor(Math.random() * 20) + 15, // Mock data 15-35
        totalShots: Math.floor(Math.random() * 40) + 30, // Mock data 30-70
        corners: Math.floor(Math.random() * 15) + 10, // Mock data 10-25
        foulsDrawn: Math.floor(Math.random() * 20) + 15, // Mock data 15-35
        foulsCommitted: Math.floor(Math.random() * 25) + 20, // Mock data 20-45
        expectedGoals: Math.round((Math.random() * 3 + 1) * 100) / 100, // Mock data 1.0-4.0
        matches: 2, // Current matches played
      }));
      
      setStatistics(transformedStats);
      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
    
    setLoading(apiLoading);
  }, [data, apiLoading, apiError]);

  return {
    statistics,
    loading,
    error,
    refetch: () => {
      // Auto-refetch handled by useApiFootball
    }
  };
};