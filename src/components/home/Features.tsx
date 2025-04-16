
import React from 'react';
import FeatureCard from '../common/FeatureCard';
import { Leaf, Droplets, BarChart3, Users, Utensils, BookOpen } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'Plant Disease Detection',
      description: 'Upload plant images and get instant disease identification with treatment recommendations.',
      icon: Leaf,
      path: '/disease-detection',
    },
    {
      title: 'Crop Recommendation',
      description: 'Receive personalized crop suggestions based on your soil type, climate, and season.',
      icon: Droplets,
      path: '/crop-recommendation',
    },
    {
      title: 'Market Prices',
      description: 'Access real-time market prices for your crops from local mandis and markets.',
      icon: BarChart3,
      path: '/market-prices',
    },
    {
      title: 'Community Forum',
      description: 'Connect with fellow farmers, share experiences, and learn from the community.',
      icon: Users,
      path: '/forum',
    },
    {
      title: 'Recipe Recommender',
      description: 'Discover delicious recipes using the crops and ingredients you grow.',
      icon: Utensils,
      path: '/recipes',
    },
    {
      title: 'Traditional Practices',
      description: 'Learn ancient and traditional farming techniques passed down through generations.',
      icon: BookOpen,
      path: '/traditional-practices',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-agri-green-dark mb-4">Comprehensive Features for Farmers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides tools and resources to help you maximize yield, detect diseases early, and make informed decisions for your farm.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              path={feature.path}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
