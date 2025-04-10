
import { User, Donation, NGO, Testimonial, Stat } from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "donor",
    phone: "123-456-7890",
    address: "123 Main St, Anytown",
    avatar: "https://i.pravatar.cc/150?u=john"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "donor",
    phone: "123-456-7891",
    address: "456 Oak St, Anytown",
    avatar: "https://i.pravatar.cc/150?u=jane"
  },
  {
    id: "ngo1",
    name: "Food For All",
    email: "info@foodforall.org",
    role: "ngo",
    phone: "123-456-7892",
    address: "789 Charity Ave, Helptown",
    avatar: "https://i.pravatar.cc/150?u=foodforall"
  },
  {
    id: "ngo2",
    name: "Hunger Heroes",
    email: "contact@hungerheroes.org",
    role: "ngo",
    phone: "123-456-7893",
    address: "101 Hope St, Goodcity",
    avatar: "https://i.pravatar.cc/150?u=hungerheroes"
  }
];

// Mock NGOs
export const mockNGOs: NGO[] = [
  {
    id: "ngo1",
    name: "Food For All",
    email: "info@foodforall.org",
    role: "ngo",
    phone: "123-456-7892",
    address: "789 Charity Ave, Helptown",
    avatar: "https://i.pravatar.cc/150?u=foodforall",
    verificationStatus: "verified",
    website: "https://www.foodforall.org",
    bio: "Food For All is dedicated to reducing food waste and ensuring everyone has access to nutritious meals. We collect excess food from restaurants, groceries, and individuals to distribute to those in need.",
    serviceAreas: ["Downtown", "Eastside", "North County"]
  },
  {
    id: "ngo2",
    name: "Hunger Heroes",
    email: "contact@hungerheroes.org",
    role: "ngo",
    phone: "123-456-7893",
    address: "101 Hope St, Goodcity",
    avatar: "https://i.pravatar.cc/150?u=hungerheroes",
    verificationStatus: "verified",
    website: "https://www.hungerheroes.org",
    bio: "Hunger Heroes focuses on collecting and distributing food donations to homeless shelters and community centers, ensuring that everyone has access to healthy, nourishing food.",
    serviceAreas: ["Westside", "South County", "Central District"]
  },
  {
    id: "ngo3",
    name: "Fresh Start Initiative",
    email: "help@freshstart.org",
    role: "ngo",
    phone: "123-456-7894",
    address: "202 Blessing Rd, Kindville",
    avatar: "https://i.pravatar.cc/150?u=freshstart",
    verificationStatus: "verified",
    website: "https://www.freshstart.org",
    bio: "Fresh Start Initiative works with local farmers and food producers to rescue surplus produce and deliver it to food banks and families in need.",
    serviceAreas: ["Rural Areas", "Urban Centers", "University District"]
  },
  {
    id: "ngo4",
    name: "Community Food Bank",
    email: "info@communityfoodbank.org",
    role: "ngo",
    phone: "123-456-7895",
    address: "303 Giving Ave, Helperville",
    avatar: "https://i.pravatar.cc/150?u=foodbank",
    verificationStatus: "verified",
    website: "https://www.communityfoodbank.org",
    bio: "For over 25 years, Community Food Bank has been collecting, storing, and distributing food to vulnerable populations throughout the city.",
    serviceAreas: ["All City Districts", "Suburban Areas"]
  }
];

// Mock Donations
export const mockDonations: Donation[] = [
  {
    id: "donation1",
    foodItem: "Fresh Vegetables",
    quantity: 10,
    unit: "kg",
    expiryDate: "2025-04-15",
    address: "123 Main St, Anytown",
    status: "pending",
    donorId: "user1",
    createdAt: "2025-04-08T10:30:00Z",
    updatedAt: "2025-04-08T10:30:00Z"
  },
  {
    id: "donation2",
    foodItem: "Canned Goods",
    quantity: 20,
    unit: "cans",
    expiryDate: "2025-07-20",
    address: "456 Oak St, Anytown",
    status: "accepted",
    donorId: "user2",
    ngoId: "ngo1",
    createdAt: "2025-04-07T14:45:00Z",
    updatedAt: "2025-04-07T16:30:00Z"
  },
  {
    id: "donation3",
    foodItem: "Bread and Pastries",
    quantity: 15,
    unit: "pcs",
    expiryDate: "2025-04-12",
    address: "123 Main St, Anytown",
    status: "collected",
    donorId: "user1",
    ngoId: "ngo2",
    createdAt: "2025-04-06T09:15:00Z",
    updatedAt: "2025-04-06T14:20:00Z"
  },
  {
    id: "donation4",
    foodItem: "Rice",
    quantity: 25,
    unit: "kg",
    expiryDate: "2025-09-30",
    address: "456 Oak St, Anytown",
    status: "pending",
    donorId: "user2",
    createdAt: "2025-04-09T11:00:00Z",
    updatedAt: "2025-04-09T11:00:00Z"
  },
  {
    id: "donation5",
    foodItem: "Dairy Products",
    quantity: 8,
    unit: "liters",
    expiryDate: "2025-04-14",
    address: "123 Main St, Anytown",
    status: "accepted",
    donorId: "user1",
    ngoId: "ngo1",
    createdAt: "2025-04-08T16:20:00Z",
    updatedAt: "2025-04-08T17:45:00Z"
  }
];

// Mock Testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: "testimonial1",
    name: "Maria Rodriguez",
    role: "Donor",
    content: "This platform made it so easy to donate surplus food from my restaurant. It's a win-win - we reduce waste and help those in need!",
    avatar: "https://i.pravatar.cc/150?u=maria"
  },
  {
    id: "testimonial2",
    name: "James Wilson",
    role: "NGO Director",
    content: "Feed the Future has transformed how we source food donations. The process is streamlined, and we can focus more on helping our community.",
    avatar: "https://i.pravatar.cc/150?u=james"
  },
  {
    id: "testimonial3",
    name: "Sarah Chen",
    role: "Volunteer",
    content: "As a volunteer, I've seen firsthand how this platform bridges the gap between food excess and scarcity. It's making a real difference.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  }
];

// Mock Stats
export const mockStats: Stat[] = [
  {
    id: "stat1",
    title: "Food Donations",
    value: "2,450",
    icon: "🍎"
  },
  {
    id: "stat2",
    title: "Meals Provided",
    value: "12,500",
    icon: "🍽️"
  },
  {
    id: "stat3",
    title: "Active NGOs",
    value: "78",
    icon: "🏢"
  },
  {
    id: "stat4",
    title: "Food Waste Reduced",
    value: "15 tons",
    icon: "♻️"
  }
];
