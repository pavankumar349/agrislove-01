
import React from "react";
import { CloudRain, Sun, Thermometer } from "lucide-react";

const SeasonalPlantingGuide: React.FC = () => (
  <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-bold text-agri-green-dark mb-6">Seasonal Planting Guide</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-agri-yellow/20 p-4 flex items-center gap-3">
          <CloudRain className="h-6 w-6 text-agri-yellow-dark" />
          <h3 className="font-bold">Kharif (Monsoon)</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-500 text-sm mb-3">June to October</p>
          <ul className="space-y-1">
            <li>Rice</li>
            <li>Maize</li>
            <li>Soybean</li>
            <li>Cotton</li>
            <li>Groundnut</li>
          </ul>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-agri-brown/20 p-4 flex items-center gap-3">
          <Thermometer className="h-6 w-6 text-agri-brown-dark" />
          <h3 className="font-bold">Rabi (Winter)</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-500 text-sm mb-3">November to April</p>
          <ul className="space-y-1">
            <li>Wheat</li>
            <li>Barley</li>
            <li>Mustard</li>
            <li>Peas</li>
            <li>Gram</li>
          </ul>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-agri-green/20 p-4 flex items-center gap-3">
          <Sun className="h-6 w-6 text-agri-green-dark" />
          <h3 className="font-bold">Zaid (Summer)</h3>
        </div>
        <div className="p-4">
          <p className="text-gray-500 text-sm mb-3">March to June</p>
          <ul className="space-y-1">
            <li>Watermelon</li>
            <li>Muskmelon</li>
            <li>Cucumber</li>
            <li>Bitter Gourd</li>
            <li>Moong Dal</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default SeasonalPlantingGuide;
