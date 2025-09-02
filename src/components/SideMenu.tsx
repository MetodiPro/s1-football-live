import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Home, Calendar, Trophy, Users, Menu, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "HOME", path: "/" },
  { icon: Calendar, label: "CALENDARIO SERIE A", path: "/schedule" },
  { icon: Users, label: "CLASSIFICA SERIE A", path: "/tables" },
  { icon: Trophy, label: "UCL", path: "/matches" },
  { icon: User, label: "SSC NAPOLI", path: "/napoli" },
];

export function SideMenu() {
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="text-xl font-bold">S1</span>
            <span className="text-primary font-bold text-xl">Score</span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}