import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MatchDetails {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
    venue: {
      id: number;
      name: string;
      city: string;
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
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
  events?: Array<{
    time: {
      elapsed: number;
      extra: number | null;
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
  }>;
  lineups?: Array<{
    team: {
      id: number;
      name: string;
      logo: string;
      colors: {
        player: {
          primary: string;
          number: string;
          border: string;
        };
        goalkeeper: {
          primary: string;
          number: string;
          border: string;
        };
      };
    };
    coach: {
      id: number;
      name: string;
      photo: string;
    };
    formation: string;
    startXI: Array<{
      player: {
        id: number;
        name: string;
        number: number;
        pos: string;
        grid: string;
      };
    }>;
    substitutes: Array<{
      player: {
        id: number;
        name: string;
        number: number;
        pos: string;
      };
    }>;
  }>;
}

export const useMatchDetails = (matchId: string) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [lineups, setLineups] = useState<any[]>([]);
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
      
      // Fetch match details
      const { data: matchData, error: matchError } = await supabase.functions.invoke('api-football', {
        body: { endpoint: `fixtures?id=${matchId}` }
      });

      if (matchError || matchData.error) {
        throw new Error(matchError?.message || matchData.error || 'Errore nel recupero partita');
      }

      if (!matchData.response || matchData.response.length === 0) {
        throw new Error('Partita non trovata');
      }

      const match = matchData.response[0];
      
      // Traduci lo status
      const statusTranslations: Record<string, string> = {
        'Match Finished': 'Partita Finita',
        'Not Started': 'Non Iniziata', 
        'First Half': 'Primo Tempo',
        'Halftime': 'Intervallo',
        'Second Half': 'Secondo Tempo',
        'Extra Time': 'Tempi Supplementari',
        'Penalty In Progress': 'Rigori in Corso',
        'Match Postponed': 'Partita Rimandata',
        'Match Cancelled': 'Partita Annullata',
        'Match Suspended': 'Partita Sospesa',
        'Live': 'In Diretta'
      };

      // Traduci i dettagli degli eventi
      const eventTranslations: Record<string, string> = {
        'Goal': 'Gol',
        'Card': 'Cartellino',
        'substitution': 'Sostituzione',
        'Yellow Card': 'Cartellino Giallo',
        'Red Card': 'Cartellino Rosso',
        'Normal Goal': 'Gol',
        'Own Goal': 'Autogol',
        'Penalty': 'Rigore',
        'Missed Penalty': 'Rigore Sbagliato'
      };

      match.fixture.status.long = statusTranslations[match.fixture.status.long] || match.fixture.status.long;
      
      setMatchDetails(match);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase.functions.invoke('api-football', {
        body: { endpoint: `fixtures/events?fixture=${matchId}` }
      });

      if (!eventsError && eventsData.response) {
        // Traduci gli eventi
        const translatedEvents = eventsData.response.map((event: any) => ({
          ...event,
          type: eventTranslations[event.type] || event.type,
          detail: eventTranslations[event.detail] || event.detail
        }));
        setEvents(translatedEvents);
      }

      // Fetch lineups
      const { data: lineupsData, error: lineupsError } = await supabase.functions.invoke('api-football', {
        body: { endpoint: `fixtures/lineups?fixture=${matchId}` }
      });

      if (!lineupsError && lineupsData.response) {
        setLineups(lineupsData.response);
      }

      console.log('Match details fetched successfully from API-Football');
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
    events,
    lineups,
    loading,
    error,
    refetch: fetchMatchDetails
  };
};