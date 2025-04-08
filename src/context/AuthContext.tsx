
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, users } from '../data/mockData';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'landlord' | 'tenant') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage (simulating persistent session)
    const savedUser = localStorage.getItem('rentOasisUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to validate credentials
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, we would check the password here
      // For demo purposes, we're just going to log the user in
      
      setUser(foundUser);
      localStorage.setItem('rentOasisUser', JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'landlord' | 'tenant') => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to create a user
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (emailExists) {
        throw new Error('Email already in use');
      }
      
      // Create a new mock user (in real app, this would be done on the server)
      const newUser: User = {
        id: (users.length + 1).toString(),
        name,
        email,
        role,
      };
      
      // In a real app, we would save this user to the database
      // For demo purposes, we're just going to log the user in
      
      setUser(newUser);
      localStorage.setItem('rentOasisUser', JSON.stringify(newUser));
      
      toast({
        title: "Signup successful",
        description: `Welcome to Rent Oasis, ${newUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rentOasisUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
