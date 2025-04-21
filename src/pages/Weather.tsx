
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, CloudRain, Sun, Wind, Droplets, Calendar, MapPin, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  state: string;
  district: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: string;
  forecast_date: string;
}

const ForecastIcon = ({ forecast }: { forecast: string }) => {
  const forecastLower = forecast.toLowerCase();
  
  if (forecastLower.includes('rain')) return <CloudRain className="h-10 w-10 text-blue-500" />;
  if (forecastLower.includes('cloud')) return <Cloud className="h-10 w-10 text-gray-500" />;
  if (forecastLower.includes('sun') || forecastLower.includes('clear')) return <Sun className="h-10 w-10 text-yellow-500" />;
  return <Cloud className="h-10 w-10 text-gray-400" />;
};

const Weather = () => {
  const [location, setLocation] = useState({ state: '', district: '' });
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const { data, error } = await supabase
          .from('weather_data')
          .select('state')
          .order('state')
          .limit(50);
          
        if (error) throw error;
        
        // Extract unique states
        const uniqueStates = [...new Set(data.map(item => item.state))];
        setStates(uniqueStates);
      } catch (error: any) {
        console.error('Error fetching states:', error);
      }
    };
    
    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (!location.state) return;
    
    const fetchDistricts = async () => {
      try {
        const { data, error } = await supabase
          .from('weather_data')
          .select('district')
          .eq('state', location.state)
          .order('district');
          
        if (error) throw error;
        
        // Extract unique districts
        const uniqueDistricts = [...new Set(data.map(item => item.district))];
        setDistricts(uniqueDistricts);
      } catch (error: any) {
        console.error('Error fetching districts:', error);
      }
    };
    
    fetchDistricts();
  }, [location.state]);

  const handleFetchWeather = async () => {
    if (!location.state) {
      toast({
        title: "Please select a state",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      let query = supabase
        .from('weather_data')
        .select('*')
        .eq('state', location.state)
        .order('forecast_date');
        
      if (location.district) {
        query = query.eq('district', location.district);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setWeatherData(data as WeatherData[]);
      } else {
        // Fallback to generate weather data using Gemini if needed
        await generateWeatherWithGemini();
      }
    } catch (error: any) {
      console.error('Error fetching weather:', error);
      toast({
        title: "Error fetching weather data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateWeatherWithGemini = async () => {
    try {
      // Invoke edge function to generate weather data
      const response = await supabase.functions.invoke('generate-weather', {
        body: { 
          state: location.state, 
          district: location.district || 'General'
        }
      });

      if (response.error) throw new Error(response.error.message);
      
      // Process and set the generated weather data
      if (response.data && response.data.weatherData) {
        setWeatherData(response.data.weatherData);
      }
    } catch (error: any) {
      console.error('Error generating weather data:', error);
      toast({
        title: "Failed to generate weather data",
        description: "Could not fetch or generate weather information. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Agricultural Weather Forecast</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Location Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <Select 
                  value={location.state} 
                  onValueChange={(value) => setLocation(prev => ({ ...prev, state: value, district: '' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">District (Optional)</label>
                <Select 
                  value={location.district} 
                  onValueChange={(value) => setLocation(prev => ({ ...prev, district: value }))}
                  disabled={!location.state || districts.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleFetchWeather} 
              disabled={loading || !location.state}
              className="w-full md:w-auto"
            >
              {loading ? "Loading..." : "Get Weather Forecast"}
            </Button>
          </CardContent>
        </Card>
        
        {weatherData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Weather Forecast for {location.district ? `${location.district}, ` : ''}{location.state}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherData.map((data, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-agri-green-dark text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">{new Date(data.forecast_date).toLocaleDateString('en-US', { weekday: 'long' })}</CardTitle>
                        <p className="text-sm opacity-90">
                          {new Date(data.forecast_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <ForecastIcon forecast={data.forecast || 'cloudy'} />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <p className="text-lg font-semibold mb-4">{data.forecast || 'Weather data not available'}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Sun className="h-5 w-5 text-yellow-500" />
                        <span>{data.temperature}°C</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span>{data.humidity}% Humidity</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <CloudRain className="h-5 w-5 text-blue-400" />
                        <span>{data.rainfall} mm</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-agri-green" />
                        <span>{data.district}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold mb-2">Agricultural Impact</h4>
                      {data.forecast.toLowerCase().includes('rain') ? (
                        <p className="text-sm">Consider postponing outdoor agricultural activities. Good for water-intensive crops.</p>
                      ) : data.forecast.toLowerCase().includes('cloud') ? (
                        <p className="text-sm">Moderate conditions for field work. Check soil moisture levels.</p>
                      ) : (
                        <p className="text-sm">Good conditions for harvesting. Ensure adequate irrigation for crops.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Weather;
