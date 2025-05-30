
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please try again.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Login error:", err);
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setIsSubmitting(true);
    
    const demoEmail = "demo@rentoasis.com";
    const demoPassword = "demo12345";
    
    try {
      // First, try direct login with supabase client
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError) {
        console.log("Demo login error:", signInError);
        
        if (signInError.message.includes("Email not confirmed")) {
          // For demo purposes, we'll show a toast and redirect anyway
          toast({
            title: "Demo mode activated",
            description: "You're now signed in as a demo user",
          });
          
          // Update auth context state manually to ensure it recognizes the user is logged in
          await login(demoEmail, demoPassword);
          
          // Use navigate for consistent routing behavior
          navigate("/dashboard", { replace: true });
          return;
        }
        throw signInError;
      }
      
      // If sign-in was successful
      toast({
        title: "Welcome to RentOasis",
        description: "You've been logged in as a demo user.",
      });
      
      // Update auth context state and use navigate for consistent routing
      await login(demoEmail, demoPassword);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError("Demo login failed: " + err.message);
      } else {
        setError("Demo login failed with an unknown error");
      }
      console.error("Demo login error:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <Building className="h-12 w-12 text-rentOasis-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Login to your RentOasis account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a 
                href="#" 
                className="text-sm text-rentOasis-secondary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password reset functionality would be implemented here");
                }}
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-2" 
            onClick={handleDemoLogin}
            disabled={isSubmitting}
          >
            Try Demo Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a onClick={() => navigate("/signup")} className="text-rentOasis-secondary hover:underline cursor-pointer">
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
