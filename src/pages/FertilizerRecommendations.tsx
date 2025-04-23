
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Leaf, Sprout, Trees } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

interface FertilizerRecommendation {
  id?: string;
  cropName: string;
  organicFertilizers: string[];
  chemicalFertilizers: string[];
  applicationTiming: string;
  dosagePerAcre: string;
  specialNotes: string;
}

const FertilizerRecommendations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiFertilizers, setAiFertilizers] = useState<FertilizerRecommendation[] | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<FertilizerRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  // Try to fetch fertilizer data from Supabase if available
  const { rows: fertilizers, isLoading } = useRealtimeTable<FertilizerRecommendation>(
    "fertilizer_recommendations",
    {}
  );

  useEffect(() => {
    if (!isLoading && (!fertilizers || fertilizers.length === 0)) {
      setLoading(true);
      fetch("https://derildzszqbqbgeygznk.functions.supabase.co/generate-fertilizer-recommendations")
        .then((r) => r.json())
        .then((data) => {
          setAiFertilizers(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching fertilizer recommendations:", error);
          setAiFertilizers([]);
          setLoading(false);
          toast({
            title: "Error",
            description: "Failed to load fertilizer recommendations. Please try again later.",
            variant: "destructive",
          });
        });
    }
  }, [isLoading, fertilizers]);

  const handleCropSearch = async (cropName: string) => {
    if (!cropName.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("https://derildzszqbqbgeygznk.functions.supabase.co/generate-fertilizer-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cropName: cropName.trim() }),
      });
      
      if (!response.ok) throw new Error("Failed to get recommendation");
      
      const data = await response.json();
      setSelectedCrop(data);
      toast({
        title: "Success",
        description: `Fertilizer recommendation for ${cropName} loaded successfully.`,
      });
    } catch (error) {
      console.error("Error fetching specific crop recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to get recommendation for this crop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCropSearch(searchQuery);
    }
  };

  // Determine which dataset to use and filter based on search
  const displayFertilizers = fertilizers && fertilizers.length > 0
    ? fertilizers
    : aiFertilizers || [];
  
  const filteredFertilizers = searchQuery 
    ? displayFertilizers.filter(item => 
        item.cropName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayFertilizers;

  // Main content rendering
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Fertilizer Recommendations</h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search crops or enter specific crop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              onClick={() => handleCropSearch(searchQuery)}
              disabled={loading || !searchQuery.trim()}
              className="bg-agri-green hover:bg-agri-green-dark"
            >
              Get Specific Recommendation
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Search from our database or enter a specific crop name to get tailored fertilizer recommendations
          </p>
        </div>

        {/* Show specific crop recommendation if selected */}
        {selectedCrop && (
          <Card className="p-6 mb-8 border-2 border-agri-green bg-agri-cream/20">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-agri-green rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-agri-green-dark">{selectedCrop.cropName}</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCrop(null)}
                  >
                    Back to List
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-agri-green" />
                      Organic Fertilizers
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCrop.organicFertilizers.map((item, idx) => (
                        <li key={idx} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2 flex items-center">
                      <Trees className="h-5 w-5 mr-2 text-agri-green" />
                      Chemical Fertilizers
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedCrop.chemicalFertilizers.map((item, idx) => (
                        <li key={idx} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Application Timing:</h3>
                    <p className="text-gray-700">{selectedCrop.applicationTiming}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Dosage Per Acre:</h3>
                    <p className="text-gray-700">{selectedCrop.dosagePerAcre}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Special Notes:</h3>
                    <p className="text-gray-700">{selectedCrop.specialNotes}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* List of fertilizer recommendations */}
        {!selectedCrop && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="p-6 h-64 animate-pulse bg-gray-100">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </Card>
              ))
            ) : filteredFertilizers.length > 0 ? (
              filteredFertilizers.map((item, index) => (
                <Card key={index} className="p-6 hover:border-agri-green transition-colors cursor-pointer" onClick={() => setSelectedCrop(item)}>
                  <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                    <Sprout className="h-6 w-6 text-agri-green" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.cropName}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {item.specialNotes || `Fertilizer recommendations for ${item.cropName} cultivation.`}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.organicFertilizers?.slice(0, 2).map((fert, idx) => (
                      <span key={idx} className="px-2 py-1 bg-agri-cream text-agri-green-dark text-xs rounded-full">{fert}</span>
                    ))}
                    {item.organicFertilizers?.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">+{item.organicFertilizers.length - 2} more</span>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No fertilizer recommendations found. Please try a different search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FertilizerRecommendations;
