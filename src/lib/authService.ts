
import { User, UserRole } from "@/types";

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "donor",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&dpr=2&q=80",
  },
  {
    id: "2",
    name: "Food Bank Inc",
    email: "foodbank@example.com",
    role: "ngo",
    phone: "987-654-3210",
    address: "456 Oak St, Othertown, USA",
    bio: "We collect and distribute food to those in need.",
    avatar: "https://images.unsplash.com/photo-1589063805942-a74e5c81b579?w=300&h=300&dpr=2&q=80",
  },
];

// Helper function to get a deterministic ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Local storage keys
const USER_KEY = "current_user";

// Register a new user
export const register = (userData: Omit<User, "id">): User => {
  // Check if email is already in use
  const existingUser = mockUsers.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  // Create new user
  const newUser: User = {
    id: generateId(),
    ...userData
  };

  // In a real app, this would send the user data to a backend API
  // For now, we'll add it to our mock data
  mockUsers.push(newUser);

  // Log in the new user
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));

  return newUser;
};

// Log in a user
export const login = (email: string, password: string): User => {
  // In a real app, this would validate credentials against a backend API
  // For now, we'll check against our mock data
  const user = mockUsers.find(u => u.email === email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // In a real app, we would validate the password here
  // But for demonstration purposes, we'll skip that step

  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};

// Log out the current user
export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Get the currently logged-in user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Update user data
export const updateUserProfile = (userData: Partial<User>): User | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const updatedUser = { ...currentUser, ...userData };

  // In a real app, this would update the user data on the backend
  const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    mockUsers[userIndex] = updatedUser;
  }

  // Update the local storage
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
};

// Check if the current user has a specific role
export const hasRole = (role: UserRole): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  return currentUser.role === role;
};

// Check if the user is authenticated and redirect if not
export const requireAuth = (callback: () => void): void => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    // In a real app with routing, we would redirect to login page
    window.location.href = "/login";
    return;
  }
  
  callback();
};
