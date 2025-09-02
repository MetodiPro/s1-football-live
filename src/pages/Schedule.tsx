import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { useSerieASchedule } from "@/hooks/useSerieASchedule";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Schedule = () => {
  const { matches, loading, error, refetch } = useSerieASchedule();

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Calendario aggiornato",
      description: "Il calendario è stato aggiornato con successo.",
    });
  };

  // Group matches by matchday
  const matchesByMatchday = matches.reduce((acc, match) => {
    const matchday = match.matchday;
    if (!acc[matchday]) {
      acc[matchday] = [];
    }
    acc[matchday].push(match);
    return acc;
  }, {} as Record<number, typeof matches>);

  const sortedMatchdays = Object.keys(matchesByMatchday)
    .map(Number)
    .sort((a, b) => a - b); // First matchday first

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Calendario Serie A</h1>
        </div>
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Caricamento calendario...</span>
          </div>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Calendario Serie A</h1>
        </div>
        <Card className="p-6 shadow-card">
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">Errore nel caricamento del calendario</p>
              <p className="text-sm text-muted-foreground/80 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Riprova
              </Button>
            </div>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Calendario Serie A</h1>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {sortedMatchdays.map((matchday) => (
          <Card key={matchday} className="shadow-card">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Giornata {matchday}
                </h2>
                <Badge variant="outline" className="ml-auto">
                  {matchesByMatchday[matchday].length} partite
                </Badge>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {matchesByMatchday[matchday].map((match) => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-center min-w-[60px]">
                      <div className="text-xs text-muted-foreground">
                        {new Date(match.utcDate).toLocaleDateString('it-IT', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(match.utcDate).toLocaleTimeString('it-IT', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="font-medium text-sm">{match.homeTeam.name}</span>
                    </div>
                  </div>
                  
                  <div className="px-4">
                    {match.status === 'FINISHED' ? (
                      <div className="text-lg font-bold text-center">
                        {match.score.fullTime.home} - {match.score.fullTime.away}
                      </div>
                    ) : match.status === 'IN_PLAY' ? (
                      <Badge variant="destructive" className="animate-pulse">
                        LIVE
                      </Badge>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        VS
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 flex-1 justify-end">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-right">{match.awayTeam.name}</span>
                    </div>
                    <Badge 
                      variant={match.status === 'FINISHED' ? 'secondary' : 
                               match.status === 'IN_PLAY' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {match.status === 'FINISHED' ? 'FT' : 
                       match.status === 'IN_PLAY' ? 'LIVE' : 'PROSS.'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Schedule;