import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  MapPin,
  Bed,
  Bath,
  DollarSign,
  Search,
  Loader2,
  Plus,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  rent_amount: number;
  is_available: boolean;
  owner_id: string;
}

const PropertyList = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<string | undefined>();

  const isLandlord = profile?.role === "landlord";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let query = supabase
          .from("properties")
          .select("*")
          .eq("is_available", true)
          .order("created_at", { ascending: false });

        // If user is a landlord, show only their properties
        if (isLandlord && user) {
          query = query.eq("owner_id", user.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        setProperties(data as Property[]);
      } catch (error: any) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user, isLandlord]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      searchTerm === "" ||
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.zip_code.includes(searchTerm);

    const matchesType =
      !propertyType || property.property_type === propertyType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rentOasis-primary" />
      </div>
    );
  }

  if (properties.length === 0 && isLandlord) {
    return (
      <div className="text-center py-12">
        <Home className="h-12 w-12 mx-auto text-gray-400" />
        <h2 className="text-2xl font-bold mt-4">No properties yet</h2>
        <p className="mt-2 text-gray-500">
          You haven't added any properties to your account.
        </p>
        <Button
          onClick={() => navigate("/properties/add")}
          className="mt-4 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Your First Property
        </Button>
      </div>
    );
  }

  if (filteredProperties.length === 0 && properties.length > 0) {
    return (
      <div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by address, city, or state..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Label htmlFor="propertyType" className="sr-only">
              Property Type
            </Label>
            <Select
              value={propertyType}
              onValueChange={setPropertyType}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Duplex">Duplex</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-center py-12">
          <h2 className="text-xl font-medium">No properties found</h2>
          <p className="mt-2 text-gray-500">
            Try adjusting your search criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setPropertyType(undefined);
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by address, city, or state..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="propertyType" className="sr-only">
            Property Type
          </Label>
          <Select
            value={propertyType}
            onValueChange={setPropertyType}
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Duplex">Duplex</SelectItem>
              <SelectItem value="Studio">Studio</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Link to={`/properties/${property.id}`} key={property.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold line-clamp-1">
                  {property.title}
                </CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {property.address}, {property.city}, {property.state}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} baths</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    <span>{property.property_type}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between items-center">
                  <div className="font-bold text-lg text-rentOasis-primary">
                    ${property.rent_amount.toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span>
                  </div>
                  <Button size="sm" variant="secondary" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {isLandlord ? "Manage" : "View"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
