
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Local storage keys
const USER_KEY = "current_user";

// Register a new user
export const register = async (userData: Omit<User, "id">): Promise<User | null> => {
  try {
    // Check if email is already in use
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', userData.email)
      .maybeSingle();
      
    if (checkError) {
      throw checkError;
    }
    
    if (existingUsers) {
      throw new Error("Email is already in use");
    }

    // Create authentication user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password || '',
    });

    if (authError || !authData.user) {
      throw authError || new Error("Failed to create user");
    }

    // Create profile for the user
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone || null,
        address: userData.address || null,
        avatar: userData.avatar || null,
        bio: userData.bio || null,
        website: userData.website || null
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    const newUser: User = {
      id: authData.user.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      address: userData.address,
      avatar: userData.avatar,
      bio: userData.bio,
      website: userData.website
    };

    // Store user in local storage
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return newUser;
  } catch (error: any) {
    console.error("Registration error:", error.message);
    toast.error(error.message || "Registration failed");
    return null;
  }
};

// Log in a user
export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      throw authError || new Error("Invalid email or password");
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    // If profile doesn't exist (which shouldn't happen), create one
    if (!profileData) {
      const { data: newProfileData, error: newProfileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          role: 'donor' // Default role
        })
        .select()
        .single();

      if (newProfileError) {
        throw newProfileError;
      }
    }

    const userData = profileData || {
      id: authData.user.id,
      email: email,
      role: 'donor',
      name: email.split('@')[0]
    };

    const user: User = {
      id: userData.id,
      name: userData.name || email.split('@')[0],
      email: userData.email || email,
      role: (userData.role as UserRole) || 'donor',
      phone: userData.phone || undefined,
      address: userData.address || undefined,
      avatar: userData.avatar || undefined,
      bio: userData.bio || undefined,
      website: userData.website || undefined
    };

    // Store user in local storage for easy access
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  } catch (error: any) {
    console.error("Login error:", error.message);
    toast.error(error.message || "Login failed");
    return null;
  }
};

// Log out the current user
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem(USER_KEY);
  } catch (error: any) {
    console.error("Logout error:", error.message);
    toast.error("Logout failed");
  }
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
export const updateUserProfile = async (userData: Partial<User>): Promise<User | null> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  try {
    // Update profile in database
    const updateData: any = {};
    if (userData.name) updateData.name = userData.name;
    if (userData.phone) updateData.phone = userData.phone;
    if (userData.address) updateData.address = userData.address;
    if (userData.avatar) updateData.avatar = userData.avatar;
    if (userData.bio) updateData.bio = userData.bio;
    if (userData.website) updateData.website = userData.website;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', currentUser.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const updatedUser = { ...currentUser, ...userData };

    // Update the local storage
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    return updatedUser;
  } catch (error: any) {
    console.error("Profile update error:", error.message);
    toast.error(error.message || "Failed to update profile");
    return null;
  }
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

// Fetch user profile from Supabase
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name || '',
      email: data.email || '',
      role: data.role as UserRole || 'donor',
      phone: data.phone || '',
      address: data.address || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      website: data.website || ''
    };
  } catch (error: any) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
};
