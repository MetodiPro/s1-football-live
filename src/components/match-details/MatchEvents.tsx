
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, AlertTriangle, ArrowUpDown, Calendar } from "lucide-react";
import { Event } from "@/hooks/useMatchDetails";

interface MatchEventsProps {
  events: Event[];
}

const getEventIcon = (type: string, detail: string) => {
  switch (type.toLowerCase()) {
    case 'goal':
      return <Target className="w-4 h-4" />;
    case 'card':
      return <AlertTriangle className="w-4 h-4" />;
    case 'subst':
      return <ArrowUpDown className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

const getEventColor = (type: string, detail: string) => {
  switch (type.toLowerCase()) {
    case 'goal':
      return 'bg-green-500';
    case 'card':
      return detail.toLowerCase().includes('red') ? 'bg-red-500' : 'bg-yellow-500';
    case 'subst':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const translateEventType = (type: string, detail: string) => {
  switch (type.toLowerCase()) {
    case 'goal':
      if (detail.toLowerCase().includes('penalty')) return 'Rigore';
      if (detail.toLowerCase().includes('own')) return 'Autogol';
      return 'Gol';
    case 'card':
      if (detail.toLowerCase().includes('red')) return 'Cartellino Rosso';
      return 'Cartellino Giallo';
    case 'subst':
      return 'Sostituzione';
    default:
      return type;
  }
};

export const MatchEvents = ({ events }: MatchEventsProps) => {
  if (!events || events.length === 0) {
    return null;
  }

  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => a.time.elapsed - b.time.elapsed);

  return (
    <Card className="shadow-card p-6">
      <h3 className="font-semibold mb-4 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Eventi della partita
      </h3>
      <div className="space-y-3">
        {sortedEvents.map((event, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getEventColor(event.type, event.detail)}`}>
                {getEventIcon(event.type, event.detail)}
              </div>
              <Badge variant="outline" className="text-xs">
                {event.time.elapsed}'
                {event.time.extra && `+${event.time.extra}`}
              </Badge>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <img 
                  src={event.team.logo} 
                  alt={event.team.name}
                  className="w-4 h-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="font-medium text-sm">{event.player.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {translateEventType(event.type, event.detail)}
                </span>
                {event.assist && (
                  <span className="text-xs text-muted-foreground">
                    (Assist: {event.assist.name})
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
