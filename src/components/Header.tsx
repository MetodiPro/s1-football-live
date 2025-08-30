import { Button } from "@/components/ui/button";
import { Menu, Bell, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="bg-gradient-hero shadow-elevated sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">S1</h1>
              <span className="text-primary ml-1 font-bold text-xl">Score</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}