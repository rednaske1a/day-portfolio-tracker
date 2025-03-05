
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { User } from "@/types/productivity";
import { Users } from "lucide-react";

interface UserSelectorProps {
  users: User[];
  selectedUserId: string;
  onUserChange: (userId: string) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ 
  users, 
  selectedUserId, 
  onUserChange 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Users className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedUserId} onValueChange={onUserChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Users</SelectLabel>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
