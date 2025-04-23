
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketPrice {
  id: string;
  crop_name: string;
  market_name: string;
  state: string;
  district: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_unit: string;
  updated_at: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

const getPriceTrend = (price: number, index: number) => {
  // Placeholder trend logic
  const isPositive = index % 2 === 0;
  if (isPositive) {
    return (
      <span className="flex items-center text-green-600">
        <TrendingUp className="h-4 w-4 mr-1" />
        {(Math.random() * 2).toFixed(1)}%
      </span>
    );
  } else {
    return (
      <span className="flex items-center text-red-600">
        <TrendingDown className="h-4 w-4 mr-1" />
        {(Math.random() * 2).toFixed(1)}%
      </span>
    );
  }
};

export const MarketPricesTable: React.FC<{ marketPrices: MarketPrice[] }> = ({ marketPrices }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-3 text-left">Crop</th>
          <th className="border p-3 text-left">Market</th>
          <th className="border p-3 text-left">State</th>
          <th className="border p-3 text-right">Min Price (₹)</th>
          <th className="border p-3 text-right">Modal Price (₹)</th>
          <th className="border p-3 text-right">Max Price (₹)</th>
          <th className="border p-3 text-left">Trend</th>
          <th className="border p-3 text-left">Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {marketPrices.map((price, index) => (
          <tr key={price.id} className="hover:bg-gray-50">
            <td className="border p-3 font-medium">{price.crop_name}</td>
            <td className="border p-3">{price.market_name}</td>
            <td className="border p-3">{price.state}</td>
            <td className="border p-3 text-right">₹{price.min_price.toLocaleString('en-IN')}</td>
            <td className="border p-3 text-right font-medium">₹{price.modal_price.toLocaleString('en-IN')}</td>
            <td className="border p-3 text-right">₹{price.max_price.toLocaleString('en-IN')}</td>
            <td className="border p-3">{getPriceTrend(price.modal_price, index)}</td>
            <td className="border p-3 text-sm text-gray-500">{formatDate(price.updated_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
