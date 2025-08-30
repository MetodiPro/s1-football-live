import { LiveScores } from "@/components/LiveScores";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-hero text-white p-6 shadow-elevated">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">
            Welcome to <span className="text-primary">S1 Score</span>
          </h1>
          <p className="text-white/90 text-lg">
            I risultati in tempo reale dei principali campionati europei
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Badge className="bg-white/20 text-white border-white/30">
              ⚽ Live Scores
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              📊 Real Time
            </Badge>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center shadow-card">
          <div className="text-primary text-2xl font-bold">12</div>
          <div className="text-xs text-muted-foreground">Live Now</div>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <div className="text-primary text-2xl font-bold">8</div>
          <div className="text-xs text-muted-foreground">Competitions</div>
        </Card>
        <Card className="p-4 text-center shadow-card">
          <div className="text-primary text-2xl font-bold">156</div>
          <div className="text-xs text-muted-foreground">Today's Games</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/tables">
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4 w-full">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-xs">Tables</span>
          </Button>
        </Link>
        <Link to="/schedule">
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4 w-full">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-xs">Schedule</span>
          </Button>
        </Link>
        <Link to="/matches">
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4 w-full">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-xs">Matches</span>
          </Button>
        </Link>
      </div>

      {/* Live Scores */}
      <LiveScores />
    </main>
  );
};

export default Index;