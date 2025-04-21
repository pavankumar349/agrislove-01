
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, TrendingUp, TrendingDown, Search, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

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

const MarketPrices = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [searchMarket, setSearchMarket] = useState('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);

  // Fetch all states
  const { data: states, isLoading: statesLoading } = useQuery({
    queryKey: ['marketStates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_prices')
        .select('state')
        .order('state');
      
      if (error) throw error;
      return [...new Set(data.map(item => item.state))];
    }
  });

  // Fetch all crops
  const { data: crops, isLoading: cropsLoading } = useQuery({
    queryKey: ['marketCrops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_prices')
        .select('crop_name')
        .order('crop_name');
      
      if (error) throw error;
      return [...new Set(data.map(item => item.crop_name))];
    }
  });

  // Update available states and crops when data is fetched
  useEffect(() => {
    if (states) setAvailableStates(states);
    if (crops) setAvailableCrops(crops);
  }, [states, crops]);

  // Fetch market prices based on filters
  const { 
    data: marketPrices, 
    isLoading, 
    error, 
    refetch,
    isRefetching 
  } = useQuery({
    queryKey: ['marketPrices', selectedState, selectedCrop, searchMarket],
    queryFn: async () => {
      try {
        let query = supabase.from('market_prices').select('*');
        
        if (selectedState) {
          query = query.eq('state', selectedState);
        }
        if (selectedCrop) {
          query = query.eq('crop_name', selectedCrop);
        }
        if (searchMarket) {
          query = query.ilike('market_name', `%${searchMarket}%`);
        }
        
        // Sort by updated_at for latest prices first
        query = query.order('updated_at', { ascending: false });
        
        const { data, error } = await query;
        if (error) throw error;
        
        // If no data and no filters are applied, create some mock data
        if ((!data || data.length === 0) && !selectedState && !selectedCrop && !searchMarket) {
          return getMockMarketPrices();
        }
        
        return data || [];
      } catch (error) {
        console.error("Error fetching market prices:", error);
        throw error;
      }
    },
  });

  // Set up real-time listener for market prices
  useEffect(() => {
    const channel = supabase
      .channel('market-prices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'market_prices'
        },
        (payload) => {
          toast({
            title: "Market prices updated",
            description: `Prices for ${payload.new.crop_name} in ${payload.new.market_name} have been updated.`,
          });
          
          refetch();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Function to generate mock market prices for empty database
  const getMockMarketPrices = (): MarketPrice[] => {
    const mockCrops = ["Rice", "Wheat", "Cotton", "Sugarcane", "Maize"];
    const mockStates = ["Maharashtra", "Punjab", "Karnataka", "Uttar Pradesh", "Tamil Nadu"];
    const mockMarkets = [
      "Azadpur Mandi", "Vashi Market", "Bowenpally Market", 
      "Gultekdi Market", "Devi Ahilya Bai Holkar Market"
    ];
    
    return mockCrops.flatMap((crop, i) => {
      return mockStates.slice(0, 3).map((state, j) => {
        const basePrice = (i + 1) * 1000 + Math.floor(Math.random() * 500);
        return {
          id: `mock-${i}-${j}`,
          crop_name: crop,
          market_name: mockMarkets[(i + j) % mockMarkets.length],
          state,
          district: "Sample District",
          min_price: basePrice - Math.floor(Math.random() * 100),
          max_price: basePrice + Math.floor(Math.random() * 200),
          modal_price: basePrice,
          price_unit: "quintal",
          updated_at: new Date().toISOString()
        };
      });
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Function to compare current price with previous to show trend
  const getPriceTrend = (price: number, index: number) => {
    // Since we don't have historical data, this is a placeholder
    // In a real app, you would compare with previous price records
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-agri-green-dark mb-4 md:mb-0">Market Prices</h1>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh Prices
          </Button>
        </div>
        
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <Select onValueChange={setSelectedState} value={selectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All states</SelectItem>
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
                  <SelectItem value="">All crops</SelectItem>
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

        {isLoading || statesLoading || cropsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-agri-green" />
            <p className="text-gray-600">Loading market prices...</p>
          </div>
        ) : error ? (
          <Card className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">We couldn't load the market prices at this time.</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </Card>
        ) : marketPrices && marketPrices.length > 0 ? (
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
        ) : (
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
                onClick={() => {
                  setSelectedState('');
                  setSelectedCrop('');
                  setSearchMarket('');
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
