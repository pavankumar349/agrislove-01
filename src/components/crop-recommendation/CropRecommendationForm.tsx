
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export interface CropRecommendation {
  name: string;
  suitability: number;
  description: string;
  growingPeriod: string;
  waterRequirement: string;
  traditionalPractices: string;
}

interface Props {
  onComplete: (recommendations: CropRecommendation[]) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
}

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

const CropRecommendationForm: React.FC<Props> = ({
  onComplete,
  isAnalyzing,
  setIsAnalyzing,
}) => {
  const [state, setState] = useState('');
  const [soilType, setSoilType] = useState('');
  const [climate, setClimate] = useState('');
  const [season, setSeason] = useState('');
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
    setTimeout(() => {
      // Mock recommendations
      onComplete([
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

  return (
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
  );
};

export default CropRecommendationForm;
