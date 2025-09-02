import { Button } from "@/components/ui/button";
import { Home, Trophy, Calendar, TrendingUp, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "HOME", path: "/" },
  { icon: <Calendar className="w-5 h-5" />, label: "CALENDARIO SERIE A", path: "/schedule" },
  { icon: <TrendingUp className="w-5 h-5" />, label: "CLASSIFICA SERIE A", path: "/tables" },
  { icon: <Trophy className="w-5 h-5" />, label: "UCL", path: "/matches" },
  { icon: <User className="w-5 h-5" />, label: "Profilo", path: "/profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bg-card border-t border-border fixed bottom-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={index} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}