
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Building, DollarSign, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RentPayment, units, properties } from "@/data/mockData";

interface PaymentFormProps {
  rentPayment?: RentPayment;
  onSuccess?: () => void;
}

const PaymentForm = ({ rentPayment, onSuccess }: PaymentFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const paymentAmount = rentPayment?.amount || 0;
  
  // Get property and unit details if we have a rent payment
  let propertyName = "";
  let unitNumber = "";
  
  if (rentPayment) {
    const unit = units.find(u => u.id === rentPayment.unitId);
    if (unit) {
      unitNumber = unit.unitNumber;
      const property = properties.find(p => p.id === unit.propertyId);
      if (property) {
        propertyName = property.name;
      }
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === "credit-card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast({
          title: "Missing information",
          description: "Please fill in all credit card details",
          variant: "destructive",
        });
        return;
      }
    }
    
    setLoading(true);
    
    // Simulate payment processing
    try {
      // In a real app, this would be an API call to process payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success state
      setSuccess(true);
      
      toast({
        title: "Payment successful",
        description: `Your payment of $${paymentAmount.toLocaleString()} has been processed successfully.`,
      });
      
      // Call success callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
      
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return value;
  };
  
  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
          <p className="text-muted-foreground mb-4">
            Your payment of ${paymentAmount.toLocaleString()} has been processed.
          </p>
          <p className="text-sm mb-6">
            A receipt has been sent to your email address.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Make Payment</CardTitle>
        <CardDescription>
          Complete your rent payment securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {(propertyName && unitNumber) && (
            <div className="mb-6 bg-muted p-4 rounded-md">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">{propertyName}</h3>
                  <p className="text-sm text-muted-foreground">Unit {unitNumber}</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Amount</span>
                <span className="font-bold text-lg">${paymentAmount.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem 
                    value="credit-card" 
                    id="credit-card" 
                    className="peer sr-only"
                  />
                  <Label 
                    htmlFor="credit-card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <CreditCard className="h-5 w-5 mb-2" />
                    Card
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="bank" 
                    id="bank" 
                    className="peer sr-only"
                  />
                  <Label 
                    htmlFor="bank"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Building className="h-5 w-5 mb-2" />
                    Bank
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="cash" 
                    id="cash" 
                    className="peer sr-only"
                  />
                  <Label 
                    htmlFor="cash"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <DollarSign className="h-5 w-5 mb-2" />
                    Cash
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {paymentMethod === 'credit-card' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Smith"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace('/', '');
                        if (value.length <= 4) {
                          setExpiryDate(formatExpiryDate(value));
                        }
                      }}
                      maxLength={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 3) {
                          setCvv(value);
                        }
                      }}
                      maxLength={3}
                    />
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  This is a demo application. No actual payments will be processed.
                </div>
              </div>
            )}
            
            {paymentMethod === 'bank' && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Bank Transfer Instructions</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Please transfer the payment amount to the following account:
                  </p>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Bank:</span>
                      <span className="font-medium">Global Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beneficiary:</span>
                      <span className="font-medium">RentOasis LLC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span className="font-medium">123456789</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Routing Number:</span>
                      <span className="font-medium">987654321</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  This is a demo application. No actual payments will be processed.
                </div>
              </div>
            )}
            
            {paymentMethod === 'cash' && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Cash Payment Instructions</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Please visit one of our office locations to make a cash payment:
                  </p>
                  <div className="text-sm space-y-3">
                    <div>
                      <div className="font-medium">Main Office</div>
                      <div>123 Main Street, Los Angeles, CA 90001</div>
                      <div className="text-muted-foreground">Mon-Fri: 9AM - 5PM</div>
                    </div>
                    <div>
                      <div className="font-medium">Downtown Branch</div>
                      <div>456 Downtown Ave, Los Angeles, CA 90007</div>
                      <div className="text-muted-foreground">Mon-Sat: 10AM - 6PM</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  This is a demo application. No actual payments will be processed.
                </div>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          onClick={handleSubmit} 
          className="w-full mb-2" 
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
              Processing...
            </span>
          ) : (
            `Pay $${paymentAmount.toLocaleString()}`
          )}
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
