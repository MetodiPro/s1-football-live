import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

export interface NapoliMatch {
  id: string;
  date: string;
  status: string;
  league: string;
  round: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
  };
  score: {
    home: number | null;
    away: number | null;
  };
  venue: string;
}

export interface NapoliPlayer {
  id: string;
  name: string;
  photo: string;
  position: string;
  age: number;
  nationality: string;
  goals: number;
  assists: number;
  matches: number;
  rating: string;
}

export interface NapoliStats {
  league: string;
  position: number;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDiff: number;
  form: string;
}

export const useNapoliMatches = () => {
  const [matches, setMatches] = useState<NapoliMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Napoli team ID is 492
  const { data, loading: apiLoading, error: apiError } = useApiFootball('fixtures?team=492&season=2025');

  useEffect(() => {
    if (data && data.response) {
      console.log('All Napoli matches from API:', data.response.length);
      
      const filteredMatches = data.response.filter((match: any) => {
        // Filter only specific competitions and exclude friendlies
        const leagueName = match.league.name.toLowerCase();
        const isValidCompetition = (
          leagueName.includes('serie a') ||
          leagueName.includes('coppa italia') ||
          leagueName.includes('supercoppa') ||
          leagueName.includes('superlega') ||
          leagueName.includes('champions league') ||
          leagueName.includes('uefa champions league')
        );
        const isFriendly = (
          leagueName.includes('friendly') ||
          leagueName.includes('friendlies') ||
          leagueName.includes('amichevole')
        );
        
        console.log(`Match: ${match.league.name}, Status: ${match.fixture.status.short}, Valid: ${isValidCompetition && !isFriendly}`);
        return isValidCompetition && !isFriendly;
      });
      
      console.log('Filtered matches:', filteredMatches.length);
      
      const transformedMatches = filteredMatches.map((match: any) => ({
        id: match.fixture.id.toString(),
        date: match.fixture.date,
        status: match.fixture.status.short,
        league: match.league.name,
        round: match.league.round,
        homeTeam: {
          id: match.teams.home.id.toString(),
          name: match.teams.home.name,
          logo: match.teams.home.logo,
        },
        awayTeam: {
          id: match.teams.away.id.toString(),
          name: match.teams.away.name,
          logo: match.teams.away.logo,
        },
        score: {
          home: match.goals.home,
          away: match.goals.away,
        },
        venue: match.fixture.venue?.name || 'TBD',
      }));
      
      // Sort chronologically (oldest first)
      transformedMatches.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      
      console.log('Final transformed matches:', transformedMatches.length);
      
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
      // Auto-refetch handled by useApiFootball
    }
  };
};

export const useNapoliPlayers = () => {
  const [players, setPlayers] = useState<NapoliPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: apiLoading, error: apiError } = useApiFootball('players?team=492&season=2025');

  useEffect(() => {
    if (data && data.response) {
      const transformedPlayers = data.response.map((item: any) => ({
        id: item.player.id.toString(),
        name: item.player.name,
        photo: item.player.photo,
        position: item.statistics[0]?.games?.position || 'N/A',
        age: item.player.age || 0,
        nationality: item.player.nationality || 'N/A',
        goals: item.statistics[0]?.goals?.total || 0,
        assists: item.statistics[0]?.goals?.assists || 0,
        matches: item.statistics[0]?.games?.appearences || 0,
        rating: item.statistics[0]?.games?.rating || '0.0',
      }));
      
      setPlayers(transformedPlayers);
      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
    
    setLoading(apiLoading);
  }, [data, apiLoading, apiError]);

  return {
    players,
    loading,
    error,
    refetch: () => {
      // Auto-refetch handled by useApiFootball
    }
  };
};

export const useNapoliStats = () => {
  const [stats, setStats] = useState<NapoliStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, loading: apiLoading, error: apiError } = useApiFootball('standings?league=135&season=2025&team=492');

  useEffect(() => {
    if (data && data.response && data.response[0]) {
      const standings = data.response[0].league.standings[0];
      const napoliStanding = standings.find((team: any) => team.team.id === 492);
      
      if (napoliStanding) {
        setStats({
          league: data.response[0].league.name,
          position: napoliStanding.rank,
          points: napoliStanding.points,
          played: napoliStanding.all.played,
          wins: napoliStanding.all.win,
          draws: napoliStanding.all.draw,
          losses: napoliStanding.all.lose,
          goalsFor: napoliStanding.all.goals.for,
          goalsAgainst: napoliStanding.all.goals.against,
          goalsDiff: napoliStanding.goalsDiff,
          form: napoliStanding.form || '',
        });
      }
      setError(null);
    } else if (apiError) {
      setError(apiError);
    }
    
    setLoading(apiLoading);
  }, [data, apiLoading, apiError]);

  return {
    stats,
    loading,
    error,
    refetch: () => {
      // Auto-refetch handled by useApiFootball
    }
  };
};