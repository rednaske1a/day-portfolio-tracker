
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductivityEntry } from "@/types/productivity";
import { getProductivityStatus } from "@/utils/productivityUtils";

interface RecentActivityProps {
  entries: ProductivityEntry[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ entries }) => {
  return (
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
  );
};
