
import { ProductivityEntry, User } from "@/types/productivity";
import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Local storage keys
const ENTRIES_STORAGE_KEY = "productivity_entries";
const USERS_STORAGE_KEY = "productivity_users";

// Fetch all entries for the current user
export const fetchUserEntries = async (): Promise<ProductivityEntry[]> => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/entries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch entries");
  }

  return response.json();
};

// Add a new entry
export const addEntry = async (entry: Omit<ProductivityEntry, "id" | "createdAt" | "userId">): Promise<ProductivityEntry> => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error("Failed to add entry");
  }

  return response.json();
};

// Update an entry
export const updateEntry = async (id: string, entry: Partial<ProductivityEntry>): Promise<ProductivityEntry> => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/entries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error("Failed to update entry");
  }

  return response.json();
};

// Delete an entry
export const deleteEntry = async (id: string): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/entries/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete entry");
  }
};

// --- Local storage functions for demo purposes ---

// Load productivity entries from localStorage
export const loadProductivityEntries = (userId: string): ProductivityEntry[] => {
  try {
    const storedEntries = localStorage.getItem(`${ENTRIES_STORAGE_KEY}_${userId}`);
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error("Error loading entries from localStorage:", error);
    return [];
  }
};

// Save productivity entries to localStorage
export const saveProductivityEntries = (entries: ProductivityEntry[], userId: string): void => {
  try {
    localStorage.setItem(`${ENTRIES_STORAGE_KEY}_${userId}`, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving entries to localStorage:", error);
  }
};

// Add a new productivity entry (demo implementation)
export const addProductivityEntry = (entry: ProductivityEntry, userId: string): ProductivityEntry[] => {
  const entries = loadProductivityEntries(userId);
  const updatedEntries = [...entries, entry];
  saveProductivityEntries(updatedEntries, userId);
  return updatedEntries;
};

// Delete a productivity entry (demo implementation)
export const deleteProductivityEntry = (id: string, userId: string): ProductivityEntry[] => {
  const entries = loadProductivityEntries(userId);
  const updatedEntries = entries.filter(entry => entry.id !== id);
  saveProductivityEntries(updatedEntries, userId);
  return updatedEntries;
};

// Get mock users for demo purposes
export const getUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
    
    // Create default users if none exist
    const defaultUsers: User[] = [
      {
        id: "user1",
        name: "Jane Smith",
        email: "jane@example.com",
        handle: "janesmith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        verified: true
      },
      {
        id: "user2",
        name: "John Doe",
        email: "john@example.com",
        handle: "johndoe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        verified: true
      }
    ];
    
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};
