import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NapoliMatch } from "@/hooks/useNapoliData";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from "react";

interface NapoliMatchesProps {
  matches: NapoliMatch[];
  loading: boolean;
}

export const NapoliMatches = ({ matches, loading }: NapoliMatchesProps) => {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <Card className="p-6 shadow-card">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-32"></div>
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

  const getMatchResult = (match: NapoliMatch) => {
    if (match.status === 'NS') return null;
    
    const isHome = match.homeTeam.name === 'Napoli';
    const napoliScore = isHome ? match.score.home : match.score.away;
    const opponentScore = isHome ? match.score.away : match.score.home;
    
    if (napoliScore === null || opponentScore === null) return null;
    
    if (napoliScore > opponentScore) return 'W';
    if (napoliScore < opponentScore) return 'L';
    return 'D';
  };

  const allMatches = matches.slice(0, 15);

  return (
    <Card className="shadow-card">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Partite Ufficiali</h3>
        <div className="space-y-3">
          {allMatches.map((match) => {
            const isHome = match.homeTeam.name === 'Napoli';
            const opponent = isHome ? match.awayTeam : match.homeTeam;
            const result = getMatchResult(match);
            
            return (
              <div 
                key={match.id}
                className="flex flex-col space-y-2 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
              >
                {/* League and Date */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="font-medium">{match.league} - {match.round}</span>
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
                    <span className={`font-medium text-sm ${match.homeTeam.name === 'Napoli' ? 'text-blue-600 font-bold' : ''}`}>
                      {match.homeTeam.name}
                    </span>
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
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(match.status)}
                          {result && (
                            <Badge 
                              variant={result === 'W' ? 'default' : result === 'D' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {result}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center space-x-3 flex-1 justify-end">
                    <span className={`font-medium text-sm ${match.awayTeam.name === 'Napoli' ? 'text-blue-600 font-bold' : ''}`}>
                      {match.awayTeam.name}
                    </span>
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
                {!isHome && (
                  <div className="text-xs text-muted-foreground text-center">
                    📍 {match.venue}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};