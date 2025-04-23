import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export interface CropRecommendation {
  name: string;
  suitability: number;
  description: string;
  growingPeriod: string;
  waterRequirement: string;
  traditionalPractices: string;
  fertilizer?: string;
}

interface Props {
  onComplete: (recommendations: CropRecommendation[]) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  setFormData?: (data: {
    state: string;
    soilType: string;
    climate: string;
    season: string;
  } | null) => void;
}

const CropRecommendationForm: React.FC<Props> = ({
  onComplete,
  isAnalyzing,
  setIsAnalyzing,
  setFormData
}) => {
  const [state, setState] = useState('');
  const [soilType, setSoilType] = useState('');
  const [climate, setClimate] = useState('');
  const [season, setSeason] = useState('');
  const [states, setStates] = useState<string[]>([]);
  const [soilTypes, setSoilTypes] = useState<string[]>([]);
  const [climates, setClimates] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch options data from Supabase
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch states
        const { data: statesData, error: statesError } = await supabase
          .from('crop_recommendations')
          .select('state')
          .order('state');
        
        if (statesError) throw statesError;
        
        // Fetch soil types
        const { data: soilData, error: soilError } = await supabase
          .from('crop_recommendations')
          .select('soil_type')
          .order('soil_type');
        
        if (soilError) throw soilError;
        
        // Fetch climate zones
        const { data: climateData, error: climateError } = await supabase
          .from('crop_recommendations')
          .select('climate_zone')
          .order('climate_zone');
        
        if (climateError) throw climateError;
        
        // Fetch seasons
        const { data: seasonData, error: seasonError } = await supabase
          .from('crop_recommendations')
          .select('season')
          .order('season');
        
        if (seasonError) throw seasonError;
        
        // Process and set data, removing duplicates
        const uniqueStates = [...new Set(statesData.map(item => item.state))].filter(Boolean);
        const uniqueSoilTypes = [...new Set(soilData.map(item => item.soil_type))].filter(Boolean);
        const uniqueClimates = [...new Set(climateData.map(item => item.climate_zone))].filter(Boolean);
        const uniqueSeasons = [...new Set(seasonData.map(item => item.season))].filter(Boolean);
        
        // If we don't have data from Supabase, use defaults
        setStates(uniqueStates.length > 0 ? uniqueStates : [
          'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 
          'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 
          'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
        ]);
        
        setSoilTypes(uniqueSoilTypes.length > 0 ? uniqueSoilTypes : [
          'Alluvial Soil', 'Black Soil', 'Red Soil', 'Laterite Soil', 
          'Desert Soil', 'Mountain Soil', 'Loamy', 'Clay', 'Sandy'
        ]);
        
        setClimates(uniqueClimates.length > 0 ? uniqueClimates : [
          'Tropical Wet', 'Tropical Dry', 'Subtropical Humid', 'Semi-Arid', 
          'Arid', 'Humid Continental', 'Highland'
        ]);
        
        setSeasons(uniqueSeasons.length > 0 ? uniqueSeasons.map(s => {
          if (s === 'Kharif') return 'Kharif (Monsoon)';
          if (s === 'Rabi') return 'Rabi (Winter)';
          if (s === 'Zaid') return 'Zaid (Summer)';
          return s;
        }) : [
          'Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Year-round'
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form options:", error);
        toast({
          title: "Error loading data",
          description: "Could not load form options. Using default values.",
          variant: "destructive",
        });
        
        // Set default values if there's an error
        setStates([
          'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 
          'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 
          'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
        ]);
        
        setSoilTypes([
          'Alluvial Soil', 'Black Soil', 'Red Soil', 'Laterite Soil', 
          'Desert Soil', 'Mountain Soil', 'Loamy', 'Clay', 'Sandy'
        ]);
        
        setClimates([
          'Tropical Wet', 'Tropical Dry', 'Subtropical Humid', 'Semi-Arid', 
          'Arid', 'Humid Continental', 'Highland'
        ]);
        
        setSeasons([
          'Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Year-round'
        ]);
        
        setLoading(false);
      }
    };
    
    fetchOptions();
    
    // Set up real-time listener for crop recommendations table
    const channel = supabase
      .channel('crop-recommendations-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'crop_recommendations' 
        }, 
        (payload) => {
          // Refresh options after table changes
          fetchOptions();
          toast({
            title: "Data updated",
            description: "Crop recommendation database has been updated with new information.",
          });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    if (setFormData) {
      setFormData({
        state,
        soilType,
        climate,
        season
      });
    }

    try {
      // Parse season to extract just the name part for querying
      const seasonName = season.split(' ')[0];
      
      // First try to fetch recommendations from Supabase
      const { data, error } = await supabase
        .from('crop_recommendations')
        .select('*')
        .eq('state', state)
        .eq('soil_type', soilType)
        .eq('season', seasonName)
        .eq('climate_zone', climate);

      if (error) {
        console.error("Error fetching crop recommendations:", error);
        throw error;
      }

      if (data && data.length > 0) {
        // Transform data to match our interface
        const recommendations: CropRecommendation[] = data.map(crop => ({
          name: crop.crop_name,
          suitability: calculateSuitability(crop),
          description: `${crop.crop_name} is well-suited to the ${climate} climate and ${soilType} of ${state}.`,
          growingPeriod: crop.growing_duration ? `${crop.growing_duration} days` : "Varies by variety",
          waterRequirement: crop.water_requirement || "Medium",
          traditionalPractices: crop.special_instructions || "Follow local traditional farming practices for best results.",
          fertilizer: determineFertilizer(crop.crop_name, soilType)
        }));

        // Sort by suitability
        recommendations.sort((a, b) => b.suitability - a.suitability);
        
        setTimeout(() => {
          onComplete(recommendations);
          setIsAnalyzing(false);
          toast({
            title: "Recommendations ready",
            description: "We've analyzed your conditions and found the best crop matches.",
          });
        }, 1000);
        return;
      }

      // Fallback to local generation if no recommendations found
      setTimeout(() => {
        const recommendations = generateRecommendations(state, soilType, climate, season);
        onComplete(recommendations);
        setIsAnalyzing(false);
        toast({
          title: "Recommendations ready",
          description: "We've analyzed your conditions and found the best crop matches based on traditional agricultural knowledge.",
        });
      }, 1500);
    } catch (err) {
      console.error("Error in crop recommendation:", err);
      setIsAnalyzing(false);
      toast({
        title: "Error analyzing conditions",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate recommendations based on local database and conditions
  const generateRecommendations = (state: string, soilType: string, climate: string, season: string): CropRecommendation[] => {
    const seasonName = season.split(' ')[0]; // Extract season name
    
    // List of potential crops based on the region and conditions
    const potentialCrops = [
      "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Millets", "Pulses", 
      "Mustard", "Groundnut", "Soybean", "Barley", "Jute", "Potato", "Tomato", 
      "Onion", "Chili", "Turmeric", "Ginger", "Cardamom", "Black Pepper", 
      "Coffee", "Tea", "Rubber", "Coconut", "Mango", "Banana", "Citrus",
      "Chickpea", "Pigeon Pea", "Black Gram", "Green Gram", "Jowar", "Bajra",
      "Ragi", "Safflower", "Sunflower", "Castor", "Tobacco", "Jute", "Okra",
      "Brinjal", "Cabbage", "Cauliflower", "Carrot", "Radish", "Beetroot",
      "Sweet Potato", "Tapioca", "Arecanut", "Cashew"
    ];
    
    // Filter crops based on conditions (in a real app, this would be more sophisticated)
    let suitableCrops: CropRecommendation[] = [];
    
    // For southern states, prefer certain crops
    const southernStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
    const northernStates = ["Punjab", "Haryana", "Uttar Pradesh", "Bihar", "Rajasthan"];
    
    potentialCrops.forEach(crop => {
      let suitability = 50; // Base suitability
      
      // Adjust based on region
      if (southernStates.includes(state) && ["Rice", "Coconut", "Coffee", "Rubber", "Spices"].includes(crop)) {
        suitability += 20;
      }
      
      if (northernStates.includes(state) && ["Wheat", "Sugarcane", "Cotton", "Mustard"].includes(crop)) {
        suitability += 20;
      }
      
      // Adjust based on soil
      if ((soilType === "Alluvial Soil" && ["Rice", "Wheat", "Sugarcane"].includes(crop)) ||
          (soilType === "Black Soil" && ["Cotton", "Groundnut", "Pulses"].includes(crop)) ||
          (soilType === "Red Soil" && ["Millets", "Groundnut", "Pulses"].includes(crop))) {
        suitability += 15;
      }
      
      // Adjust based on climate
      if ((climate === "Tropical Wet" && ["Rice", "Coconut", "Rubber"].includes(crop)) ||
          (climate === "Semi-Arid" && ["Millets", "Pulses", "Cotton"].includes(crop))) {
        suitability += 15;
      }
      
      // Adjust based on season
      if ((seasonName === "Kharif" && ["Rice", "Cotton", "Maize"].includes(crop)) ||
          (seasonName === "Rabi" && ["Wheat", "Mustard", "Chickpea"].includes(crop)) ||
          (seasonName === "Zaid" && ["Cucumber", "Watermelon", "Muskmelon"].includes(crop))) {
        suitability += 15;
      }
      
      // Random variation to make it more realistic
      suitability += Math.floor(Math.random() * 10);
      
      // Cap at 100
      suitability = Math.min(100, suitability);
      
      // Only include crops with suitability over threshold
      if (suitability > 60) {
        suitableCrops.push({
          name: crop,
          suitability,
          description: generateDescription(crop, state, soilType, climate),
          growingPeriod: determineGrowingPeriod(crop),
          waterRequirement: determineWaterRequirement(crop),
          traditionalPractices: generateTraditionalPractices(crop, state),
          fertilizer: determineFertilizer(crop, soilType)
        });
      }
    });
    
    // Sort by suitability
    suitableCrops.sort((a, b) => b.suitability - a.suitability);
    
    // Return top results
    return suitableCrops.slice(0, 5);
  };

  // Helper functions to generate crop details
  const generateDescription = (crop: string, state: string, soilType: string, climate: string): string => {
    return `${crop} is a ${determineCategory(crop)} crop that thrives in ${climate} climates with ${soilType}. It's commonly grown in ${state} and surrounding regions, using traditional farming methods passed down through generations.`;
  };
  
  const determineCategory = (crop: string): string => {
    const categories: {[key: string]: string} = {
      "Rice": "staple cereal", "Wheat": "winter cereal", "Maize": "versatile cereal",
      "Cotton": "cash fiber", "Sugarcane": "high-value commercial", "Potato": "tuber",
      "Tomato": "fruit vegetable", "Onion": "bulb vegetable", "Chili": "spice",
      "Mango": "tropical fruit", "Banana": "year-round fruit", "Coconut": "multi-purpose palm",
      "Coffee": "plantation", "Tea": "perennial", "Rubber": "industrial",
      // Add more as needed
    };
    
    return categories[crop] || "traditional";
  };
  
  const determineGrowingPeriod = (crop: string): string => {
    const periods: {[key: string]: string} = {
      "Rice": "90-150 days", "Wheat": "100-150 days", "Maize": "70-140 days",
      "Cotton": "150-180 days", "Sugarcane": "12-18 months", "Potato": "70-120 days",
      "Tomato": "90-150 days", "Onion": "100-175 days", "Chili": "60-95 days",
      "Mango": "5-8 years to first major harvest", "Banana": "9-12 months", "Coconut": "6-10 years to first yield",
      "Coffee": "3-4 years to first yield", "Tea": "3-5 years to first harvest", "Rubber": "5-7 years to first tapping",
      // Add more as needed
    };
    
    return periods[crop] || "Varies by variety and local conditions";
  };
  
  const determineWaterRequirement = (crop: string): string => {
    const requirements: {[key: string]: string} = {
      "Rice": "High - requires standing water during most growing phases",
      "Wheat": "Medium - critical during crown root initiation and flowering",
      "Maize": "Medium to High - particularly during silking and tasseling",
      "Cotton": "Medium - sensitive during flowering and boll formation",
      "Sugarcane": "High - needs regular irrigation throughout growth",
      "Potato": "Medium to High - consistent moisture needed for tuber development",
      "Tomato": "Medium - critical during flowering and fruit development",
      "Onion": "Medium - shallow roots require regular watering",
      "Chili": "Medium - particularly during flowering and fruit development",
      // Add more as needed
    };
    
    return requirements[crop] || "Medium - adequate soil moisture throughout growth cycle";
  };
  
  const generateTraditionalPractices = (crop: string, state: string): string => {
    const practices: {[key: string]: {[key: string]: string}} = {
      "Rice": {
        "default": "Traditional rice cultivation uses the SRI (System of Rice Intensification) technique which reduces water usage. Farmers often use the 'Pancha Gavya' organic formulation made from cow products.",
        "Tamil Nadu": "In Tamil Nadu, Kuruvai, Thaladi, and Samba methods of rice cultivation are practiced based on the season. Farmers use the auspicious star Rohini for timing planting.",
        "West Bengal": "West Bengal farmers use the 'Dapog' method for nursery preparation and celebrate 'Nabanna' festival after the rice harvest."
      },
      "Wheat": {
        "default": "Traditional wheat farming involves seed treatment with cow dung ash and manual broadcasting. Crop rotation with legumes helps maintain soil fertility.",
        "Punjab": "Punjab farmers often use the 'Bed Planting' method for wheat, improving water use efficiency. Baisakhi festival marks the wheat harvest celebration."
      },
      // Add more as needed
    };
    
    // Return state-specific practices if available, otherwise default
    if (practices[crop]) {
      return practices[crop][state] || practices[crop]["default"];
    }
    
    return "Traditional farming methods emphasize crop rotation, natural pest management, and timing agricultural activities according to lunar cycles.";
  };
  
  const determineFertilizer = (crop: string, soilType: string): string => {
    // Base fertilizer recommendations
    const baseFertilizers: {[key: string]: string} = {
      "Rice": "NPK 5:10:10, organic compost, and farmyard manure. Apply nitrogen in split doses.",
      "Wheat": "NPK 12:32:16 at sowing and nitrogen topdressing during tillering stage.",
      "Maize": "NPK 10:26:26 at sowing followed by nitrogen application at knee-high stage.",
      "Cotton": "NPK 14:35:14 as basal dose with micronutrient foliar spray containing zinc and boron.",
      "Sugarcane": "NPK 10:20:20 at planting with additional nitrogen applied at tillering.",
      "Potato": "NPK 8:16:16 at planting and potassium sulfate during tuber formation.",
      // Add more as needed
    };
    
    // Soil-specific adjustments
    const soilAdjustments: {[key: string]: string} = {
      "Alluvial Soil": "Standard recommendations apply with moderate use of organic matter.",
      "Black Soil": "Reduce phosphorus application as these soils typically retain phosphates. Add sulfur and zinc supplements.",
      "Red Soil": "Increase potassium and add lime to counter acidity. Include micronutrients, especially iron and manganese.",
      "Laterite Soil": "Add lime to counter acidity. Increase application of phosphorus and organic matter.",
      "Sandy Soil": "Increase frequency of fertilizer application in smaller doses. Add more organic matter to improve water retention.",
      "Clay Soil": "Reduce nitrogen application rate but increase frequency. Add gypsum to improve soil structure."
    };
    
    const baseFertilizer = baseFertilizers[crop] || "Balanced NPK fertilizer with appropriate micronutrients based on soil testing.";
    const soilAdvice = soilAdjustments[soilType] || "";
    
    return `${baseFertilizer} ${soilAdvice}`;
  };

  // Helper function to calculate suitability score based on crop data
  const calculateSuitability = (crop: any): number => {
    // Simple algorithm to calculate suitability percentage
    let score = 80; // Base score
    
    // Adjust based on water requirements matching climate
    if (climate === 'Tropical Wet' && crop.water_requirement === 'High') {
      score += 10;
    } else if ((climate === 'Semi-Arid' || climate === 'Arid') && crop.water_requirement === 'Low') {
      score += 10;
    }
    
    // Random variation to make it more realistic
    score += Math.floor(Math.random() * 10);
    
    // Cap at 100
    return Math.min(score, 100);
  };

  return (
    <Card className="p-6 lg:col-span-1 relative">
      <h2 className="text-xl font-bold text-agri-green-dark mb-4">Enter Your Details</h2>
      {loading ? (
        <div className="flex items-center justify-center h-60">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-agri-green mb-2" />
            <p className="text-sm text-gray-500">Loading crop data...</p>
          </div>
        </div>
      ) : (
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
              {isAnalyzing ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </span>
              ) : 'Get Recommendations'}
            </Button>
          </div>
        </form>
      )}
      <div className="mt-6">
        <h3 className="font-semibold text-agri-green-dark mb-2">How it works:</h3>
        <ul className="text-gray-600 space-y-1 list-disc pl-5">
          <li>Enter your location and growing conditions</li>
          <li>Our system matches with traditional agricultural knowledge</li>
          <li>We analyze soil, climate and seasonal factors</li>
          <li>You receive personalized recommendations based on centuries of farming wisdom</li>
        </ul>
      </div>
    </Card>
  );
};

export default CropRecommendationForm;
