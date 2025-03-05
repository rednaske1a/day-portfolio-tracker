
import React from "react";
import { Dashboard as DashboardComponent } from "@/components/dashboard/Dashboard";
import { Layout } from "@/components/shared/Layout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
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

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <DashboardComponent />
    </Layout>
  );
};

export default Dashboard;
