
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sprout, 
  Menu, 
  X, 
  Apple, 
  ShoppingCart, 
  BookOpen, 
  MessageCircle,
  Bot,
  User,
  CloudSun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    // Get current user on component mount
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const routes = [
    { name: "Home", path: "/" },
    { name: "Crop Recommendation", path: "/crop-recommendation", icon: Sprout },
    { name: "Disease Detection", path: "/disease-detection", icon: Apple },
    { name: "Weather", path: "/weather", icon: CloudSun },
    { name: "Market Prices", path: "/market-prices", icon: ShoppingCart },
    { name: "Recipes", path: "/recipes", icon: BookOpen },
    { name: "Traditional Practices", path: "/traditional-practices", icon: BookOpen },
    { name: "Community Forum", path: "/forum", icon: MessageCircle },
    { name: "Chatbot", path: "/chatbot", icon: Bot },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-agri-green" />
            <span className="text-xl font-bold text-agri-green-dark">KrishiMitra</span>
          </Link>

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {routes.slice(1).map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === route.path
                    ? "bg-agri-cream text-agri-green-dark"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {route.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center"
                  onClick={handleLogout}
                >
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="bg-agri-green hover:bg-agri-green-dark">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobile && isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "px-4 py-3 flex items-center space-x-2 text-sm font-medium rounded-md transition-colors",
                    location.pathname === route.path
                      ? "bg-agri-cream text-agri-green-dark"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={closeMenu}
                >
                  {route.icon && <route.icon className="h-5 w-5" />}
                  <span>{route.name}</span>
                </Link>
              ))}
              
              {user ? (
                <Button 
                  variant="ghost"
                  className="px-4 py-3 flex items-center space-x-2 text-sm font-medium rounded-md w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <User className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-3 flex items-center space-x-2 text-sm font-medium rounded-md transition-colors bg-agri-green text-white"
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
