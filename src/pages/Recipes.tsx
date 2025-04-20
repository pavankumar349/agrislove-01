import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Utensils } from 'lucide-react';
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

const Recipes = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const { rows: recipes, isLoading } = useRealtimeTable<any>(
    "recipes",
    {}
  );

  const displayRecipes =
    recipes && recipes.length > 0
      ? recipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [
          {
            id: 1,
            title: "Traditional Dal Khichdi",
            ingredients: ["Rice", "Yellow Dal", "Ghee", "Cumin Seeds"],
            description: "A nutritious and easy-to-digest Indian dish",
            cookingTime: "30 mins",
          },
          {
            id: 2,
            title: "Sarson Ka Saag",
            ingredients: ["Mustard Greens", "Spinach", "Makki Flour", "Spices"],
            description: "Popular North Indian winter dish",
            cookingTime: "45 mins",
          },
        ].filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-agri-green-dark mb-8">Traditional Recipes</h1>
        
        <div className="relative mb-8 max-w-md">
          <Input
            type="search"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayRecipes.map((recipe) => (
            <Card key={recipe.id} className="p-6">
              <div className="w-12 h-12 bg-agri-cream rounded-full flex items-center justify-center mb-4">
                <Utensils className="h-6 w-6 text-agri-green" />
              </div>
              <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              <div className="text-sm text-gray-500">
                <p>Cooking time: {recipe.cookingTime}</p>
                <p className="mt-2">Main ingredients:</p>
                <ul className="list-disc list-inside mt-1">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <Button className="w-full mt-4">View Recipe</Button>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Recipes;
