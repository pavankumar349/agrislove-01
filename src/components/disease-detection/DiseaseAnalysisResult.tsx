
import React from "react";
import { Check, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

type DiseaseAnalysisResultProps = {
  isAnalyzing: boolean;
  result: {
    disease: string;
    confidence: number;
    description: string;
    treatment: string;
  } | null;
};

const DiseaseAnalysisResult: React.FC<DiseaseAnalysisResultProps> = ({
  isAnalyzing,
  result
}) => (
  <div>
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
  </div>
);

export default DiseaseAnalysisResult;
