
import { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import PropertyList from "@/components/properties/PropertyList";
import AddPropertyForm from "@/components/properties/AddPropertyForm";
import PropertyDetails from "@/components/properties/PropertyDetails";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PropertiesPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isAddingProperty, setIsAddingProperty] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Properties</h1>
          {profile?.role === "landlord" && (
            <Button 
              onClick={() => navigate("/properties/add")} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Routes>
            <Route index element={<PropertyList />} />
            <Route path="/add" element={<AddPropertyForm />} />
            <Route path="/:id" element={<PropertyDetails />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default PropertiesPage;
