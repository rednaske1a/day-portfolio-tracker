
import { User } from "@/types/productivity";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface RegisterData {
  username: string;
  email: string;
  handle: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Register a new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  const result = await response.json();
  localStorage.setItem("auth_token", result.token);
  localStorage.setItem("productivity_user", JSON.stringify(result.user));
  return result;
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const result = await response.json();
  localStorage.setItem("auth_token", result.token);
  localStorage.setItem("productivity_user", JSON.stringify(result.user));
  return result;
};

// Verify email
export const verifyEmail = async (token: string): Promise<{ success: boolean, message: string }> => {
  const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
    method: "GET",
  });

  const result = await response.json();
  return result;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("productivity_user");
};

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("productivity_user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
