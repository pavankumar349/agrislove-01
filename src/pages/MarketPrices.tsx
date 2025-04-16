
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

const MarketPrices = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');

  const { data: marketPrices, isLoading } = useQuery({
    queryKey: ['marketPrices', selectedState, selectedCrop],
    queryFn: async () => {
      const query = supabase.from('market_prices').select('*');
      
      if (selectedState) {
        query.eq('state', selectedState);
      }
      if (selectedCrop) {
        query.eq('crop_name', selectedCrop);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
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
          <div>Loading market prices...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketPrices?.map((price) => (
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
        )}
      </div>
    </Layout>
  );
};

export default MarketPrices;
