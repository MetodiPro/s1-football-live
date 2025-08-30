import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useMemo } from "react";
import { useFootballData } from "@/hooks/useFootballData";
import { format, isToday, differenceInMinutes } from "date-fns";
import { it } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export function NotificationsPanel() {
  const { matches, loading } = useFootballData();
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    if (!matches) return [];

    const notifs: Notification[] = [];

    matches.forEach((match) => {
      const matchDate = new Date(match.utcDate);
      const now = new Date();
      const minutesDiff = differenceInMinutes(now, matchDate);

      // Partite live
      if (match.status === 'IN_PLAY') {
        notifs.push({
          id: `live-${match.id}`,
          title: "🔴 Partita in corso",
          message: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          time: "Live",
          isRead: readNotifications.has(`live-${match.id}`)
        });
      }

      // Partite iniziate di recente (ultimi 120 minuti)
      if (match.status === 'IN_PLAY' && minutesDiff <= 120) {
        notifs.push({
          id: `started-${match.id}`,
          title: "⚽ Partita iniziata",
          message: `${match.homeTeam.name} - ${match.awayTeam.name} è iniziata`,
          time: `${minutesDiff} min fa`,
          isRead: readNotifications.has(`started-${match.id}`)
        });
      }

      // Partite finite di recente (ultimi 180 minuti)
      if (match.status === 'FINISHED' && minutesDiff <= 180) {
        const homeScore = match.score.fullTime.home || 0;
        const awayScore = match.score.fullTime.away || 0;
        
        notifs.push({
          id: `finished-${match.id}`,
          title: "🏁 Risultato finale",
          message: `${match.homeTeam.name} ${homeScore}-${awayScore} ${match.awayTeam.name}`,
          time: `${Math.floor(minutesDiff / 60)}h fa`,
          isRead: readNotifications.has(`finished-${match.id}`)
        });
      }

      // Partite con gol (se il punteggio è cambiato)
      if (match.status === 'IN_PLAY' && (match.score.fullTime.home > 0 || match.score.fullTime.away > 0)) {
        const homeScore = match.score.fullTime.home || 0;
        const awayScore = match.score.fullTime.away || 0;
        
        if (homeScore > 0) {
          notifs.push({
            id: `goal-home-${match.id}-${homeScore}`,
            title: "⚽ GOL!",
            message: `${match.homeTeam.name} segna! ${homeScore}-${awayScore}`,
            time: "Poco fa",
            isRead: readNotifications.has(`goal-home-${match.id}-${homeScore}`)
          });
        }
        
        if (awayScore > 0) {
          notifs.push({
            id: `goal-away-${match.id}-${awayScore}`,
            title: "⚽ GOL!",
            message: `${match.awayTeam.name} segna! ${homeScore}-${awayScore}`,
            time: "Poco fa",
            isRead: readNotifications.has(`goal-away-${match.id}-${awayScore}`)
          });
        }
      }
    });

    // Ordina per importanza: live prima, poi per tempo
    return notifs.sort((a, b) => {
      if (a.time === "Live" && b.time !== "Live") return -1;
      if (b.time === "Live" && a.time !== "Live") return 1;
      if (!a.isRead && b.isRead) return -1;
      if (!b.isRead && a.isRead) return 1;
      return 0;
    }).slice(0, 10); // Limita a 10 notifiche più recenti

  }, [matches, readNotifications]);

  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    if (notifications.length > 0) {
      setAllNotifications(notifications);
    }
  }, [notifications]);

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setReadNotifications(prev => new Set([...prev, id]));
  };

  const clearAll = () => {
    const allIds = allNotifications.map(n => n.id);
    setReadNotifications(prev => new Set([...prev, ...allIds]));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifiche</SheetTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Segna tutto letto
            </Button>
          )}
        </SheetHeader>
        <ScrollArea className="h-full mt-4">
          <div className="space-y-3">
            {loading ? (
              <p className="text-muted-foreground text-center py-8">
                Caricamento notifiche...
              </p>
            ) : allNotifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nessuna notifica disponibile
              </p>
            ) : (
              allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    !notification.isRead 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-muted/50"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}