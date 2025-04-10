
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser, hasRole, requireAuth } from "@/lib/authService";
import { getDonationsByDonorId, getDonationStats, getAvailableDonations } from "@/lib/donationService";
import DonorDashboard from "@/components/dashboard/DonorDashboard";
import NGODashboard from "@/components/dashboard/NGODashboard";
import { ChevronRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    requireAuth(() => {
      // This is just to ensure the user is authenticated
    });
  }, [navigate]);
  
  if (!currentUser) {
    return null; // requireAuth will redirect if not authenticated
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}</p>
        </div>
        
        {hasRole("donor") && (
          <Button onClick={() => navigate("/donate")}>
            Make Donation
          </Button>
        )}
      </div>
      
      {hasRole("donor") && <DonorDashboard />}
      {hasRole("ngo") && <NGODashboard />}
    </div>
  );
};

export default Dashboard;
