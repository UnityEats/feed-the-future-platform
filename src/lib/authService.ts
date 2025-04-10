
import { User } from "@/types";
import { mockUsers } from "./mockData";
import { toast } from "sonner";

// Store current user in localStorage
const CURRENT_USER_KEY = "feed_the_future_current_user";

// Initialize user data in localStorage if it doesn't exist
const initializeUserData = () => {
  if (!localStorage.getItem("feed_the_future_users")) {
    localStorage.setItem("feed_the_future_users", JSON.stringify(mockUsers));
  }
};

// Get all users
export const getUsers = (): User[] => {
  initializeUserData();
  return JSON.parse(localStorage.getItem("feed_the_future_users") || "[]");
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Login
export const login = (email: string, password: string): User | null => {
  // In a real app, you would validate the password
  // For this demo, we'll just check if the email exists
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  
  return null;
};

// Register
export const register = (user: Omit<User, "id">): User | null => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    return null;
  }
  
  // Create new user
  const newUser: User = {
    ...user,
    id: `user${Date.now()}`
  };
  
  // Add to users array
  users.push(newUser);
  localStorage.setItem("feed_the_future_users", JSON.stringify(users));
  
  // Set as current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  
  return newUser;
};

// Logout
export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user ? user.role === role : false;
};

// Auth context wrapper for protected routes
export const requireAuth = (callback: () => void) => {
  if (!isAuthenticated()) {
    toast.error("You must be logged in to access this page");
    window.location.href = "/login";
    return;
  }
  callback();
};
