
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDonations } from "@/lib/donationService";
import { Donation } from "@/types";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadDonations = async () => {
    setIsLoading(true);
    try {
      const donationsData = await getDonations();
      setDonations(donationsData);
    } catch (error) {
      console.error("Error loading donations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
    
    // Set up real-time subscription for donation changes
    const channel = supabase
      .channel('donation-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'donations' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          loadDonations(); // Reload the entire list when any change occurs
        }
      )
      .subscribe();
      
    return () => {
      // Clean up subscription when component unmounts
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDonationClick = (donation: Donation) => {
    setSelectedDonation(donation);
    setDialogOpen(true);
  };

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="pl-0 mr-4" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">All Donations</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading donations...</span>
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No donations found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow 
                  key={donation.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleDonationClick(donation)}
                >
                  <TableCell className="font-medium">{donation.foodItem}</TableCell>
                  <TableCell>{donation.quantity} {donation.unit}</TableCell>
                  <TableCell>{new Date(donation.expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeColor(donation.status)}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(donation.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Donation Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Complete information about this donation
            </DialogDescription>
          </DialogHeader>
          {selectedDonation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Food Item</p>
                  <p className="text-base">{selectedDonation.foodItem}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantity</p>
                  <p className="text-base">{selectedDonation.quantity} {selectedDonation.unit}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant="outline" className={getStatusBadgeColor(selectedDonation.status)}>
                    {selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                  <p className="text-base">{new Date(selectedDonation.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Pickup Address</p>
                <p className="text-base">{selectedDonation.address}</p>
              </div>
              
              {selectedDonation.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Additional Notes</p>
                  <p className="text-base">{selectedDonation.notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-base">{new Date(selectedDonation.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-base">{new Date(selectedDonation.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Donations;
