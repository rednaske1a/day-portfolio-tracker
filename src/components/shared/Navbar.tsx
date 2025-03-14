
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart2 } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-card border-b border-white/10 sticky top-0 z-10 w-full">
      <div className="container flex items-center justify-between h-16 px-4 max-w-[1200px]">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Productivity Portfolio</span>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline-block">
              {user.name} {/* Changed from username to name */}
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Sign out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
