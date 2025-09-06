import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

export interface ChampionsMatch {
  id: string;
  date: string;
  status: string;
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

export interface ChampionsStanding {
  rank: number;
  team: {
    id: string;
    name: string;
    logo: string;
  };
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDiff: number;
  group?: string;
}

export const useChampionsLeague = () => {
  const [fixtures, setFixtures] = useState<ChampionsMatch[]>([]);
  const [standings, setStandings] = useState<ChampionsStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UEFA Champions League ID is 2
  const { data: fixturesData, loading: fixturesLoading, error: fixturesError } = useApiFootball('fixtures?league=2&season=2025');
  const { data: standingsData, loading: standingsLoading, error: standingsError } = useApiFootball('standings?league=2&season=2025');

  useEffect(() => {
    if (fixturesData && fixturesData.response) {
      // Filter ONLY for group stage matches - exclude all qualifying rounds
      const filteredMatches = fixturesData.response.filter((match: any) => {
        const round = match.league.round?.toLowerCase() || '';
        console.log('Match round:', match.league.round); // Debug log
        
        // Include only group stage matches (Matchday 1-6)
        return round.includes('group stage') || 
               (round.includes('matchday') && 
                !round.includes('qualifying') && 
                !round.includes('play-off') &&
                !round.includes('preliminary'));
      });

      console.log('Filtered group stage matches:', filteredMatches.length); // Debug log

      const transformedFixtures = filteredMatches.map((match: any) => ({
        id: match.fixture.id.toString(),
        date: match.fixture.date,
        status: match.fixture.status.short,
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
      
      // Sort by date
      transformedFixtures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setFixtures(transformedFixtures);
    }

    if (standingsData && standingsData.response) {
      const allStandings: ChampionsStanding[] = [];
      standingsData.response.forEach((group: any) => {
        group.league.standings.forEach((groupStandings: any[]) => {
          groupStandings.forEach((standing: any) => {
            allStandings.push({
              rank: standing.rank,
              team: {
                id: standing.team.id.toString(),
                name: standing.team.name,
                logo: standing.team.logo,
              },
              points: standing.points,
              played: standing.all.played,
              wins: standing.all.win,
              draws: standing.all.draw,
              losses: standing.all.lose,
              goalsFor: standing.all.goals.for,
              goalsAgainst: standing.all.goals.against,
              goalsDiff: standing.goalsDiff,
              group: group.league.name,
            });
          });
        });
      });
      setStandings(allStandings);
    }

    const hasError = fixturesError || standingsError;
    setError(hasError || null);
    setLoading(fixturesLoading || standingsLoading);
  }, [fixturesData, standingsData, fixturesLoading, standingsLoading, fixturesError, standingsError]);

  return {
    fixtures,
    standings,
    loading,
    error,
    refetch: () => {
      // Auto-refetch handled by useApiFootball
    }
  };
};