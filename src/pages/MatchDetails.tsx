import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, Trophy, Target, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import { Skeleton } from "@/components/ui/skeleton";

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matchDetails, events, lineups, loading, error } = useMatchDetails(id || '');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !matchDetails) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            {error || 'Dettagli partita non disponibili'}
          </p>
        </Card>
      </div>
    );
  }

  const match = matchDetails;
  const isLive = match.fixture.status.short === 'LIVE' || match.fixture.status.short === '1H' || match.fixture.status.short === '2H';
  const isFinished = match.fixture.status.short === 'FT';

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Header con pulsante indietro */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Indietro
      </Button>

      {/* Intestazione partita */}
      <Card className="shadow-elevated p-6">
        <div className="space-y-4">
          {/* Competizione e status */}
          <div className="flex items-center justify-between">
            <Badge 
              variant={isLive ? "destructive" : "secondary"}
              className={isLive ? "bg-gradient-primary animate-pulse" : ""}
            >
              <Trophy className="w-3 h-3 mr-1" />
              {match.league.name}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {isFinished ? 'Finale' : 
               isLive ? `${match.fixture.status.elapsed || 0}'` : 
               new Date(match.fixture.date).toLocaleString('it-IT')}
            </div>
          </div>

          {/* Teams e Score */}
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Home Team */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                {match.teams.home.logo ? (
                  <img 
                    src={match.teams.home.logo} 
                    alt={match.teams.home.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {match.teams.home.name.substring(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm">{match.teams.home.name}</h3>
            </div>

            {/* Score */}
            <div className="text-center">
              {(isFinished || isLive) && match.goals.home !== null ? (
                <div className="text-4xl font-bold text-primary">
                  {match.goals.home} - {match.goals.away}
                </div>
              ) : (
                <div className="text-2xl font-bold text-muted-foreground">
                  VS
                </div>
              )}
              {isLive && (
                <Badge variant="destructive" className="mt-2 animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>

            {/* Away Team */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                {match.teams.away.logo ? (
                  <img 
                    src={match.teams.away.logo} 
                    alt={match.teams.away.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {match.teams.away.name.substring(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm">{match.teams.away.name}</h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Dettagli aggiuntivi */}
      {match.score && (
        <Card className="shadow-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Risultato
          </h3>
          <div className="space-y-3">
            {match.score.fulltime.home !== null && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tempo pieno:</span>
                <span className="font-mono text-lg">
                  {match.score.fulltime.home} - {match.score.fulltime.away}
                </span>
              </div>
            )}
            {match.score.halftime?.home !== null && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Primo tempo:</span>
                <span className="font-mono">
                  {match.score.halftime.home} - {match.score.halftime.away}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Informazioni partita */}
      <Card className="shadow-card p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Informazioni partita
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data e ora:</span>
            <span>{new Date(match.fixture.date).toLocaleString('it-IT')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="outline">{match.fixture.status.long}</Badge>
          </div>
          {match.fixture.venue && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stadio:</span>
              <span>{match.fixture.venue.name}</span>
            </div>
          )}
          {match.fixture.referee && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Arbitro:</span>
              <span>{match.fixture.referee}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Eventi partita (gol, cartellini, sostituzioni) */}
      {events && events.length > 0 && (
        <Card className="shadow-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Eventi partita
          </h3>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    {event.time.elapsed}'
                  </Badge>
                  <div>
                    <div className="font-medium text-sm">
                      {event.type === 'Goal' ? '⚽' : 
                       event.type === 'Card' ? (event.detail.includes('Yellow') ? '🟨' : '🟥') :
                       event.type === 'subst' ? '🔄' : '📝'} {event.detail}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.player.name}
                      {event.assist && ` (Assist: ${event.assist.name})`}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {event.team.name}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Formazioni */}
      {lineups && lineups.length > 0 && (
        <Card className="shadow-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Formazioni
          </h3>
          <div className="grid gap-6">
            {lineups.map((lineup, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={lineup.team.logo} 
                      alt={lineup.team.name}
                      className="w-6 h-6"
                    />
                    <span className="font-medium">{lineup.team.name}</span>
                  </div>
                  <Badge variant="outline">{lineup.formation}</Badge>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Titolari</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {lineup.startXI.map((player, playerIndex) => (
                      <div key={playerIndex} className="flex items-center space-x-2">
                        <Badge variant="outline" className="w-6 h-6 text-xs p-0 flex items-center justify-center">
                          {player.player.number}
                        </Badge>
                        <span>{player.player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Panchina</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {lineup.substitutes.map((player, playerIndex) => (
                      <div key={playerIndex} className="flex items-center space-x-2">
                        <Badge variant="outline" className="w-6 h-6 text-xs p-0 flex items-center justify-center">
                          {player.player.number}
                        </Badge>
                        <span>{player.player.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Placeholder se non ci sono dati aggiuntivi */}
      {(!events || events.length === 0) && (!lineups || lineups.length === 0) && (
        <Card className="shadow-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Dettagli aggiuntivi
          </h3>
          <p className="text-muted-foreground text-sm">
            Eventi e formazioni saranno disponibili per le partite in corso o finite.
          </p>
        </Card>
      )}
    </main>
  );
};

export default MatchDetails;