
import React from 'react';
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="py-8 px-4">
        <Link to="/" className="flex items-center gap-2 max-w-md mx-auto">
          <Building className="h-6 w-6 text-rentOasis-primary" />
          <span className="text-lg font-bold text-rentOasis-primary font-heading">RentOasis</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full">
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
