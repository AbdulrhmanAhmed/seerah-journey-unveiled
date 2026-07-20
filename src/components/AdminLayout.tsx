import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Map, Route, LogOut, LayoutDashboard, Heart, Clock, MessageSquare, Brain, Swords } from "lucide-react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/paths", label: "Paths", icon: Route },
  { path: "/admin/locations", label: "Locations", icon: Map },
  { path: "/admin/shamail", label: "Shamail", icon: Heart },
  { path: "/admin/timeline", label: "Timeline", icon: Clock },
  { path: "/admin/battles", label: "Battles", icon: Swords },
  { path: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { path: "/admin/quiz", label: "Quiz", icon: Brain },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background" dir="ltr">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-bold text-lg text-foreground">Seerah Admin</Link>
            <nav className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/map">
              <Button variant="outline" size="sm">View Map</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
