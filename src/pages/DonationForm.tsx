
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createDonation } from "@/lib/donationService";
import { requireAuth } from "@/lib/authService";
import { ArrowLeft } from "lucide-react";

// Form validation schema
const donationSchema = z.object({
  foodItem: z.string().min(3, "Food item is required and must be at least 3 characters"),
  quantity: z.coerce.number().positive("Quantity must be a positive number"),
  unit: z.string().min(1, "Unit is required"),
  expiryDate: z.string().refine(date => {
    const today = new Date();
    const expiryDate = new Date(date);
    return expiryDate >= today;
  }, { message: "Expiry date must be in the future" }),
  address: z.string().min(5, "Address is required and must be at least 5 characters"),
  notes: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

const DonationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      foodItem: "",
      quantity: 1,
      unit: "kg",
      expiryDate: "",
      address: "",
      notes: ""
    },
  });

  const onSubmit = async (data: DonationFormValues) => {
    setIsLoading(true);
    
    try {
      requireAuth(() => {
        // Create a new donation
        setTimeout(() => {
          try {
            const newDonation = createDonation({
              ...data,
              expiryDate: data.expiryDate,
            });
            
            toast.success("Donation created successfully!");
            reset();
            navigate("/dashboard");
          } catch (error) {
            toast.error("Failed to create donation. Please try again.");
          } finally {
            setIsLoading(false);
          }
        }, 1000);
      });
    } catch (error) {
      // requireAuth will handle the error
      setIsLoading(false);
    }
  };

  // Set minimum date to today for the date input
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 flex items-center"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Donate Food</CardTitle>
          <CardDescription>
            Fill in the details below to list your food donation.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="foodItem">Food Item</Label>
              <Input
                id="foodItem"
                placeholder="E.g., Fresh Vegetables, Canned Goods"
                {...register("foodItem")}
              />
              {errors.foodItem && (
                <p className="text-sm text-red-500">{errors.foodItem.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  {...register("quantity")}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="kg, pcs, liters"
                  {...register("unit")}
                />
                {errors.unit && (
                  <p className="text-sm text-red-500">{errors.unit.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                min={today}
                {...register("expiryDate")}
              />
              {errors.expiryDate && (
                <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address</Label>
              <Textarea
                id="address"
                placeholder="Enter the full address for pickup"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or details about the food"
                {...register("notes")}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Donation..." : "Submit Donation"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default DonationForm;
