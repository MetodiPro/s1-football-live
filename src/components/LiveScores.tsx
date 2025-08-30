import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, AlertCircle } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { useFootballData } from "@/hooks/useFootballData";
import { toast } from "@/hooks/use-toast";

export function LiveScores() {
  const { matches, loading, error, refetch } = useFootballData();

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Aggiornamento completato",
      description: "I risultati sono stati aggiornati con successo.",
    });
  };

  // Convert API data to our component format
  const convertMatch = (match: any) => ({
    id: match.id.toString(),
    homeTeam: { 
      name: match.homeTeam.name, 
      logo: "", 
      score: match.score.fullTime.home 
    },
    awayTeam: { 
      name: match.awayTeam.name, 
      logo: "", 
      score: match.score.fullTime.away 
    },
    competition: match.competition.name,
    status: (match.status === 'IN_PLAY' ? 'live' : 
             match.status === 'FINISHED' ? 'finished' : 
             'upcoming') as 'live' | 'finished' | 'upcoming',
    time: match.status === 'TIMED' ? 
          new Date(match.utcDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : 
          new Date(match.utcDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    minute: match.status === 'IN_PLAY' ? 90 : undefined, // Football-Data doesn't provide exact minute
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Caricamento risultati...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">Errore nel caricamento dei dati</p>
              <p className="text-sm text-muted-foreground/80 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Riprova
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const convertedMatches = matches.map(convertMatch);
  const liveMatches = convertedMatches.filter(match => match.status === "live");
  const otherMatches = convertedMatches.filter(match => match.status !== "live");

  return (
    <div className="space-y-6">
      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center">
              🔴 In Diretta
              <span className="ml-2 text-sm text-muted-foreground">
                ({liveMatches.length})
              </span>
            </h2>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Aggiorna
            </Button>
          </div>
          <div className="space-y-3">
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Other Matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {convertedMatches.length > 0 ? "Recenti e Prossime" : "Nessuna partita oggi"}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
        </div>
        <div className="space-y-3">
          {otherMatches.length > 0 ? (
            otherMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessuna partita disponibile per oggi.</p>
              <p className="text-sm mt-1">Prova ad aggiornare o controlla domani.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
