
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("productivity_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - in a real app, you'd validate against a backend
      if (password.length < 6) {
        throw new Error("Invalid password - must be at least 6 characters");
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = { username };
      localStorage.setItem("productivity_user", JSON.stringify(user));
      localStorage.setItem("password", password); // In a real app, never store passwords in localStorage
      setUser(user);
      toast.success("Welcome back!", {
        description: `Logged in as ${username}`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Authentication failed", {
        description: error instanceof Error ? error.message : "Please check your credentials",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("productivity_user");
    localStorage.removeItem("password");
    setUser(null);
    toast.info("You've been logged out");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
