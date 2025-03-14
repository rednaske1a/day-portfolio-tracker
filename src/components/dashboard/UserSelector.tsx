
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedUserId} onValueChange={onUserChange}>
        <SelectTrigger className="w-[180px] h-9 text-sm">
          <SelectValue placeholder="View user portfolio" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {user.avatar ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                    {user.name[0]}
                  </div>
                )}
                <span>{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
