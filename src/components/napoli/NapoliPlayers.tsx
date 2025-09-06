import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NapoliPlayer } from "@/hooks/useNapoliData";
import { useState } from "react";

interface NapoliPlayersProps {
  players: NapoliPlayer[];
  loading: boolean;
}

export const NapoliPlayers = ({ players, loading }: NapoliPlayersProps) => {
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

  const scorers = players
    .filter(player => player.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);

  const assistProviders = players
    .filter(player => player.assists > 0)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 10);

  // Sort players by position: Goalkeeper -> Defender -> Midfielder -> Attacker
  const getPositionPriority = (position: string): number => {
    const pos = position.toLowerCase();
    if (pos.includes('goalkeeper') || pos.includes('goalie') || pos === 'g') return 1;
    if (pos.includes('defender') || pos.includes('defence') || pos === 'd') return 2;
    if (pos.includes('midfielder') || pos.includes('midfield') || pos === 'm') return 3;
    if (pos.includes('attacker') || pos.includes('forward') || pos.includes('striker') || pos === 'f') return 4;
    return 5; // Unknown positions last
  };

  const allPlayers = players
    .sort((a, b) => {
      const aPriority = getPositionPriority(a.position);
      const bPriority = getPositionPriority(b.position);
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority; // Sort by position first
      }
      
      // Within same position, sort by matches played (descending)
      return b.matches - a.matches;
    })
    .slice(0, 25);

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'goalkeeper':
        return 'bg-yellow-500';
      case 'defender':
        return 'bg-blue-500';
      case 'midfielder':
        return 'bg-green-500';
      case 'attacker':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const PlayerTable = ({ playersList, showGoals = true, showAssists = true }: { 
    playersList: NapoliPlayer[], 
    showGoals?: boolean, 
    showAssists?: boolean 
  }) => (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border/50 px-4 py-3">
        <div className="grid grid-cols-[40px_1fr_80px_60px_60px_60px_80px] gap-2 min-w-[500px] text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="text-center">Pos</div>
          <div className="text-left">Giocatore</div>
          <div className="text-left">Ruolo</div>
          {showGoals && <div className="text-center">Goal</div>}
          {showAssists && <div className="text-center">Assist</div>}
          <div className="text-center">Partite</div>
          <div className="text-center">Voto</div>
        </div>
      </div>

      {/* Players */}
      <div className="divide-y divide-border/30">
        {playersList.map((player, index) => (
          <div
            key={player.id}
            className="px-4 py-3 transition-colors hover:bg-muted/20"
          >
            <div className="grid grid-cols-[40px_1fr_80px_60px_60px_60px_80px] gap-2 items-center min-w-[500px]">
              {/* Position */}
              <div className="text-center">
                <span className="font-bold text-sm">{index + 1}</span>
              </div>
              
              {/* Player */}
              <div className="text-left">
                <div className="flex items-center space-x-3">
                  {player.photo && !logoErrors[player.id] ? (
                    <img 
                      src={player.photo} 
                      alt={`${player.name} photo`}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={() => {
                        setLogoErrors(prev => ({ ...prev, [player.id]: true }));
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{player.name}</span>
                    <span className="text-xs text-muted-foreground">{player.age} anni • {player.nationality}</span>
                  </div>
                </div>
              </div>
              
              {/* Position Badge */}
              <div className="text-left">
                <Badge 
                  className={`${getPositionColor(player.position)} text-white text-xs`}
                >
                  {player.position}
                </Badge>
              </div>
              
              {/* Stats */}
              {showGoals && (
                <div className="text-center">
                  <span className="text-lg font-bold text-primary">{player.goals}</span>
                </div>
              )}
              {showAssists && (
                <div className="text-center text-sm font-medium">{player.assists}</div>
              )}
              <div className="text-center text-sm text-muted-foreground">{player.matches}</div>
              <div className="text-center text-sm font-medium">
                {parseFloat(player.rating) > 0 ? parseFloat(player.rating).toFixed(1) : '-'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Giocatori Napoli</h3>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Rosa Completa</TabsTrigger>
            <TabsTrigger value="scorers">Marcatori</TabsTrigger>
            <TabsTrigger value="assists">Assist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <PlayerTable playersList={allPlayers} />
          </TabsContent>
          
          <TabsContent value="scorers">
            {scorers.length > 0 ? (
              <PlayerTable playersList={scorers} showAssists={false} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nessun marcatore disponibile per questa stagione
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="assists">
            {assistProviders.length > 0 ? (
              <PlayerTable playersList={assistProviders} showGoals={false} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nessun assist disponibile per questa stagione
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};