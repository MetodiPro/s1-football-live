import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, AlertCircle } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { useSerieASchedule, ScheduleMatch } from "@/hooks/useSerieASchedule";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function LiveScores() {
  const { matches, loading, error, refetch } = useSerieASchedule();

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Aggiornamento completato",
      description: "I risultati sono stati aggiornati con successo.",
    });
  };

  // Convert Football-Data API to our component format
  const convertMatch = (match: ScheduleMatch) => {
    const statusTranslations: Record<string, string> = {
      'FINISHED': 'Finale',
      'TIMED': 'Programmata',
      'IN_PLAY': 'In Diretta',
      'PAUSED': 'Intervallo',
      'POSTPONED': 'Rimandata',
      'CANCELLED': 'Annullata',
      'SUSPENDED': 'Sospesa'
    };

    const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
    const isFinished = match.status === 'FINISHED';
    
    return {
      id: match.id.toString(),
      homeTeam: { 
        name: match.homeTeam.name, 
        logo: match.homeTeam.crest || '', 
        score: match.score.fullTime.home 
      },
      awayTeam: { 
        name: match.awayTeam.name, 
        logo: match.awayTeam.crest || '', 
        score: match.score.fullTime.away 
      },
      competition: "Serie A",
      status: (isLive ? 'live' : isFinished ? 'finished' : 'upcoming') as 'live' | 'finished' | 'upcoming',
      time: isLive ? 'In Diretta' : 
            isFinished ? 'Finale' : 
            new Date(match.utcDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      minute: undefined,
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
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
      <div className="space-y-4">
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
  
  // Separate live and other matches
  const liveMatches = convertedMatches.filter(match => match.status === 'live');
  const otherMatches = convertedMatches.filter(match => match.status !== 'live');

  if (convertedMatches.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="p-6 shadow-card">
          <div className="text-center py-8 text-muted-foreground">
            <p>Nessuna partita disponibile per oggi.</p>
            <p className="text-sm mt-1">Prova ad aggiornare o controlla domani.</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Aggiorna
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          Serie A - Partite
        </h2>
        <Button variant="ghost" size="sm" onClick={handleRefresh} className="p-2">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Live matches */}
      {liveMatches.length > 0 && (
        <Card className="p-4 shadow-card">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <Badge variant="destructive" className="text-xs px-2 py-1 animate-pulse">
              {liveMatches.length} IN DIRETTA
            </Badge>
            <span className="text-sm font-bold text-primary uppercase tracking-wide">
              In Diretta
            </span>
          </div>
          <div className="space-y-2">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </Card>
      )}
      
      {/* Other matches */}
      {otherMatches.length > 0 && (
        <Card className="p-4 shadow-card">
          {liveMatches.length > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Altre partite
              </span>
            </div>
          )}
          <div className="space-y-2">
            {otherMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
