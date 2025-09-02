import { ChampionsFixtures } from "@/components/champions/ChampionsFixtures";
import { ChampionsStandings } from "@/components/champions/ChampionsStandings";
import { ChampionsPlayerStats } from "@/components/champions/ChampionsPlayerStats";
import { useChampionsLeague } from "@/hooks/useChampionsLeague";
import { useChampionsTopScorers, useChampionsTopAssists } from "@/hooks/useChampionsPlayers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Matches = () => {
  const { fixtures, standings, loading: leagueLoading, error: leagueError } = useChampionsLeague();
  const { scorers, loading: scorersLoading, error: scorersError } = useChampionsTopScorers();
  const { assists, loading: assistsLoading, error: assistsError } = useChampionsTopAssists();

  return (
    <main className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">UEFA Champions League</h1>
        <p className="text-muted-foreground">Risultati, calendario e classifiche della massima competizione europea</p>
      </div>

      <Tabs defaultValue="fixtures" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fixtures">Partite</TabsTrigger>
          <TabsTrigger value="standings">Classifiche</TabsTrigger>
          <TabsTrigger value="players">Giocatori</TabsTrigger>
        </TabsList>

        <TabsContent value="fixtures" className="space-y-6">
          <ChampionsFixtures fixtures={fixtures} loading={leagueLoading} />
        </TabsContent>

        <TabsContent value="standings" className="space-y-6">
          <ChampionsStandings standings={standings} loading={leagueLoading} />
        </TabsContent>

        <TabsContent value="players" className="space-y-6">
          <ChampionsPlayerStats 
            scorers={scorers} 
            assists={assists} 
            loading={scorersLoading || assistsLoading} 
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Matches;