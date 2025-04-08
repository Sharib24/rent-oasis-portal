
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import RentTracker from '@/components/rent/RentTracker';
import { 
  getRentPaymentsByTenant, 
  getUnitsByTenant, 
  getPropertiesByLandlord, 
  getUnitsByProperty, 
  units, 
  rentPayments 
} from '@/data/mockData';

const RentTracking = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [userRentPayments, setUserRentPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (!isLoading && user) {
      // Get relevant rent payments based on user role
      if (user.role === 'tenant') {
        // For tenants, get their rent payments
        const tenantPayments = getRentPaymentsByTenant(user.id);
        setUserRentPayments(tenantPayments);
      } else if (user.role === 'landlord') {
        // For landlords, get all rent payments for all their properties/units
        const landlordProperties = getPropertiesByLandlord(user.id);
        let allUnits: string[] = [];
        
        landlordProperties.forEach(property => {
          const propertyUnits = getUnitsByProperty(property.id);
          allUnits = [...allUnits, ...propertyUnits.map(unit => unit.id)];
        });
        
        const landlordPayments = rentPayments.filter(payment => 
          allUnits.includes(payment.unitId)
        );
        
        setUserRentPayments(landlordPayments);
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rentOasis-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <RentTracker rentPayments={userRentPayments} />
      </main>
    </div>
  );
};

export default RentTracking;
