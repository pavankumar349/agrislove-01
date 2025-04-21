
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DiseaseDetection from "./pages/DiseaseDetection";
import CropRecommendation from "./pages/CropRecommendation";
import MarketPrices from "./pages/MarketPrices";
import Recipes from "./pages/Recipes";
import TraditionalPractices from "./pages/TraditionalPractices";
import CommunityForum from "./pages/CommunityForum";
import ChatBot from "./pages/ChatBot";
import Weather from "./pages/Weather";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/traditional-practices" element={<TraditionalPractices />} />
          <Route path="/forum" element={<CommunityForum />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
