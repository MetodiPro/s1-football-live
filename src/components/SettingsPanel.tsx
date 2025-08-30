import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings, Moon, Sun, Volume2, VolumeX, Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

export function SettingsPanel() {
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Impostazioni</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aspetto</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="dark-mode">Modalità scura</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Audio e Notifiche</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                <Label htmlFor="sound">Suoni</Label>
              </div>
              <Switch
                id="sound"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                <Label htmlFor="notifications">Notifiche push</Label>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">App</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Versione: 1.0.0</p>
              <p>Ultimo aggiornamento: Oggi</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}