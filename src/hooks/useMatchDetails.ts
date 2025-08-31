import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

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

  // Fetch multiple endpoints for complete match data
  const { data: matchData, loading: matchLoading, error: matchError } = useApiFootball(matchId ? `fixtures?id=${matchId}` : '');
  const { data: lineupsData, loading: lineupsLoading } = useApiFootball(matchId ? `fixtures/lineups?fixture=${matchId}` : '');
  const { data: eventsData, loading: eventsLoading } = useApiFootball(matchId ? `fixtures/events?fixture=${matchId}` : '');
  const { data: statisticsData, loading: statisticsLoading } = useApiFootball(matchId ? `fixtures/statistics?fixture=${matchId}` : '');

  useEffect(() => {
    if (matchData && matchData.response && matchData.response[0]) {
      const match = matchData.response[0];
      console.log('Match details from API-Football:', match);
      
      // Transform API-Football match to our format
      const transformedMatch: MatchDetails = {
        fixture: {
          id: match.fixture.id.toString(),
          referee: match.fixture.referee,
          timezone: match.fixture.timezone || 'Europe/Rome',
          date: match.fixture.date,
          timestamp: match.fixture.timestamp,
          periods: {
            first: match.fixture.periods?.first,
            second: match.fixture.periods?.second,
          },
          venue: {
            id: match.fixture.venue?.id?.toString(),
            name: match.fixture.venue?.name,
            city: match.fixture.venue?.city,
          },
          status: {
            long: getStatusLong(match.fixture.status.short),
            short: getStatusShort(match.fixture.status.short),
            elapsed: match.fixture.status.elapsed,
          },
        },
        league: {
          id: match.league.id.toString(),
          name: match.league.name,
          country: match.league.country,
          logo: match.league.logo || '',
          flag: match.league.flag || 'https://flagsapi.com/it/flat/64.png',
          season: match.league.season,
          round: match.league.round,
        },
        teams: {
          home: {
            id: match.teams.home.id.toString(),
            name: match.teams.home.name,
            logo: match.teams.home.logo || '',
            winner: match.teams.home.winner,
          },
          away: {
            id: match.teams.away.id.toString(),
            name: match.teams.away.name,
            logo: match.teams.away.logo || '',
            winner: match.teams.away.winner,
          },
        },
        goals: {
          home: match.goals.home,
          away: match.goals.away,
        },
        score: {
          halftime: {
            home: match.score.halftime.home,
            away: match.score.halftime.away,
          },
          fulltime: {
            home: match.score.fulltime.home,
            away: match.score.fulltime.away,
          },
          extratime: {
            home: match.score.extratime.home,
            away: match.score.extratime.away,
          },
          penalty: {
            home: match.score.penalty.home,
            away: match.score.penalty.away,
          },
        },
      };

      setMatchDetails(transformedMatch);
      setError(null);
    } else if (matchError) {
      setError(matchError);
    }
  }, [matchData, matchError]);

  // Process lineups data
  useEffect(() => {
    if (lineupsData && lineupsData.response) {
      console.log('Lineups from API-Football:', lineupsData);
      const transformedLineups = lineupsData.response.map((lineup: any) => ({
        team: {
          id: lineup.team.id.toString(),
          name: lineup.team.name,
          logo: lineup.team.logo,
        },
        formation: lineup.formation,
        startXI: lineup.startXI.map((player: any) => ({
          player: {
            id: player.player.id.toString(),
            name: player.player.name,
            photo: player.player.photo,
            pos: player.player.pos,
            number: player.player.number,
          },
        })),
        substitutes: lineup.substitutes.map((player: any) => ({
          player: {
            id: player.player.id.toString(),
            name: player.player.name,
            photo: player.player.photo,
            pos: player.player.pos,
            number: player.player.number,
          },
        })),
      }));
      setLineups(transformedLineups);
    }
  }, [lineupsData]);

  // Process events data
  useEffect(() => {
    if (eventsData && eventsData.response) {
      console.log('Events from API-Football:', eventsData);
      const transformedEvents = eventsData.response.map((event: any) => ({
        time: {
          elapsed: event.time.elapsed,
          extra: event.time.extra,
        },
        team: {
          id: event.team.id.toString(),
          name: event.team.name,
          logo: event.team.logo,
        },
        player: {
          id: event.player.id.toString(),
          name: event.player.name,
        },
        assist: event.assist ? {
          id: event.assist.id.toString(),
          name: event.assist.name,
        } : undefined,
        type: event.type,
        detail: event.detail,
        comments: event.comments,
      }));
      setEvents(transformedEvents);
    }
  }, [eventsData]);

  // Process statistics data
  useEffect(() => {
    if (statisticsData && statisticsData.response) {
      console.log('Statistics from API-Football:', statisticsData);
      const transformedStats = statisticsData.response.map((stat: any) => ({
        team: {
          id: stat.team.id.toString(),
          name: stat.team.name,
          logo: stat.team.logo,
        },
        statistics: stat.statistics || [],
      }));
      setStatistics(transformedStats);
    }
  }, [statisticsData]);

  // Update overall loading state
  useEffect(() => {
    const isLoading = matchLoading || lineupsLoading || eventsLoading || statisticsLoading;
    setLoading(isLoading);
  }, [matchLoading, lineupsLoading, eventsLoading, statisticsLoading]);

  const getStatusLong = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'FT': 'Match Finished',
      'NS': 'Not Started',
      '1H': 'First Half',
      '2H': 'Second Half',
      'HT': 'Half Time',
      'ET': 'Extra Time',
      'P': 'Penalty In Progress',
      'PEN': 'Match Finished After Penalties',
      'PST': 'Postponed',
      'CANC': 'Cancelled',
      'SUSP': 'Suspended',
      'AWD': 'Technical Loss',
      'WO': 'WalkOver',
      'LIVE': 'In Play'
    };
    return statusMap[status] || status;
  };

  const getStatusShort = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'FT': 'FT',
      'NS': 'NS',
      '1H': 'LIVE',
      '2H': 'LIVE',
      'HT': 'HT',
      'ET': 'LIVE',
      'P': 'LIVE',
      'PEN': 'FT',
      'PST': 'PP',
      'CANC': 'CANC',
      'SUSP': 'SUSP',
      'AWD': 'AWD',
      'WO': 'WO',
      'LIVE': 'LIVE'
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