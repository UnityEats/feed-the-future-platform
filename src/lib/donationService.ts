
import { Donation, DonationStatus } from "@/types";
import { mockDonations } from "./mockData";
import { getCurrentUser } from "./authService";

// Store donations in localStorage
const DONATIONS_KEY = "feed_the_future_donations";

// Initialize donation data in localStorage if it doesn't exist
const initializeDonationData = () => {
  if (!localStorage.getItem(DONATIONS_KEY)) {
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(mockDonations));
  }
};

// Get all donations
export const getAllDonations = (): Donation[] => {
  initializeDonationData();
  return JSON.parse(localStorage.getItem(DONATIONS_KEY) || "[]");
};

// Get donation by ID
export const getDonationById = (id: string): Donation | undefined => {
  const donations = getAllDonations();
  return donations.find(donation => donation.id === id);
};

// Get donations by donor ID
export const getDonationsByDonorId = (donorId: string): Donation[] => {
  const donations = getAllDonations();
  return donations.filter(donation => donation.donorId === donorId);
};

// Get donations by NGO ID
export const getDonationsByNgoId = (ngoId: string): Donation[] => {
  const donations = getAllDonations();
  return donations.filter(donation => donation.ngoId === ngoId);
};

// Get available donations for NGOs
export const getAvailableDonations = (): Donation[] => {
  const donations = getAllDonations();
  return donations.filter(donation => donation.status === "pending");
};

// Create a new donation
export const createDonation = (donation: Omit<Donation, "id" | "status" | "createdAt" | "updatedAt" | "donorId">): Donation => {
  const donations = getAllDonations();
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error("User must be logged in to create a donation");
  }
  
  const newDonation: Donation = {
    ...donation,
    id: `donation${Date.now()}`,
    status: "pending",
    donorId: currentUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  donations.push(newDonation);
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  
  return newDonation;
};

// Update donation status
export const updateDonationStatus = (donationId: string, status: DonationStatus, ngoId?: string): Donation | null => {
  const donations = getAllDonations();
  const index = donations.findIndex(d => d.id === donationId);
  
  if (index === -1) {
    return null;
  }
  
  const updated: Donation = {
    ...donations[index],
    status,
    ngoId: ngoId || donations[index].ngoId,
    updatedAt: new Date().toISOString()
  };
  
  donations[index] = updated;
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  
  return updated;
};

// Get donation statistics
export const getDonationStats = () => {
  const donations = getAllDonations();
  
  return {
    total: donations.length,
    pending: donations.filter(d => d.status === "pending").length,
    accepted: donations.filter(d => d.status === "accepted").length,
    collected: donations.filter(d => d.status === "collected").length,
    expired: donations.filter(d => d.status === "expired").length,
  };
};
