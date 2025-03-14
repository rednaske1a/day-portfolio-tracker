
import { ProductivityEntry } from "@/types/productivity";
import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
