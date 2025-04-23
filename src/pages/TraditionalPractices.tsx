
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { BookOpen, Calendar, Search, Leaf, Trees } from 'lucide-react';
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Practice {
  id: string | number;
  title: string;
  description: string;
  category: string;
  season: string;
  benefits?: string;
  regions?: string[];
}

const TraditionalPractices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  
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
              description: "Traditional methods using neem leaves and other natural ingredients for pest management without harmful chemicals. Neem leaves contain azadirachtin which repels and disrupts the lifecycle of over 200 species of insects.",
              category: "Pest Management",
              season: "All Seasons",
              benefits: "Environmentally friendly, cost-effective, and promotes beneficial insects",
              regions: ["North India", "South India", "Central India"]
            },
            {
              id: 2,
              title: "Mixed Cropping",
              description: "Ancient technique of growing multiple crops in the same field to maximize land use and natural pest control. This method has been practiced in India for thousands of years and helps maintain soil health through biodiversity.",
              category: "Farming Method",
              season: "Based on crops",
              benefits: "Reduced risk of crop failure, improved soil health, natural pest management",
              regions: ["All regions of India"]
            },
            {
              id: 3,
              title: "Water Harvesting Bunds",
              description: "Traditional water conservation technique using earthen bunds to capture rainwater and prevent soil erosion. This method was widely practiced in ancient India, particularly in arid regions.",
              category: "Water Conservation",
              season: "Pre-monsoon",
              benefits: "Improves groundwater recharge, prevents soil erosion, ensures water availability",
              regions: ["Rajasthan", "Gujarat", "Maharashtra"]
            },
          ];
  
  // Filter based on search
  const filteredPractices = searchQuery 
    ? displayPractices.filter(practice => 
        practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        practice.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        practice.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayPractices;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Traditional Farming Practices</h1>

        <div className="relative mb-8 max-w-md">
          <Input
            type="search"
            placeholder="Search practices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        {selectedPractice ? (
          <div className="mb-8">
            <Card className="p-6 border-2 border-agri-green">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-agri-green" />
                  </div>
                  <h2 className="text-2xl font-bold">{selectedPractice.title}</h2>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPractice(null)}
                >
                  Back to List
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 mb-4">{selectedPractice.description}</p>
                  
                  {selectedPractice.benefits && (
                    <>
                      <h3 className="font-bold text-lg mb-2">Benefits</h3>
                      <p className="text-gray-700 mb-4">{selectedPractice.benefits}</p>
                    </>
                  )}
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Category</h3>
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{selectedPractice.category}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Best Season</h3>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{selectedPractice.season}</span>
                    </div>
                  </div>
                  
                  {selectedPractice.regions && (
                    <div>
                      <h3 className="font-bold text-lg mb-2">Regions</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedPractice.regions) ? selectedPractice.regions.map((region, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-agri-cream text-agri-green-dark text-sm rounded-full"
                          >
                            {region}
                          </span>
                        )) : (
                          <span className="text-gray-700">Information not available</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractices.map((practice) => (
              <Card 
                key={practice.id} 
                className="p-6 hover:border-agri-green hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedPractice(practice)}
              >
                <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                  {practice.category?.toLowerCase().includes('water') ? (
                    <Trees className="h-6 w-6 text-agri-green" />
                  ) : practice.category?.toLowerCase().includes('pest') ? (
                    <Leaf className="h-6 w-6 text-agri-green" />
                  ) : (
                    <BookOpen className="h-6 w-6 text-agri-green" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{practice.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{practice.description}</p>
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
            
            {filteredPractices.length === 0 && (
              <div className="col-span-3 text-center py-10">
                <p>No practices found for "{searchQuery}". Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TraditionalPractices;
