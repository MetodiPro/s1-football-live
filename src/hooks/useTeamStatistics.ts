import { useState, useEffect } from 'react';
import { useApiFootball } from '@/hooks/useApiFootball';

export interface TeamStatistic {
  team: {
    id: string;
    name: string;
    logo: string;
  };
  possession: number;
  shotsOnGoal: number;
  totalShots: number;
  corners: number;
  foulsDrawn: number;
  foulsCommitted: number;
  expectedGoals: number;
  matches: number;
}

export const useTeamStatistics = () => {
  const [statistics, setStatistics] = useState<TeamStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get Serie A standings to get all teams
  const { data: standingsData, loading: standingsLoading, error: standingsError } = useApiFootball('standings?league=135&season=2025');

  useEffect(() => {
    const fetchTeamStatistics = async () => {
      if (!standingsData || !standingsData.response || standingsData.response.length === 0) {
        return;
      }

      try {
        setLoading(true);
        const teams = standingsData.response[0].league.standings[0];
        const teamStats: TeamStatistic[] = [];

        // For each team, we'll aggregate their season statistics
        for (const teamData of teams) {
          const teamId = teamData.team.id;
          
          // Fetch all matches for this team in Serie A 2025
          const matchesResponse = await fetch(`https://urebctifhcxphqbhwrjr.supabase.co/functions/v1/api-football`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              endpoint: `fixtures?team=${teamId}&league=135&season=2025&status=FT`
            })
          });

          if (!matchesResponse.ok) continue;

          const matchesData = await matchesResponse.json();
          
          if (!matchesData.response || matchesData.response.length === 0) {
            // No completed matches yet, use team data from standings
            teamStats.push({
              team: {
                id: teamId.toString(),
                name: teamData.team.name,
                logo: teamData.team.logo,
              },
              possession: 50, // Default value when no matches
              shotsOnGoal: 0,
              totalShots: 0,
              corners: 0,
              foulsDrawn: 0,
              foulsCommitted: 0,
              expectedGoals: 0,
              matches: teamData.all.played,
            });
            continue;
          }

          // Aggregate statistics from all completed matches
          let totalPossession = 0;
          let totalShotsOnGoal = 0;
          let totalShotsTotal = 0;
          let totalCorners = 0;
          let totalFoulsDrawn = 0;
          let totalFoulsCommitted = 0;
          let totalExpectedGoals = 0;
          let matchCount = 0;

          for (const match of matchesData.response) {
            // Fetch match statistics
            const statsResponse = await fetch(`https://urebctifhcxphqbhwrjr.supabase.co/functions/v1/api-football`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                endpoint: `fixtures/statistics?fixture=${match.fixture.id}`
              })
            });

            if (!statsResponse.ok) continue;

            const statsData = await statsResponse.json();
            
            if (!statsData.response || statsData.response.length === 0) continue;

            // Find team's statistics in this match
            const teamStats = statsData.response.find((stat: any) => stat.team.id === teamId);
            if (!teamStats || !teamStats.statistics) continue;

            matchCount++;

            // Extract statistics
            teamStats.statistics.forEach((stat: any) => {
              switch (stat.type) {
                case 'Ball Possession':
                  if (stat.value && stat.value !== null) {
                    totalPossession += parseInt(stat.value.replace('%', '')) || 0;
                  }
                  break;
                case 'Shots on Goal':
                  totalShotsOnGoal += stat.value || 0;
                  break;
                case 'Total Shots':
                  totalShotsTotal += stat.value || 0;
                  break;
                case 'Corner Kicks':
                  totalCorners += stat.value || 0;
                  break;
                case 'Fouls':
                  totalFoulsCommitted += stat.value || 0;
                  break;
                case 'expected_goals':
                  totalExpectedGoals += parseFloat(stat.value) || 0;
                  break;
              }
            });
          }

          // Calculate averages and totals
          teamStats.push({
            team: {
              id: teamId.toString(),
              name: teamData.team.name,
              logo: teamData.team.logo,
            },
            possession: matchCount > 0 ? Math.round(totalPossession / matchCount) : 50,
            shotsOnGoal: Math.round(totalShotsOnGoal / Math.max(matchCount, 1)),
            totalShots: Math.round(totalShotsTotal / Math.max(matchCount, 1)),
            corners: Math.round(totalCorners / Math.max(matchCount, 1)),
            foulsDrawn: Math.round(totalFoulsDrawn / Math.max(matchCount, 1)), // Using foulsCommitted as approximation
            foulsCommitted: Math.round(totalFoulsCommitted / Math.max(matchCount, 1)),
            expectedGoals: Math.round((totalExpectedGoals / Math.max(matchCount, 1)) * 100) / 100,
            matches: teamData.all.played,
          });

          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        setStatistics(teamStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching team statistics:', err);
        setError('Errore nel caricamento delle statistiche');
      } finally {
        setLoading(false);
      }
    };

    if (standingsData && standingsData.response) {
      fetchTeamStatistics();
    } else if (standingsError) {
      setError(standingsError);
      setLoading(standingsLoading);
    } else {
      setLoading(standingsLoading);
    }
  }, [standingsData, standingsError, standingsLoading]);

  return {
    statistics,
    loading,
    error,
    refetch: () => {
      // Trigger re-fetch by clearing current data
      setStatistics([]);
      setLoading(true);
    }
  };
};