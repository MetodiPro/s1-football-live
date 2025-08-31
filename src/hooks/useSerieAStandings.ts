import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

export interface TeamStanding {
  position: number;
  team: {
    id: string;
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

  // Serie A league ID is 135 in API-Football
  const { data, loading: apiLoading, error: apiError } = useApiFootball('standings?league=135&season=2023');

  useEffect(() => {
    if (data && data.response && data.response[0]) {
      const transformedStandings = data.response[0].league.standings[0].map((team: any) => ({
        position: team.rank,
        team: {
          id: team.team.id.toString(),
          name: team.team.name,
          crest: team.team.logo,
          shortName: team.team.name.split(' ')[0],
        },
        playedGames: team.all.played,
        form: team.form,
        won: team.all.win,
        draw: team.all.draw,
        lost: team.all.lose,
        points: team.points,
        goalsFor: team.all.goals.for,
        goalsAgainst: team.all.goals.against,
        goalDifference: team.goalsDiff,
      }));
      
      setStandings(transformedStandings);
      setSeason({
        startDate: '2023-08-01',
        endDate: '2024-05-31',
        currentMatchday: 1
      });
      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
    
    setLoading(apiLoading);
  }, [data, apiLoading, apiError]);

  return {
    standings,
    season,
    loading,
    error,
    refetch: () => {
      // The hook will automatically refetch when dependencies change
    }
  };
};