
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Subcomponents
import { MarketPricesFilters } from "@/components/market-prices/MarketPricesFilters";
import { MarketPricesTable } from "@/components/market-prices/MarketPricesTable";
import { MarketPricesEmpty } from "@/components/market-prices/MarketPricesEmpty";
import { MarketPricesError } from "@/components/market-prices/MarketPricesError";

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
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
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
      const filteredData = data
        .filter(item => item && item.state && item.state.trim() !== '')
        .map(item => item.state);
      
      return [...new Set(filteredData)];
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
      const filteredData = data
        .filter(item => item && item.crop_name && item.crop_name.trim() !== '')
        .map(item => item.crop_name);
      
      return [...new Set(filteredData)];
    }
  });

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
        // Apply filters, but skip "all-xxx"
        if (selectedState && selectedState !== "all-states") {
          query = query.eq('state', selectedState);
        }
        if (selectedCrop && selectedCrop !== "all-crops") {
          query = query.eq('crop_name', selectedCrop);
        }
        if (searchMarket) {
          query = query.ilike('market_name', `%${searchMarket}%`);
        }
        query = query.order('updated_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw error;
        if ((!data || data.length === 0) && !selectedState && !selectedCrop && !searchMarket) {
          return getMockMarketPrices();
        }
        return data as MarketPrice[] || [];
      } catch (error) {
        console.error("Error fetching market prices:", error);
        throw error;
      }
    },
  });

  // Real-time listener for updates
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
          const newData = payload.new as MarketPrice;
          if (newData && newData.crop_name && newData.market_name) {
            toast({
              title: "Market prices updated",
              description: `Prices for ${newData.crop_name} in ${newData.market_name} have been updated.`,
            });
          }
          refetch();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Mock data for empty db
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

  const clearFilters = () => {
    setSelectedState('');
    setSelectedCrop('');
    setSearchMarket('');
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
        <MarketPricesFilters
          availableStates={availableStates}
          availableCrops={availableCrops}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          searchMarket={searchMarket}
          setSearchMarket={setSearchMarket}
        />
        {isLoading || statesLoading || cropsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-agri-green" />
            <p className="text-gray-600">Loading market prices...</p>
          </div>
        ) : error ? (
          <MarketPricesError refetch={refetch} />
        ) : marketPrices && marketPrices.length > 0 ? (
          <MarketPricesTable marketPrices={marketPrices} />
        ) : (
          <MarketPricesEmpty
            selectedState={selectedState}
            selectedCrop={selectedCrop}
            searchMarket={searchMarket}
            clearFilters={clearFilters}
          />
        )}
      </div>
    </Layout>
  );
};

export default MarketPrices;
