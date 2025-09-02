import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NapoliStats } from "@/hooks/useNapoliData";

interface NapoliHeaderProps {
  stats: NapoliStats | null;
  loading: boolean;
}

export const NapoliHeader = ({ stats, loading }: NapoliHeaderProps) => {
  if (loading) {
    return (
      <Card className="p-6 shadow-card">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full"></div>
            <div className="space-y-2">
              <div className="w-32 h-6 bg-muted rounded"></div>
              <div className="w-24 h-4 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const getPositionColor = (position: number) => {
    if (position <= 4) return "bg-green-500";
    if (position <= 6) return "bg-blue-500";
    if (position <= 17) return "bg-gray-500";
    return "bg-red-500";
  };

  return (
    <Card className="p-6 shadow-card bg-gradient-to-r from-blue-600/10 to-blue-800/10 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SSC Napoli</h1>
            <p className="text-muted-foreground">Società Sportiva Calcio Napoli</p>
          </div>
        </div>
        
        {stats && (
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`w-8 h-8 ${getPositionColor(stats.position)} rounded-full flex items-center justify-center text-white font-bold text-sm mb-1`}>
                {stats.position}°
              </div>
              <span className="text-xs text-muted-foreground">Posizione</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.points}</div>
              <span className="text-xs text-muted-foreground">Punti</span>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.played}</div>
              <span className="text-xs text-muted-foreground">Partite</span>
            </div>
            {stats.form && (
              <div className="flex space-x-1">
                {stats.form.split('').slice(-5).map((result, index) => (
                  <Badge 
                    key={index}
                    variant={result === 'W' ? 'default' : result === 'D' ? 'secondary' : 'destructive'}
                    className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                  >
                    {result}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};