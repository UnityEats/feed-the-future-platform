
import { Donation, DonationStatus } from "@/types";
import { mockDonations } from "./mockData";

// Helper function to get a deterministic ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a new donation
export const createDonation = (
  donationData: Omit<Donation, "id" | "status" | "createdAt" | "updatedAt" | "donorId">
): Donation => {
  // Ensure all required fields are provided
  if (!donationData.foodItem || !donationData.quantity || !donationData.unit || !donationData.expiryDate || !donationData.address) {
    throw new Error("Missing required fields for donation");
  }

  const currentDate = new Date().toISOString();
  
  const newDonation: Donation = {
    id: generateId(),
    foodItem: donationData.foodItem,
    quantity: donationData.quantity,
    unit: donationData.unit,
    expiryDate: donationData.expiryDate,
    address: donationData.address,
    status: "pending" as DonationStatus,
    donorId: "current-user-id", // In a real app, this would be the logged-in user's ID
    createdAt: currentDate,
    updatedAt: currentDate
  };

  // In a real app, this would send the donation to a backend API
  // For now, we'll add it to our mock data
  mockDonations.push(newDonation);
  
  console.log("New donation created:", newDonation);
  return newDonation;
};

// Get all donations
export const getDonations = (filters?: Partial<Donation>): Donation[] => {
  // In a real app, this would fetch donations from a backend API with filters
  // For now, we'll filter our mock data
  if (!filters) return mockDonations;
  
  return mockDonations.filter(donation => {
    return Object.entries(filters).every(([key, value]) => {
      return donation[key as keyof Donation] === value;
    });
  });
};

// Update a donation's status
export const updateDonationStatus = (
  donationId: string,
  newStatus: DonationStatus,
  ngoId?: string
): Donation | null => {
  // In a real app, this would update the donation on the backend
  // For now, we'll update our mock data
  const donationIndex = mockDonations.findIndex(d => d.id === donationId);
  
  if (donationIndex === -1) return null;
  
  mockDonations[donationIndex] = {
    ...mockDonations[donationIndex],
    status: newStatus,
    updatedAt: new Date().toISOString(),
    ...(ngoId && { ngoId })
  };
  
  return mockDonations[donationIndex];
};

// Get donations by donor ID
export const getDonationsByDonorId = (donorId: string): Donation[] => {
  return getDonations({ donorId });
};

// Get donations by NGO ID
export const getDonationsByNgoId = (ngoId: string): Donation[] => {
  return getDonations({ ngoId });
};

// Get available donations (pending donations without an NGO assigned)
export const getAvailableDonations = (): Donation[] => {
  return mockDonations.filter(donation => 
    donation.status === "pending" && !donation.ngoId
  );
};

// Get donation statistics
export const getDonationStats = () => {
  return {
    total: mockDonations.length,
    pending: mockDonations.filter(d => d.status === "pending").length,
    accepted: mockDonations.filter(d => d.status === "accepted").length,
    collected: mockDonations.filter(d => d.status === "collected").length,
  };
};
