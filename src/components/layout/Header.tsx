
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Building, 
  Home, 
  Menu, 
  X, 
  LogOut, 
  User,
  CalendarDays,
  CreditCard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Building className="h-8 w-8 text-rentOasis-primary" />
          <span className="text-xl font-bold text-rentOasis-primary font-heading">RentOasis</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-rentOasis-primary font-medium">Home</Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-rentOasis-primary font-medium">Dashboard</Link>
              {profile && profile.role === 'landlord' && (
                <Link to="/properties" className="text-gray-600 hover:text-rentOasis-primary font-medium">Properties</Link>
              )}
              <Link to="/rent-tracking" className="text-gray-600 hover:text-rentOasis-primary font-medium">Rent Tracking</Link>
              <Link to="/payments" className="text-gray-600 hover:text-rentOasis-primary font-medium">Payments</Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name || 'User'} />
                    <AvatarFallback className="bg-rentOasis-secondary text-white">
                      {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>My Schedule</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link to="/" className="block py-2 text-gray-600 hover:text-rentOasis-primary font-medium" onClick={toggleMenu}>
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </div>
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-600 hover:text-rentOasis-primary font-medium" onClick={toggleMenu}>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                {profile && profile.role === 'landlord' && (
                  <Link to="/properties" className="block py-2 text-gray-600 hover:text-rentOasis-primary font-medium" onClick={toggleMenu}>
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      <span>Properties</span>
                    </div>
                  </Link>
                )}
                <Link to="/rent-tracking" className="block py-2 text-gray-600 hover:text-rentOasis-primary font-medium" onClick={toggleMenu}>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    <span>Rent Tracking</span>
                  </div>
                </Link>
                <Link to="/payments" className="block py-2 text-gray-600 hover:text-rentOasis-primary font-medium" onClick={toggleMenu}>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payments</span>
                  </div>
                </Link>
                <div className="py-2">
                  <Button onClick={() => { logout(); toggleMenu(); }} variant="destructive" className="w-full flex items-center justify-center gap-2">
                    <LogOut className="h-5 w-5" />
                    <span>Log out</span>
                  </Button>
                </div>
              </>
            )}
            {!user && (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/signup" onClick={toggleMenu}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
