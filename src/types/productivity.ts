
export interface ProductivityEntry {
  id: string;
  date: string;
  score: number;
  category: string;
  description: string;
  createdAt: Date;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar?: string;
  verified?: boolean;
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
