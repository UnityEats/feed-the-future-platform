
export type UserRole = 'donor' | 'ngo' | 'admin';

export type DonationStatus = 'pending' | 'accepted' | 'collected' | 'expired';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  bio?: string;
  password?: string; // Added password field for registration
  website?: string; // Added website field for NGO users
}

export interface Donation {
  id: string;
  foodItem: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  address: string;
  status: DonationStatus;
  donorId: string;
  ngoId?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string; // Added notes field for additional information
}

export interface NGO extends User {
  verificationStatus: 'pending' | 'verified' | 'rejected';
  coverImage?: string;
  website?: string;
  serviceAreas?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface Stat {
  id: string;
  title: string;
  value: string | number;
  icon?: string;
}
