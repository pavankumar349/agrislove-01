
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-12 md:py-20 bg-agri-green-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Revolutionize Your Farming?</h2>
          <p className="text-lg md:text-xl mb-8 text-agri-cream">
            Join thousands of Indian farmers who are using KrishiMitra to improve crop yield, prevent diseases, and increase income with both modern AI and traditional wisdom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-agri-yellow text-agri-green-dark hover:bg-agri-yellow-dark">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/crop-recommendation">Try Crop Recommendation</Link>
            </Button>
          </div>
          <div className="mt-8 text-sm text-agri-cream opacity-80">
            <p>Access to modern AI technology and traditional farming wisdom, all in one platform</p>
            <p className="mt-2">No download required - works on any device with an internet connection</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
