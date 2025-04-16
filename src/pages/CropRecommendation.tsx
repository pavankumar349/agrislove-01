
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Droplets, Sun, Thermometer, Sprout, CloudRain } from 'lucide-react';

const CropRecommendation = () => {
  const [state, setState] = useState('');
  const [soilType, setSoilType] = useState('');
  const [climate, setClimate] = useState('');
  const [season, setSeason] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{
    name: string;
    suitability: number;
    description: string;
    growingPeriod: string;
    waterRequirement: string;
    traditionalPractices: string;
  }> | null>(null);

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state || !soilType || !climate || !season) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required for accurate crop recommendations",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock recommendations - in production, this would come from your ML model or API
      setRecommendations([
        {
          name: "Rice (Dhan)",
          suitability: 95,
          description: "Rice is a staple food crop and thrives in your selected conditions. It's well-suited to the warm, humid climate and clay-rich soils of your region.",
          growingPeriod: "120-150 days",
          waterRequirement: "High - requires standing water during most growing phases",
          traditionalPractices: "Traditional methods include the SRI (System of Rice Intensification) technique which reduces water usage while increasing yield."
        },
        {
          name: "Moong Dal (Green Gram)",
          suitability: 87,
          description: "Moong Dal is a short-duration pulse crop that fits well in crop rotation systems. It improves soil fertility by fixing nitrogen.",
          growingPeriod: "60-90 days",
          waterRequirement: "Low to Medium - drought resistant once established",
          traditionalPractices: "Traditionally interplanted with cereals or grown as a catch crop between major growing seasons."
        },
        {
          name: "Cotton",
          suitability: 82,
          description: "Cotton is a commercial fiber crop that grows well in warm conditions with moderate water requirements. It has a deep root system.",
          growingPeriod: "160-180 days",
          waterRequirement: "Medium - sensitive to both waterlogging and drought",
          traditionalPractices: "Indigenous varieties are often more pest-resistant. Traditional organic methods use neem-based solutions for pest control."
        },
      ]);
      setIsAnalyzing(false);
      
      toast({
        title: "Recommendations ready",
        description: "We've analyzed your conditions and found the best crop matches.",
      });
    }, 1500);
  };

  const states = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 
    'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];
  
  const soilTypes = [
    'Alluvial Soil', 'Black Soil', 'Red Soil', 'Laterite Soil', 
    'Desert Soil', 'Mountain Soil', 'Loamy', 'Clay', 'Sandy'
  ];
  
  const climates = [
    'Tropical Wet', 'Tropical Dry', 'Subtropical Humid', 'Semi-Arid', 
    'Arid', 'Humid Continental', 'Highland'
  ];
  
  const seasons = [
    'Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Year-round'
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-agri-green-dark mb-4">Crop Recommendation</h1>
            <p className="text-gray-600">
              Get personalized crop suggestions based on your location, soil type, and climate conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-6 lg:col-span-1">
              <h2 className="text-xl font-bold text-agri-green-dark mb-4">Enter Your Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <Select onValueChange={setState} value={state}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                    <Select onValueChange={setSoilType} value={soilType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        {soilTypes.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Climate Zone</label>
                    <Select onValueChange={setClimate} value={climate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select climate" />
                      </SelectTrigger>
                      <SelectContent>
                        {climates.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Growing Season</label>
                    <Select onValueChange={setSeason} value={season}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-2" 
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Get Recommendations'}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <h3 className="font-semibold text-agri-green-dark mb-2">How it works:</h3>
                <ul className="text-gray-600 space-y-1 list-disc pl-5">
                  <li>Enter your location and growing conditions</li>
                  <li>Our AI analyzes soil, climate and seasonal factors</li>
                  <li>We match these with crop requirements</li>
                  <li>You receive personalized recommendations</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-agri-green-dark mb-4">Crop Recommendations</h2>
              
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-green mb-4"></div>
                  <p className="text-gray-600">Analyzing your growing conditions...</p>
                </div>
              ) : recommendations ? (
                <div className="space-y-6">
                  {recommendations.map((crop, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-agri-cream-light p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-agri-green-dark">{crop.name}</h3>
                          <div className="bg-white px-3 py-1 rounded-full text-sm">
                            Suitability: {crop.suitability}%
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600">{crop.description}</p>
                      </div>
                      
                      <Tabs defaultValue="details">
                        <div className="border-t px-4 pt-4">
                          <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="details">Growing Details</TabsTrigger>
                            <TabsTrigger value="traditional">Traditional Practices</TabsTrigger>
                          </TabsList>
                        </div>
                        
                        <TabsContent value="details" className="p-4 pt-2 space-y-4">
                          <div className="flex items-center">
                            <div className="bg-agri-cream w-8 h-8 rounded-full flex items-center justify-center mr-3">
                              <Sprout className="w-4 h-4 text-agri-green" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Growing Period</p>
                              <p className="font-medium">{crop.growingPeriod}</p>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center">
                            <div className="bg-agri-cream w-8 h-8 rounded-full flex items-center justify-center mr-3">
                              <Droplets className="w-4 h-4 text-agri-green" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Water Requirement</p>
                              <p className="font-medium">{crop.waterRequirement}</p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="traditional" className="p-4">
                          <p className="text-gray-700">{crop.traditionalPractices}</p>
                        </TabsContent>
                      </Tabs>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-agri-cream-light p-4 rounded-full mb-4">
                    <Sprout className="h-12 w-12 text-agri-green" />
                  </div>
                  <p className="text-gray-500 mb-2">Fill out the form to get personalized crop recommendations</p>
                  <p className="text-sm text-gray-400 max-w-md">
                    Our AI will analyze your local conditions and suggest the best crops for optimal yield.
                  </p>
                </div>
              )}
            </Card>
          </div>

          <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-agri-green-dark mb-6">Seasonal Planting Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-agri-yellow/20 p-4 flex items-center gap-3">
                  <CloudRain className="h-6 w-6 text-agri-yellow-dark" />
                  <h3 className="font-bold">Kharif (Monsoon)</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-sm mb-3">June to October</p>
                  <ul className="space-y-1">
                    <li>Rice</li>
                    <li>Maize</li>
                    <li>Soybean</li>
                    <li>Cotton</li>
                    <li>Groundnut</li>
                  </ul>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-agri-brown/20 p-4 flex items-center gap-3">
                  <Thermometer className="h-6 w-6 text-agri-brown-dark" />
                  <h3 className="font-bold">Rabi (Winter)</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-sm mb-3">November to April</p>
                  <ul className="space-y-1">
                    <li>Wheat</li>
                    <li>Barley</li>
                    <li>Mustard</li>
                    <li>Peas</li>
                    <li>Gram</li>
                  </ul>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-agri-green/20 p-4 flex items-center gap-3">
                  <Sun className="h-6 w-6 text-agri-green-dark" />
                  <h3 className="font-bold">Zaid (Summer)</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-sm mb-3">March to June</p>
                  <ul className="space-y-1">
                    <li>Watermelon</li>
                    <li>Muskmelon</li>
                    <li>Cucumber</li>
                    <li>Bitter Gourd</li>
                    <li>Moong Dal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CropRecommendation;
