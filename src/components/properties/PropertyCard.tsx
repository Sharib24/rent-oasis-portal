
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property, getUnitsByProperty } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Home, MapPin } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  const units = getUnitsByProperty(property.id);
  const occupiedUnits = units.filter(unit => unit.isOccupied);
  const occupancyRate = units.length > 0 ? Math.round((occupiedUnits.length / units.length) * 100) : 0;

  return (
    <Card className="overflow-hidden card-hover h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={property.imageUrl} 
          alt={property.name} 
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/70 text-white">
          {occupancyRate}% Occupied
        </Badge>
      </div>
      <CardContent className="pt-4 pb-2 flex-1">
        <h3 className="text-xl font-bold mb-2">{property.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm truncate">
            {property.address}, {property.city}, {property.state} {property.zip}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Home className="h-4 w-4" />
          <span className="text-sm">{occupiedUnits.length} / {property.units} units occupied</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
