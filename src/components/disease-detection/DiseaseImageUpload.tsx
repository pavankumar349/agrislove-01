
import React from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DiseaseImageUploadProps = {
  imagePreview: string | null;
  isAnalyzing: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  clearImage: () => void;
};

const DiseaseImageUpload: React.FC<DiseaseImageUploadProps> = ({
  imagePreview,
  isAnalyzing,
  handleFileChange,
  handleUpload,
  clearImage,
}) => {
  return (
    <div>
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
            {isAnalyzing ? "Analyzing..." : "Analyze Image"}
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
    </div>
  );
};

export default DiseaseImageUpload;
