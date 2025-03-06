
import React, { useState, useEffect } from "react";
import { EntryForm } from "./EntryForm";
import { ProductivityChart } from "./ProductivityChart";
import { ProductivityStats } from "./ProductivityStats";
import { RecentActivity } from "./RecentActivity";
import { EntriesList } from "./EntriesList";
import { UserSelector } from "./UserSelector";
import { User, ProductivityEntry } from "@/types/productivity";
import { toast } from "sonner";
import { 
  addProductivityEntry, 
  deleteProductivityEntry, 
  getUsers, 
  loadProductivityEntries, 
  saveProductivityEntries
} from "@/services/productivityService";

export const Dashboard: React.FC = () => {
  const [entries, setEntries] = useState<ProductivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("current");

  useEffect(() => {
    // Initialize users
    setUsers(getUsers());
    
    // Load initial data
    loadData("current");
  }, []);

  const loadData = (userId: string) => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const loadedEntries = loadProductivityEntries(userId);
      setEntries(loadedEntries);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    // Save entries to localStorage whenever they change
    if (!isLoading && selectedUserId === "current") {
      saveProductivityEntries(entries, "current");
    }
  }, [entries, isLoading, selectedUserId]);

  const handleAddEntry = (entry: ProductivityEntry) => {
    if (selectedUserId !== "current") {
      toast.error("Permission denied", {
        description: "You can only add entries to your own portfolio"
      });
      return;
    }
    
    const updatedEntries = addProductivityEntry(entry, "current");
    setEntries(updatedEntries);
  };

  const handleDeleteEntry = (id: string) => {
    if (selectedUserId !== "current") {
      toast.error("Permission denied", {
        description: "You can only delete entries from your own portfolio"
      });
      return;
    }
    
    const updatedEntries = deleteProductivityEntry(id, "current");
    setEntries(updatedEntries);
    toast.info("Entry deleted", {
      description: "The productivity entry has been removed"
    });
  };

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    loadData(userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading productivity data...</p>
        </div>
      </div>
    );
  }

  const isOwnData = selectedUserId === "current";
  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <div className="animate-fade-in space-y-6 w-full max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isOwnData ? "My Productivity Portfolio" : `${selectedUser?.name}'s Portfolio`}
          </h1>
          <UserSelector 
            users={users}
            selectedUserId={selectedUserId}
            onUserChange={handleUserChange}
          />
        </div>
        
        {isOwnData && <EntryForm onAddEntry={handleAddEntry} />}
      </div>
      
      <ProductivityStats entries={entries} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProductivityChart entries={entries} />
        </div>
        
        <RecentActivity entries={entries} />
      </div>
      
      <EntriesList 
        entries={entries} 
        onDelete={handleDeleteEntry}
        isReadOnly={!isOwnData}
      />
    </div>
  );
};
