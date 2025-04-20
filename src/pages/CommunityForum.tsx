import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ThumbsUp, User, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useRealtimeTable } from "@/hooks/useRealtimeTable";

const CommunityForum = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { rows: allPosts, isLoading } = useRealtimeTable<any>("community_posts", {});

  const posts = allPosts.filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic ? post.topic === selectedTopic : true;
    return matchesSearch && matchesTopic;
  });

  const topics = [
    'Organic Farming',
    'Pest Control',
    'Water Management',
    'Soil Health',
    'Market Insights',
    'Equipment',
    'Seeds',
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-agri-green-dark mb-4 md:mb-0">Community Forum</h1>
          <Button asChild>
            <a href="/forum/new-post" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Start New Discussion
            </a>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card className="p-4">
              <h2 className="font-bold text-lg mb-4">Topics</h2>
              <div className="space-y-2">
                <Button 
                  variant={selectedTopic === null ? "default" : "outline"} 
                  className="w-full justify-start" 
                  onClick={() => setSelectedTopic(null)}
                >
                  All Topics
                </Button>
                {topics.map(topic => (
                  <Button 
                    key={topic} 
                    variant={selectedTopic === topic ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <div className="mb-6">
              <Input 
                placeholder="Search discussions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="recent">Recent Discussions</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">Loading discussions...</div>
                ) : posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <Card key={post.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-agri-green-dark">{post.title}</h3>
                        <span className="bg-agri-cream text-agri-green-dark text-xs px-2 py-1 rounded-full">
                          {post.topic}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            Farmer
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {format(new Date(post.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {Math.floor(Math.random() * 10)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={14} />
                            {post.likes || 0}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No discussions found</p>
                    <Button variant="outline" className="mt-4">Start a New Discussion</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-gray-500">Popular discussions will appear here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="unanswered" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-gray-500">Unanswered discussions will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityForum;
