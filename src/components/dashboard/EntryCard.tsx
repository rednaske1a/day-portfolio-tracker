
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductivityEntry } from "./EntryForm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EntryCardProps {
  entry: ProductivityEntry;
  onDelete: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete }) => {
  const { id, date, score, category, description, createdAt } = entry;
  
  const getScoreColor = (score: number): string => {
    if (score >= 8) return "border-productivity-high";
    if (score >= 5) return "border-productivity-medium";
    return "border-productivity-low";
  };

  const getScoreTextColor = (score: number): string => {
    if (score >= 8) return "text-productivity-high";
    if (score >= 5) return "text-productivity-medium";
    return "text-productivity-low";
  };

  // Safe date formatting with error handling
  const formatDateSafely = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTimeSafely = (dateObj: Date) => {
    try {
      return format(new Date(dateObj), "h:mm a");
    } catch (error) {
      return "Invalid time";
    }
  };
  
  return (
    <Card className={cn(
      "glass-card hover:shadow-glass-hover cursor-default border overflow-hidden animate-enter transition-all", 
      getScoreColor(score)
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {formatDateSafely(date)}
          </span>
          <Badge variant="outline" className="mt-1 w-fit">
            {category}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "text-xl font-mono font-semibold", 
            getScoreTextColor(score)
          )}>
            {score}/10
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description || "No description provided"}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {formatTimeSafely(createdAt)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
