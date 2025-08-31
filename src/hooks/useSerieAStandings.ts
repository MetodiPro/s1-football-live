import { useState, useEffect } from 'react';
import { useFootballDataOrg } from '@/hooks/useFootballDataOrg';

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

  // Serie A competition ID in Football-Data.org
  const { data, loading: apiLoading, error: apiError } = useFootballDataOrg('competitions/SA/standings');

  useEffect(() => {
    if (data && data.standings && data.standings[0]) {
      const transformedStandings = data.standings[0].table.map((team: any) => ({
        position: team.position,
        team: {
          id: team.team.id.toString(),
          name: team.team.name,
          crest: team.team.crest,
          shortName: team.team.shortName,
        },
        playedGames: team.playedGames,
        form: team.form,
        won: team.won,
        draw: team.draw,
        lost: team.lost,
        points: team.points,
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference: team.goalDifference,
      }));
      
      setStandings(transformedStandings);
      setSeason({
        startDate: data.season.startDate,
        endDate: data.season.endDate,
        currentMatchday: data.season.currentMatchday
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