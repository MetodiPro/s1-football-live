import { SideMenu } from "@/components/SideMenu";
import { NotificationsPanel } from "@/components/NotificationsPanel";
import { SettingsPanel } from "@/components/SettingsPanel";

export function Header() {
  return (
    <header className="bg-gradient-hero shadow-elevated sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SideMenu />
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">S1</h1>
              <span className="text-primary ml-1 font-bold text-xl">Score</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationsPanel />
            <SettingsPanel />
          </div>
        </div>
      </div>
    </header>
  );
}