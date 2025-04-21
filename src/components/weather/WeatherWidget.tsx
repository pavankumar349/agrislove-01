
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cloud, CloudRain, Droplets, Thermometer, Sun, Wind, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface WeatherData {
  state: string;
  district: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: string;
  forecast_date: string;
}

const WeatherWidget = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  // Fetch available states
  const { data: states, isLoading: statesLoading } = useQuery({
    queryKey: ['weatherStates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weather_data')
        .select('state')
        .order('state', { ascending: true });
      
      if (error) throw error;
      return [...new Set(data.map(item => item.state))];
    }
  });

  // Update available states when data is fetched
  useEffect(() => {
    if (states && states.length > 0) {
      setAvailableStates(states);
      if (!selectedState) {
        setSelectedState(states[0]);
      }
    }
  }, [states, selectedState]);

  // Fetch districts when state is selected
  const { data: districts, isLoading: districtsLoading } = useQuery({
    queryKey: ['weatherDistricts', selectedState],
    queryFn: async () => {
      if (!selectedState) return [];
      
      const { data, error } = await supabase
        .from('weather_data')
        .select('district')
        .eq('state', selectedState)
        .order('district', { ascending: true });
      
      if (error) throw error;
      return [...new Set(data.map(item => item.district))];
    },
    enabled: !!selectedState
  });

  // Update available districts when districts data is fetched
  useEffect(() => {
    if (districts && districts.length > 0) {
      setAvailableDistricts(districts);
      if (!selectedDistrict || !districts.includes(selectedDistrict)) {
        setSelectedDistrict(districts[0]);
      }
    } else {
      setAvailableDistricts([]);
      setSelectedDistrict('');
    }
  }, [districts, selectedDistrict]);

  // Fetch weather data for selected state and district
  const { 
    data: weatherData, 
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather
  } = useQuery({
    queryKey: ['weather', selectedState, selectedDistrict],
    queryFn: async () => {
      if (!selectedState || !selectedDistrict) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('state', selectedState)
        .eq('district', selectedDistrict)
        .order('forecast_date', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        // If no data exists, try to generate it using the edge function
        if (error.code === 'PGRST116') {
          try {
            const { data: generatedData, error: genError } = await supabase.functions.invoke('generate-weather', {
              body: { state: selectedState, district: selectedDistrict }
            });
            
            if (genError) throw genError;
            
            return generatedData;
          } catch (e) {
            console.error("Error generating weather data:", e);
            return null;
          }
        }
        
        throw error;
      }
      
      return data;
    },
    enabled: !!selectedState && !!selectedDistrict
  });

  // Set up real-time listener for weather data
  useEffect(() => {
    if (!selectedState || !selectedDistrict) return;
    
    const channel = supabase
      .channel('weather-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weather_data',
          filter: `state=eq.${selectedState}~district=eq.${selectedDistrict}`
        },
        (payload) => {
          toast({
            title: "Weather data updated",
            description: `Latest weather information for ${selectedDistrict}, ${selectedState} is now available.`,
          });
          
          refetchWeather();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedState, selectedDistrict, refetchWeather]);

  const getWeatherIcon = (forecast: string) => {
    const forecastLower = forecast?.toLowerCase() || '';
    
    if (forecastLower.includes('rain') || forecastLower.includes('shower')) {
      return <CloudRain className="h-12 w-12 text-blue-500" />;
    } else if (forecastLower.includes('cloud')) {
      return <Cloud className="h-12 w-12 text-gray-500" />;
    } else if (forecastLower.includes('sun') || forecastLower.includes('clear')) {
      return <Sun className="h-12 w-12 text-yellow-500" />;
    } else if (forecastLower.includes('wind')) {
      return <Wind className="h-12 w-12 text-teal-500" />;
    } else {
      return <Sun className="h-12 w-12 text-yellow-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (statesLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-agri-green" />
            <span className="ml-2">Loading weather data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!availableStates.length) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Weather Data Available</h3>
            <p className="text-gray-500">Weather information will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Weather Information</span>
          {weatherData && (
            <span className="text-sm font-normal text-gray-500">
              Last updated: {formatDate(weatherData.forecast_date)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger id="state-select" className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {availableStates.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <Select 
              value={selectedDistrict} 
              onValueChange={setSelectedDistrict}
              disabled={districtsLoading || !availableDistricts.length}
            >
              <SelectTrigger id="district-select" className="w-full">
                <SelectValue placeholder={
                  districtsLoading 
                    ? "Loading districts..." 
                    : !availableDistricts.length 
                      ? "No districts available" 
                      : "Select district"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {weatherLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-agri-green" />
            <span className="ml-2">Loading weather data...</span>
          </div>
        ) : weatherError ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Weather</h3>
            <p className="text-gray-500 mb-4">Could not retrieve weather information at this time.</p>
          </div>
        ) : weatherData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 flex flex-col md:flex-row items-center justify-between p-6 bg-agri-cream-light rounded-lg">
              <div className="flex items-center mb-4 md:mb-0">
                {getWeatherIcon(weatherData.forecast)}
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{weatherData.district}, {weatherData.state}</h3>
                  <p className="text-gray-600">{weatherData.forecast}</p>
                </div>
              </div>
              <div className="flex items-center text-2xl font-bold">
                <Thermometer className="h-6 w-6 mr-2 text-red-500" />
                {weatherData.temperature}°C
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg">
              <Droplets className="h-10 w-10 text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="text-xl font-bold">{weatherData.humidity}%</p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg">
              <CloudRain className="h-10 w-10 text-green-500 mb-2" />
              <p className="text-sm text-gray-500">Rainfall</p>
              <p className="text-xl font-bold">{weatherData.rainfall} mm</p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-lg">
              <Sun className="h-10 w-10 text-yellow-500 mb-2" />
              <p className="text-sm text-gray-500">Forecast</p>
              <p className="text-xl font-bold capitalize">{weatherData.forecast}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Weather Data</h3>
            <p className="text-gray-500">Please select a state and district to view weather information.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
