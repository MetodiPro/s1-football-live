import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Gol di Lautaro!",
    message: "Inter - Milan: Lautaro Martinez segna al 78'!",
    time: "2 min fa",
    isRead: false,
  },
  {
    id: "2",
    title: "Partita iniziata",
    message: "Juventus vs Roma è iniziata",
    time: "15 min fa",
    isRead: false,
  },
  {
    id: "3",
    title: "Risultato finale",
    message: "Napoli 2-1 Atalanta - Partita terminata",
    time: "1h fa",
    isRead: true,
  },
];

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nessuna notifica
              </p>
            ) : (
              notifications.map((notification) => (
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