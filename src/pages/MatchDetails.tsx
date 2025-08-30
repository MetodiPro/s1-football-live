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
  const isLive = match.status === 'IN_PLAY';
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
              {match.competition.name}
            </Badge>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {isFinished ? 'Finale' : 
               isLive ? 'In corso' : 
               new Date(match.utcDate).toLocaleString('it-IT')}
            </div>
          </div>

          {/* Teams e Score */}
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Home Team */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                {match.homeTeam.crest ? (
                  <img 
                    src={match.homeTeam.crest} 
                    alt={match.homeTeam.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {match.homeTeam.name.substring(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm">{match.homeTeam.name}</h3>
            </div>

            {/* Score */}
            <div className="text-center">
              {(isFinished || isLive) && match.score.fullTime.home !== null ? (
                <div className="text-4xl font-bold text-primary">
                  {match.score.fullTime.home} - {match.score.fullTime.away}
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
                {match.awayTeam.crest ? (
                  <img 
                    src={match.awayTeam.crest} 
                    alt={match.awayTeam.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {match.awayTeam.name.substring(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm">{match.awayTeam.name}</h3>
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
            <Badge variant="outline">{match.status}</Badge>
          </div>
          {match.venue && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stadio:</span>
              <span>{match.venue}</span>
            </div>
          )}
          {match.referee && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Arbitro:</span>
              <span>{match.referee}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Marcatori (se disponibili) */}
      {match.goals && match.goals.length > 0 && (
        <Card className="shadow-card p-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Marcatori
          </h3>
          <div className="space-y-2">
            {match.goals.map((goal, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div>
                  <span className="font-medium">{goal.scorer?.name || 'Sconosciuto'}</span>
                  <span className="text-muted-foreground ml-2">
                    ({goal.team === 'HOME_TEAM' ? match.homeTeam.name : match.awayTeam.name})
                  </span>
                </div>
                <Badge variant="outline">{goal.minute}'</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Placeholder per altre informazioni */}
      <Card className="shadow-card p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Altre informazioni
        </h3>
        <p className="text-muted-foreground text-sm">
          Formazioni, sostituzioni e altre statistiche saranno disponibili in futuro.
        </p>
      </Card>
    </main>
  );
};

export default MatchDetails;