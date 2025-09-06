import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChampionsMatch } from "@/hooks/useChampionsLeague";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from "react";

interface ChampionsFixturesProps {
  fixtures: ChampionsMatch[];
  loading: boolean;
}

export const ChampionsFixtures = ({ fixtures, loading }: ChampionsFixturesProps) => {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <Card className="p-6 shadow-card">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="w-20 h-4 bg-muted rounded"></div>
                </div>
                <div className="w-8 h-6 bg-muted rounded"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-4 bg-muted rounded"></div>
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FT':
        return <Badge variant="secondary">Finita</Badge>;
      case 'LIVE':
      case '1H':
      case '2H':
      case 'HT':
        return <Badge variant="destructive">Live</Badge>;
      case 'NS':
        return <Badge variant="outline">Programmata</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Group matches by matchday
  const groupedMatches = fixtures.reduce((groups: { [key: string]: ChampionsMatch[] }, match) => {
    const round = match.round || 'Altro';
    if (!groups[round]) {
      groups[round] = [];
    }
    groups[round].push(match);
    return groups;
  }, {});

  // Sort matchdays properly (Matchday 1, Matchday 2, etc.)
  const sortedRounds = Object.keys(groupedMatches).sort((a, b) => {
    const matchA = a.match(/matchday (\d+)/i);
    const matchB = b.match(/matchday (\d+)/i);
    
    if (matchA && matchB) {
      return parseInt(matchA[1]) - parseInt(matchB[1]);
    }
    
    return a.localeCompare(b);
  });

  // Show message if no group stage matches are available
  if (fixtures.length === 0) {
    return (
      <Card className="shadow-card">
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Partite Champions League - Fase a Gironi</h3>
          <div className="py-8">
            <p className="text-muted-foreground mb-2">
              Nessuna partita della fase a gironi disponibile al momento
            </p>
            <p className="text-sm text-muted-foreground">
              Le partite della fase a gironi verranno mostrate quando saranno programmate
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sortedRounds.map((round) => (
        <Card key={round} className="shadow-card">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center bg-gradient-primary bg-clip-text text-transparent">
              {round}
            </h3>
            <div className="space-y-3">
              {groupedMatches[round].map((match) => (
                <div 
                  key={match.id}
                  className="flex flex-col space-y-2 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {/* Date */}
                  <div className="text-xs text-muted-foreground text-center">
                    <span>{format(new Date(match.date), 'dd/MM/yyyy HH:mm', { locale: it })}</span>
                  </div>
                  
                  {/* Match */}
                  <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex items-center space-x-3 flex-1">
                      {match.homeTeam.logo && !logoErrors[match.homeTeam.id] ? (
                        <img 
                          src={match.homeTeam.logo} 
                          alt={`${match.homeTeam.name} logo`}
                          className="w-8 h-8 object-contain"
                          onError={() => {
                            setLogoErrors(prev => ({ ...prev, [match.homeTeam.id]: true }));
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {match.homeTeam.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-sm truncate">{match.homeTeam.name}</span>
                    </div>

                    {/* Score/Status */}
                    <div className="flex flex-col items-center space-y-1 px-4">
                      {match.status === 'NS' ? (
                        <>
                          {getStatusBadge(match.status)}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(match.date), 'HH:mm', { locale: it })}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{match.score.home ?? 0}</span>
                            <span className="text-muted-foreground">-</span>
                            <span className="text-lg font-bold">{match.score.away ?? 0}</span>
                          </div>
                          {getStatusBadge(match.status)}
                        </>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center space-x-3 flex-1 justify-end">
                      <span className="font-medium text-sm truncate">{match.awayTeam.name}</span>
                      {match.awayTeam.logo && !logoErrors[match.awayTeam.id] ? (
                        <img 
                          src={match.awayTeam.logo} 
                          alt={`${match.awayTeam.name} logo`}
                          className="w-8 h-8 object-contain"
                          onError={() => {
                            setLogoErrors(prev => ({ ...prev, [match.awayTeam.id]: true }));
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {match.awayTeam.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="text-xs text-muted-foreground text-center">
                    📍 {match.venue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};