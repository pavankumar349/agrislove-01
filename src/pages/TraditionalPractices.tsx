import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { BookOpen, Calendar, Cloud, Droplets } from 'lucide-react';
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

const TraditionalPractices = () => {
  const { rows: practices, isLoading } = useRealtimeTable<any>(
    "traditional_practices",
    {}
  );
  const [aiCrops, setAiCrops] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    if (!isLoading && practices?.length === 0) {
      fetch("https://derildzszqbqbgeygznk.functions.supabase.co/generate-traditional-crops")
        .then((r) => r.json())
        .then((data) => setAiCrops(Array.isArray(data) ? data : []))
        .catch(() => setAiCrops([]));
    }
  }, [isLoading, practices]);

  const displayPractices =
    practices && practices.length > 0
      ? practices
      : aiCrops
        ? aiCrops
        : [
            {
              id: 1,
              title: "Natural Pest Control",
              description: "Traditional methods using neem leaves and other natural ingredients",
              category: "Pest Management",
              season: "All Seasons",
            },
            {
              id: 2,
              title: "Mixed Cropping",
              description: "Ancient technique of growing multiple crops in the same field",
              category: "Farming Method",
              season: "Based on crops",
            },
          ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Traditional Farming Practices</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPractices.map((practice) => (
            <Card key={practice.id} className="p-6">
              <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-agri-green" />
              </div>
              <h3 className="font-bold text-lg mb-2">{practice.title}</h3>
              <p className="text-gray-600 mb-4">{practice.description}</p>
              <div className="flex items-center text-sm text-gray-500 mt-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{practice.season}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{practice.category}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TraditionalPractices;
