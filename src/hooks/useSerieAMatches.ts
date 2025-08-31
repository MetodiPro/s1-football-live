import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SerieAMatch {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
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
  };
}

// Traduzione degli status in italiano
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
  'Live': 'In Diretta',
  'FT': 'Finale',
  'HT': 'Primo Tempo',
  'LIVE': 'In Diretta',
  'NS': 'Non Iniziata',
  'PST': 'Rimandata',
  'CANC': 'Annullata',
  'SUSP': 'Sospesa'
};

export const useSerieAMatches = () => {
  const [matches, setMatches] = useState<SerieAMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ottenere date per cercare partite Serie A di oggi e ieri
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const dateFrom = yesterday.toISOString().split('T')[0];
      const dateTo = tomorrow.toISOString().split('T')[0];
      
      console.log(`Fetching Serie A matches from API-Football: ${dateFrom} to ${dateTo}`);
      
      // Serie A ha league ID 135 in API-Football - usando stagione 2023 per API gratuita
      const { data, error: functionError } = await supabase.functions.invoke('api-football', {
        body: { 
          endpoint: `fixtures?league=135&season=2023&from=${dateFrom}&to=${dateTo}` 
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Serie A matches from API-Football:', data);

      // Traduci gli status e processa i dati
      const processedMatches = (data.response || []).map((match: any) => ({
        ...match,
        fixture: {
          ...match.fixture,
          status: {
            ...match.fixture.status,
            long: statusTranslations[match.fixture.status.long] || match.fixture.status.long
          }
        }
      }));

      setMatches(processedMatches);
    } catch (err) {
      console.error('Error fetching Serie A matches from API-Football:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare le partite della Serie A');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches
  };
};