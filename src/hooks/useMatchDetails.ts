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
  const { data: matchData, loading: matchLoading, error: matchError } = useFootballDataOrg(`matches/${matchId}`);
  
  // Try to fetch match events (testing if this endpoint exists)
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useFootballDataOrg(`matches/${matchId}/events`);

  useEffect(() => {
    console.log('Match data:', matchData);
    console.log('Events data:', eventsData);
    console.log('Events error:', eventsError);

    if (matchData) {
      // Transform Football-Data.org match to our format
      const transformedMatch: MatchDetails = {
        fixture: {
          id: matchData.id.toString(),
          referee: matchData.referees?.[0]?.name,
          timezone: 'Europe/Rome',
          date: matchData.utcDate,
          timestamp: new Date(matchData.utcDate).getTime() / 1000,
          periods: {
            first: matchData.score.halfTime.home !== null ? 45 : undefined,
            second: matchData.score.fullTime.home !== null ? 90 : undefined,
          },
          venue: {
            id: matchData.venue?.id?.toString(),
            name: matchData.venue?.name,
            city: matchData.venue?.city,
          },
          status: {
            long: getStatusLong(matchData.status),
            short: getStatusShort(matchData.status),
            elapsed: matchData.minute || undefined,
          },
        },
        league: {
          id: matchData.competition.id.toString(),
          name: matchData.competition.name,
          country: 'Italy',
          logo: matchData.competition.emblem || '',
          flag: 'https://flagsapi.com/it/flat/64.png',
          season: matchData.season.startDate ? new Date(matchData.season.startDate).getFullYear() : 2024,
          round: `Matchday ${matchData.matchday}`,
        },
        teams: {
          home: {
            id: matchData.homeTeam.id.toString(),
            name: matchData.homeTeam.name,
            logo: matchData.homeTeam.crest || '',
            winner: matchData.score.winner === 'HOME_TEAM',
          },
          away: {
            id: matchData.awayTeam.id.toString(),
            name: matchData.awayTeam.name,
            logo: matchData.awayTeam.crest || '',
            winner: matchData.score.winner === 'AWAY_TEAM',
          },
        },
        goals: {
          home: matchData.score.fullTime.home,
          away: matchData.score.fullTime.away,
        },
        score: {
          halftime: {
            home: matchData.score.halfTime.home,
            away: matchData.score.halfTime.away,
          },
          fulltime: {
            home: matchData.score.fullTime.home,
            away: matchData.score.fullTime.away,
          },
          extratime: {
            home: matchData.score.extraTime?.home,
            away: matchData.score.extraTime?.away,
          },
          penalty: {
            home: matchData.score.penalties?.home,
            away: matchData.score.penalties?.away,
          },
        },
      };

      setMatchDetails(transformedMatch);

      // Try to process events data if available
      if (eventsData && eventsData.events) {
        const transformedEvents = eventsData.events.map((event: any) => ({
          time: {
            elapsed: event.minute || 0,
            extra: event.extraTime,
          },
          team: {
            id: event.team?.id?.toString() || '',
            name: event.team?.name || '',
            logo: event.team?.crest || '',
          },
          player: {
            id: event.player?.id?.toString() || '',
            name: event.player?.name || 'Giocatore sconosciuto',
          },
          assist: event.assist ? {
            id: event.assist.id?.toString() || '',
            name: event.assist.name || '',
          } : undefined,
          type: event.type || 'unknown',
          detail: event.detail || '',
          comments: event.comments,
        }));
        
        setEvents(transformedEvents);
      } else {
        setEvents([]);
      }

      setError(null);
    } else if (matchError) {
      setError(matchError);
    }
    
    setLoading(matchLoading || eventsLoading);
  }, [matchData, eventsData, matchLoading, eventsLoading, matchError, eventsError]);

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