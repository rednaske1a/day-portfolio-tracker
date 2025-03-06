
import { format, isSameDay, subDays, parseISO } from "date-fns";
import { ProductivityEntry } from "@/types/productivity";

// Color utilities for score visualization
export const getScoreColor = (score: number): string => {
  if (score >= 8) return "border-productivity-high";
  if (score >= 5) return "border-productivity-medium";
  return "border-productivity-low";
};

export const getScoreTextColor = (score: number): string => {
  if (score >= 8) return "text-productivity-high";
  if (score >= 5) return "text-productivity-medium";
  return "text-productivity-low";
};

export const getProductivityStatus = (score: number) => {
  if (score >= 8) return { label: "High", className: "bg-productivity-high/10 text-productivity-high" };
  if (score >= 5) return { label: "Medium", className: "bg-productivity-medium/10 text-productivity-medium" };
  return { label: "Low", className: "bg-productivity-low/10 text-productivity-low" };
};

// Safe date formatting with robust error handling
export const formatDateSafely = (dateString: string) => {
  try {
    // Handle both ISO strings and date objects
    return format(typeof dateString === 'string' ? parseISO(dateString) : dateString, "MMMM d, yyyy");
  } catch (error) {
    console.error("Date formatting error:", error, "Invalid date:", dateString);
    return "Invalid date";
  }
};

export const formatTimeSafely = (dateObj: Date) => {
  try {
    return format(new Date(dateObj), "h:mm a");
  } catch (error) {
    console.error("Time formatting error:", error, "Invalid date object:", dateObj);
    return "Invalid time";
  }
};

// Analytics utilities
export const calculateAverageScore = (entries: ProductivityEntry[]): number => {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, entry) => acc + entry.score, 0);
  return parseFloat((sum / entries.length).toFixed(1));
};

export const getTodayScore = (entries: ProductivityEntry[]): number => {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(entry => entry.date === today);
  if (todayEntries.length === 0) return 0;
  
  const sum = todayEntries.reduce((acc, entry) => acc + entry.score, 0);
  return parseFloat((sum / todayEntries.length).toFixed(1));
};

export const getMostProductiveCategory = (entries: ProductivityEntry[]): string => {
  if (entries.length === 0) return "N/A";
  
  const categoryScores: Record<string, { total: number, count: number }> = {};
  
  entries.forEach(entry => {
    if (!categoryScores[entry.category]) {
      categoryScores[entry.category] = { total: 0, count: 0 };
    }
    categoryScores[entry.category].total += entry.score;
    categoryScores[entry.category].count += 1;
  });
  
  let bestCategory = "";
  let bestAverage = 0;
  
  Object.entries(categoryScores).forEach(([category, data]) => {
    const average = data.total / data.count;
    if (average > bestAverage) {
      bestAverage = average;
      bestCategory = category;
    }
  });
  
  return bestCategory;
};

// Chart data preparation with proper error handling
export const prepareChartData = (entries: ProductivityEntry[], days = 7) => {
  const today = new Date();
  // Create an array representing the last [days] days
  const dateRange = Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i);
    return {
      name: format(date, "MMM d"),
      value: 0,
      date,
    };
  });

  // Fill in scores for days that have entries
  entries.forEach(entry => {
    try {
      const entryDate = parseISO(entry.date);
      const dayData = dateRange.find(d => isSameDay(d.date, entryDate));
      if (dayData) {
        // If multiple entries on the same day, use the average
        if (dayData.value > 0) {
          dayData.value = parseFloat(((dayData.value + entry.score) / 2).toFixed(1));
        } else {
          dayData.value = entry.score;
        }
      }
    } catch (error) {
      console.error("Error processing entry date:", error, "Entry:", entry);
    }
  });

  return dateRange;
};
