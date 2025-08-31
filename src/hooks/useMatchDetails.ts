import { useState, useEffect } from 'react';
import { useFootballDataOrg } from '@/hooks/useFootballDataOrg';

export interface Player {
  id: string;
  name: string;
  photo?: string;
  pos?: string;
  number?: number;
}

export interface Lineup {
  team: {
    id: string;
    name: string;
    logo: string;
  };
  formation: string;
  startXI: Array<{
    player: Player;
  }>;
  substitutes: Array<{
    player: Player;
  }>;
}

export interface Event {
  time: {
    elapsed: number;
    extra?: number;
  };
  team: {
    id: string;
    name: string;
    logo: string;
  };
  player: {
    id: string;
    name: string;
  };
  assist?: {
    id: string;
    name: string;
  };
  type: string;
  detail: string;
  comments?: string;
}

export interface Statistics {
  team: {
    id: string;
    name: string;
    logo: string;
  };
  statistics: Array<{
    type: string;
    value: string | number;
  }>;
}

export interface MatchDetails {
  fixture: {
    id: string;
    referee?: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first?: number;
      second?: number;
    };
    venue: {
      id?: string;
      name?: string;
      city?: string;
    };
    status: {
      long: string;
      short: string;
      elapsed?: number;
    };
  };
  league: {
    id: string;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: string;
      name: string;
      logo: string;
      winner?: boolean;
    };
    away: {
      id: string;
      name: string;
      logo: string;
      winner?: boolean;
    };
  };
  goals: {
    home?: number;
    away?: number;
  };
  score: {
    halftime: {
      home?: number;
      away?: number;
    };
    fulltime: {
      home?: number;
      away?: number;
    };
    extratime: {
      home?: number;
      away?: number;
    };
    penalty: {
      home?: number;
      away?: number;
    };
  };
}

export const useMatchDetails = (matchId: string) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch match details from Football-Data.org
  const { data, loading: apiLoading, error: apiError } = useFootballDataOrg(`matches/${matchId}`);

  useEffect(() => {
    if (data) {
      console.log('Match details from Football-Data.org:', data);

      // Transform Football-Data.org match to our format
      const transformedMatch: MatchDetails = {
        fixture: {
          id: data.id.toString(),
          referee: data.referees?.[0]?.name,
          timezone: 'Europe/Rome',
          date: data.utcDate,
          timestamp: new Date(data.utcDate).getTime() / 1000,
          periods: {
            first: data.score.halfTime.home !== null ? 45 : undefined,
            second: data.score.fullTime.home !== null ? 90 : undefined,
          },
          venue: {
            id: data.venue?.id?.toString(),
            name: data.venue?.name,
            city: data.venue?.city,
          },
          status: {
            long: getStatusLong(data.status),
            short: getStatusShort(data.status),
            elapsed: data.minute || undefined,
          },
        },
        league: {
          id: data.competition.id.toString(),
          name: data.competition.name,
          country: 'Italy',
          logo: data.competition.emblem || '',
          flag: 'https://flagsapi.com/it/flat/64.png',
          season: data.season.startDate ? new Date(data.season.startDate).getFullYear() : 2024,
          round: `Matchday ${data.matchday}`,
        },
        teams: {
          home: {
            id: data.homeTeam.id.toString(),
            name: data.homeTeam.name,
            logo: data.homeTeam.crest || '',
            winner: data.score.winner === 'HOME_TEAM',
          },
          away: {
            id: data.awayTeam.id.toString(),
            name: data.awayTeam.name,
            logo: data.awayTeam.crest || '',
            winner: data.score.winner === 'AWAY_TEAM',
          },
        },
        goals: {
          home: data.score.fullTime.home,
          away: data.score.fullTime.away,
        },
        score: {
          halftime: {
            home: data.score.halfTime.home,
            away: data.score.halfTime.away,
          },
          fulltime: {
            home: data.score.fullTime.home,
            away: data.score.fullTime.away,
          },
          extratime: {
            home: data.score.extraTime?.home,
            away: data.score.extraTime?.away,
          },
          penalty: {
            home: data.score.penalties?.home,
            away: data.score.penalties?.away,
          },
        },
      };

      setMatchDetails(transformedMatch);
      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
    
    setLoading(apiLoading);
  }, [data, apiLoading, apiError]);

  const getStatusLong = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'FINISHED': 'Match Finished',
      'SCHEDULED': 'Not Started',
      'IN_PLAY': 'In Play',
      'PAUSED': 'Half Time',
      'POSTPONED': 'Postponed',
      'CANCELLED': 'Cancelled',
      'SUSPENDED': 'Suspended'
    };
    return statusMap[status] || status;
  };

  const getStatusShort = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'FINISHED': 'FT',
      'SCHEDULED': 'NS',
      'IN_PLAY': 'LIVE',
      'PAUSED': 'HT',
      'POSTPONED': 'PP',
      'CANCELLED': 'CANC',
      'SUSPENDED': 'SUSP'
    };
    return statusMap[status] || 'NS';
  };

  return {
    matchDetails,
    lineups,
    events,
    statistics,
    loading,
    error,
    refetch: () => {
      // The hook will automatically refetch when dependencies change
    }
  };
};