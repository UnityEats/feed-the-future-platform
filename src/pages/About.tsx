
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">About Feed the Future</h1>
          <p className="text-xl text-gray-600 mb-8">
            We're on a mission to reduce food waste and combat hunger by connecting food donors with organizations that help those in need.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 bg-gray-50 rounded-lg mb-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <p className="text-gray-700 mb-4">
                Feed the Future is dedicated to creating a world where no food goes to waste and no one goes hungry. We believe that by connecting those with excess food to those who need it most, we can make a significant impact on both food waste and food insecurity.
              </p>
              <p className="text-gray-700">
                Our platform makes it easy for individuals, restaurants, grocery stores, and other food providers to donate their surplus food to verified non-profit organizations who distribute it to people facing food insecurity.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Volunteers sorting food donations" 
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 mb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Register</h3>
                <p className="text-gray-600">
                  Create an account as a donor or an NGO to get started on our platform.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600">
                  Donors list available food items, and NGOs browse and accept donations they can use.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Distribute</h3>
                <p className="text-gray-600">
                  NGOs collect the food and distribute it to those who need it most in their communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 bg-gray-50 rounded-lg mb-12">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">2,450+</p>
              <p className="text-gray-700">Food Donations</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">12,500+</p>
              <p className="text-gray-700">Meals Provided</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">15+</p>
              <p className="text-gray-700">Tons of Food Waste Reduced</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 mb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <p className="text-center text-gray-600 mb-8">
            Feed the Future was founded by a dedicated team passionate about reducing food waste and fighting hunger.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Jane Smith",
                role: "Co-Founder & CEO",
                bio: "Jane has over 10 years experience in nonprofit management and food security initiatives.",
                avatar: "https://i.pravatar.cc/300?img=5"
              },
              {
                name: "Michael Johnson",
                role: "Co-Founder & CTO",
                bio: "Michael brings 15 years of tech expertise to create our user-friendly platform.",
                avatar: "https://i.pravatar.cc/300?img=8"
              },
              {
                name: "Sarah Lee",
                role: "Community Director",
                bio: "Sarah oversees NGO partnerships and ensures smooth operations between donors and receivers.",
                avatar: "https://i.pravatar.cc/300?img=9"
              }
            ].map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-primary text-white rounded-lg text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8">
            Be part of the solution to reduce food waste and combat hunger in your community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/register">Join as Donor</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
              <Link to="/register?tab=ngo">Register NGO</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
