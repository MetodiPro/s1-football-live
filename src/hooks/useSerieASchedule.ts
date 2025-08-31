import { useState, useEffect } from 'react';
import { useFootballDataOrg } from '@/hooks/useFootballDataOrg';

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

  // Get Serie A matches - Serie A competition ID is SA in Football-Data.org
  const { data, loading: apiLoading, error: apiError } = useFootballDataOrg('competitions/SA/matches');

  useEffect(() => {
    if (data && data.matches) {
      const transformedMatches = data.matches.map((match: any) => ({
        id: match.id.toString(),
        utcDate: match.utcDate,
        status: match.status,
        matchday: match.matchday,
        homeTeam: {
          id: match.homeTeam.id.toString(),
          name: match.homeTeam.name,
          crest: match.homeTeam.crest,
          shortName: match.homeTeam.shortName,
        },
        awayTeam: {
          id: match.awayTeam.id.toString(),
          name: match.awayTeam.name,
          crest: match.awayTeam.crest,
          shortName: match.awayTeam.shortName,
        },
        score: {
          fullTime: {
            home: match.score.fullTime.home,
            away: match.score.fullTime.away,
          },
        },
      }));
      
      setMatches(transformedMatches);
      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
    
    setLoading(apiLoading);
  }, [data, apiLoading, apiError]);

  return {
    matches,
    loading,
    error,
    refetch: () => {
      // The hook will automatically refetch when dependencies change
    }
  };
};