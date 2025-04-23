
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  refetch: () => void;
}

export const MarketPricesError: React.FC<Props> = ({ refetch }) => (
  <Card className="p-6 text-center">
    <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
    <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
    <p className="text-gray-600 mb-4">We couldn't load the market prices at this time.</p>
    <Button onClick={refetch}>Try Again</Button>
  </Card>
);
