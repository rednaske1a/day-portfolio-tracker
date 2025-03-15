
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Laptop, Code, Layout, Database, ExternalLink, Hammer, ArrowRight } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationStep < 5) {
        setAnimationStep(animationStep + 1);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [animationStep]);

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

  const renderAnimationStep = () => {
    switch (animationStep) {
      case 0:
        return (
          <div className="animate-fade-in flex items-center justify-center bg-blue-100/30 rounded-lg p-10 w-full max-w-md">
            <Laptop className="h-24 w-24 text-primary animate-pulse" />
          </div>
        );
      case 1:
        return (
          <div className="animate-fade-in flex flex-col items-center justify-center bg-blue-100/30 rounded-lg p-10 w-full max-w-md">
            <Laptop className="h-24 w-24 text-primary" />
            <Code className="h-16 w-16 text-green-500 mt-4 animate-slide-up" />
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in flex flex-col items-center justify-center bg-blue-100/30 rounded-lg p-10 w-full max-w-md">
            <Laptop className="h-24 w-24 text-primary" />
            <Code className="h-16 w-16 text-green-500 mt-4" />
            <Layout className="h-16 w-16 text-blue-500 mt-4 animate-slide-up" />
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in flex flex-col items-center justify-center bg-blue-100/30 rounded-lg p-10 w-full max-w-md">
            <Laptop className="h-24 w-24 text-primary" />
            <Code className="h-16 w-16 text-green-500 mt-4" />
            <Layout className="h-16 w-16 text-blue-500 mt-4" />
            <Database className="h-16 w-16 text-purple-500 mt-4 animate-slide-up" />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in flex flex-col items-center justify-center bg-blue-100/30 rounded-lg p-10 w-full max-w-md">
            <Laptop className="h-24 w-24 text-primary" />
            <Code className="h-16 w-16 text-green-500 mt-4" />
            <Layout className="h-16 w-16 text-blue-500 mt-4" />
            <Database className="h-16 w-16 text-purple-500 mt-4" />
            <Hammer className="h-16 w-16 text-amber-500 mt-4 animate-slide-up" />
          </div>
        );
      case 5:
        return (
          <div className="animate-scale-in flex flex-col items-center justify-center bg-blue-100/30 rounded-lg p-10 w-full max-w-md">
            <div className="relative">
              <Laptop className="h-24 w-24 text-primary" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded">
                <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-green-500 rounded animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-lg font-medium">Website ready! 🎉</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-background via-background/90 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Website Builder</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Watch the magic happen!
        </p>
      </div>

      {renderAnimationStep()}

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <a href="https://urnik.apg.si" target="_blank" rel="noopener noreferrer">
          <Button className="group flex items-center gap-2">
            <span>Visit Urnik</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </a>
        <a href="https://igre.apg.si" target="_blank" rel="noopener noreferrer">
          <Button className="group flex items-center gap-2" variant="outline">
            <span>Visit Igre</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </a>
      </div>

      <div className="mt-6 text-muted-foreground text-center">
        <p>Productivity Portfolio app is coming soon!</p>
        <a href="/verify-email" className="flex items-center justify-center mt-2 text-sm hover:underline">
          <span>Already have a verification code?</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default Index;
