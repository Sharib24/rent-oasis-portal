
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, CreditCard, AlertCircle, Calendar, Clock, CheckCircle, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUnitsByTenant, getRentPaymentsByTenant, notifications, Notification, units, RentPayment } from "@/data/mockData";

const TenantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [tenantUnits, setTenantUnits] = useState<any[]>([]);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [nextPayment, setNextPayment] = useState<RentPayment | null>(null);

  useEffect(() => {
    if (user) {
      // Get tenant units
      const myUnits = getUnitsByTenant(user.id);
      setTenantUnits(myUnits);
      
      // Get rent payments
      const myRentPayments = getRentPaymentsByTenant(user.id);
      setRentPayments(myRentPayments);
      
      // Find next payment
      const pendingPayments = myRentPayments
        .filter(payment => payment.status === 'pending')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
      if (pendingPayments.length > 0) {
        setNextPayment(pendingPayments[0]);
      }
      
      // Get notifications
      const userNotifs = notifications
        .filter(notif => notif.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setUserNotifications(userNotifs);
    }
  }, [user]);

  const getDateDifferenceText = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Units</p>
                <h3 className="text-2xl font-bold">{tenantUnits.length}</h3>
              </div>
              <div className="p-2 bg-rentOasis-accent rounded-full">
                <Home className="h-5 w-5 text-rentOasis-primary" />
              </div>
            </div>
            <div className="mt-4">
              {tenantUnits.map(unit => {
                const property = units.find(u => u.id === unit.id)?.propertyId;
                return (
                  <div key={unit.id} className="border-b border-gray-100 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
                    <p className="font-medium">{property}</p>
                    <p className="text-sm text-muted-foreground">Unit {unit.unitNumber}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {nextPayment ? (
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next Rent Payment</p>
                  <h3 className="text-2xl font-bold">${nextPayment.amount.toLocaleString()}</h3>
                </div>
                <div className="p-2 bg-rentOasis-accent rounded-full">
                  <CreditCard className="h-5 w-5 text-rentOasis-primary" />
                </div>
              </div>
              
              <div className="flex items-center mt-4 gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Due on {new Date(nextPayment.dueDate).toLocaleDateString()}</span>
                <Badge variant={nextPayment.status === 'overdue' ? 'destructive' : 'outline'}>
                  {getDateDifferenceText(nextPayment.dueDate)}
                </Badge>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => navigate("/payments")} className="w-full">
                  Make Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-bold">No Payments Due</h3>
              <p className="text-muted-foreground mt-2">You're all caught up on your rent payments.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Recent Rent History</CardTitle>
            <CardDescription>Your payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rentPayments.length > 0 ? (
                rentPayments.slice(0, 4).map(payment => (
                  <div key={payment.id} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0">
                    <div className={`p-2 rounded-full ${
                      payment.status === 'paid' ? 'bg-green-100' : 
                      payment.status === 'pending' ? 'bg-blue-100' :
                      'bg-red-100'
                    }`}>
                      {payment.status === 'paid' ? <CheckCircle className="h-4 w-4 text-green-500" /> : 
                       payment.status === 'pending' ? <Clock className="h-4 w-4 text-blue-500" /> :
                       <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">
                          Rent Payment - {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                        <p className="font-medium">${payment.amount.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {payment.status === 'paid' ? `Paid on ${new Date(payment.paidDate!).toLocaleDateString()}` : 
                           payment.status === 'pending' ? getDateDifferenceText(payment.dueDate) :
                           'Overdue'}
                        </p>
                        <Badge variant={
                          payment.status === 'paid' ? 'outline' :
                          payment.status === 'pending' ? 'secondary' :
                          'destructive'
                        }>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm py-6">No payment history found</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/rent-tracking")}>
              View Complete History
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Documents & Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <FileText className="h-5 w-5 text-rentOasis-primary" />
                <div>
                  <p className="font-medium text-sm">Lease Agreement</p>
                  <p className="text-xs text-muted-foreground">Expires Apr 30, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <FileText className="h-5 w-5 text-rentOasis-primary" />
                <div>
                  <p className="font-medium text-sm">House Rules</p>
                  <p className="text-xs text-muted-foreground">Updated Jan 15, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <FileText className="h-5 w-5 text-rentOasis-primary" />
                <div>
                  <p className="font-medium text-sm">Maintenance Policy</p>
                  <p className="text-xs text-muted-foreground">Updated Feb 3, 2025</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View All Documents
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {userNotifications.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userNotifications.slice(0, 3).map(notif => (
                <div key={notif.id} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0">
                  <div className={`p-2 rounded-full ${
                    notif.type === 'info' ? 'bg-blue-100' : 
                    notif.type === 'warning' ? 'bg-yellow-100' : 
                    notif.type === 'success' ? 'bg-green-100' : 
                    'bg-red-100'
                  }`}>
                    {notif.type === 'info' ? <Home className="h-4 w-4 text-blue-500" /> : 
                     notif.type === 'warning' ? <AlertCircle className="h-4 w-4 text-yellow-500" /> : 
                     notif.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-500" /> : 
                     <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantDashboard;
