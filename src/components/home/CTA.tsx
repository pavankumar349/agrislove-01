
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
            Join thousands of Indian farmers who are using Agrislove to improve crop yield, prevent diseases, and increase income.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-agri-yellow text-agri-green-dark hover:bg-agri-yellow-dark">
              <Link to="/register">Register Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/disease-detection">Try Disease Detection</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
