
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductivityEntry } from "@/types/productivity";
import { formatTimeSafely, getScoreTextColor } from "@/utils/productivityUtils";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  entries: ProductivityEntry[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ entries }) => {
  // Sort entries by creation time (newest first)
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.createdAt instanceof Date && b.createdAt instanceof Date) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    return 0;
  });
  
  // Take only the most recent 5 entries
  const recentEntries = sortedEntries.slice(0, 5);
  
  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recentEntries.length > 0 ? (
          <div className="px-4 divide-y divide-white/5">
            {recentEntries.map(entry => (
              <div key={entry.id} className="py-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {entry.createdAt instanceof Date ? formatTimeSafely(entry.createdAt) : "Invalid time"}
                    </span>
                  </div>
                  <p className="text-sm mt-1 line-clamp-1">
                    {entry.description || "No description"}
                  </p>
                </div>
                <div className={cn("font-mono font-semibold", getScoreTextColor(entry.score))}>
                  {entry.score}/10
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
