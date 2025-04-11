
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
import { getDonationsByNgoId, getAvailableDonations, updateDonationStatus } from "@/lib/donationService";
import { toast } from "sonner";

const NGODashboard = () => {
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchDonations = async () => {
      if (currentUser) {
        try {
          // Fetch donations accepted by the current NGO
          const ngoDonations = await getDonationsByNgoId(currentUser.id);
          setMyDonations(ngoDonations);
          
          // Fetch available donations
          const available = await getAvailableDonations();
          setAvailableDonations(available);
        } catch (error) {
          console.error("Error fetching donations:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchDonations();
  }, [currentUser]);

  const acceptedDonations = myDonations.filter((d) => d.status === "accepted");
  const collectedDonations = myDonations.filter((d) => d.status === "collected");

  const handleAcceptDonation = async (donationId: string) => {
    if (currentUser) {
      try {
        const updated = await updateDonationStatus(donationId, "accepted", currentUser.id);
        
        if (updated) {
          toast.success("Donation accepted successfully");
          
          // Update the state to reflect the changes
          setAvailableDonations(prev => prev.filter(d => d.id !== donationId));
          setMyDonations(prev => [...prev, updated]);
        } else {
          toast.error("Failed to accept donation");
        }
      } catch (error) {
        console.error("Error accepting donation:", error);
        toast.error("Failed to accept donation");
      }
    }
  };

  const handleMarkCollected = async (donationId: string) => {
    try {
      const updated = await updateDonationStatus(donationId, "collected");
      
      if (updated) {
        toast.success("Donation marked as collected");
        
        // Update the state to reflect the changes
        setMyDonations(prev => 
          prev.map(d => d.id === donationId ? { ...d, status: "collected" } : d)
        );
      } else {
        toast.error("Failed to update donation status");
      }
    } catch (error) {
      console.error("Error marking donation as collected:", error);
      toast.error("Failed to update donation status");
    }
  };

  const renderDonationList = (donationList: Donation[], isAvailable = false) => {
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
            <div className={`h-2 ${isAvailable ? "bg-warning" : "bg-primary"}`}></div>
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
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm truncate max-w-[150px]" title={donation.address}>
                    {donation.address}
                  </span>
                </div>
                {!isAvailable && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge
                      className={
                        donation.status === "accepted"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                      variant="outline"
                    >
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {isAvailable ? (
                <Button 
                  onClick={() => handleAcceptDonation(donation.id)} 
                  className="w-full"
                >
                  Accept Donation
                </Button>
              ) : donation.status === "accepted" ? (
                <Button 
                  onClick={() => handleMarkCollected(donation.id)} 
                  className="w-full"
                >
                  Mark as Collected
                </Button>
              ) : (
                <Button variant="outline" asChild className="w-full">
                  <Link to={`/donations/${donation.id}`}>View Details</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{availableDonations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{acceptedDonations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{collectedDonations.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Tabs */}
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="collected">Collected</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <h3 className="text-xl font-semibold">Available Donations</h3>
          {renderDonationList(availableDonations, true)}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          <h3 className="text-xl font-semibold">Accepted Donations</h3>
          {renderDonationList(acceptedDonations)}
        </TabsContent>

        <TabsContent value="collected" className="space-y-4">
          <h3 className="text-xl font-semibold">Collected Donations</h3>
          {renderDonationList(collectedDonations)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NGODashboard;
