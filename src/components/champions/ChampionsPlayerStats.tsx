import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChampionsPlayer } from "@/hooks/useChampionsPlayers";
import { useState } from "react";

interface ChampionsPlayerStatsProps {
  scorers: ChampionsPlayer[];
  assists: ChampionsPlayer[];
  loading: boolean;
}

export const ChampionsPlayerStats = ({ scorers, assists, loading }: ChampionsPlayerStatsProps) => {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <Card className="p-6 shadow-card">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="w-24 h-4 bg-muted rounded"></div>
                <div className="w-16 h-4 bg-muted rounded"></div>
                <div className="w-8 h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const PlayerTable = ({ players, type }: { players: ChampionsPlayer[], type: 'goals' | 'assists' }) => (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border/50 px-4 py-3">
        <div className="grid grid-cols-[40px_1fr_80px_60px_60px_60px] gap-2 min-w-[500px] text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="text-center">Pos</div>
          <div className="text-left">Giocatore</div>
          <div className="text-left">Squadra</div>
          <div className="text-center">{type === 'goals' ? 'Goal' : 'Assist'}</div>
          <div className="text-center">{type === 'goals' ? 'Assist' : 'Goal'}</div>
          <div className="text-center">Partite</div>
        </div>
      </div>

      {/* Players */}
      <div className="divide-y divide-border/30">
        {players.slice(0, 10).map((player, index) => (
          <div
            key={player.player.id}
            className="px-4 py-3 transition-colors hover:bg-muted/20"
          >
            <div className="grid grid-cols-[40px_1fr_80px_60px_60px_60px] gap-2 items-center min-w-[500px]">
              {/* Position */}
              <div className="text-center">
                <span className="font-bold text-sm">{index + 1}</span>
              </div>
              
              {/* Player */}
              <div className="text-left">
                <div className="flex items-center space-x-3">
                  {player.player.photo && !logoErrors[player.player.id] ? (
                    <img 
                      src={player.player.photo} 
                      alt={`${player.player.name} photo`}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={() => {
                        setLogoErrors(prev => ({ ...prev, [player.player.id]: true }));
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {player.player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                  )}
                  <span className="font-medium text-sm">{player.player.name}</span>
                </div>
              </div>
              
              {/* Team */}
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  {player.team.logo && !logoErrors[player.team.id] ? (
                    <img 
                      src={player.team.logo} 
                      alt={`${player.team.name} logo`}
                      className="w-5 h-5 object-contain"
                      onError={() => {
                        setLogoErrors(prev => ({ ...prev, [player.team.id]: true }));
                      }}
                    />
                  ) : (
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {player.team.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Stats */}
              <div className="text-center">
                <span className="text-lg font-bold text-primary">
                  {type === 'goals' ? player.goals : player.assists}
                </span>
              </div>
              <div className="text-center text-sm font-medium">
                {type === 'goals' ? player.assists : player.goals}
              </div>
              <div className="text-center text-sm text-muted-foreground">{player.matches}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Classifiche Individuali</h3>
        <Tabs defaultValue="scorers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scorers">Marcatori</TabsTrigger>
            <TabsTrigger value="assists">Assist</TabsTrigger>
          </TabsList>
          <TabsContent value="scorers">
            <PlayerTable players={scorers} type="goals" />
          </TabsContent>
          <TabsContent value="assists">
            <PlayerTable players={assists} type="assists" />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};