
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/authService";
import { Donation } from "@/types";
import { getDonationsByDonorId } from "@/lib/donationService";
import { Loader2 } from "lucide-react";

const DonorDashboard = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchDonations = async () => {
      if (currentUser) {
        try {
          // Fetch donations made by the current user
          const userDonations = await getDonationsByDonorId(currentUser.id);
          setDonations(userDonations);
        } catch (error) {
          console.error("Error fetching donations:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    fetchDonations();
  }, [currentUser]);

  const pendingDonations = donations.filter((d) => d.status === "pending");
  const acceptedDonations = donations.filter((d) => d.status === "accepted");
  const completedDonations = donations.filter((d) => d.status === "collected");

  const renderDonationList = (donationList: Donation[]) => {
    if (donationList.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No donations found</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {donationList.map((donation) => (
          <Card key={donation.id} className="overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <CardHeader className="pb-2">
              <CardTitle>{donation.foodItem}</CardTitle>
              <CardDescription>
                {new Date(donation.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Quantity:</span>
                  <span>
                    {donation.quantity} {donation.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expires:</span>
                  <span>{new Date(donation.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge
                    className={
                      donation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : donation.status === "accepted"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-green-100 text-green-800 hover:bg-green-100"
                    }
                    variant="outline"
                  >
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </Badge>
                </div>
                {donation.ngoId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">NGO:</span>
                    <span>Food For All</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to={`/donations/${donation.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading donations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{donations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingDonations.length + acceptedDonations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedDonations.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <h3 className="text-xl font-semibold">All Donations</h3>
          {renderDonationList(donations)}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <h3 className="text-xl font-semibold">Pending Donations</h3>
          {renderDonationList(pendingDonations)}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          <h3 className="text-xl font-semibold">Accepted Donations</h3>
          {renderDonationList(acceptedDonations)}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <h3 className="text-xl font-semibold">Completed Donations</h3>
          {renderDonationList(completedDonations)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonorDashboard;
