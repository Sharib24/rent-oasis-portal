
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  MapPin,
  Bed,
  Bath,
  SquareFoot,
  DollarSign,
  ArrowLeft,
  Loader2,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

interface Property {
  id: string;
  title: string;
  description: string;
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
  created_at: string;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          setProperty(data as Property);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!property || !user || property.owner_id !== user.id) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", property.id);

      if (error) throw error;

      toast({
        title: "Property deleted",
        description: "The property has been removed from your listings.",
      });
      navigate("/properties");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rentOasis-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Property not found</h2>
        <p className="mt-2 text-gray-500">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/properties")} className="mt-4">
          Back to Properties
        </Button>
      </div>
    );
  }

  const isOwner = user && property.owner_id === user.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center"
          onClick={() => navigate("/properties")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>

        {isOwner && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/properties/edit/${property.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the property and remove it from your listings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-rentOasis-primary" />
                <CardTitle className="text-2xl">{property.title}</CardTitle>
              </div>
              <CardDescription className="flex items-center mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}, {property.city}, {property.state}{" "}
                {property.zip_code}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-rentOasis-primary">
                ${property.rent_amount.toLocaleString()}/month
              </div>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  property.is_available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {property.is_available ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
            <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
              <div className="flex items-center text-gray-500 mb-1">
                <Home className="h-4 w-4 mr-1" />
                <span className="text-xs">Type</span>
              </div>
              <span className="font-medium">{property.property_type}</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
              <div className="flex items-center text-gray-500 mb-1">
                <Bed className="h-4 w-4 mr-1" />
                <span className="text-xs">Beds</span>
              </div>
              <span className="font-medium">{property.bedrooms}</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
              <div className="flex items-center text-gray-500 mb-1">
                <Bath className="h-4 w-4 mr-1" />
                <span className="text-xs">Baths</span>
              </div>
              <span className="font-medium">{property.bathrooms}</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-lg bg-gray-50">
              <div className="flex items-center text-gray-500 mb-1">
                <SquareFoot className="h-4 w-4 mr-1" />
                <span className="text-xs">Area</span>
              </div>
              <span className="font-medium">
                {property.square_feet} sq ft
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {property.description}
            </p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Listed on{" "}
                {new Date(property.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          {!isOwner && (
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <Button className="flex-1">
                <DollarSign className="mr-2 h-4 w-4" />
                Apply to Rent
              </Button>
              <Button variant="outline" className="flex-1">
                Contact Landlord
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PropertyDetails;
