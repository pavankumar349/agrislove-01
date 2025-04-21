import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-agri-cream to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-agri-green-dark grow-animation">
              Empowering Indian Farmers with Technology
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Your comprehensive agriculture assistant platform combining AI, community wisdom, and traditional knowledge.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-agri-green hover:bg-agri-green-dark">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/disease-detection">Try Disease Detection</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-agri-green"></div>
                <span className="text-gray-700">Plant Disease Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-agri-brown"></div>
                <span className="text-gray-700">Crop Recommendation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-agri-yellow"></div>
                <span className="text-gray-700">Market Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-agri-green-dark"></div>
                <span className="text-gray-700">Community Support</span>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Indian farmer in field"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-agri-green/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-agri-yellow/10"></div>
      <div className="absolute top-12 -right-12 w-32 h-32 rounded-full bg-agri-green/10"></div>
    </div>
  );
};

export default Hero;
