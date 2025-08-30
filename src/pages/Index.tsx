import { LiveScores } from "@/components/LiveScores";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero Image */}
      <div className="w-full">
        <img 
          src="/lovable-uploads/015971d5-b0b0-4639-adb6-924871746319.png" 
          alt="S1 Score - Risultati in tempo reale della Serie A italiana"
          className="w-full h-auto rounded-lg shadow-elevated"
        />
      </div>

      {/* Live Scores */}
      <LiveScores />
    </main>
  );
};

export default Index;