
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/lib/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/6165e66d-dc06-41e4-95e5-407fe2d78a54.png" 
                alt="UnityEats Logo" 
                className="h-8 w-8 mr-2" 
              />
              <span className="text-primary font-bold text-xl">UnityEats</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">Home</Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">About</Link>
            <Link to="/ngos" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">NGOs</Link>
            <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">Contact</Link>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <span>Hi, {currentUser.name.split(' ')[0]}</span>
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted"
              aria-expanded="false"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">Home</Link>
          <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">About</Link>
          <Link to="/ngos" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">NGOs</Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">Contact</Link>
          
          {currentUser ? (
            <>
              <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">Dashboard</Link>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted">Profile</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-muted"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 px-3 py-2">
              <Button variant="outline" asChild className="w-full justify-center">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="w-full justify-center">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
