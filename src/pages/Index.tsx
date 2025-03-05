
import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { BarChart2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-background via-background/90 p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart2 className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">Productivity Portfolio</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Track your productivity like a financial portfolio
        </p>
      </div>
      <AuthForm />
    </div>
  );
};

export default Index;
