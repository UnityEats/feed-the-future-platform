
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Donation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchUserProfile } from "@/lib/authService";
import { User } from "@/types";

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-blue-100 text-blue-800';
    case 'collected':
      return 'bg-green-100 text-green-800';
    case 'expired':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DonationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [donor, setDonor] = useState<User | null>(null);
  const [ngo, setNgo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!id) {
        setError("No donation ID provided");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the donation
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          setError("Donation not found");
          setIsLoading(false);
          return;
        }

        // Map the donation data to our Donation type
        const donationData: Donation = {
          id: data.id,
          foodItem: data.food_item,
          quantity: data.quantity,
          unit: data.unit,
          expiryDate: data.expiry_date,
          address: data.address,
          status: data.status,
          donorId: data.donor_id,
          ngoId: data.ngo_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          notes: data.notes
        };

        setDonation(donationData);

        // Fetch the donor info
        if (donationData.donorId) {
          const donorData = await fetchUserProfile(donationData.donorId);
          setDonor(donorData);
        }

        // Fetch the NGO info if assigned
        if (donationData.ngoId) {
          const ngoData = await fetchUserProfile(donationData.ngoId);
          setNgo(ngoData);
        }

      } catch (e: any) {
        console.error("Error fetching donation details:", e);
        setError(e.message || "Failed to load donation details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonationDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading donation details...</span>
        </div>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Failed to load donation details"}</p>
            <Button className="mt-4" onClick={() => navigate("/donations")}>
              View All Donations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="overflow-hidden">
        <div className={`h-2 bg-primary`}></div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{donation.foodItem}</CardTitle>
              <p className="text-sm text-gray-500">
                Added on {new Date(donation.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline" className={getStatusBadgeColor(donation.status)}>
              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Donation Information</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm font-medium text-gray-500">Quantity:</div>
                  <div>{donation.quantity} {donation.unit}</div>
                  
                  <div className="text-sm font-medium text-gray-500">Expiry Date:</div>
                  <div>{new Date(donation.expiryDate).toLocaleDateString()}</div>
                  
                  <div className="text-sm font-medium text-gray-500">Last Updated:</div>
                  <div>{new Date(donation.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Pickup Address</h3>
                <p className="mt-1">{donation.address}</p>
              </div>
              
              {donation.notes && (
                <div>
                  <h3 className="font-medium text-gray-700">Additional Notes</h3>
                  <p className="mt-1">{donation.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Donor Information</h3>
                {donor ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm font-medium text-gray-500">Name:</div>
                    <div>{donor.name}</div>
                    
                    <div className="text-sm font-medium text-gray-500">Email:</div>
                    <div>{donor.email}</div>
                    
                    {donor.phone && (
                      <>
                        <div className="text-sm font-medium text-gray-500">Phone:</div>
                        <div>{donor.phone}</div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-1">Donor information not available</p>
                )}
              </div>

              {ngo && (
                <div>
                  <h3 className="font-medium text-gray-700">NGO Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm font-medium text-gray-500">Name:</div>
                    <div>{ngo.name}</div>
                    
                    <div className="text-sm font-medium text-gray-500">Email:</div>
                    <div>{ngo.email}</div>
                    
                    {ngo.phone && (
                      <>
                        <div className="text-sm font-medium text-gray-500">Phone:</div>
                        <div>{ngo.phone}</div>
                      </>
                    )}
                    
                    {ngo.website && (
                      <>
                        <div className="text-sm font-medium text-gray-500">Website:</div>
                        <div>
                          <a 
                            href={ngo.website.startsWith('http') ? ngo.website : `https://${ngo.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {ngo.website}
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationDetails;
