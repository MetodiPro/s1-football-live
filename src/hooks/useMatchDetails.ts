
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Player {
  id: number;
  name: string;
  photo?: string;
  pos?: string;
  number?: number;
}

export interface Lineup {
  team: {
    id: number;
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
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist?: {
    id: number;
    name: string;
  };
  type: string;
  detail: string;
  comments?: string;
}

export interface Statistics {
  team: {
    id: number;
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
    id: number;
    referee?: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first?: number;
      second?: number;
    };
    venue: {
      id?: number;
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
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner?: boolean;
    };
    away: {
      id: number;
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

  const fetchMatchDetails = async () => {
    if (!matchId) {
      setError('ID partita mancante');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching match details for ID: ${matchId} from API-Football`);

      // Fetch basic match details
      const { data: matchData, error: matchError } = await supabase.functions.invoke('api-football', {
        body: { endpoint: `fixtures?id=${matchId}` }
      });

      if (matchError) {
        console.error('Match fetch error:', matchError);
        throw new Error(matchError.message);
      }

      if (matchData.errors && matchData.errors.length > 0) {
        console.error('API errors:', matchData.errors);
        throw new Error('Errore nel recupero dati partita');
      }

      if (!matchData.response || matchData.response.length === 0) {
        throw new Error('Partita non trovata');
      }

      const match = matchData.response[0];
      console.log('Match details from API-Football:', match);
      setMatchDetails(match);

      // Fetch lineups if match is finished or live
      if (match.fixture.status.short === 'FT' || match.fixture.status.short === '1H' || match.fixture.status.short === '2H' || match.fixture.status.short === 'HT') {
        try {
          const { data: lineupsData } = await supabase.functions.invoke('api-football', {
            body: { endpoint: `fixtures/lineups?fixture=${matchId}` }
          });
          
          if (lineupsData.response) {
            console.log('Lineups data:', lineupsData.response);
            setLineups(lineupsData.response);
          }
        } catch (err) {
          console.log('Lineups not available:', err);
        }

        // Fetch events
        try {
          const { data: eventsData } = await supabase.functions.invoke('api-football', {
            body: { endpoint: `fixtures/events?fixture=${matchId}` }
          });
          
          if (eventsData.response) {
            console.log('Events data:', eventsData.response);
            setEvents(eventsData.response);
          }
        } catch (err) {
          console.log('Events not available:', err);
        }

        // Fetch statistics
        try {
          const { data: statsData } = await supabase.functions.invoke('api-football', {
            body: { endpoint: `fixtures/statistics?fixture=${matchId}` }
          });
          
          if (statsData.response) {
            console.log('Statistics data:', statsData.response);
            setStatistics(statsData.response);
          }
        } catch (err) {
          console.log('Statistics not available:', err);
        }
      }

    } catch (err) {
      console.error('Error fetching match details from API-Football:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare i dettagli della partita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  return {
    matchDetails,
    lineups,
    events,
    statistics,
    loading,
    error,
    refetch: fetchMatchDetails
  };
};
