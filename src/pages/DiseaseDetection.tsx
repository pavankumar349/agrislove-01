
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import DiseaseImageUpload from "@/components/disease-detection/DiseaseImageUpload";
import DiseaseAnalysisResult from "@/components/disease-detection/DiseaseAnalysisResult";
import CommonDiseasesGrid from "@/components/disease-detection/CommonDiseasesGrid";

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    description: string;
    treatment: string;
  } | null>(null);

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setResult(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call with timeout (mock)
    setTimeout(() => {
      setResult({
        disease: "Tomato Late Blight",
        confidence: 92.5,
        description: "Late blight is a disease of tomato caused by the fungus-like oomycete pathogen Phytophthora infestans. It affects leaves, stems, and fruits, and can lead to significant yield loss if not managed properly.",
        treatment: "1. Remove affected plant parts immediately.\n2. Apply copper-based fungicide as per directions.\n3. Ensure proper spacing between plants for air circulation.\n4. Water at the base of plants, avoid wetting leaves.\n5. Plant resistant varieties in future seasons.",
      });
      setIsAnalyzing(false);

      toast({
        title: "Analysis complete",
        description: "We've identified the plant disease in your image.",
        variant: "default",
      });
    }, 2000);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-agri-green-dark mb-4">Plant Disease Detection</h1>
            <p className="text-gray-600">
              Upload a photo of your plant to identify diseases and get treatment recommendations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <DiseaseImageUpload
                imagePreview={imagePreview}
                isAnalyzing={isAnalyzing}
                handleFileChange={handleFileChange}
                handleUpload={handleUpload}
                clearImage={clearImage}
              />
            </Card>

            <Card className="p-6">
              <DiseaseAnalysisResult
                isAnalyzing={isAnalyzing}
                result={result}
              />
            </Card>
          </div>
          <CommonDiseasesGrid />
        </div>
      </div>
    </Layout>
  );
};

export default DiseaseDetection;
