import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Trophy, Target, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import { Skeleton } from "@/components/ui/skeleton";

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matchDetails, loading, error } = useMatchDetails(id || '');

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
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';

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
              Serie A
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {isFinished ? 'Finale' : 
               isLive ? 'In Diretta' : 
               new Date(match.utcDate).toLocaleString('it-IT')}
            </div>
          </div>

          {/* Teams e Score */}
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Home Team */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-muted rounded-full">
                <img 
                  src={match.homeTeam.crest} 
                  alt={match.homeTeam.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-medium text-sm">{match.homeTeam.name}</h3>
            </div>

            {/* Score */}
            <div className="text-center">
              {(isFinished || isLive) && match.score.fullTime.home !== null ? (
                <div className="text-4xl font-bold text-primary">
                  {match.score.fullTime.home} - {match.score.fullTime.away}
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
                  src={match.awayTeam.crest} 
                  alt={match.awayTeam.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="font-medium text-sm">{match.awayTeam.name}</h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Dettagli risultato */}
      {match.score && (
        <Card className="shadow-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Risultato
          </h3>
          <div className="space-y-3">
            {match.score.fullTime.home !== null && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tempo pieno:</span>
                <span className="font-mono text-lg">
                  {match.score.fullTime.home} - {match.score.fullTime.away}
                </span>
              </div>
            )}
            {match.score.halfTime?.home !== null && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Primo tempo:</span>
                <span className="font-mono">
                  {match.score.halfTime.home} - {match.score.halfTime.away}
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
            <span>{new Date(match.utcDate).toLocaleString('it-IT')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="outline">
              {match.status === 'FINISHED' ? 'Finale' : 
               match.status === 'TIMED' ? 'Programmata' :
               match.status === 'IN_PLAY' ? 'In Diretta' : match.status}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giornata:</span>
            <span>{match.matchday}ª</span>
          </div>
          {match.referees && match.referees.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Arbitro:</span>
              <span>{match.referees[0].name}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Nota sui dettagli aggiuntivi */}
      <Card className="shadow-card p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Dettagli aggiuntivi
        </h3>
        <p className="text-muted-foreground text-sm">
          L'app utilizza Football-Data API che fornisce risultati in tempo reale della stagione 2025-2026. 
          Eventi dettagliati, formazioni e statistiche complete saranno disponibili con l'upgrade dell'API.
        </p>
      </Card>
    </main>
  );
};

export default MatchDetails;