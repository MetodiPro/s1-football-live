import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { Event } from "@/hooks/useMatchDetails";

interface MatchScorersProps {
  events: Event[];
  homeTeam: { id: string; name: string; logo: string };
  awayTeam: { id: string; name: string; logo: string };
}

export const MatchScorers = ({ events, homeTeam, awayTeam }: MatchScorersProps) => {
  // Filter only goal events
  const goalEvents = events.filter(event => event.type.toLowerCase() === 'goal');
  
  if (goalEvents.length === 0) {
    return null;
  }

  // Separate goals by team
  const homeGoals = goalEvents.filter(event => event.team.id === homeTeam.id);
  const awayGoals = goalEvents.filter(event => event.team.id === awayTeam.id);

  const getGoalType = (detail: string) => {
    if (detail.toLowerCase().includes('penalty')) return ' (R)';
    if (detail.toLowerCase().includes('own')) return ' (A)';
    return '';
  };

  const renderGoals = (goals: Event[], teamName: string, teamLogo: string) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <img 
          src={teamLogo} 
          alt={teamName}
          className="w-5 h-5"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="font-medium text-sm">{teamName}</span>
        <Badge variant="secondary" className="text-xs">
          {goals.length} {goals.length === 1 ? 'gol' : 'gol'}
        </Badge>
      </div>
      {goals
        .sort((a, b) => a.time.elapsed - b.time.elapsed)
        .map((goal, index) => (
          <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="font-medium text-sm">
                {goal.player.name}{getGoalType(goal.detail)}
              </span>
              {goal.assist && (
                <span className="text-xs text-muted-foreground">
                  (Assist: {goal.assist.name})
                </span>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {goal.time.elapsed}'
              {goal.time.extra && `+${goal.time.extra}`}
            </Badge>
          </div>
        ))}
    </div>
  );

  return (
    <Card className="shadow-card p-6">
      <h3 className="font-semibold mb-4 flex items-center">
        <Target className="w-4 h-4 mr-2 text-green-600" />
        Marcatori
      </h3>
      <div className="space-y-6">
        {homeGoals.length > 0 && renderGoals(homeGoals, homeTeam.name, homeTeam.logo)}
        {awayGoals.length > 0 && renderGoals(awayGoals, awayTeam.name, awayTeam.logo)}
      </div>
    </Card>
  );
};