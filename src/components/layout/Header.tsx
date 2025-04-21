
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
  Bot 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const closeMenu = () => setIsOpen(false);

  const routes = [
    { name: "Home", path: "/" },
    { name: "Crop Recommendation", path: "/crop-recommendation", icon: Sprout },
    { name: "Disease Detection", path: "/disease-detection", icon: Apple },
    { name: "Market Prices", path: "/market-prices", icon: ShoppingCart },
    { name: "Recipes", path: "/recipes", icon: BookOpen },
    { name: "Traditional Practices", path: "/traditional-practices", icon: BookOpen },
    { name: "Community Forum", path: "/forum", icon: MessageCircle },
    { name: "Chatbot", path: "/chatbot", icon: Bot },
  ];

  return (
    <header className="bg-white border-b">
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
