
import React from "react";

const COMMON_DISEASES = [
  "Tomato Late Blight",
  "Rice Blast",
  "Wheat Rust",
  "Cotton Leaf Curl",
  "Potato Early Blight",
  "Mango Black Spot"
];

const CommonDiseasesGrid: React.FC = () => (
  <div className="mt-12 bg-agri-cream-light p-6 rounded-lg">
    <h2 className="text-xl font-bold text-agri-green-dark mb-4">
      Common Plant Diseases
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {COMMON_DISEASES.map((disease, index) => (
        <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-agri-green-dark">{disease}</p>
        </div>
      ))}
    </div>
  </div>
);

export default CommonDiseasesGrid;
