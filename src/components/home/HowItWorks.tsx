
import React from 'react';
import { Camera, Sprout, BarChart3, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Camera,
      title: "Capture & Upload",
      description: "Take a photo of your plant or crop issue directly with the app or upload an existing image.",
      color: "bg-agri-green",
    },
    {
      icon: Sprout,
      title: "Get AI Analysis",
      description: "Our advanced ML models analyze the image to identify diseases, pests, or nutrient deficiencies.",
      color: "bg-agri-brown",
    },
    {
      icon: BarChart3,
      title: "Receive Recommendations",
      description: "Get personalized treatment options, preventive measures, and crop management advice.",
      color: "bg-agri-yellow",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-agri-green-dark mb-4">How Agrislove Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A simple three-step process to help you identify and solve agricultural challenges.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="w-full md:w-1/3 text-center p-6">
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-agri-green-dark mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block text-agri-green-dark" size={32} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-agri-brown-dark font-medium">
            Start identifying plant diseases and getting recommendations in minutes!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
