
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import PropertyList from '@/components/properties/PropertyList';
import { getPropertiesByLandlord } from '@/data/mockData';

const Properties = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (!isLoading && user && user.role !== 'landlord') {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rentOasis-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'landlord') return null;

  const landlordProperties = getPropertiesByLandlord(user.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Properties</h1>
        <PropertyList properties={landlordProperties} />
      </main>
    </div>
  );
};

export default Properties;
