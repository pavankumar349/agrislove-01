
import React, { useEffect, useState } from "react";
import { Sprout, AlertCircle } from "lucide-react";
import RecommendationResultCard from "./RecommendationResultCard";
import { CropRecommendation } from "./CropRecommendationForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface Props {
  recommendations: CropRecommendation[] | null;
  isAnalyzing: boolean;
  formData?: {
    state: string;
    soilType: string;
    climate: string;
    season: string;
  } | null;
}

const RecommendationResultList: React.FC<Props> = ({ 
  recommendations, 
  isAnalyzing,
  formData 
}) => {
  const [recentRecommendations, setRecentRecommendations] = useState<any[]>([]);

  // Fetch recent recommendations for the region
  const { data: recentData, isLoading, refetch } = useQuery({
    queryKey: ['recentRecommendations', formData?.state],
    queryFn: async () => {
      if (!formData?.state) return [];
      
      const { data, error } = await supabase
        .from('crop_recommendations')
        .select('*')
        .eq('state', formData.state)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!formData?.state
  });

  useEffect(() => {
    if (recentData) {
      setRecentRecommendations(recentData);
    }
  }, [recentData]);

  useEffect(() => {
    if (!formData || !formData.state) return;

    const channel = supabase
      .channel('crop-recommendations-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'crop_recommendations',
          filter: `state=eq.${formData.state}`
        },
        (payload) => {
          // Update the UI with the new recommendation
          setRecentRecommendations(prev => [payload.new, ...prev].slice(0, 3));
          
          toast({
            title: "New crop recommendation available",
            description: `A new recommendation for ${payload.new.crop_name} has been added for your region.`,
          });
          
          // Refetch to ensure we have the latest data
          refetch();
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.warn(`Realtime subscription status: ${status}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formData, refetch]);

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
        
        {recentRecommendations.length > 0 && formData && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-agri-green-dark mb-4">
              Recent Recommendations for {formData.state}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-agri-cream-light rounded-lg">
                  <h4 className="font-bold">{rec.crop_name}</h4>
                  <p className="text-sm text-gray-600">For {rec.soil_type} soil</p>
                  <p className="text-sm text-gray-600">Season: {rec.season}</p>
                </div>
              ))}
            </div>
          </div>
        )}
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
        Our AI will analyze your local conditions and suggest the best crops for optimal yield based on traditional and modern agricultural practices.
      </p>
      
      {formData?.state && recentRecommendations.length > 0 && (
        <div className="mt-8 w-full">
          <h3 className="text-lg font-bold text-agri-green-dark mb-4 text-center">
            Popular Crops in {formData.state}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentRecommendations.map((rec) => (
              <div key={rec.id} className="p-4 bg-agri-cream-light rounded-lg text-left">
                <h4 className="font-bold">{rec.crop_name}</h4>
                <p className="text-sm text-gray-600">For {rec.soil_type} soil</p>
                <p className="text-sm text-gray-600">Season: {rec.season}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationResultList;
