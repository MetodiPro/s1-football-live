import { LiveScores } from "@/components/LiveScores";

const Matches = () => {
  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Partite</h1>
      <LiveScores />
    </main>
  );
};

export default Matches;