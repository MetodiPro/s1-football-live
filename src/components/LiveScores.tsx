import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { useFootballData } from "@/hooks/useFootballData";
import { toast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          Partite per Campionato
        </h2>
        <Button variant="ghost" size="sm" onClick={handleRefresh} className="p-2">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {competitionEntries.map(([competition, competitionMatches]) => {
        const isOpen = openCompetitions[competition] ?? false;
        const hasLiveMatches = competitionMatches.live.length > 0;
        
        return (
          <Card key={competition} className="overflow-hidden shadow-card">
            <Collapsible open={isOpen} onOpenChange={() => toggleCompetition(competition)}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <h3 className="font-bold text-foreground text-left">{competition}</h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hasLiveMatches && (
                      <Badge variant="destructive" className="text-xs px-2 py-1 animate-pulse">
                        {competitionMatches.live.length} LIVE
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground font-medium">
                      {competitionMatches.total} partite
                    </span>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-muted/20">
                  {/* Live matches first */}
                  {competitionMatches.live.length > 0 && (
                    <div className="p-3 space-y-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-bold text-primary uppercase tracking-wide">In Diretta</span>
                      </div>
                      {competitionMatches.live.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  )}
                  
                  {/* Other matches */}
                  {competitionMatches.other.length > 0 && (
                    <div className="p-3 space-y-2">
                      {competitionMatches.live.length > 0 && (
                        <div className="flex items-center space-x-2 mb-2 pt-3 border-t border-border/30">
                          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                            Altre partite
                          </span>
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
