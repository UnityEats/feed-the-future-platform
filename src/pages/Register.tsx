
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { register as registerUser } from "@/lib/authService";
import { toast } from "sonner";
import { UserRole } from "@/types";

// Form validation schema for donor
const donorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Additional fields for NGO registration
const ngoSchema = donorSchema.extend({
  website: z.string().url("Please enter a valid URL").optional(),
  bio: z.string().min(20, "Please provide a description of at least 20 characters"),
});

type DonorFormValues = z.infer<typeof donorSchema>;
type NGOFormValues = z.infer<typeof ngoSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<UserRole>("donor");
  const navigate = useNavigate();

  // Donor form
  const donorForm = useForm<DonorFormValues>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  // NGO form
  const ngoForm = useForm<NGOFormValues>({
    resolver: zodResolver(ngoSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      website: "",
      bio: "",
    },
  });

  const onSubmitDonor = async (data: DonorFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real app, we'd make an API call here
      // For this demo, we'll use our mock auth service
      setTimeout(() => {
        const newUser = registerUser({
          ...data,
          role: "donor",
        });
        
        if (newUser) {
          toast.success("Registration successful! Welcome to Feed the Future!");
          navigate("/dashboard");
        } else {
          toast.error("Email already in use. Please try another.");
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const onSubmitNGO = async (data: NGOFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real app, we'd make an API call here and handle verification
      setTimeout(() => {
        const newUser = registerUser({
          ...data,
          role: "ngo",
        });
        
        if (newUser) {
          toast.success("NGO registration submitted! Your account is pending verification.");
          navigate("/dashboard");
        } else {
          toast.error("Email already in use. Please try another.");
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Choose your account type to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="donor" className="w-full" onValueChange={(value) => setActiveTab(value as UserRole)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="donor">Donor</TabsTrigger>
              <TabsTrigger value="ngo">NGO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="donor" className="mt-0">
              <form onSubmit={donorForm.handleSubmit(onSubmitDonor)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donor-name">Full Name</Label>
                  <Input
                    id="donor-name"
                    placeholder="John Doe"
                    {...donorForm.register("name")}
                  />
                  {donorForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{donorForm.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donor-email">Email</Label>
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="name@example.com"
                    {...donorForm.register("email")}
                  />
                  {donorForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{donorForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donor-password">Password</Label>
                  <Input
                    id="donor-password"
                    type="password"
                    {...donorForm.register("password")}
                  />
                  {donorForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{donorForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donor-phone">Phone (Optional)</Label>
                  <Input
                    id="donor-phone"
                    placeholder="(123) 456-7890"
                    {...donorForm.register("phone")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donor-address">Address (Optional)</Label>
                  <Input
                    id="donor-address"
                    placeholder="123 Main St, City, State"
                    {...donorForm.register("address")}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register as Donor"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="ngo" className="mt-0">
              <form onSubmit={ngoForm.handleSubmit(onSubmitNGO)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ngo-name">Organization Name</Label>
                  <Input
                    id="ngo-name"
                    placeholder="Food Rescue Organization"
                    {...ngoForm.register("name")}
                  />
                  {ngoForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{ngoForm.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-email">Email</Label>
                  <Input
                    id="ngo-email"
                    type="email"
                    placeholder="contact@organization.org"
                    {...ngoForm.register("email")}
                  />
                  {ngoForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{ngoForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-password">Password</Label>
                  <Input
                    id="ngo-password"
                    type="password"
                    {...ngoForm.register("password")}
                  />
                  {ngoForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{ngoForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-phone">Phone</Label>
                  <Input
                    id="ngo-phone"
                    placeholder="(123) 456-7890"
                    {...ngoForm.register("phone")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-address">Address</Label>
                  <Input
                    id="ngo-address"
                    placeholder="123 Main St, City, State"
                    {...ngoForm.register("address")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-website">Website (Optional)</Label>
                  <Input
                    id="ngo-website"
                    placeholder="https://www.example.org"
                    {...ngoForm.register("website")}
                  />
                  {ngoForm.formState.errors.website && (
                    <p className="text-sm text-red-500">{ngoForm.formState.errors.website.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-bio">Organization Description</Label>
                  <Textarea
                    id="ngo-bio"
                    placeholder="Tell us about your organization and the communities you serve..."
                    className="min-h-[100px]"
                    {...ngoForm.register("bio")}
                  />
                  {ngoForm.formState.errors.bio && (
                    <p className="text-sm text-red-500">{ngoForm.formState.errors.bio.message}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register as NGO"}
                </Button>
                <p className="text-xs text-gray-500">
                  *NGO accounts require verification before full access is granted.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <p className="text-center text-sm text-gray-600 w-full">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
