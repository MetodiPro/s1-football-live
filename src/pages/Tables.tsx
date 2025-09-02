import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { useSerieAStandings } from "@/hooks/useSerieAStandings";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Tables = () => {
  const { standings, season, loading, error, refetch } = useSerieAStandings();

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Classifica aggiornata",
      description: "La classifica è stata aggiornata con successo.",
    });
  };

  const getPositionStyle = (position: number) => {
    if (position <= 4) return "bg-primary/10 border-l-4 border-primary"; // Champions League
    if (position === 5) return "bg-orange-500/10 border-l-4 border-orange-500"; // Europa League
    if (position === 6) return "bg-green-500/10 border-l-4 border-green-500"; // Conference League
    if (position >= 18) return "bg-destructive/10 border-l-4 border-destructive"; // Relegation
    return "bg-muted/30";
  };

  const getPositionBadge = (position: number) => {
    if (position <= 4) return { text: "UCL", variant: "default" as const };
    if (position === 5) return { text: "UEL", variant: "secondary" as const };
    if (position === 6) return { text: "UECL", variant: "outline" as const };
    if (position >= 18) return { text: "RET", variant: "destructive" as const };
    return null;
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Classifica Serie A</h1>
        </div>
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Caricamento classifica...</span>
          </div>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Classifica Serie A</h1>
        </div>
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">Errore nel caricamento della classifica</p>
              <p className="text-sm text-muted-foreground/80 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Riprova
              </Button>
            </div>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Classifica Serie A</h1>
          {season && (
            <p className="text-sm text-muted-foreground">
              Stagione {new Date(season.startDate).getFullYear()}/{new Date(season.endDate).getFullYear()} 
              {season.currentMatchday && ` • Giornata ${season.currentMatchday}`}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <Card className="shadow-card overflow-hidden">
        {/* Mobile View */}
        <div className="block md:hidden">
          <div className="p-4 bg-muted/30 border-b border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Classifica Serie A</h3>
          </div>
          <div className="divide-y divide-border/30">
            {standings.map((team) => {
              const badge = getPositionBadge(team.position);
              return (
                <div
                  key={team.team.id}
                  className={`p-4 ${getPositionStyle(team.position)}`}
                >
                  {/* Main Row: Position, Team, Points */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Position */}
                      <div className="flex flex-col items-center min-w-[40px]">
                        <span className="text-lg font-bold">{team.position}</span>
                        {badge && (
                          <Badge variant={badge.variant} className="text-xs px-1 py-0 mt-1">
                            {badge.text}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Team */}
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {team.team.shortName?.substring(0, 2) || team.team.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-base">{team.team.name}</span>
                      </div>
                    </div>
                    
                    {/* Points */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{team.points}</div>
                      <div className="text-xs text-muted-foreground uppercase">Punti</div>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <div className="flex justify-between text-sm">
                      <div className="text-center">
                        <div className="font-medium">{team.playedGames}</div>
                        <div className="text-xs text-muted-foreground">Partite</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-green-600">{team.won}</div>
                        <div className="text-xs text-muted-foreground">Vinte</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-yellow-600">{team.draw}</div>
                        <div className="text-xs text-muted-foreground">Pari</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">{team.lost}</div>
                        <div className="text-xs text-muted-foreground">Perse</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-3 pt-2 border-t border-border/20">
                      <div className="flex space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{team.goalsFor}</div>
                          <div className="text-xs text-muted-foreground">GF</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{team.goalsAgainst}</div>
                          <div className="text-xs text-muted-foreground">GS</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-medium ${team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : ''}`}>
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </div>
                          <div className="text-xs text-muted-foreground">Diff</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          {/* Header */}
          <div className="p-4 bg-muted/30 border-b border-border/50">
            <div className="grid grid-cols-14 gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <div className="col-span-1 text-center">Pos</div>
              <div className="col-span-4">Squadra</div>
              <div className="col-span-1 text-center">G</div>
              <div className="col-span-1 text-center">V</div>
              <div className="col-span-1 text-center">N</div>
              <div className="col-span-1 text-center">P</div>
              <div className="col-span-1 text-center">GF</div>
              <div className="col-span-1 text-center">GS</div>
              <div className="col-span-1 text-center">Dif</div>
              <div className="col-span-2 text-center">Punti</div>
            </div>
          </div>

          {/* Teams */}
          <div className="divide-y divide-border/30">
            {standings.map((team) => {
              const badge = getPositionBadge(team.position);
              return (
                <div
                  key={team.team.id}
                  className={`p-3 transition-colors hover:bg-muted/20 ${getPositionStyle(team.position)}`}
                >
                  <div className="grid grid-cols-14 gap-2 items-center">
                    <div className="col-span-1 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-sm">{team.position}</span>
                        {badge && (
                          <Badge variant={badge.variant} className="text-xs px-1 py-0 mt-1">
                            {badge.text}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="col-span-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {team.team.shortName?.substring(0, 2) || team.team.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-sm truncate">{team.team.name}</span>
                      </div>
                    </div>
                    <div className="col-span-1 text-center text-sm">{team.playedGames}</div>
                    <div className="col-span-1 text-center text-sm text-green-600 font-medium">{team.won}</div>
                    <div className="col-span-1 text-center text-sm text-yellow-600 font-medium">{team.draw}</div>
                    <div className="col-span-1 text-center text-sm text-red-600 font-medium">{team.lost}</div>
                    <div className="col-span-1 text-center text-sm font-medium">{team.goalsFor}</div>
                    <div className="col-span-1 text-center text-sm font-medium">{team.goalsAgainst}</div>
                    <div className="col-span-1 text-center text-sm">
                      <div className={team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : ''}>
                        {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-lg font-bold text-primary">{team.points}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 bg-muted/20 border-t border-border/50">
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-muted-foreground">Champions League</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-muted-foreground">Europa League</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-muted-foreground">Conference League</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-destructive rounded"></div>
              <span className="text-muted-foreground">Retrocessione</span>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default Tables;