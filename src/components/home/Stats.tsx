
import React from 'react';
import { Users, MapPin, Database, Award } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, value, label, color }) => {
  return (
    <div className="text-center p-6">
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="text-3xl font-bold text-agri-green-dark mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="py-16 bg-agri-cream-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-agri-green-dark mb-4">Agrislove Impact</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're building a community of informed farmers across India.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem 
            icon={Users}
            value="10,000+"
            label="Active Farmers"
            color="bg-agri-green"
          />
          <StatItem 
            icon={MapPin}
            value="18"
            label="States Covered"
            color="bg-agri-brown"
          />
          <StatItem 
            icon={Database}
            value="50+"
            label="Crop Varieties"
            color="bg-agri-yellow"
          />
          <StatItem 
            icon={Award}
            value="95%"
            label="Disease Detection Accuracy"
            color="bg-agri-green-dark"
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;
