
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Leaf,
  Bot,
  CloudSun,
  Apple,
  Sprout,
  ShoppingCart,
  BookOpen,
  MessageCircle
} from 'lucide-react';

const features = [
  {
    title: 'AI-Powered Crop Recommendations',
    description: 'Get personalized crop suggestions based on your soil type, location, and season, leveraging both modern science and traditional knowledge.',
    icon: Sprout,
    path: '/crop-recommendation',
    color: 'bg-green-50 text-green-600'
  },
  {
    title: 'Agricultural Chatbot',
    description: 'Ask our AI assistant any farming-related questions from pest control to soil management, with knowledge of both modern and traditional practices.',
    icon: Bot,
    path: '/chatbot',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Weather Forecasts',
    description: 'Access localized weather predictions to plan your farming activities and protect your crops.',
    icon: CloudSun,
    path: '/weather',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Disease Detection',
    description: 'Upload photos of your crops to identify diseases and get treatment recommendations quickly.',
    icon: Apple,
    path: '/disease-detection',
    color: 'bg-red-50 text-red-600'
  },
  {
    title: 'Traditional Practices',
    description: 'Rediscover ancient agricultural wisdom and sustainable farming techniques passed down through generations.',
    icon: Leaf,
    path: '/traditional-practices',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    title: 'Market Prices',
    description: 'Check current crop prices to make informed decisions about when to sell your harvest.',
    icon: ShoppingCart,
    path: '/market-prices',
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    title: 'Recipes & Cooking',
    description: 'Explore traditional and modern recipes for your harvested crops, celebrating the farm-to-table journey.',
    icon: BookOpen,
    path: '/recipes',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    title: 'Farmer Community',
    description: 'Connect with other farmers to share experiences, ask questions, and build a supportive agricultural network.',
    icon: MessageCircle,
    path: '/forum',
    color: 'bg-teal-50 text-teal-600'
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-agri-green-dark mb-4">
            Comprehensive Agricultural Support
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform combines artificial intelligence with traditional agricultural wisdom 
            to provide farmers with practical, location-specific guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-agri-green-dark">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Button asChild variant="outline" className="w-full">
                <Link to={feature.path}>
                  Explore
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
