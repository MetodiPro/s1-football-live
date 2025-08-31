import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchMatchDetails = async () => {
    if (!matchId) {
      setError('ID partita mancante');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching match details for ID: ${matchId} from TheSportsDB`);

      // Fetch basic match details
      const { data: matchData, error: matchError } = await supabase.functions.invoke('thesportsdb', {
        body: { endpoint: `lookupevent.php?id=${matchId}` }
      });

      if (matchError) {
        console.error('Match fetch error:', matchError);
        throw new Error(matchError.message);
      }

      if (matchData.error) {
        throw new Error(matchData.error);
      }

      if (!matchData.events || matchData.events.length === 0) {
        throw new Error('Partita non trovata');
      }

      const event = matchData.events[0];
      console.log('Match details from TheSportsDB:', event);

      // Transform TheSportsDB event to our format
      const transformedMatch: MatchDetails = {
        fixture: {
          id: event.idEvent,
          referee: event.strOfficial,
          timezone: 'Europe/Rome',
          date: event.strTimestamp || event.dateEvent + 'T' + (event.strTime || '00:00:00'),
          timestamp: new Date(event.strTimestamp || event.dateEvent).getTime() / 1000,
          periods: {
            first: null,
            second: null,
          },
          venue: {
            id: event.idVenue,
            name: event.strVenue,
            city: event.strCity,
          },
          status: {
            long: getStatusLong(event.strStatus || 'Not Started'),
            short: getStatusShort(event.strStatus || 'Not Started'),
            elapsed: event.intSpectators ? undefined : undefined,
          },
        },
        league: {
          id: event.idLeague || '4332',
          name: event.strLeague || 'Serie A',
          country: 'Italy',
          logo: event.strLeagueBadge || '',
          flag: 'https://www.thesportsdb.com/images/media/league/badge/64049016687289.png',
          season: 2024,
          round: `Round ${event.intRound || 'Unknown'}`,
        },
        teams: {
          home: {
            id: event.idHomeTeam,
            name: event.strHomeTeam,
            logo: event.strHomeTeamBadge || '',
            winner: event.intHomeScore && event.intAwayScore ? 
              parseInt(event.intHomeScore) > parseInt(event.intAwayScore) : undefined,
          },
          away: {
            id: event.idAwayTeam,
            name: event.strAwayTeam,
            logo: event.strAwayTeamBadge || '',
            winner: event.intHomeScore && event.intAwayScore ? 
              parseInt(event.intAwayScore) > parseInt(event.intHomeScore) : undefined,
          },
        },
        goals: {
          home: event.intHomeScore ? parseInt(event.intHomeScore) : undefined,
          away: event.intAwayScore ? parseInt(event.intAwayScore) : undefined,
        },
        score: {
          halftime: {
            home: event.intHomeScore ? parseInt(event.intHomeScore) : undefined,
            away: event.intAwayScore ? parseInt(event.intAwayScore) : undefined,
          },
          fulltime: {
            home: event.intHomeScore ? parseInt(event.intHomeScore) : undefined,
            away: event.intAwayScore ? parseInt(event.intAwayScore) : undefined,
          },
          extratime: {
            home: undefined,
            away: undefined,
          },
          penalty: {
            home: undefined,
            away: undefined,
          },
        },
      };

      setMatchDetails(transformedMatch);

      // Fetch additional data if match is finished or live
      const status = event.strStatus;
      if (status === 'Match Finished' || status === 'FT') {
        try {
          // Fetch events timeline
          const { data: eventsData } = await supabase.functions.invoke('thesportsdb', {
            body: { endpoint: `lookupeventtimeline.php?id=${matchId}` }
          });
          
          if (eventsData.timeline) {
            const transformedEvents = eventsData.timeline.map((timeline: any) => ({
              time: {
                elapsed: parseInt(timeline.intTime) || 0,
              },
              team: {
                id: timeline.idTeam,
                name: timeline.strTeamBadge?.includes('Home') ? event.strHomeTeam : event.strAwayTeam,
                logo: timeline.idTeam === event.idHomeTeam ? event.strHomeTeamBadge : event.strAwayTeamBadge,
              },
              player: {
                id: timeline.idPlayer || '',
                name: timeline.strPlayer || '',
              },
              assist: timeline.strAssist ? {
                id: '',
                name: timeline.strAssist,
              } : undefined,
              type: timeline.strEvent || 'Unknown',
              detail: timeline.strEvent || '',
              comments: timeline.strComment,
            }));
            setEvents(transformedEvents);
          }
        } catch (err) {
          console.log('Events timeline not available:', err);
        }

        try {
          // Try to fetch lineup if available
          const { data: lineupData } = await supabase.functions.invoke('thesportsdb', {
            body: { endpoint: `lookuplineup.php?id=${matchId}` }
          });
          
          if (lineupData.lineup) {
            const homeLineup = lineupData.lineup.filter((player: any) => 
              player.strTeam === event.strHomeTeam
            );
            const awayLineup = lineupData.lineup.filter((player: any) => 
              player.strTeam === event.strAwayTeam
            );

            const transformedLineups = [
              {
                team: {
                  id: event.idHomeTeam,
                  name: event.strHomeTeam,
                  logo: event.strHomeTeamBadge || '',
                },
                formation: homeLineup[0]?.strFormation || '4-4-2',
                startXI: homeLineup.filter((p: any) => p.strPosition !== 'Substitute').map((player: any) => ({
                  player: {
                    id: player.idPlayer,
                    name: player.strPlayer,
                    pos: player.strPosition,
                    number: parseInt(player.intSquadNumber) || undefined,
                  },
                })),
                substitutes: homeLineup.filter((p: any) => p.strPosition === 'Substitute').map((player: any) => ({
                  player: {
                    id: player.idPlayer,
                    name: player.strPlayer,
                    pos: player.strPosition,
                    number: parseInt(player.intSquadNumber) || undefined,
                  },
                })),
              },
              {
                team: {
                  id: event.idAwayTeam,
                  name: event.strAwayTeam,
                  logo: event.strAwayTeamBadge || '',
                },
                formation: awayLineup[0]?.strFormation || '4-4-2',
                startXI: awayLineup.filter((p: any) => p.strPosition !== 'Substitute').map((player: any) => ({
                  player: {
                    id: player.idPlayer,
                    name: player.strPlayer,
                    pos: player.strPosition,
                    number: parseInt(player.intSquadNumber) || undefined,
                  },
                })),
                substitutes: awayLineup.filter((p: any) => p.strPosition === 'Substitute').map((player: any) => ({
                  player: {
                    id: player.idPlayer,
                    name: player.strPlayer,
                    pos: player.strPosition,
                    number: parseInt(player.intSquadNumber) || undefined,
                  },
                })),
              },
            ];
            setLineups(transformedLineups);
          }
        } catch (err) {
          console.log('Lineups not available:', err);
        }
      }

    } catch (err) {
      console.error('Error fetching match details from TheSportsDB:', err);
      setError(err instanceof Error ? err.message : 'Impossibile recuperare i dettagli della partita');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLong = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Match Finished': 'Match Finished',
      'Not Started': 'Not Started',
      'In Play': 'In Play',
      'Half Time': 'Half Time',
      'Full Time': 'Match Finished',
      'NS': 'Not Started',
      'FT': 'Match Finished',
      'HT': 'Half Time',
      '1H': 'First Half',
      '2H': 'Second Half'
    };
    return statusMap[status] || status;
  };

  const getStatusShort = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Match Finished': 'FT',
      'Not Started': 'NS',
      'In Play': 'LIVE',
      'Half Time': 'HT',
      'Full Time': 'FT',
      'NS': 'NS',
      'FT': 'FT',
      'HT': 'HT',
      '1H': '1H',
      '2H': '2H'
    };
    return statusMap[status] || 'NS';
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