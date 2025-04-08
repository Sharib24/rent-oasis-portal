
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RentPayment, Property, units, properties } from "@/data/mockData";
import { CreditCard, Check, Clock, AlertCircle, Download, ChevronDown, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface RentTrackerProps {
  rentPayments: RentPayment[];
}

const RentTracker = ({ rentPayments }: RentTrackerProps) => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("04"); // April
  const [selectedProperty, setSelectedProperty] = useState("all");

  // Get all properties if landlord
  const landlordProperties = user?.role === "landlord" 
    ? properties.filter(p => p.landlordId === user.id) 
    : [];

  // Filter payments based on selections
  const filteredPayments = rentPayments.filter(payment => {
    const paymentDate = new Date(payment.dueDate);
    const matchesYear = paymentDate.getFullYear().toString() === selectedYear;
    const matchesMonth = (paymentDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth;
    
    if (selectedProperty === "all") {
      return matchesYear && matchesMonth;
    }
    
    // Get the unit and check if it belongs to the selected property
    const unit = units.find(u => u.id === payment.unitId);
    return matchesYear && matchesMonth && unit?.propertyId === selectedProperty;
  });

  // Group payments by status
  const paidPayments = filteredPayments.filter(p => p.status === "paid");
  const pendingPayments = filteredPayments.filter(p => p.status === "pending");
  const overduePayments = filteredPayments.filter(p => p.status === "overdue");

  // Calculate total amounts
  const paidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = overduePayments.reduce((sum, p) => sum + p.amount, 0);
  const totalAmount = paidAmount + pendingAmount + overdueAmount;

  // Get the month name
  const getMonthName = (monthNum: string) => {
    const date = new Date(2000, parseInt(monthNum) - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  const getPaymentStatusIcon = (status: string) => {
    switch(status) {
      case 'paid':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return null;
    }
  };

  // Get unit and property info for payment
  const getPaymentDetails = (payment: RentPayment) => {
    const unit = units.find(u => u.id === payment.unitId);
    if (!unit) return { unitNumber: "Unknown", propertyName: "Unknown" };
    
    const property = properties.find(p => p.id === unit.propertyId);
    return { 
      unitNumber: unit.unitNumber,
      propertyName: property?.name || "Unknown"
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <h2 className="text-2xl font-bold">Rent Tracker</h2>
        <div className="flex flex-wrap gap-3">
          {user?.role === "landlord" && (
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {landlordProperties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: 12}, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return (
                  <SelectItem key={month} value={month}>
                    {getMonthName(month)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {getMonthName(selectedMonth)} {selectedYear} Overview
          </CardTitle>
          <CardDescription>
            Summary of rent payments for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <CreditCard className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-2xl font-bold mt-2">${totalAmount.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold mt-2">${paidAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{paidPayments.length} payments</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold mt-2">${pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{pendingPayments.length} payments</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2">${overdueAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{overduePayments.length} payments</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({filteredPayments.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidPayments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingPayments.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overduePayments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-4 font-medium">Property & Unit</th>
                      <th className="text-left p-4 font-medium">Due Date</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Payment Date</th>
                      <th className="text-left p-4 font-medium">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map(payment => {
                        const details = getPaymentDetails(payment);
                        return (
                          <tr key={payment.id} className="border-t hover:bg-muted/30">
                            <td className="p-4">
                              <div className="font-medium">{details.propertyName}</div>
                              <div className="text-sm text-muted-foreground">Unit {details.unitNumber}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium">${payment.amount.toLocaleString()}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getPaymentStatusIcon(payment.status)}
                                {getPaymentStatusBadge(payment.status)}
                              </div>
                            </td>
                            <td className="p-4">
                              {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}
                            </td>
                            <td className="p-4">{payment.paymentMethod || "-"}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No payments found for the selected period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paid">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-4 font-medium">Property & Unit</th>
                      <th className="text-left p-4 font-medium">Due Date</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Payment Date</th>
                      <th className="text-left p-4 font-medium">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidPayments.length > 0 ? (
                      paidPayments.map(payment => {
                        const details = getPaymentDetails(payment);
                        return (
                          <tr key={payment.id} className="border-t hover:bg-muted/30">
                            <td className="p-4">
                              <div className="font-medium">{details.propertyName}</div>
                              <div className="text-sm text-muted-foreground">Unit {details.unitNumber}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium">${payment.amount.toLocaleString()}</td>
                            <td className="p-4">
                              {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}
                            </td>
                            <td className="p-4">{payment.paymentMethod || "-"}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                          No paid payments found for the selected period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-4 font-medium">Property & Unit</th>
                      <th className="text-left p-4 font-medium">Due Date</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPayments.length > 0 ? (
                      pendingPayments.map(payment => {
                        const details = getPaymentDetails(payment);
                        return (
                          <tr key={payment.id} className="border-t hover:bg-muted/30">
                            <td className="p-4">
                              <div className="font-medium">{details.propertyName}</div>
                              <div className="text-sm text-muted-foreground">Unit {details.unitNumber}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(payment.dueDate).toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium">${payment.amount.toLocaleString()}</td>
                            <td className="p-4">
                              {user?.role === "tenant" ? (
                                <Button variant="outline" size="sm">Make Payment</Button>
                              ) : (
                                <Button variant="outline" size="sm">Send Reminder</Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          No pending payments found for the selected period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overdue">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-4 font-medium">Property & Unit</th>
                      <th className="text-left p-4 font-medium">Due Date</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Days Overdue</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overduePayments.length > 0 ? (
                      overduePayments.map(payment => {
                        const details = getPaymentDetails(payment);
                        const dueDate = new Date(payment.dueDate);
                        const today = new Date();
                        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <tr key={payment.id} className="border-t hover:bg-muted/30">
                            <td className="p-4">
                              <div className="font-medium">{details.propertyName}</div>
                              <div className="text-sm text-muted-foreground">Unit {details.unitNumber}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{dueDate.toLocaleDateString()}</span>
                              </div>
                            </td>
                            <td className="p-4 font-medium">${payment.amount.toLocaleString()}</td>
                            <td className="p-4 text-red-500 font-medium">{daysOverdue} days</td>
                            <td className="p-4">
                              {user?.role === "tenant" ? (
                                <Button size="sm">Pay Now</Button>
                              ) : (
                                <Button variant="outline" size="sm">Send Notice</Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                          No overdue payments found for the selected period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RentTracker;
