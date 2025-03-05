
import { ProductivityEntry, User } from "@/types/productivity";

// Mock users for demonstration
export const mockUsers: User[] = [
  { id: "current", name: "You" },
  { id: "user1", name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?u=alex" },
  { id: "user2", name: "Sam Rodriguez", avatar: "https://i.pravatar.cc/150?u=sam" },
  { id: "user3", name: "Taylor Kim", avatar: "https://i.pravatar.cc/150?u=taylor" },
];

// Generate sample entries for each user
export const generateSampleEntries = (userId: string): ProductivityEntry[] => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const todayIso = today.toISOString().split('T')[0];
  const yesterdayIso = yesterday.toISOString().split('T')[0];
  const twoDaysAgoIso = twoDaysAgo.toISOString().split('T')[0];
  const threeDaysAgoIso = threeDaysAgo.toISOString().split('T')[0];
  
  // Different sample entries based on user
  switch (userId) {
    case "user1":
      return [
        {
          id: `${userId}-1`,
          date: todayIso,
          score: 9,
          category: "Work",
          description: "Finished quarterly report ahead of schedule",
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
          userId
        },
        {
          id: `${userId}-2`,
          date: yesterdayIso,
          score: 7,
          category: "Exercise",
          description: "Morning run - 5km in 25 minutes",
          createdAt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 8, 30),
          userId
        },
        {
          id: `${userId}-3`,
          date: twoDaysAgoIso,
          score: 6,
          category: "Study",
          description: "Completed online course module",
          createdAt: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 19, 15),
          userId
        },
      ];
    case "user2":
      return [
        {
          id: `${userId}-1`,
          date: todayIso,
          score: 5,
          category: "Personal Project",
          description: "Worked on home renovation plans",
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
          userId
        },
        {
          id: `${userId}-2`,
          date: yesterdayIso,
          score: 8,
          category: "Creative",
          description: "Designed new website mockups",
          createdAt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 14, 0),
          userId
        },
        {
          id: `${userId}-3`,
          date: threeDaysAgoIso,
          score: 9,
          category: "Work",
          description: "Led successful client presentation",
          createdAt: new Date(threeDaysAgo.getFullYear(), threeDaysAgo.getMonth(), threeDaysAgo.getDate(), 11, 0),
          userId
        },
      ];
    case "user3":
      return [
        {
          id: `${userId}-1`,
          date: todayIso,
          score: 7,
          category: "Social",
          description: "Networking event with industry professionals",
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 30),
          userId
        },
        {
          id: `${userId}-2`,
          date: yesterdayIso,
          score: 4,
          category: "Study",
          description: "Struggled with new programming concept",
          createdAt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 22, 0),
          userId
        },
        {
          id: `${userId}-3`,
          date: twoDaysAgoIso,
          score: 10,
          category: "Exercise",
          description: "Personal best in deadlift - 140kg",
          createdAt: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 7, 0),
          userId
        },
      ];
    default:
      // Default entries for current user
      return [
        {
          id: "1",
          date: todayIso,
          score: 8,
          category: "Work",
          description: "Completed major project milestone ahead of schedule",
          createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
          userId: "current"
        },
        {
          id: "2",
          date: yesterdayIso,
          score: 6,
          category: "Study",
          description: "Reviewed course materials and prepared for assessment",
          createdAt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 19, 15),
          userId: "current"
        },
        {
          id: "3",
          date: twoDaysAgoIso,
          score: 9,
          category: "Exercise",
          description: "Intense workout session and achieved personal best",
          createdAt: new Date(twoDaysAgo.getFullYear(), twoDaysAgo.getMonth(), twoDaysAgo.getDate(), 8, 0),
          userId: "current"
        },
      ];
  }
};

// Load productivity entries from localStorage or generate if not found
export const loadProductivityEntries = (userId: string = "current"): ProductivityEntry[] => {
  try {
    const storageKey = userId === "current" ? 'productivity_entries' : `productivity_entries_${userId}`;
    const storedEntries = localStorage.getItem(storageKey);
    
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries);
      // Ensure dates are valid
      return parsedEntries.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt)
      }));
    }
    
    // If no entries found, generate samples
    const sampleEntries = generateSampleEntries(userId);
    localStorage.setItem(storageKey, JSON.stringify(sampleEntries));
    return sampleEntries;
  } catch (error) {
    console.error("Error loading entries:", error);
    const sampleEntries = generateSampleEntries(userId);
    return sampleEntries;
  }
};

// Save productivity entries to localStorage
export const saveProductivityEntries = (entries: ProductivityEntry[], userId: string = "current") => {
  try {
    const storageKey = userId === "current" ? 'productivity_entries' : `productivity_entries_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving entries:", error);
  }
};

// Add a new productivity entry
export const addProductivityEntry = (entry: ProductivityEntry, userId: string = "current") => {
  const entries = loadProductivityEntries(userId);
  const updatedEntries = [entry, ...entries];
  saveProductivityEntries(updatedEntries, userId);
  return updatedEntries;
};

// Delete a productivity entry
export const deleteProductivityEntry = (entryId: string, userId: string = "current") => {
  const entries = loadProductivityEntries(userId);
  const updatedEntries = entries.filter(entry => entry.id !== entryId);
  saveProductivityEntries(updatedEntries, userId);
  return updatedEntries;
};

// Get users for the user selection dropdown
export const getUsers = (): User[] => {
  return mockUsers;
};
