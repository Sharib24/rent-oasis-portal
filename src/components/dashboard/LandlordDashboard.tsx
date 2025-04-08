
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building, Home, CreditCard, Users, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { getPropertiesByLandlord, getUnitsByProperty, rentPayments, Notification, notifications } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";

const LandlordDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    properties: 0,
    units: 0,
    occupancyRate: 0,
    rentCollected: 0,
    pendingRent: 0,
    overdueRent: 0
  });

  useEffect(() => {
    if (user) {
      // Get landlord properties
      const landlordProperties = getPropertiesByLandlord(user.id);
      
      // Get all units from properties
      let allUnits: any[] = [];
      landlordProperties.forEach(property => {
        const propertyUnits = getUnitsByProperty(property.id);
        allUnits = [...allUnits, ...propertyUnits];
      });
      
      // Calculate occupancy rate
      const occupiedUnits = allUnits.filter(unit => unit.isOccupied);
      const occupancyRate = allUnits.length > 0 ? (occupiedUnits.length / allUnits.length) * 100 : 0;
      
      // Get payments related to these units
      const unitIds = allUnits.map(unit => unit.id);
      const relevantPayments = rentPayments.filter(payment => unitIds.includes(payment.unitId));
      
      // Calculate payment stats
      const collected = relevantPayments
        .filter(payment => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);
        
      const pending = relevantPayments
        .filter(payment => payment.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0);
        
      const overdue = relevantPayments
        .filter(payment => payment.status === 'overdue')
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      // Set stats
      setStats({
        properties: landlordProperties.length,
        units: allUnits.length,
        occupancyRate,
        rentCollected: collected,
        pendingRent: pending,
        overdueRent: overdue
      });
      
      // Get notifications
      const userNotifs = notifications.filter(notif => notif.userId === user.id);
      setUserNotifications(userNotifs);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Properties</p>
                <h3 className="text-2xl font-bold">{stats.properties}</h3>
              </div>
              <div className="p-2 bg-rentOasis-accent rounded-full">
                <Building className="h-5 w-5 text-rentOasis-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/properties")}>
              View all properties
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Units</p>
                <h3 className="text-2xl font-bold">{stats.units}</h3>
              </div>
              <div className="p-2 bg-rentOasis-accent rounded-full">
                <Home className="h-5 w-5 text-rentOasis-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Occupancy Rate</span>
                <span className="text-sm font-medium">{stats.occupancyRate.toFixed(1)}%</span>
              </div>
              <Progress value={stats.occupancyRate} className="h-2" />
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rent Collected</p>
                <h3 className="text-2xl font-bold">${stats.rentCollected.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-rentOasis-accent rounded-full">
                <CreditCard className="h-5 w-5 text-rentOasis-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-sm font-medium">${stats.pendingRent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-sm font-medium text-red-500">${stats.overdueRent.toLocaleString()}</p>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <h3 className="text-2xl font-bold">April 2025</h3>
              </div>
              <div className="p-2 bg-rentOasis-accent rounded-full">
                <Calendar className="h-5 w-5 text-rentOasis-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/rent-tracking")}>
              View rent tracker
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Rent Payment Overview</CardTitle>
            <CardDescription>Latest rent collection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Rent Collection Progress</span>
                  <span className="text-sm font-medium">
                    ${stats.rentCollected.toLocaleString()} / ${(stats.rentCollected + stats.pendingRent + stats.overdueRent).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-rentOasis-primary h-2.5 rounded-full"
                    style={{ 
                      width: `${stats.rentCollected / (stats.rentCollected + stats.pendingRent + stats.overdueRent) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-rentOasis-accent rounded-lg p-4">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">Collected</p>
                  <p className="text-lg font-bold">${stats.rentCollected.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold">${stats.pendingRent.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-lg font-bold">${stats.overdueRent.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <Button onClick={() => navigate("/rent-tracking")} className="w-full">
                  View Detailed Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Notifications</CardTitle>
            <CardDescription>Recent updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userNotifications.length > 0 ? (
                userNotifications.map(notif => (
                  <div key={notif.id} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0">
                    <div className={`p-2 rounded-full ${
                      notif.type === 'info' ? 'bg-blue-100' : 
                      notif.type === 'warning' ? 'bg-yellow-100' : 
                      notif.type === 'success' ? 'bg-green-100' : 
                      'bg-red-100'
                    }`}>
                      {notif.type === 'info' ? <Users className="h-4 w-4 text-blue-500" /> : 
                       notif.type === 'warning' ? <AlertCircle className="h-4 w-4 text-yellow-500" /> : 
                       notif.type === 'success' ? <TrendingUp className="h-4 w-4 text-green-500" /> : 
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
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm py-6">No new notifications</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LandlordDashboard;
