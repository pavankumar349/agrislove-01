
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UploadCloud, X, AlertTriangle, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock result - in production, this would come from your backend API
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
              <h2 className="text-xl font-bold text-agri-green-dark mb-4">Upload Image</h2>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">Upload a clear image of the affected plant part</p>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                    id="image-upload" 
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      Select Image
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Selected plant" 
                    className="w-full h-auto rounded-lg mb-4" 
                  />
                  <button 
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                  <Button 
                    onClick={handleUpload} 
                    disabled={isAnalyzing} 
                    className="w-full mt-4"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                </div>
              )}

              <div className="mt-6">
                <h3 className="font-semibold text-agri-green-dark mb-2">Tips for best results:</h3>
                <ul className="text-gray-600 space-y-1 list-disc pl-5">
                  <li>Ensure good lighting for clear images</li>
                  <li>Focus on the affected area of the plant</li>
                  <li>Include some healthy parts for comparison</li>
                  <li>Take multiple photos from different angles if needed</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-agri-green-dark mb-4">Analysis Results</h2>
              
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-green mb-4"></div>
                  <p className="text-gray-600">Analyzing your plant image...</p>
                </div>
              ) : result ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-agri-green/10 p-2 rounded-full mr-3">
                      <Check className="h-6 w-6 text-agri-green" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{result.disease}</h3>
                      <p className="text-sm text-gray-500">Confidence: {result.confidence}%</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-agri-brown mb-2">Description:</h4>
                    <p className="text-gray-600">{result.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-agri-brown mb-2">Recommended Treatment:</h4>
                    <div className="bg-agri-cream p-4 rounded-lg">
                      {result.treatment.split('\n').map((item, index) => (
                        <p key={index} className="text-gray-700 mb-2">{item}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <AlertTriangle className="h-12 w-12 text-agri-yellow mb-4" />
                  <p className="text-gray-500 mb-2">No image analyzed yet</p>
                  <p className="text-sm text-gray-400">Upload an image and click "Analyze Image" to get results</p>
                </div>
              )}
            </Card>
          </div>

          <div className="mt-12 bg-agri-cream-light p-6 rounded-lg">
            <h2 className="text-xl font-bold text-agri-green-dark mb-4">Common Plant Diseases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Tomato Late Blight", 
                "Rice Blast",
                "Wheat Rust",
                "Cotton Leaf Curl",
                "Potato Early Blight",
                "Mango Black Spot"
              ].map((disease, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-agri-green-dark">{disease}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiseaseDetection;
