import { LiveScores } from "@/components/LiveScores";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-hero text-white p-6 shadow-elevated">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">
            Benvenuto su <span className="text-primary">S1 Score</span>
          </h1>
          <p className="text-white/90 text-lg">
            I risultati in tempo reale della Serie A italiana
          </p>
          <div className="flex justify-center gap-2 pt-2">
            <Badge className="bg-white/20 text-white border-white/30">
              ⚽ Risultati Live
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              📊 Tempo Reale
            </Badge>
          </div>
        </div>
      </Card>

      {/* Live Scores */}
      <LiveScores />
    </main>
  );
};

export default Index;