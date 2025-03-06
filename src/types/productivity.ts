
export interface ProductivityEntry {
  id: string;
  date: string;
  score: number;
  category: string;
  description: string;
  createdAt: Date;
  userId: string; // Used for multi-user support
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export const PRODUCTIVITY_CATEGORIES = [
  "Work",
  "Study",
  "Exercise",
  "Creative",
  "Social",
  "Personal Project",
  "Self-care",
  "Other"
];
