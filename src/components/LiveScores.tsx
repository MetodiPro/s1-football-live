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

    const isLive = match.status === '1H' || match.status === '2H' || match.status === 'HT' || match.status === 'ET' || match.status === 'P';
    const isFinished = match.status === 'FT';
    
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

  console.log('🔍 Debug LiveScores:');
  console.log('- matches length:', matches.length);
  console.log('- loading:', loading);
  console.log('- error:', error);
  
  if (matches.length > 0) {
    console.log('- first match:', matches[0]);
    console.log('- all match statuses:', [...new Set(matches.map(m => m.status))]);
    console.log('- all matchdays:', [...new Set(matches.map(m => m.matchday))].sort((a, b) => a - b));
  }

  // Determine current matchday (ongoing round with mix of played/unplayed matches)
  const getCurrentMatchday = (): number => {
    if (matches.length === 0) return 1;
    
    const today = new Date();
    
    // First, check if there are live matches
    const liveMatches = matches.filter(match => 
      match.status === '1H' || match.status === '2H' || match.status === 'HT' || match.status === 'ET' || match.status === 'P'
    );
    
    if (liveMatches.length > 0) {
      return Math.max(...liveMatches.map(match => match.matchday));
    }
    
    // Find matchdays with both finished and upcoming matches (current round)
    const matchdayStats = matches.reduce((acc, match) => {
      const matchday = match.matchday;
      if (!acc[matchday]) {
        acc[matchday] = { finished: 0, upcoming: 0, total: 0 };
      }
      acc[matchday].total++;
      
      if (match.status === 'FT') {
        acc[matchday].finished++;
      } else if (match.status === 'NS' || match.status === 'TBD' || match.status === 'PST') {
        const matchDate = new Date(match.utcDate);
        if (matchDate >= today) {
          acc[matchday].upcoming++;
        }
      }
      
      return acc;
    }, {} as Record<number, {finished: number, upcoming: number, total: number}>);
    
    // Find the matchday that has both finished and upcoming matches (ongoing round)
    for (const matchday of Object.keys(matchdayStats).map(Number).sort((a, b) => a - b)) {
      const stats = matchdayStats[matchday];
      if (stats.finished > 0 && stats.upcoming > 0) {
        return matchday;
      }
    }
    
    // If no mixed matchday, find the most recent with upcoming matches
    for (const matchday of Object.keys(matchdayStats).map(Number).sort((a, b) => a - b)) {
      const stats = matchdayStats[matchday];
      if (stats.upcoming > 0) {
        return matchday;
      }
    }
    
    // If no upcoming matches, get the most recent completed matchday
    const finishedMatchdays = Object.keys(matchdayStats)
      .map(Number)
      .filter(matchday => matchdayStats[matchday].finished > 0)
      .sort((a, b) => b - a);
      
    return finishedMatchdays[0] || 1;
  };

  const currentMatchday = getCurrentMatchday();
  console.log('📅 Current matchday determined:', currentMatchday);
  
  // Get all matches for the current matchday
  const currentMatchdayMatches = matches.filter(match => match.matchday === currentMatchday);
  console.log('🏆 Current matchday matches:', currentMatchdayMatches.length);
  
  const convertedMatches = currentMatchdayMatches.map(convertMatch);
  console.log('✅ Converted matches:', convertedMatches.length);
  
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
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Serie A - Giornata {currentMatchday}
          </h2>
          <p className="text-sm text-muted-foreground">
            {liveMatches.length > 0 ? 'In corso' : 
             convertedMatches.some(m => m.status === 'upcoming') ? 'In corso' : 
             'Completata'}
          </p>
        </div>
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
