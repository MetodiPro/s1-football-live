import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduleMatch {
  id: string;
  utcDate: string;
  status: string;
  matchday: number;
  homeTeam: {
    id: string;
    name: string;
    crest?: string;
    shortName?: string;
  };
  awayTeam: {
    id: string;
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

  const fetchSchedule = async (round?: number) => {
    try {
      setLoading(true);
      setError(null);

      // Serie A ID in TheSportsDB is 4332
      const leagueId = '4332';
      const currentSeason = '2024-2025';
      
      // Get current round if not specified
      const roundNumber = round || getCurrentRound();
      
      const endpoint = `eventsround.php?id=${leagueId}&r=${roundNumber}&s=${currentSeason}`;
      
      console.log(`Fetching Serie A schedule: ${endpoint}`);
      
      const { data, error: functionError } = await supabase.functions.invoke('thesportsdb', {
        body: { endpoint }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Serie A Schedule Response:', data);

      // Transform TheSportsDB events to our format
      const transformedMatches = (data.events || []).map((event: any) => ({
        id: event.idEvent,
        utcDate: event.strTimestamp || event.dateEvent + 'T' + (event.strTime || '00:00:00'),
        status: transformMatchStatus(event.strStatus || 'NS'),
        matchday: parseInt(event.intRound) || roundNumber,
        homeTeam: {
          id: event.idHomeTeam,
          name: event.strHomeTeam,
          crest: event.strHomeTeamBadge,
          shortName: event.strHomeTeam
        },
        awayTeam: {
          id: event.idAwayTeam,
          name: event.strAwayTeam,
          crest: event.strAwayTeamBadge,
          shortName: event.strAwayTeam
        },
        score: {
          fullTime: {
            home: event.intHomeScore ? parseInt(event.intHomeScore) : null,
            away: event.intAwayScore ? parseInt(event.intAwayScore) : null
          }
        }
      }));

      setMatches(transformedMatches);

    } catch (err) {
      console.error('Error fetching Serie A schedule:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare il calendario della Serie A');
    } finally {
      setLoading(false);
    }
  };

  // Get current round based on date
  const getCurrentRound = () => {
    const now = new Date();
    const seasonStart = new Date('2024-08-15');
    const weeksPassed = Math.floor((now.getTime() - seasonStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, Math.min(38, weeksPassed + 1));
  };

  // Transform TheSportsDB status to our format
  const transformMatchStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Match Finished': 'FINISHED',
      'Not Started': 'SCHEDULED',
      'In Play': 'IN_PLAY',
      'Half Time': 'PAUSED',
      'Full Time': 'FINISHED',
      'NS': 'SCHEDULED',
      'FT': 'FINISHED',
      'HT': 'PAUSED',
      '1H': 'IN_PLAY',
      '2H': 'IN_PLAY'
    };
    return statusMap[status] || 'SCHEDULED';
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