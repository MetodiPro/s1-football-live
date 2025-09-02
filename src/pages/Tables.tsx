import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Trophy, Target, Users, BarChart3, Square, Flag, AlertTriangle, Zap } from "lucide-react";
import { useSerieAStandings } from "@/hooks/useSerieAStandings";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TopScorersTable } from "@/components/classifications/TopScorersTable";
import { TopAssistsTable } from "@/components/classifications/TopAssistsTable";
import { TeamStatsTable } from "@/components/classifications/TeamStatsTable";

const Tables = () => {
  const { standings, season, loading, error, refetch } = useSerieAStandings();
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>('standings');

  const tabs = [
    { id: 'standings', label: 'Classifica Generale', icon: Trophy },
    { id: 'scorers', label: 'Marcatori', icon: Target },
    { id: 'assists', label: 'Assist', icon: Users },
    { id: 'possession', label: 'Possesso Palla', icon: BarChart3 },
    { id: 'shotsOnGoal', label: 'Tiri in Porta', icon: Target },
    { id: 'totalShots', label: 'Tiri Totali', icon: Square },
    { id: 'corners', label: 'Corner', icon: Square },
    { id: 'foulsDrawn', label: 'Falli Subiti', icon: Flag },
    { id: 'foulsCommitted', label: 'Falli Fatti', icon: AlertTriangle },
    { id: 'expectedGoals', label: 'Expected Goals', icon: Zap },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'scorers':
        return <TopScorersTable />;
      case 'assists':
        return <TopAssistsTable />;
      case 'possession':
        return <TeamStatsTable statType="possession" title="Classifica Possesso Palla" valueLabel="Possesso %" />;
      case 'shotsOnGoal':
        return <TeamStatsTable statType="shotsOnGoal" title="Classifica Tiri in Porta" valueLabel="Tiri" />;
      case 'totalShots':
        return <TeamStatsTable statType="totalShots" title="Classifica Tiri Totali" valueLabel="Tiri" />;
      case 'corners':
        return <TeamStatsTable statType="corners" title="Classifica Corner" valueLabel="Corner" />;
      case 'foulsDrawn':
        return <TeamStatsTable statType="foulsDrawn" title="Classifica Falli Subiti" valueLabel="Falli" />;
      case 'foulsCommitted':
        return <TeamStatsTable statType="foulsCommitted" title="Classifica Falli Fatti" valueLabel="Falli" />;
      case 'expectedGoals':
        return <TeamStatsTable statType="expectedGoals" title="Classifica Expected Goals" valueLabel="xG" />;
      default:
        return renderStandingsTable();
    }
  };

  const renderStandingsTable = () => {
    return (
      <Card className="shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          {/* Header */}
          <div className="bg-muted/30 border-b border-border/50 px-4 py-3">
            <div className="grid grid-cols-[40px_1fr_repeat(8,40px)] gap-2 min-w-[600px] text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <div className="text-center">Pos</div>
              <div className="text-left">Squadra</div>
              <div className="text-center">PG</div>
              <div className="text-center">V</div>
              <div className="text-center">N</div>
              <div className="text-center">P</div>
              <div className="text-center">GF</div>
              <div className="text-center">GS</div>
              <div className="text-center">DR</div>
              <div className="text-center">Pt</div>
            </div>
          </div>

          {/* Teams */}
          <div className="divide-y divide-border/30">
            {standings.map((team) => {
              const badge = getPositionBadge(team.position);
              return (
                <div
                  key={team.team.id}
                  className={`px-4 py-3 transition-colors hover:bg-muted/20 ${getPositionStyle(team.position)}`}
                >
                  <div className="grid grid-cols-[40px_1fr_repeat(8,40px)] gap-2 items-center min-w-[600px]">
                    {/* Position */}
                    <div className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-sm">{team.position}</span>
                        {badge && (
                          <Badge variant={badge.variant} className="text-xs px-1 py-0 mt-1">
                            {badge.text}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Team */}
                    <div className="text-left">
                      <div className="flex items-center space-x-3">
                        {team.team.crest && !logoErrors[team.team.id] ? (
                          <img 
                            src={team.team.crest} 
                            alt={`${team.team.name} logo`}
                            className="w-6 h-6 object-contain"
                            onError={() => {
                              setLogoErrors(prev => ({ ...prev, [team.team.id]: true }));
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {team.team.shortName?.substring(0, 2) || team.team.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-sm">{team.team.name}</span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-center text-sm">{team.playedGames}</div>
                    <div className="text-center text-sm font-medium text-green-600">{team.won}</div>
                    <div className="text-center text-sm font-medium text-yellow-600">{team.draw}</div>
                    <div className="text-center text-sm font-medium text-red-600">{team.lost}</div>
                    <div className="text-center text-sm font-medium">{team.goalsFor}</div>
                    <div className="text-center text-sm font-medium">{team.goalsAgainst}</div>
                    <div className="text-center text-sm font-medium">
                      <span className={team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : ''}>
                        {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                      </span>
                    </div>
                    <div className="text-center">
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
    );
  };

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

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 bg-muted/30 p-4 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="text-xs"
            >
              <Icon className="w-4 h-4 mr-1" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </main>
  );
};

export default Tables;