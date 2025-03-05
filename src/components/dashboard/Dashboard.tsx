
import React, { useState, useEffect } from "react";
import { EntryForm, ProductivityEntry } from "./EntryForm";
import { EntryCard } from "./EntryCard";
import { ProductivityChart } from "./ProductivityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Activity, BarChart2, Calendar, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Dashboard: React.FC = () => {
  const [entries, setEntries] = useState<ProductivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from storage
    const storedEntries = localStorage.getItem('productivity_entries');
    
    setTimeout(() => {
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      } else {
        // Add some sample data for demonstration
        const sampleEntries = getSampleEntries();
        setEntries(sampleEntries);
        localStorage.setItem('productivity_entries', JSON.stringify(sampleEntries));
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Save entries to localStorage whenever they change
    if (!isLoading) {
      localStorage.setItem('productivity_entries', JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  const handleAddEntry = (entry: ProductivityEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.info("Entry deleted", {
      description: "The productivity entry has been removed"
    });
  };

  const getTodayScore = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(entry => entry.date === today);
    if (todayEntries.length === 0) return 0;
    
    const sum = todayEntries.reduce((acc, entry) => acc + entry.score, 0);
    return Math.round((sum / todayEntries.length) * 10) / 10;
  };

  const getAverageScore = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.score, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };

  const getProductivityStatus = (score: number) => {
    if (score >= 8) return { label: "High", className: "bg-productivity-high/10 text-productivity-high" };
    if (score >= 5) return { label: "Medium", className: "bg-productivity-medium/10 text-productivity-medium" };
    return { label: "Low", className: "bg-productivity-low/10 text-productivity-low" };
  };

  const getMostProductiveCategory = () => {
    if (entries.length === 0) return "N/A";
    
    const categoryScores: Record<string, { total: number, count: number }> = {};
    
    entries.forEach(entry => {
      if (!categoryScores[entry.category]) {
        categoryScores[entry.category] = { total: 0, count: 0 };
      }
      categoryScores[entry.category].total += entry.score;
      categoryScores[entry.category].count += 1;
    });
    
    let bestCategory = "";
    let bestAverage = 0;
    
    Object.entries(categoryScores).forEach(([category, data]) => {
      const average = data.total / data.count;
      if (average > bestAverage) {
        bestAverage = average;
        bestCategory = category;
      }
    });
    
    return bestCategory;
  };

  const todayScore = getTodayScore();
  const todayStatus = getProductivityStatus(todayScore);
  const averageScore = getAverageScore();
  const mostProductiveCategory = getMostProductiveCategory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading your productivity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 w-full max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Productivity Portfolio</h1>
        <EntryForm onAddEntry={handleAddEntry} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Today's Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold crypto-value">
                <AnimatedNumber value={todayScore} decimals={1} />
                <span className="text-lg font-normal text-muted-foreground">/10</span>
              </div>
              <Badge variant="outline" className={cn("ml-2", todayStatus.className)}>
                {todayStatus.label}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold crypto-value">
                <AnimatedNumber value={averageScore} decimals={1} />
                <span className="text-lg font-normal text-muted-foreground">/10</span>
              </div>
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                Lifetime
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Most Productive Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-semibold truncate">
                {mostProductiveCategory}
              </div>
              <Badge variant="outline" className="ml-2 bg-productivity-high/10 text-productivity-high">
                Best
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProductivityChart entries={entries} />
        </div>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[200px] overflow-y-auto p-4 space-y-2">
              {entries.slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center border-b border-border pb-2 last:border-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-productivity-bg">
                    <span className={cn(
                      "text-sm font-semibold",
                      getProductivityStatus(entry.score).className
                    )}>
                      {entry.score}
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{entry.category}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.description}</p>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No activity yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Productivity Entries</h2>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="all">All Entries</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {entries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map(entry => (
                <EntryCard 
                  key={entry.id} 
                  entry={entry} 
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 glass-card">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No entries yet</h3>
              <p className="text-muted-foreground">
                Add your first productivity entry to get started
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="today" className="mt-0">
          {entries.filter(entry => {
            const today = new Date().toISOString().split('T')[0];
            return entry.date === today;
          }).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries
                .filter(entry => {
                  const today = new Date().toISOString().split('T')[0];
                  return entry.date === today;
                })
                .map(entry => (
                  <EntryCard 
                    key={entry.id} 
                    entry={entry} 
                    onDelete={handleDeleteEntry}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-10 glass-card">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No entries for today</h3>
              <p className="text-muted-foreground">
                Add your first productivity entry for today
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Sample data for demonstration
function getSampleEntries(): ProductivityEntry[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  return [
    {
      id: "1",
      date: today.toISOString().split('T')[0],
      score: 8,
      category: "Work",
      description: "Completed major project milestone ahead of schedule",
      createdAt: new Date(today.setHours(14, 30)),
    },
    {
      id: "2",
      date: yesterday.toISOString().split('T')[0],
      score: 6,
      category: "Study",
      description: "Reviewed course materials and prepared for assessment",
      createdAt: new Date(yesterday.setHours(19, 15)),
    },
    {
      id: "3",
      date: twoDaysAgo.toISOString().split('T')[0],
      score: 9,
      category: "Exercise",
      description: "Intense workout session and achieved personal best",
      createdAt: new Date(twoDaysAgo.setHours(8, 0)),
    },
  ];
}
