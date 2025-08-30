import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Circle } from "lucide-react";

interface Team {
  name: string;
  logo: string;
  score?: number;
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: string;
  status: "live" | "upcoming" | "finished";
  time: string;
  minute?: number;
}

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth bg-card">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <Badge 
            variant={isLive ? "destructive" : "secondary"} 
            className={`text-xs px-2 py-1 ${isLive ? "bg-gradient-primary animate-pulse" : ""}`}
          >
            {isLive && <Circle className="w-2 h-2 mr-1 fill-current" />}
            {match.competition}
          </Badge>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-3 h-3 mr-1" />
            {match.status === "finished" ? "FT" : 
             match.status === "upcoming" ? "PROSS." :
             isLive ? `${match.minute}'` : match.time}
          </div>
        </div>

        <div className="space-y-3">
          {/* Home vs Away */}
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">
                  {match.homeTeam.name.substring(0, 3).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-card-foreground truncate text-sm">
                {match.homeTeam.name}
              </span>
            </div>

            {/* Score */}
            <div className="px-3">
              {isFinished || isLive ? (
                <div className={`text-xl font-bold ${isLive ? 'text-primary' : 'text-card-foreground'}`}>
                  {match.homeTeam.score} - {match.awayTeam.score}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground font-medium">
                  VS
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center space-x-2 flex-1 min-w-0 justify-end">
              <span className="font-medium text-card-foreground truncate text-sm text-right">
                {match.awayTeam.name}
              </span>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">
                  {match.awayTeam.name.substring(0, 3).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {isLive && (
            <div className="flex justify-center">
              <Badge variant="destructive" className="text-xs px-3 py-1 animate-pulse bg-gradient-primary">
                <Circle className="w-2 h-2 mr-1 fill-current" />
                IN DIRETTA
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}