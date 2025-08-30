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
    <Card className="p-4 shadow-card hover:shadow-elevated transition-smooth bg-card">
      <div className="flex items-center justify-between mb-3">
        <Badge 
          variant={isLive ? "destructive" : "secondary"} 
          className={isLive ? "bg-gradient-primary animate-pulse" : ""}
        >
          {isLive && <Circle className="w-2 h-2 mr-1 fill-current" />}
          {match.competition}
        </Badge>
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {isLive ? `${match.minute}'` : match.time}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Home Team */}
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">
              {match.homeTeam.name.substring(0, 3).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-card-foreground truncate">
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score */}
        <div className="px-4">
          {isFinished || isLive ? (
            <div className="text-center">
              <div className={`text-2xl font-bold ${isLive ? 'text-primary' : 'text-card-foreground'}`}>
                {match.homeTeam.score} - {match.awayTeam.score}
              </div>
            </div>
          ) : (
            <Button variant="ghost" size="xs" className="text-muted-foreground">
              VS
            </Button>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <span className="font-medium text-card-foreground truncate">
            {match.awayTeam.name}
          </span>
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">
              {match.awayTeam.name.substring(0, 3).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {isLive && (
        <div className="mt-3 flex justify-center">
          <Button variant="live" size="xs">
            LIVE
          </Button>
        </div>
      )}
    </Card>
  );
}