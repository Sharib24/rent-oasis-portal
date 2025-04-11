
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const propertyTypes = [
  "Apartment",
  "House",
  "Townhouse",
  "Condo",
  "Duplex",
  "Studio",
  "Other",
];

const AddPropertyForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    rentAmount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    // Convert numeric strings to numbers
    const numericFields = {
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      squareFeet: parseInt(formData.squareFeet),
      rentAmount: parseFloat(formData.rentAmount),
    };

    try {
      const { data, error } = await supabase.from("properties").insert([
        {
          owner_id: user.id,
          title: formData.title,
          description: formData.description,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          property_type: formData.propertyType,
          bedrooms: numericFields.bedrooms,
          bathrooms: numericFields.bathrooms,
          square_feet: numericFields.squareFeet,
          rent_amount: numericFields.rentAmount,
          is_available: true,
        },
      ]).select();

      if (error) throw error;

      toast({
        title: "Property added successfully",
        description: "Your property has been added to your listings.",
      });
      navigate("/properties");
    } catch (error: any) {
      toast({
        title: "Error adding property",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-rentOasis-primary" />
          <CardTitle>Add New Property</CardTitle>
        </div>
        <CardDescription>
          List a new property for rent on RentOasis
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Modern Downtown Apartment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property with details about amenities, features, etc."
              className="min-h-32"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="San Francisco"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="CA"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="94105"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) =>
                  handleSelectChange("propertyType", value)
                }
              >
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                step="1"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="1.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="squareFeet">Square Feet</Label>
              <Input
                id="squareFeet"
                name="squareFeet"
                type="number"
                min="0"
                step="1"
                value={formData.squareFeet}
                onChange={handleChange}
                placeholder="1000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rentAmount">Monthly Rent ($)</Label>
              <Input
                id="rentAmount"
                name="rentAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.rentAmount}
                onChange={handleChange}
                placeholder="1500.00"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/properties")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Property...
              </>
            ) : (
              "Add Property"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddPropertyForm;
