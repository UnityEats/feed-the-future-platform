
import { Link } from "react-router-dom";
import { ArrowRight, Apple, Package, HeartHandshake, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockDonations, mockTestimonials, mockStats } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { getDonations } from "@/lib/donationService";
import { Donation } from "@/types";

const Home = () => {
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      setIsLoading(true);
      try {
        const allDonations = await getDonations();
        // Get the most recent 3 donations
        const recent = allDonations.slice(0, 3);
        setRecentDonations(recent);
      } catch (error) {
        console.error("Error fetching recent donations:", error);
        // Fallback to mock data if API fails
        const recent = [...mockDonations].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 3);
        setRecentDonations(recent);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentDonations();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="container mx-auto px-6 py-24 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Reducing Food Waste, Fighting Hunger Together
              </h1>
              <p className="text-lg mb-8 max-w-md">
                Connect with local NGOs to donate excess food and make a difference in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
                  <Link to="/donate">Donate Food</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/ngos">Find NGOs</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd59a0c3a4c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Food donation"
                  className="rounded-lg shadow-xl animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockStats.map((stat) => (
              <Card key={stat.id} className="text-center py-6 shadow-sm hover:shadow-md transition-shadow card-hover">
                <CardContent>
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <h3 className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our platform makes it easy to connect food donors with NGOs, reducing waste and fighting hunger in just a few simple steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-success-light/20 rounded-full p-4 inline-flex mb-4">
                <Package className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Donate Excess Food</h3>
              <p className="text-gray-600">
                List your surplus food items through our simple donation form.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-warning-light/20 rounded-full p-4 inline-flex mb-4">
                <HeartHandshake className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-4">NGO Matches</h3>
              <p className="text-gray-600">
                NGOs in your area are notified and can accept your donation.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-success-light/20 rounded-full p-4 inline-flex mb-4">
                <Award className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Make a Difference</h3>
              <p className="text-gray-600">
                Your donation reaches those in need, reducing waste and hunger.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button asChild>
              <Link to="/about" className="inline-flex items-center">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Donations Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Donations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentDonations.map((donation) => (
              <Card key={donation.id} className="overflow-hidden card-hover">
                <div className="bg-primary h-2"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{donation.foodItem}</h3>
                    <span className="text-sm bg-gray-100 rounded-full px-3 py-1">
                      {donation.quantity} {donation.unit}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Expires:</span> {new Date(donation.expiryDate).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      donation.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : donation.status === "accepted"
                        ? "bg-blue-100 text-blue-800"
                        : donation.status === "collected"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/donations" className="inline-flex items-center">
                View All Donations <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">What People Say</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Hear from donors and NGOs who have used our platform to make a difference in their communities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 card-hover">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <img
                        src={testimonial.avatar || "https://via.placeholder.com/100"}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hero-gradient text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join our community of donors and NGOs working together to reduce food waste and fight hunger.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
              <Link to="/register">Register Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
