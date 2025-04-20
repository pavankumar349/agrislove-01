
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MarketPrices = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');

  const { data: marketPrices, isLoading, error, refetch } = useQuery({
    queryKey: ['marketPrices', selectedState, selectedCrop],
    queryFn: async () => {
      try {
        const query = supabase.from('market_prices').select('*');
        
        if (selectedState) {
          query.eq('state', selectedState);
        }
        if (selectedCrop) {
          query.eq('crop_name', selectedCrop);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching market prices:", error);
        throw error;
      }
    },
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Market Prices</h1>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Select onValueChange={setSelectedState} value={selectedState}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {["Maharashtra", "Punjab", "Karnataka"].map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedCrop} value={selectedCrop}>
            <SelectTrigger>
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {["Rice", "Wheat", "Cotton"].map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agri-green mx-auto mb-4"></div>
            <p>Loading market prices...</p>
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">We couldn't load the market prices at this time.</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </Card>
        ) : marketPrices && marketPrices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketPrices.map((price) => (
              <Card key={price.id} className="p-6">
                <h3 className="font-bold text-lg mb-2">{price.crop_name}</h3>
                <p className="text-gray-600 mb-1">Market: {price.market_name}</p>
                <p className="text-gray-600 mb-1">State: {price.state}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Min</p>
                    <p className="font-semibold">₹{price.min_price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Max</p>
                    <p className="font-semibold">₹{price.max_price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Modal</p>
                    <p className="font-semibold">₹{price.modal_price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <h3 className="font-bold text-lg mb-4">No market prices found</h3>
            <p className="text-gray-600">
              {selectedState || selectedCrop ? 
                `No prices available for the selected filters. Try different criteria.` : 
                `No market price data available at this time.`}
            </p>
            {(selectedState || selectedCrop) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedState('');
                  setSelectedCrop('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MarketPrices;
