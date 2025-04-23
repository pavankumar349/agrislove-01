
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  selectedState: string;
  selectedCrop: string;
  searchMarket: string;
  clearFilters: () => void;
}

export const MarketPricesEmpty: React.FC<Props> = ({
  selectedState,
  selectedCrop,
  searchMarket,
  clearFilters
}) => (
  <Card className="p-6 text-center">
    <h3 className="font-bold text-lg mb-4">No market prices found</h3>
    <p className="text-gray-600">
      {selectedState || selectedCrop || searchMarket ? 
        `No prices available for the selected filters. Try different criteria.` : 
        `No market price data available at this time.`}
    </p>
    {(selectedState || selectedCrop || searchMarket) && (
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    )}
  </Card>
);
