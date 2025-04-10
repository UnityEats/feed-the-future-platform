
import { NGO } from "@/types";
import { mockNGOs } from "./mockData";

// Store NGOs in localStorage
const NGOS_KEY = "feed_the_future_ngos";

// Initialize NGO data in localStorage if it doesn't exist
const initializeNGOData = () => {
  if (!localStorage.getItem(NGOS_KEY)) {
    localStorage.setItem(NGOS_KEY, JSON.stringify(mockNGOs));
  }
};

// Get all NGOs
export const getAllNGOs = (): NGO[] => {
  initializeNGOData();
  return JSON.parse(localStorage.getItem(NGOS_KEY) || "[]");
};

// Get verified NGOs
export const getVerifiedNGOs = (): NGO[] => {
  const ngos = getAllNGOs();
  return ngos.filter(ngo => ngo.verificationStatus === "verified");
};

// Get NGO by ID
export const getNGOById = (id: string): NGO | undefined => {
  const ngos = getAllNGOs();
  return ngos.find(ngo => ngo.id === id);
};

// Search NGOs by name or location
export const searchNGOs = (query: string): NGO[] => {
  if (!query.trim()) return getVerifiedNGOs();
  
  const ngos = getVerifiedNGOs();
  const lowercaseQuery = query.toLowerCase();
  
  return ngos.filter(ngo => 
    ngo.name.toLowerCase().includes(lowercaseQuery) || 
    ngo.address?.toLowerCase().includes(lowercaseQuery) ||
    ngo.serviceAreas?.some(area => area.toLowerCase().includes(lowercaseQuery))
  );
};
