
import React from "react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Droplets, Sprout, Flower } from "lucide-react";
import { CropRecommendation } from "./CropRecommendationForm";

interface Props {
  crop: CropRecommendation;
}

const RecommendationResultCard: React.FC<Props> = ({ crop }) => (
  <div className="border rounded-lg overflow-hidden">
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
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="details">Growing Details</TabsTrigger>
          <TabsTrigger value="traditional">Traditional Practices</TabsTrigger>
          <TabsTrigger value="fertilizer">Fertilizer Guide</TabsTrigger>
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
      <TabsContent value="fertilizer" className="p-4">
        <div className="flex items-start">
          <div className="bg-agri-cream w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
            <Flower className="w-4 h-4 text-agri-green" />
          </div>
          <div>
            <p className="font-medium text-gray-700">Recommended Fertilizer</p>
            <p className="text-gray-600 mt-2">{crop.fertilizer || "Balanced NPK fertilizer with appropriate micronutrients based on soil testing."}</p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default RecommendationResultCard;
