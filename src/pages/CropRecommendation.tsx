
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import CropRecommendationForm, { CropRecommendation } from "@/components/crop-recommendation/CropRecommendationForm";
import RecommendationResultList from "@/components/crop-recommendation/RecommendationResultList";
import SeasonalPlantingGuide from "@/components/crop-recommendation/SeasonalPlantingGuide";
import { Card } from "@/components/ui/card";

const CropRecommendationPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);

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
            <CropRecommendationForm
              onComplete={setRecommendations}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
            />
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-agri-green-dark mb-4">Crop Recommendations</h2>
              <RecommendationResultList
                recommendations={recommendations}
                isAnalyzing={isAnalyzing}
              />
            </Card>
          </div>
          <SeasonalPlantingGuide />
        </div>
      </div>
    </Layout>
  );
};

export default CropRecommendationPage;
