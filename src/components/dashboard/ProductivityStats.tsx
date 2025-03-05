
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils";
import { ProductivityEntry } from "@/types/productivity";
import { calculateAverageScore, getMostProductiveCategory, getProductivityStatus, getTodayScore } from "@/utils/productivityUtils";

interface ProductivityStatsProps {
  entries: ProductivityEntry[];
}

export const ProductivityStats: React.FC<ProductivityStatsProps> = ({ entries }) => {
  const todayScore = getTodayScore(entries);
  const todayStatus = getProductivityStatus(todayScore);
  const averageScore = calculateAverageScore(entries);
  const mostProductiveCategory = getMostProductiveCategory(entries);

  return (
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
  );
};
