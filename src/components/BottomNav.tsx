import { Button } from "@/components/ui/button";
import { Home, Trophy, Calendar, TrendingUp, User } from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", active: true },
  { icon: <Trophy className="w-5 h-5" />, label: "Matches" },
  { icon: <Calendar className="w-5 h-5" />, label: "Schedule" },
  { icon: <TrendingUp className="w-5 h-5" />, label: "Tables" },
  { icon: <User className="w-5 h-5" />, label: "Profile" },
];

export function BottomNav() {
  return (
    <nav className="bg-card border-t border-border fixed bottom-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                item.active 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}