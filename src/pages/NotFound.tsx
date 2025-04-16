
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-agri-cream-light">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-agri-green rounded-full">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-agri-green-dark">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-agri-green-dark">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <div className="mt-12 text-gray-500 text-sm">
        <p>Need help? <Link to="/contact" className="text-agri-green">Contact our support team</Link></p>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-agri-green/5"></div>
      <div className="absolute bottom-12 -right-12 w-32 h-32 rounded-full bg-agri-yellow/10"></div>
    </div>
  );
};

export default NotFound;
