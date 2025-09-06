import { ChampionsFixtures } from "@/components/champions/ChampionsFixtures";
import { ChampionsStandings } from "@/components/champions/ChampionsStandings";
import { useChampionsLeague } from "@/hooks/useChampionsLeague";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Matches = () => {
  const { fixtures, standings, loading: leagueLoading, error: leagueError } = useChampionsLeague();

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">UEFA Champions League</h1>
        <p className="text-muted-foreground">Risultati, calendario e classifiche della massima competizione europea</p>
      </div>

      <Tabs defaultValue="fixtures" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fixtures">Partite</TabsTrigger>
          <TabsTrigger value="standings">Classifiche</TabsTrigger>
        </TabsList>

        <TabsContent value="fixtures" className="space-y-6">
          <ChampionsFixtures fixtures={fixtures} loading={leagueLoading} />
        </TabsContent>

        <TabsContent value="standings" className="space-y-6">
          <ChampionsStandings standings={standings} loading={leagueLoading} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Matches;