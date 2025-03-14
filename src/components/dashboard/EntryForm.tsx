
import React, { useState } from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTIVITY_CATEGORIES, ProductivityEntry } from "@/types/productivity";
import { getScoreTextColor } from "@/utils/productivityUtils";

interface EntryFormProps {
  onAddEntry: (entry: ProductivityEntry) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onAddEntry }) => {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(7);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setScore(7);
    setCategory("");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create new entry
    const newEntry: ProductivityEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      score,
      category: category || "Other",
      description,
      createdAt: new Date(),
      userId: "current"
    };
    
    // Simulate network delay
    setTimeout(() => {
      onAddEntry(newEntry);
      toast.success("Entry added successfully", {
        description: `You added a new ${category || "Other"} entry with a score of ${score}/10`,
      });
      
      resetForm();
      setOpen(false);
      setIsSubmitting(false);
    }, 500);
  };

  const getProductivityLabel = (score: number): string => {
    if (score >= 8) return "Highly Productive";
    if (score >= 5) return "Moderately Productive";
    return "Low Productivity";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 h-11 bg-primary hover:brightness-110 transition-all shadow-lg px-4 hover:scale-[1.02] active:scale-[0.98]">
          <PlusCircle className="h-5 w-5" />
          <span>Add Entry</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card border border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Add Productivity Entry</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Record your productivity for today's activities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-4">
              <Label className="text-base">
                Productivity Score: <span className={getScoreTextColor(score)}>{score}/10</span> 
                <span className="ml-2 text-sm text-muted-foreground">({getProductivityLabel(score)})</span>
              </Label>
              <Slider
                defaultValue={[7]}
                max={10}
                step={1}
                value={[score]}
                onValueChange={([value]) => setScore(value)}
                className="py-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTIVITY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="What did you accomplish today?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11 border border-white/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-11 bg-primary hover:brightness-110 transition-all" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
