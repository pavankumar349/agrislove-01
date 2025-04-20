
import React from "react";
import { Sprout } from "lucide-react";
import RecommendationResultCard from "./RecommendationResultCard";
import { CropRecommendation } from "./CropRecommendationForm";

interface Props {
  recommendations: CropRecommendation[] | null;
  isAnalyzing: boolean;
}

const RecommendationResultList: React.FC<Props> = ({ recommendations, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-green mb-4"></div>
        <p className="text-gray-600">Analyzing your growing conditions...</p>
      </div>
    );
  }

  if (recommendations && recommendations.length > 0) {
    return (
      <div className="space-y-6">
        {recommendations.map((crop, index) => (
          <RecommendationResultCard key={index} crop={crop} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="bg-agri-cream-light p-4 rounded-full mb-4">
        <Sprout className="h-12 w-12 text-agri-green" />
      </div>
      <p className="text-gray-500 mb-2">
        Fill out the form to get personalized crop recommendations
      </p>
      <p className="text-sm text-gray-400 max-w-md">
        Our AI will analyze your local conditions and suggest the best crops for optimal yield.
      </p>
    </div>
  );
};

export default RecommendationResultList;
