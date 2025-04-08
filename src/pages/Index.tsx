
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Building, CreditCard, Calendar, Users, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="w-full py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building className="h-8 w-8 text-rentOasis-primary" />
            <span className="text-xl font-bold text-rentOasis-primary font-heading">RentOasis</span>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <Link to="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Link to="/login">
              <Button>Log In</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="gradient-bg py-16 md:py-24 px-4 text-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight">
                Simplify Property Management and Rent Collection
              </h1>
              <p className="text-lg opacity-90">
                An all-in-one platform for landlords and tenants to manage properties, track rent payments, and streamline communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button className="bg-white text-rentOasis-primary hover:bg-gray-100 px-8 py-6 text-lg font-medium">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-medium">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" 
                alt="Property Management" 
                className="rounded-lg shadow-2xl w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              RentOasis simplifies property management with powerful features for both landlords and tenants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover border-t-4 border-t-rentOasis-primary">
              <CardContent className="pt-6">
                <Building className="h-12 w-12 text-rentOasis-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Property Management</h3>
                <p className="text-gray-600">
                  Easily manage all your properties, units, and tenants in one centralized dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-t-4 border-t-rentOasis-secondary">
              <CardContent className="pt-6">
                <CreditCard className="h-12 w-12 text-rentOasis-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Rent Collection</h3>
                <p className="text-gray-600">
                  Collect rent payments online with multiple payment options and automatic tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-t-4 border-t-rentOasis-primary">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 text-rentOasis-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Rent Tracking</h3>
                <p className="text-gray-600">
                  Keep track of rent payments, due dates, and payment history with detailed reports.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-t-4 border-t-rentOasis-secondary">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-rentOasis-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Tenant Management</h3>
                <p className="text-gray-600">
                  Store tenant information, lease agreements, and communications in one secure place.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-t-4 border-t-rentOasis-primary">
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-rentOasis-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Automated Reminders</h3>
                <p className="text-gray-600">
                  Send automatic rent reminders and notifications to tenants to reduce late payments.
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-t-4 border-t-rentOasis-secondary">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-rentOasis-accent rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-rentOasis-secondary">+</span>
                </div>
                <h3 className="text-xl font-bold mb-2">And Much More</h3>
                <p className="text-gray-600">
                  Maintenance requests, document storage, reporting tools, and other useful features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Ready to Simplify Your Rental Management?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of landlords and tenants who use RentOasis to make property management effortless.
            </p>
            <Link to="/signup">
              <Button className="px-8 py-6 text-lg font-medium">
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-8 w-8 text-white" />
                <span className="text-xl font-bold text-white font-heading">RentOasis</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Simplifying property management for landlords and tenants since 2025.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 text-center md:text-left text-gray-400">
            <p>&copy; 2025 RentOasis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
