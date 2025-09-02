import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

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
  venue?: {
    name: string;
    city: string;
  };
  referee?: string;
}

export const useSerieASchedule = () => {
  const [matches, setMatches] = useState<ScheduleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get Serie A matches - Serie A league ID is 135 in API-Football
  const { data, loading: apiLoading, error: apiError } = useApiFootball('fixtures?league=135&season=2025');

  useEffect(() => {
    if (data && data.response) {
      const transformedMatches = data.response.map((match: any) => ({
        id: match.fixture.id.toString(),
        utcDate: match.fixture.date,
        status: match.fixture.status.short,
        matchday: parseInt(match.league.round.replace('Regular Season - ', '')), // Convert to number
        homeTeam: {
          id: match.teams.home.id.toString(),
          name: match.teams.home.name,
          crest: match.teams.home.logo,
          shortName: match.teams.home.name.split(' ')[0],
        },
        awayTeam: {
          id: match.teams.away.id.toString(),
          name: match.teams.away.name,
          crest: match.teams.away.logo,
          shortName: match.teams.away.name.split(' ')[0],
        },
        score: {
          fullTime: {
            home: match.goals.home,
            away: match.goals.away,
          },
        },
        venue: match.fixture.venue ? {
          name: match.fixture.venue.name,
          city: match.fixture.venue.city,
        } : undefined,
        referee: match.fixture.referee || undefined,
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