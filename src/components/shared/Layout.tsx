
import React from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background via-background/90">
      {isAuthenticated && <Navbar />}
      <main className="flex-1 px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
};
