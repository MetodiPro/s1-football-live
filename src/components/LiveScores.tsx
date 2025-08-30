import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { useFootballData } from "@/hooks/useFootballData";
import { toast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface GroupedMatches {
  [competition: string]: {
    live: any[];
    other: any[];
    total: number;
  };
}

export function LiveScores() {
  const { matches, loading, error, refetch } = useFootballData();
  const [openCompetitions, setOpenCompetitions] = useState<Record<string, boolean>>({});

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Aggiornamento completato",
      description: "I risultati sono stati aggiornati con successo.",
    });
  };

  const toggleCompetition = (competition: string) => {
    setOpenCompetitions(prev => ({
      ...prev,
      [competition]: !prev[competition]
    }));
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
  
  // Group matches by competition
  const groupedMatches: GroupedMatches = convertedMatches.reduce((acc, match) => {
    const competition = match.competition;
    
    if (!acc[competition]) {
      acc[competition] = { live: [], other: [], total: 0 };
    }
    
    if (match.status === 'live') {
      acc[competition].live.push(match);
    } else {
      acc[competition].other.push(match);
    }
    
    acc[competition].total = acc[competition].live.length + acc[competition].other.length;
    
    return acc;
  }, {} as GroupedMatches);

  const competitionEntries = Object.entries(groupedMatches).sort(([, a], [, b]) => {
    // Sort by live matches first, then by total matches
    if (a.live.length !== b.live.length) {
      return b.live.length - a.live.length;
    }
    return b.total - a.total;
  });

  if (competitionEntries.length === 0) {
    return (
      <div className="space-y-6">
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">
          Partite per Campionato
        </h2>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Aggiorna
        </Button>
      </div>

      {competitionEntries.map(([competition, competitionMatches]) => {
        const isOpen = openCompetitions[competition] || false;
        const hasLiveMatches = competitionMatches.live.length > 0;
        
        return (
          <Card key={competition} className="shadow-card">
            <Collapsible open={isOpen} onOpenChange={() => toggleCompetition(competition)}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <h3 className="font-semibold text-foreground">{competition}</h3>
                    </div>
                    {hasLiveMatches && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm text-primary font-medium">
                          {competitionMatches.live.length} in diretta
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{competitionMatches.total} partite</span>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-3">
                  {/* Live matches first */}
                  {competitionMatches.live.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-primary">In Diretta</span>
                      </div>
                      {competitionMatches.live.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  )}
                  
                  {/* Other matches */}
                  {competitionMatches.other.length > 0 && (
                    <div className="space-y-2">
                      {competitionMatches.live.length > 0 && (
                        <div className="flex items-center space-x-2 mb-2 mt-4">
                          <span className="text-sm font-medium text-muted-foreground">Altre partite</span>
                        </div>
                      )}
                      {competitionMatches.other.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}
