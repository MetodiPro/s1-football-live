
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { Statistics } from "@/hooks/useMatchDetails";

interface MatchStatisticsProps {
  statistics: Statistics[];
}

const translateStatistic = (type: string) => {
  const translations: { [key: string]: string } = {
    'Shots on Goal': 'Tiri in porta',
    'Shots off Goal': 'Tiri fuori porta',
    'Total Shots': 'Tiri totali',
    'Blocked Shots': 'Tiri bloccati',
    'Shots insidebox': 'Tiri in area',
    'Shots outsidebox': 'Tiri fuori area',
    'Fouls': 'Falli',
    'Corner Kicks': 'Calci d\'angolo',
    'Offsides': 'Fuorigioco',
    'Ball Possession': 'Possesso palla',
    'Yellow Cards': 'Cartellini gialli',
    'Red Cards': 'Cartellini rossi',
    'Goalkeeper Saves': 'Parate',
    'Total passes': 'Passaggi totali',
    'Passes accurate': 'Passaggi riusciti',
    'Passes %': 'Precisione passaggi'
  };
  return translations[type] || type;
};

const getStatisticValue = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Handle percentage values
    if (value.includes('%')) {
      return parseInt(value.replace('%', ''));
    }
    return parseInt(value) || 0;
  }
  return 0;
};

export const MatchStatistics = ({ statistics }: MatchStatisticsProps) => {
  if (!statistics || statistics.length !== 2) {
    return null;
  }

  const homeStats = statistics[0];
  const awayStats = statistics[1];

  // Get all unique statistic types
  const allStatTypes = homeStats.statistics.map(stat => stat.type);

  return (
    <Card className="shadow-card p-6">
      <h3 className="font-semibold mb-4 flex items-center">
        <BarChart3 className="w-4 h-4 mr-2" />
        Statistiche
      </h3>
      
      <div className="space-y-4">
        {allStatTypes.map((statType) => {
          const homeStat = homeStats.statistics.find(s => s.type === statType);
          const awayStat = awayStats.statistics.find(s => s.type === statType);
          
          if (!homeStat || !awayStat) return null;

          const homeValue = getStatisticValue(homeStat.value);
          const awayValue = getStatisticValue(awayStat.value);
          const total = homeValue + awayValue;
          
          const homePercentage = total > 0 ? (homeValue / total) * 100 : 0;
          const awayPercentage = total > 0 ? (awayValue / total) * 100 : 0;

          return (
            <div key={statType} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img 
                    src={homeStats.team.logo} 
                    alt={homeStats.team.name}
                    className="w-4 h-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="font-medium text-sm">{homeStat.value}</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {translateStatistic(statType)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{awayStat.value}</span>
                  <img 
                    src={awayStats.team.logo} 
                    alt={awayStats.team.name}
                    className="w-4 h-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              
              {total > 0 && (
                <div className="flex items-center gap-2">
                  <Progress value={homePercentage} className="flex-1 h-2" />
                  <Progress value={awayPercentage} className="flex-1 h-2 [&>div]:bg-red-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
