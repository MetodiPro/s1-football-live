
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Trophy, Target, Calendar, MapPin, ArrowUpDown, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchLineups } from "@/components/match-details/MatchLineups";
import { MatchEvents } from "@/components/match-details/MatchEvents";
import { MatchStatistics } from "@/components/match-details/MatchStatistics";
import { MatchScorers } from "@/components/match-details/MatchScorers";

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matchDetails, lineups, events, statistics, loading, error } = useMatchDetails(id || '');

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
          <p className="text-muted-foreground mb-4">
            {error || 'Dettagli partita non disponibili'}
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Riprova
          </Button>
        </Card>
      </div>
    );
  }

  const match = matchDetails;
  const isLive = match.fixture.status.short === '1H' || match.fixture.status.short === '2H' || match.fixture.status.short === 'HT';
  const isFinished = match.fixture.status.short === 'FT';
  const hasScore = match.goals.home !== null && match.goals.away !== null;

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
              {match.league.name} - {match.league.round}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {isFinished ? 'Finale' : 
               isLive ? `${match.fixture.status.elapsed}'` : 
               new Date(match.fixture.date).toLocaleString('it-IT')}
            </div>
          </div>

          {/* Teams e Score */}
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Home Team */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-muted rounded-full">
                <img 
                  src={match.teams.home.logo} 
                  alt={match.teams.home.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-medium text-sm">{match.teams.home.name}</h3>
              {match.teams.home.winner && (
                <Badge variant="secondary" className="mt-1 text-xs">Vincitore</Badge>
              )}
            </div>

            {/* Score */}
            <div className="text-center">
              {hasScore ? (
                <div className="text-4xl font-bold text-primary">
                  {match.goals.home} - {match.goals.away}
                </div>
              ) : (
                <div className="text-2xl font-medium text-muted-foreground">
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
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-muted rounded-full">
                <img 
                  src={match.teams.away.logo} 
                  alt={match.teams.away.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-medium text-sm">{match.teams.away.name}</h3>
              {match.teams.away.winner && (
                <Badge variant="secondary" className="mt-1 text-xs">Vincitore</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Dettagli risultato */}
      {hasScore && (
        <Card className="shadow-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Risultato
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tempo pieno:</span>
              <span className="font-mono text-lg">
                {match.score.fulltime.home} - {match.score.fulltime.away}
              </span>
            </div>
            {match.score.halftime.home !== null && (
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

      {/* Marcatori */}
      <MatchScorers 
        events={events} 
        homeTeam={match.teams.home} 
        awayTeam={match.teams.away} 
      />

      {/* Eventi della partita */}
      <MatchEvents events={events} />

      {/* Statistiche */}
      <MatchStatistics statistics={statistics} />

      {/* Formazioni */}
      <MatchLineups lineups={lineups} />

      {/* Sostituzioni e Cartellini */}
      {events && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sostituzioni */}
          {events.filter(e => e.type.toLowerCase() === 'subst').length > 0 && (
            <Card className="shadow-card p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sostituzioni
              </h3>
              <div className="space-y-3">
                {events
                  .filter(e => e.type.toLowerCase() === 'subst')
                  .sort((a, b) => a.time.elapsed - b.time.elapsed)
                  .map((sub, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Badge variant="outline" className="text-xs">
                        {sub.time.elapsed}'
                      </Badge>
                      <div className="flex items-center gap-2">
                        <img 
                          src={sub.team.logo} 
                          alt={sub.team.name}
                          className="w-4 h-4"
                        />
                        <div className="text-sm">
                          <div className="font-medium text-green-600">⬆ {sub.player.name}</div>
                          {sub.assist && (
                            <div className="text-muted-foreground">⬇ {sub.assist.name}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </Card>
          )}

          {/* Cartellini */}
          {events.filter(e => e.type.toLowerCase() === 'card').length > 0 && (
            <Card className="shadow-card p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Disciplinari
              </h3>
              <div className="space-y-3">
                {events
                  .filter(e => e.type.toLowerCase() === 'card')
                  .sort((a, b) => a.time.elapsed - b.time.elapsed)
                  .map((card, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Badge variant="outline" className="text-xs">
                        {card.time.elapsed}'
                      </Badge>
                      <div className="flex items-center gap-2">
                        <img 
                          src={card.team.logo} 
                          alt={card.team.name}
                          className="w-4 h-4"
                        />
                        <div className="text-sm">
                          <div className="font-medium">{card.player.name}</div>
                          <Badge 
                            variant={card.detail.toLowerCase().includes('red') ? "destructive" : "default"}
                            className="text-xs mt-1"
                          >
                            {card.detail.toLowerCase().includes('red') ? '🟥 Rosso' : '🟨 Giallo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </Card>
          )}
        </div>
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
            <Badge variant="outline">
              {match.fixture.status.long}
            </Badge>
          </div>
          {match.fixture.venue.name && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Stadio:
              </span>
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
    </main>
  );
};

export default MatchDetails;
