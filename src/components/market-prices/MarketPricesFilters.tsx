
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface MarketPricesFiltersProps {
  availableStates: string[];
  availableCrops: string[];
  selectedState: string;
  setSelectedState: (v: string) => void;
  selectedCrop: string;
  setSelectedCrop: (v: string) => void;
  searchMarket: string;
  setSearchMarket: (v: string) => void;
}

export const MarketPricesFilters: React.FC<MarketPricesFiltersProps> = ({
  availableStates,
  availableCrops,
  selectedState,
  setSelectedState,
  selectedCrop,
  setSelectedCrop,
  searchMarket,
  setSearchMarket
}) => (
  <Card className="p-6 mb-8">
    <div className="grid md:grid-cols-3 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
        <Select onValueChange={setSelectedState} value={selectedState}>
          <SelectTrigger>
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-states">All states</SelectItem>
            {availableStates.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
        <Select onValueChange={setSelectedCrop} value={selectedCrop}>
          <SelectTrigger>
            <SelectValue placeholder="All crops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-crops">All crops</SelectItem>
            {availableCrops.map(crop => (
              <SelectItem key={crop} value={crop}>{crop}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search Market</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by market name"
            value={searchMarket}
            onChange={(e) => setSearchMarket(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  </Card>
);
