
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import WeatherWidget from "@/components/weather/WeatherWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, CloudRain, Cloud, CloudSun, Sun, AlertCircle, Loader2 } from "lucide-react";

const WeatherPage = () => {
  const [activeTab, setActiveTab] = useState("current");

  // Fetch weather tips from Supabase
  const { data: weatherTips, isLoading: tipsLoading } = useQuery({
    queryKey: ['weatherTips'],
    queryFn: async () => {
      // This would ideally fetch from a weather_tips table
      // For now using mock data as placeholder
      return [
        {
          id: 1,
          season: "monsoon",
          tip: "Ensure proper drainage in your fields to prevent waterlogging during heavy rainfall.",
          crop_types: ["Rice", "Vegetables"]
        },
        {
          id: 2,
          season: "summer",
          tip: "Mulch your soil to retain moisture and protect plant roots from extreme heat.",
          crop_types: ["Vegetables", "Fruits"]
        },
        {
          id: 3,
          season: "winter",
          tip: "Cover sensitive crops at night to protect from frost damage during cold waves.",
          crop_types: ["Vegetables", "Pulses"]
        },
        {
          id: 4,
          season: "monsoon",
          tip: "Monitor for increased pest activity during humid conditions and apply appropriate organic remedies.",
          crop_types: ["All Crops"]
        }
      ];
    }
  });

  // Get current season based on month
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    // India's seasons by month (approximate)
    if (month >= 5 && month <= 8) return "monsoon"; // June to September
    if (month >= 9 && month <= 10) return "post-monsoon"; // October to November
    if (month >= 11 || month <= 1) return "winter"; // December to February
    return "summer"; // March to May
  };

  const currentSeason = getCurrentSeason();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-6">Weather Information</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="current">Current Weather</TabsTrigger>
                <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
                <TabsTrigger value="seasonal">Seasonal Outlook</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current">
                <WeatherWidget />
              </TabsContent>
              
              <TabsContent value="forecast">
                <Card>
                  <CardHeader>
                    <CardTitle>5-Day Weather Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {Array(5).fill(0).map((_, index) => {
                        const date = new Date();
                        date.setDate(date.getDate() + index + 1);
                        const formattedDate = date.toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        });
                        
                        // Just sample weather icons
                        const icons = [
                          <Sun key={1} className="h-10 w-10 text-yellow-500" />,
                          <CloudSun key={2} className="h-10 w-10 text-blue-400" />,
                          <Cloud key={3} className="h-10 w-10 text-gray-400" />,
                          <CloudRain key={4} className="h-10 w-10 text-blue-500" />,
                          <CloudSun key={5} className="h-10 w-10 text-blue-400" />
                        ];
                        
                        const temperatures = [32, 30, 29, 28, 31];
                        
                        return (
                          <div key={index} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                            <p className="font-medium text-gray-600">{formattedDate}</p>
                            <div className="my-3">{icons[index]}</div>
                            <p className="text-xl font-bold">{temperatures[index]}°C</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-6 text-center text-sm text-gray-500">
                      <p>* This is a forecast preview. For detailed 5-day forecasts with precipitation and wind data, please select a specific district.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="seasonal">
                <Card>
                  <CardHeader>
                    <CardTitle>Seasonal Weather Outlook</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-6 p-4 bg-agri-cream-light rounded-lg">
                      <Calendar className="h-8 w-8 text-agri-green-dark mr-3" />
                      <div>
                        <h3 className="font-bold text-lg capitalize">Current Season: {currentSeason.replace('-', ' ')}</h3>
                        <p className="text-gray-600">Seasonal forecasts help plan your farming activities months in advance.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-5 bg-blue-50 rounded-lg">
                        <h3 className="font-bold mb-2 capitalize">Monsoon (June-September)</h3>
                        <p className="text-gray-600 mb-2">Expected rainfall: Above normal</p>
                        <p className="text-gray-600">Good conditions for kharif crops like rice, soybean, and cotton. Prepare for possible flooding in low-lying areas.</p>
                      </div>
                      
                      <div className="p-5 bg-yellow-50 rounded-lg">
                        <h3 className="font-bold mb-2">Winter (December-February)</h3>
                        <p className="text-gray-600 mb-2">Expected temperatures: Normal</p>
                        <p className="text-gray-600">Favorable for rabi crops like wheat, mustard, and gram. Watch for occasional cold waves in northern regions.</p>
                      </div>
                      
                      <div className="p-5 bg-red-50 rounded-lg">
                        <h3 className="font-bold mb-2">Summer (March-May)</h3>
                        <p className="text-gray-600 mb-2">Expected temperatures: Above normal</p>
                        <p className="text-gray-600">Challenging for most crops. Focus on heat-tolerant varieties and efficient irrigation methods.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Weather Advisory</CardTitle>
              </CardHeader>
              <CardContent>
                {tipsLoading ? (
                  <div className="flex justify-center items-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin text-agri-green mr-2" />
                    <span>Loading advisories...</span>
                  </div>
                ) : weatherTips && weatherTips.length > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-agri-green-light rounded-lg">
                      <h3 className="font-bold text-agri-green-dark mb-2">Current Season Tips</h3>
                      {weatherTips
                        .filter(tip => tip.season === currentSeason)
                        .map(tip => (
                          <div key={tip.id} className="mb-3 pb-3 border-b border-agri-green-light last:border-0 last:mb-0 last:pb-0">
                            <p className="text-gray-700">{tip.tip}</p>
                            <div className="flex flex-wrap mt-1">
                              {tip.crop_types.map(crop => (
                                <span key={crop} className="text-xs bg-agri-cream px-2 py-1 rounded-full mr-1 mt-1">
                                  {crop}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    
                    <div>
                      <h3 className="font-bold mb-2">General Weather Tips</h3>
                      <ul className="space-y-2 text-gray-700">
                        {weatherTips
                          .filter(tip => tip.season !== currentSeason)
                          .slice(0, 2)
                          .map(tip => (
                            <li key={tip.id} className="flex items-start">
                              <span className="inline-block bg-gray-200 rounded-full p-1 mr-2 mt-1">
                                <AlertCircle className="h-3 w-3" />
                              </span>
                              {tip.tip}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                    <p>No weather advisories available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WeatherPage;
