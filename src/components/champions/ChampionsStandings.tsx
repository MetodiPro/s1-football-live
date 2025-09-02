import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChampionsStanding } from "@/hooks/useChampionsLeague";
import { useState } from "react";

interface ChampionsStandingsProps {
  standings: ChampionsStanding[];
  loading: boolean;
}

export const ChampionsStandings = ({ standings, loading }: ChampionsStandingsProps) => {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <Card className="p-6 shadow-card">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded"></div>
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="w-24 h-4 bg-muted rounded"></div>
                <div className="flex space-x-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="w-8 h-4 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Group standings by group
  const groupedStandings = standings.reduce((acc, standing) => {
    const group = standing.group || 'Unknown';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(standing);
    return acc;
  }, {} as Record<string, ChampionsStanding[]>);

  const getQualificationBadge = (rank: number) => {
    if (rank <= 2) {
      return <Badge variant="default" className="text-xs">Ottavi</Badge>;
    } else if (rank === 3) {
      return <Badge variant="secondary" className="text-xs">Europa</Badge>;
    }
    return null;
  };

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Classifiche Gironi</h3>
        <div className="space-y-6">
          {Object.entries(groupedStandings).map(([group, teams]) => (
            <div key={group}>
              <h4 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">{group}</h4>
              <div className="overflow-x-auto">
                {/* Header */}
                <div className="bg-muted/30 border-b border-border/50 px-4 py-3">
                  <div className="grid grid-cols-[40px_1fr_60px_60px_60px_60px_60px_60px_60px_80px] gap-2 min-w-[600px] text-xs font-medium text-muted-foreground uppercase tracking-wide">
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
                  {teams.map((team) => (
                    <div
                      key={team.team.id}
                      className="px-4 py-3 transition-colors hover:bg-muted/20"
                    >
                      <div className="grid grid-cols-[40px_1fr_60px_60px_60px_60px_60px_60px_60px_80px] gap-2 items-center min-w-[600px]">
                        {/* Position */}
                        <div className="text-center">
                          <span className="font-bold text-sm">{team.rank}</span>
                        </div>
                        
                        {/* Team */}
                        <div className="text-left">
                          <div className="flex items-center space-x-3">
                            {team.team.logo && !logoErrors[team.team.id] ? (
                              <img 
                                src={team.team.logo} 
                                alt={`${team.team.name} logo`}
                                className="w-6 h-6 object-contain"
                                onError={() => {
                                  setLogoErrors(prev => ({ ...prev, [team.team.id]: true }));
                                }}
                              />
                            ) : (
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">
                                  {team.team.name.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{team.team.name}</span>
                              {getQualificationBadge(team.rank)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="text-center text-sm">{team.played}</div>
                        <div className="text-center text-sm font-medium text-green-600">{team.wins}</div>
                        <div className="text-center text-sm">{team.draws}</div>
                        <div className="text-center text-sm font-medium text-red-600">{team.losses}</div>
                        <div className="text-center text-sm">{team.goalsFor}</div>
                        <div className="text-center text-sm">{team.goalsAgainst}</div>
                        <div className="text-center text-sm font-medium">{team.goalsDiff > 0 ? '+' : ''}{team.goalsDiff}</div>
                        <div className="text-center">
                          <span className="text-lg font-bold text-primary">{team.points}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};