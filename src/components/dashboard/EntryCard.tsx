
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductivityEntry } from "@/types/productivity";
import { formatDateSafely, formatTimeSafely, getScoreColor, getScoreTextColor } from "@/utils/productivityUtils";

interface EntryCardProps {
  entry: ProductivityEntry;
  onDelete: (id: string) => void;
  isReadOnly?: boolean;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onDelete, isReadOnly = false }) => {
  const { id, date, score, category, description, createdAt } = entry;
  
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
            {createdAt instanceof Date ? formatTimeSafely(createdAt) : "Invalid time"}
          </span>
          {!isReadOnly && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};
