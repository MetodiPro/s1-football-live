
import { LiveScores } from "@/components/LiveScores";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  console.log('Index component is rendering');
  
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Hero Image */}
      <div className="w-full">
        <img 
          src="/lovable-uploads/1b63cf75-3b04-4ff3-a981-f0f42c5044b8.png" 
          alt="S1 Score - Risultati in tempo reale della Serie A italiana"
          className="w-full max-h-48 object-cover rounded-lg shadow-elevated"
        />
      </div>

      {/* Live Scores */}
      <LiveScores />
    </main>
  );
};

export default Index;
