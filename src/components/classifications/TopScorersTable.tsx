import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useTopScorers } from "@/hooks/useTopScorers";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export const TopScorersTable = () => {
  const { scorers, loading, error, refetch } = useTopScorers();
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Classifica marcatori aggiornata",
      description: "La classifica è stata aggiornata con successo.",
    });
  };

  if (loading) {
    return (
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Caricamento classifica marcatori...</span>
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
          <div className="grid grid-cols-[40px_1fr_80px_60px_60px_60px] gap-2 min-w-[500px] text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="text-center">Pos</div>
            <div className="text-left">Giocatore</div>
            <div className="text-left">Squadra</div>
            <div className="text-center">Goal</div>
            <div className="text-center">Assist</div>
            <div className="text-center">Partite</div>
          </div>
        </div>

        {/* Players */}
        <div className="divide-y divide-border/30">
          {scorers.map((scorer, index) => (
            <div
              key={scorer.player.id}
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
                    {scorer.player.photo && !logoErrors[scorer.player.id] ? (
                      <img 
                        src={scorer.player.photo} 
                        alt={`${scorer.player.name} photo`}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={() => {
                          setLogoErrors(prev => ({ ...prev, [scorer.player.id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {scorer.player.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                    )}
                    <span className="font-medium text-sm">{scorer.player.name}</span>
                  </div>
                </div>
                
                {/* Team */}
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    {scorer.team.logo && !logoErrors[scorer.team.id] ? (
                      <img 
                        src={scorer.team.logo} 
                        alt={`${scorer.team.name} logo`}
                        className="w-5 h-5 object-contain"
                        onError={() => {
                          setLogoErrors(prev => ({ ...prev, [scorer.team.id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {scorer.team.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="text-center">
                  <span className="text-lg font-bold text-primary">{scorer.goals}</span>
                </div>
                <div className="text-center text-sm font-medium">{scorer.assists}</div>
                <div className="text-center text-sm text-muted-foreground">{scorer.matches}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};