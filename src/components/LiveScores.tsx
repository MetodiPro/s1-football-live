import { MatchCard } from "./MatchCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Mock data for demonstration
const mockMatches = [
  {
    id: "1",
    homeTeam: { name: "Inter Milan", logo: "", score: 2 },
    awayTeam: { name: "AC Milan", logo: "", score: 1 },
    competition: "Serie A",
    status: "live" as const,
    time: "15:30",
    minute: 67,
  },
  {
    id: "2",
    homeTeam: { name: "Barcelona", logo: "", score: 3 },
    awayTeam: { name: "Real Madrid", logo: "", score: 2 },
    competition: "La Liga",
    status: "finished" as const,
    time: "20:00",
  },
  {
    id: "3",
    homeTeam: { name: "Manchester United", logo: "" },
    awayTeam: { name: "Liverpool", logo: "" },
    competition: "Premier League",
    status: "upcoming" as const,
    time: "17:00",
  },
  {
    id: "4",
    homeTeam: { name: "Bayern Munich", logo: "", score: 1 },
    awayTeam: { name: "Borussia Dortmund", logo: "", score: 0 },
    competition: "Bundesliga",
    status: "live" as const,
    time: "18:30",
    minute: 34,
  },
];

export function LiveScores() {
  const liveMatches = mockMatches.filter(match => match.status === "live");
  const otherMatches = mockMatches.filter(match => match.status !== "live");

  return (
    <div className="space-y-6">
      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center">
              🔴 Live Now
              <span className="ml-2 text-sm text-muted-foreground">
                ({liveMatches.length})
              </span>
            </h2>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
          <div className="space-y-3">
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Other Matches */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Recent & Upcoming
        </h2>
        <div className="space-y-3">
          {otherMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
}
