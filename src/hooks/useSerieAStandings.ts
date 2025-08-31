import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchStandings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Serie A ID in TheSportsDB is 4332
      const leagueId = '4332';
      const currentSeason = '2024-2025';

      console.log('Fetching Serie A standings from TheSportsDB...');
      
      const endpoint = `lookuptable.php?l=${leagueId}&s=${currentSeason}`;
      
      const { data, error: functionError } = await supabase.functions.invoke('thesportsdb', {
        body: { endpoint }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Serie A Standings Response:', data);

      // Transform TheSportsDB table to our format
      const transformedStandings = (data.table || []).map((team: any, index: number) => ({
        position: parseInt(team.intRank) || index + 1,
        team: {
          id: team.idTeam,
          name: team.strTeam,
          crest: team.strTeamBadge,
          shortName: team.strTeam
        },
        playedGames: parseInt(team.intPlayed) || 0,
        form: team.strForm,
        won: parseInt(team.intWin) || 0,
        draw: parseInt(team.intDraw) || 0,
        lost: parseInt(team.intLoss) || 0,
        points: parseInt(team.intPoints) || 0,
        goalsFor: parseInt(team.intGoalsFor) || 0,
        goalsAgainst: parseInt(team.intGoalsAgainst) || 0,
        goalDifference: parseInt(team.intGoalDifference) || 0
      }));

      setStandings(transformedStandings);
      setSeason({
        startDate: '2024-08-15',
        endDate: '2025-05-25',
        currentMatchday: getCurrentRound()
      });

    } catch (err) {
      console.error('Error fetching Serie A standings:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare la classifica della Serie A');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentRound = () => {
    const now = new Date();
    const seasonStart = new Date('2024-08-15');
    const weeksPassed = Math.floor((now.getTime() - seasonStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, Math.min(38, weeksPassed + 1));
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