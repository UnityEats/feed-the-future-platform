
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NGO } from "@/types";
import { getVerifiedNGOs, searchNGOs } from "@/lib/ngoService";
import { Search, MapPin, Globe, Phone } from "lucide-react";

const NGODirectory = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch verified NGOs
    const fetchNGOs = () => {
      const verifiedNGOs = getVerifiedNGOs();
      setNgos(verifiedNGOs);
      setIsLoading(false);
    };

    fetchNGOs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = searchNGOs(searchQuery);
    setNgos(results);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">NGO Directory</h1>
        <p className="text-gray-600 mb-8">
          Find and connect with verified non-profit organizations in your area that are working to reduce food waste and fight hunger.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : ngos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No NGOs found matching your search criteria</p>
          <Button variant="link" onClick={() => setNgos(getVerifiedNGOs())}>
            View all NGOs
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((ngo) => (
            <Card key={ngo.id} className="overflow-hidden">
              {/* NGO Card Header with Cover Image */}
              <div className="h-32 bg-gray-200 relative">
                {ngo.coverImage ? (
                  <img
                    src={ngo.coverImage}
                    alt={ngo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {ngo.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="px-6 pt-6 pb-2 flex items-start">
                <div className="mr-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-100 -mt-12 overflow-hidden flex items-center justify-center">
                    {ngo.avatar ? (
                      <img
                        src={ngo.avatar}
                        alt={ngo.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {ngo.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <CardTitle>{ngo.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 hover:bg-green-50">
                    Verified
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6 pt-3">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ngo.bio}</p>
                
                <div className="space-y-2">
                  {ngo.address && (
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <span className="text-gray-700">{ngo.address}</span>
                    </div>
                  )}
                  
                  {ngo.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-700">{ngo.phone}</span>
                    </div>
                  )}
                  
                  {ngo.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <a 
                        href={ngo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
                
                {ngo.serviceAreas && ngo.serviceAreas.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Service Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {ngo.serviceAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Contact NGO
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NGODirectory;
