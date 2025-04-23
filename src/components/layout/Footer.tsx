
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-agri-green text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-8 w-8" />
              <span className="font-bold text-2xl">Agrislove</span>
            </div>
            <p className="mb-4">
              Empowering Indian farmers with technology, knowledge, and community.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <Phone size={16} />
              <span>+91 9876543210</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} />
              <span>contact@agrislove.in</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>New Delhi, India</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-xl mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/disease-detection" className="hover:underline">Disease Detection</Link>
              </li>
              <li>
                <Link to="/crop-recommendation" className="hover:underline">Crop Recommendation</Link>
              </li>
              <li>
                <Link to="/market-prices" className="hover:underline">Market Prices</Link>
              </li>
              <li>
                <Link to="/fertilizer-recommendations" className="hover:underline">Fertilizer Recommendations</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/forum" className="hover:underline">Farmers Forum</Link>
              </li>
              <li>
                <Link to="/recipes" className="hover:underline">Recipe Recommender</Link>
              </li>
              <li>
                <Link to="/traditional-practices" className="hover:underline">Traditional Practices</Link>
              </li>
              <li>
                <Link to="/weather" className="hover:underline">Weather Forecast</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:underline">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">Contact</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-agri-green-dark mt-8 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Agrislove. All rights reserved. Made with{" "}
            <Heart size={16} className="inline text-agri-yellow" /> for Indian Farmers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
