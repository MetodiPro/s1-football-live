import { NapoliHeader } from "@/components/napoli/NapoliHeader";
import { NapoliMatches } from "@/components/napoli/NapoliMatches";
import { NapoliPlayers } from "@/components/napoli/NapoliPlayers";
import { useNapoliMatches, useNapoliPlayers, useNapoliStats } from "@/hooks/useNapoliData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Napoli = () => {
  const { matches, loading: matchesLoading } = useNapoliMatches();
  const { players, loading: playersLoading } = useNapoliPlayers();
  const { stats, loading: statsLoading } = useNapoliStats();

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <NapoliHeader stats={stats} loading={statsLoading} />

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">Partite</TabsTrigger>
          <TabsTrigger value="players">Giocatori</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-6">
          <NapoliMatches matches={matches} loading={matchesLoading} />
        </TabsContent>

        <TabsContent value="players" className="space-y-6">
          <NapoliPlayers players={players} loading={playersLoading} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Napoli;