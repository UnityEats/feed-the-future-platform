
import { Donation, DonationStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper function to get a deterministic ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a new donation
export const createDonation = async (
  donationData: Omit<Donation, "id" | "status" | "createdAt" | "updatedAt" | "donorId">
): Promise<Donation | null> => {
  // Ensure all required fields are provided
  if (!donationData.foodItem || !donationData.quantity || !donationData.unit || !donationData.expiryDate || !donationData.address) {
    throw new Error("Missing required fields for donation");
  }

  try {
    const user = supabase.auth.getUser();
    const donorId = (await user).data.user?.id;

    if (!donorId) {
      throw new Error("User not authenticated");
    }

    const currentDate = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('donations')
      .insert({
        food_item: donationData.foodItem,
        quantity: donationData.quantity,
        unit: donationData.unit,
        expiry_date: donationData.expiryDate,
        address: donationData.address,
        status: "pending",
        donor_id: donorId,
        notes: donationData.notes || null,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return mapDonationFromDB(data);
  } catch (error: any) {
    console.error("Error creating donation:", error.message);
    toast.error("Failed to create donation");
    return null;
  }
};

// Get all donations
export const getDonations = async (filters?: Partial<Donation>): Promise<Donation[]> => {
  try {
    let query = supabase.from('donations').select('*');
    
    if (filters) {
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.donorId) {
        query = query.eq('donor_id', filters.donorId);
      }
      if (filters.ngoId) {
        query = query.eq('ngo_id', filters.ngoId);
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(mapDonationFromDB);
  } catch (error: any) {
    console.error("Error fetching donations:", error.message);
    toast.error("Failed to fetch donations");
    return [];
  }
};

// Update a donation's status
export const updateDonationStatus = async (
  donationId: string,
  newStatus: DonationStatus,
  ngoId?: string
): Promise<Donation | null> => {
  try {
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    if (ngoId) {
      updateData.ngo_id = ngoId;
    }
    
    const { data, error } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', donationId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return mapDonationFromDB(data);
  } catch (error: any) {
    console.error("Error updating donation status:", error.message);
    toast.error("Failed to update donation status");
    return null;
  }
};

// Get donations by donor ID
export const getDonationsByDonorId = async (donorId: string): Promise<Donation[]> => {
  return getDonations({ donorId });
};

// Get donations by NGO ID
export const getDonationsByNgoId = async (ngoId: string): Promise<Donation[]> => {
  return getDonations({ ngoId });
};

// Get available donations (pending donations without an NGO assigned)
export const getAvailableDonations = async (): Promise<Donation[]> => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'pending')
      .is('ngo_id', null)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data.map(mapDonationFromDB);
  } catch (error: any) {
    console.error("Error fetching available donations:", error.message);
    toast.error("Failed to fetch available donations");
    return [];
  }
};

// Get donation statistics
export const getDonationStats = async () => {
  try {
    const { data: allDonations, error: allError } = await supabase
      .from('donations')
      .select('status');
      
    if (allError) {
      throw allError;
    }
    
    return {
      total: allDonations.length,
      pending: allDonations.filter(d => d.status === "pending").length,
      accepted: allDonations.filter(d => d.status === "accepted").length,
      collected: allDonations.filter(d => d.status === "collected").length,
    };
  } catch (error: any) {
    console.error("Error fetching donation stats:", error.message);
    toast.error("Failed to fetch donation statistics");
    return {
      total: 0,
      pending: 0,
      accepted: 0,
      collected: 0,
    };
  }
};

// Helper function to map database columns to our Donation type
const mapDonationFromDB = (data: any): Donation => {
  return {
    id: data.id,
    foodItem: data.food_item,
    quantity: data.quantity,
    unit: data.unit,
    expiryDate: data.expiry_date,
    address: data.address,
    status: data.status as DonationStatus,
    donorId: data.donor_id,
    ngoId: data.ngo_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    notes: data.notes
  };
};
