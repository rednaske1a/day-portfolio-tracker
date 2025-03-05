
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { ProductivityEntry } from "@/types/productivity";
import { EntryCard } from "./EntryCard";

interface EntriesListProps {
  entries: ProductivityEntry[];
  onDelete: (id: string) => void;
  isReadOnly?: boolean;
}

export const EntriesList: React.FC<EntriesListProps> = ({ entries, onDelete, isReadOnly = false }) => {
  return (
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
                onDelete={onDelete}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 glass-card">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No entries yet</h3>
            <p className="text-muted-foreground">
              {isReadOnly 
                ? "This user hasn't added any productivity entries yet"
                : "Add your first productivity entry to get started"
              }
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
                  onDelete={onDelete}
                  isReadOnly={isReadOnly}
                />
              ))
            }
          </div>
        ) : (
          <div className="text-center py-10 glass-card">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No entries for today</h3>
            <p className="text-muted-foreground">
              {isReadOnly 
                ? "This user hasn't added any productivity entries for today"
                : "Add your first productivity entry for today"
              }
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
