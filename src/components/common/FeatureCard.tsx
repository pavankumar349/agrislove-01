
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  path,
  className = '',
}) => {
  return (
    <Card className={`p-6 h-full flex flex-col border-agri-cream-dark hover:shadow-lg transition-shadow ${className}`}>
      <div className="rounded-full bg-agri-cream p-4 w-16 h-16 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-agri-green" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-agri-green-dark">{title}</h3>
      <p className="text-gray-600 mb-5 flex-grow">{description}</p>
      <Button asChild variant="outline" className="mt-auto">
        <Link to={path}>Explore</Link>
      </Button>
    </Card>
  );
};

export default FeatureCard;
