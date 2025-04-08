
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property } from "@/data/mockData";
import PropertyCard from "./PropertyCard";
import { PlusCircle, Search } from "lucide-react";

interface PropertyListProps {
  properties: Property[];
}

const PropertyList = ({ properties }: PropertyListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter properties based on search term
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort properties based on selected option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "city":
        return a.city.localeCompare(b.city);
      case "units":
        return b.units - a.units;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="city">City (A-Z)</SelectItem>
              <SelectItem value="units">Units (High-Low)</SelectItem>
            </SelectContent>
          </Select>
          <Button className="whitespace-nowrap">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      {sortedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-medium mb-2">No properties found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? "Try adjusting your search terms or filters" 
              : "You haven't added any properties yet"}
          </p>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Property
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
