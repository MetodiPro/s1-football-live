
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Lineup } from "@/hooks/useMatchDetails";

interface MatchLineupsProps {
  lineups: Lineup[];
}

export const MatchLineups = ({ lineups }: MatchLineupsProps) => {
  if (!lineups || lineups.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-card p-6">
      <h3 className="font-semibold mb-4 flex items-center">
        <Users className="w-4 h-4 mr-2" />
        Formazioni
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lineups.map((lineup, index) => (
          <div key={index} className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img 
                  src={lineup.team.logo} 
                  alt={lineup.team.name}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h4 className="font-medium">{lineup.team.name}</h4>
              </div>
              <Badge variant="outline" className="mb-3">
                {lineup.formation}
              </Badge>
            </div>
            
            <div>
              <h5 className="font-medium text-sm mb-2 text-muted-foreground">Titolari</h5>
              <div className="space-y-1">
                {lineup.startXI.map((player, playerIndex) => (
                  <div key={playerIndex} className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                      {player.player.number || playerIndex + 1}
                    </span>
                    <span>{player.player.name}</span>
                    {player.player.pos && (
                      <Badge variant="secondary" className="text-xs">
                        {player.player.pos}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {lineup.substitutes && lineup.substitutes.length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2 text-muted-foreground">Panchina</h5>
                <div className="space-y-1">
                  {lineup.substitutes.slice(0, 7).map((player, playerIndex) => (
                    <div key={playerIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs">
                        {player.player.number || '-'}
                      </span>
                      <span>{player.player.name}</span>
                      {player.player.pos && (
                        <Badge variant="outline" className="text-xs">
                          {player.player.pos}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
