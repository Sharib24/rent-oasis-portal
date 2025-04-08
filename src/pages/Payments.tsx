
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import PaymentForm from '@/components/payments/PaymentForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { getRentPaymentsByTenant, RentPayment } from '@/data/mockData';

const Payments = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pendingPayments, setPendingPayments] = useState<RentPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<RentPayment | undefined>(undefined);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (!isLoading && user && user.role === 'tenant') {
      const tenantPayments = getRentPaymentsByTenant(user.id);
      const pending = tenantPayments.filter(p => p.status === 'pending' || p.status === 'overdue');
      setPendingPayments(pending);
    }
  }, [user, isLoading, navigate]);

  const handlePayNow = (payment: RentPayment) => {
    setSelectedPayment(payment);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    // In a real app, this would refresh the payment data
    setTimeout(() => {
      setShowPaymentForm(false);
      setSelectedPayment(undefined);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rentOasis-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  // For landlords, show payment processing options
  if (user.role === 'landlord') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Payment Management</h1>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Payment Overview</TabsTrigger>
              <TabsTrigger value="settings">Payment Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Accepted Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Credit/Debit Cards</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bank Transfers</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cash</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Manage Payment Methods</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Processing</CardTitle>
                    <CardDescription>Your payment processing status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <Badge className="bg-green-500">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Processing Fee</span>
                      <span>2.9% + $0.30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Deposit Schedule</span>
                      <span>2-3 Business Days</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Payment Account</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Total Processed</span>
                      <span className="font-bold">$5,400.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Number of Transactions</span>
                      <span>7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Processing Fees</span>
                      <span>$164.70</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Transaction History</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>Configure your payment processing options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Late Fee Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure how late fees are calculated and applied to overdue payments.
                    </p>
                    <Button variant="outline" size="sm">Configure Late Fees</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Payment Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up automated payment reminders and notifications for tenants.
                    </p>
                    <Button variant="outline" size="sm">Configure Notifications</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage which payment methods you accept from your tenants.
                    </p>
                    <Button variant="outline" size="sm">Manage Payment Methods</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Bank Account Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Update where your rental payments are deposited.
                    </p>
                    <Button variant="outline" size="sm">Update Bank Information</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  // For tenants, show payment form
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Make a Payment</h1>
        
        {showPaymentForm ? (
          <PaymentForm rentPayment={selectedPayment} onSuccess={handlePaymentSuccess} />
        ) : (
          <>
            {pendingPayments.length > 0 ? (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Payments</CardTitle>
                    <CardDescription>
                      You have {pendingPayments.length} payment{pendingPayments.length > 1 ? 's' : ''} due
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingPayments.map(payment => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">
                              Rent Payment - {new Date(payment.dueDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payment.status === 'overdue' ? 'Overdue' : 'Due soon'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-bold">${payment.amount.toLocaleString()}</p>
                            <Button 
                              onClick={() => handlePayNow(payment)}
                              variant={payment.status === 'overdue' ? 'default' : 'outline'}
                            >
                              Pay Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>View your recent payment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Your payment history will appear here</p>
                      <Button variant="outline" className="mt-4">View All Transactions</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Payments Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-6">
                    You have no pending payments at this time. Your next payment will appear here when it's due.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/rent-tracking')}>
                    View Payment History
                  </Button>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Payments;
