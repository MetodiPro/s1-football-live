import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useTeamStatistics } from "@/hooks/useTeamStatistics";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface TeamStatsTableProps {
  statType: 'possession' | 'shotsOnGoal' | 'totalShots' | 'corners' | 'foulsDrawn' | 'foulsCommitted' | 'expectedGoals';
  title: string;
  valueLabel: string;
}

export const TeamStatsTable = ({ statType, title, valueLabel }: TeamStatsTableProps) => {
  const { statistics, loading, error, refetch } = useTeamStatistics();
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: `${title} aggiornata`,
      description: "La classifica è stata aggiornata con successo.",
    });
  };

  const sortedStats = [...statistics].sort((a, b) => {
    const valueA = a[statType];
    const valueB = b[statType];
    return valueB - valueA;
  });

  if (loading) {
    return (
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Caricamento {title.toLowerCase()}...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-muted-foreground mb-2">Errore nel caricamento</p>
            <p className="text-sm text-muted-foreground/80 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Riprova
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="bg-muted/30 border-b border-border/50 px-4 py-3">
          <div className="grid grid-cols-[40px_1fr_100px_60px] gap-2 min-w-[400px] text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="text-center">Pos</div>
            <div className="text-left">Squadra</div>
            <div className="text-center">{valueLabel}</div>
            <div className="text-center">Partite</div>
          </div>
        </div>

        {/* Teams */}
        <div className="divide-y divide-border/30">
          {sortedStats.map((stat, index) => (
            <div
              key={stat.team.id}
              className="px-4 py-3 transition-colors hover:bg-muted/20"
            >
              <div className="grid grid-cols-[40px_1fr_100px_60px] gap-2 items-center min-w-[400px]">
                {/* Position */}
                <div className="text-center">
                  <span className="font-bold text-sm">{index + 1}</span>
                </div>
                
                {/* Team */}
                <div className="text-left">
                  <div className="flex items-center space-x-3">
                    {stat.team.logo && !logoErrors[stat.team.id] ? (
                      <img 
                        src={stat.team.logo} 
                        alt={`${stat.team.name} logo`}
                        className="w-6 h-6 object-contain"
                        onError={() => {
                          setLogoErrors(prev => ({ ...prev, [stat.team.id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {stat.team.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-sm">{stat.team.name}</span>
                  </div>
                </div>
                
                {/* Value */}
                <div className="text-center">
                  <span className="text-lg font-bold text-primary">
                    {statType === 'possession' ? `${stat[statType]}%` : 
                     statType === 'expectedGoals' ? stat[statType].toFixed(2) : 
                     stat[statType]}
                  </span>
                </div>
                
                {/* Matches */}
                <div className="text-center text-sm text-muted-foreground">{stat.matches}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};