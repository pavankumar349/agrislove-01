
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, ThumbsUp, User, Calendar, AlertCircle, 
  Search, Loader2, Filter, RefreshCw, Send
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

const CommunityForum = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTopic, setNewPostTopic] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { rows: allPosts, isLoading, error, setRows } = useRealtimeTable<any>("community_posts", {});

  // If there was an error, show a toast message (only once)
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading forum posts",
        description: "Could not load community posts. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  const posts = React.useMemo(() => {
    return (allPosts || []).filter((post) => {
      const matchesSearch =
        !searchTerm ||
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTopic = selectedTopic ? post.topic === selectedTopic : true;
      return matchesSearch && matchesTopic;
    });
  }, [allPosts, searchTerm, selectedTopic]);

  const topics = [
    'Organic Farming',
    'Pest Control',
    'Water Management',
    'Soil Health',
    'Market Insights',
    'Equipment',
    'Seeds',
    'Traditional Practices'
  ];

  // Generate mock posts if there are none
  useEffect(() => {
    if (!isLoading && (!allPosts || allPosts.length === 0)) {
      const mockPosts = generateMockPosts();
      setRows(mockPosts);
    }
  }, [isLoading, allPosts, setRows]);

  const generateMockPosts = () => {
    return [
      {
        id: 'mock-1',
        title: 'Best practices for organic pest control?',
        content: 'I\'m growing vegetables using organic methods and dealing with aphids. What natural remedies have worked for you?',
        topic: 'Pest Control',
        user_id: 'mock-user-1',
        likes: 12,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-2',
        title: 'Water conservation techniques for rice cultivation',
        content: 'I want to reduce water usage in my rice fields. Has anyone tried the SRI (System of Rice Intensification) method?',
        topic: 'Water Management',
        user_id: 'mock-user-2',
        likes: 8,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-3',
        title: 'Market rates for organic turmeric',
        content: 'Can anyone share current market rates for organic turmeric in Maharashtra region? Planning to harvest next month.',
        topic: 'Market Insights',
        user_id: 'mock-user-3',
        likes: 5,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-4',
        title: 'Traditional methods for seed preservation',
        content: 'My grandfather used to preserve seeds using some traditional techniques. Looking to gather more knowledge about traditional seed preservation methods.',
        topic: 'Traditional Practices',
        user_id: 'mock-user-4',
        likes: 15,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-5',
        title: 'Soil testing labs in Tamil Nadu',
        content: 'Can anyone recommend reliable soil testing laboratories in Tamil Nadu? Need to check nutrient levels before the next planting season.',
        topic: 'Soil Health',
        user_id: 'mock-user-5',
        likes: 3,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const handleNewPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostTopic) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all fields to create a post.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create a new post
      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        topic: newPostTopic,
        user_id: 'current-user', // In a real app, get from auth context
        likes: 0,
        created_at: new Date().toISOString()
      };
      
      // Insert into database
      const { data, error } = await supabase
        .from('community_posts')
        .insert(newPost)
        .select();
      
      if (error) throw error;
      
      // Update local state (the realtime subscription should handle this)
      // but we'll update anyway for immediate feedback
      if (data) {
        setRows([data[0], ...(allPosts || [])]);
      }
      
      // Reset form
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostTopic('');
      setShowNewPostForm(false);
      
      toast({
        title: "Post created",
        description: "Your discussion has been posted to the community forum.",
      });
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: "Error creating post",
        description: "There was a problem posting your discussion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostLike = async (postId: string) => {
    try {
      // Find the post
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      // Update the post
      const { data, error } = await supabase
        .from('community_posts')
        .update({ likes: (post.likes || 0) + 1 })
        .eq('id', postId)
        .select();
      
      if (error) throw error;
      
      // Update local state
      if (data) {
        setRows(allPosts.map(p => p.id === postId ? data[0] : p));
      }
    } catch (err) {
      console.error("Error liking post:", err);
      toast({
        title: "Error",
        description: "Could not like the post. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-agri-green-dark mb-4 md:mb-0">Community Forum</h1>
          {showNewPostForm ? (
            <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
              Cancel
            </Button>
          ) : (
            <Button onClick={() => setShowNewPostForm(true)} className="flex items-center gap-2">
              <MessageSquare size={16} />
              Start New Discussion
            </Button>
          )}
        </div>
        
        {showNewPostForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Start a New Discussion</h2>
            <form onSubmit={handleNewPostSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter a descriptive title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <select
                    id="topic"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newPostTopic}
                    onChange={(e) => setNewPostTopic(e.target.value)}
                  >
                    <option value="">Select a topic</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    placeholder="Describe your question or discussion topic in detail..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={5}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewPostForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Post Discussion
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        )}
        
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search discussions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Tabs defaultValue="recent" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>
                <Button variant="ghost" onClick={() => setRows([])} className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
              
              <TabsContent value="recent" className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-agri-green" />
                    <p>Loading discussions...</p>
                  </div>
                ) : error ? (
                  <Card className="p-6 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
                    <p className="text-gray-600 mb-4">We couldn't load the discussions at this time.</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                  </Card>
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
                            {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : 'Recent'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {Math.floor(Math.random() * 10)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => handlePostLike(post.id)}
                          >
                            <ThumbsUp size={14} className="mr-1" />
                            {post.likes || 0}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No discussions found</p>
                    <Button variant="outline" className="mt-4" onClick={() => setShowNewPostForm(true)}>
                      Start a New Discussion
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-agri-green" />
                    <p>Loading popular discussions...</p>
                  </div>
                ) : posts && posts.length > 0 ? (
                  [...posts]
                    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                    .slice(0, 5)
                    .map((post) => (
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
                              {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : 'Recent'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              {Math.floor(Math.random() * 10)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => handlePostLike(post.id)}
                            >
                              <ThumbsUp size={14} className="mr-1" />
                              {post.likes || 0}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No popular discussions found</p>
                    <Button variant="outline" className="mt-4" onClick={() => setShowNewPostForm(true)}>
                      Start a New Discussion
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="unanswered" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-gray-500">Unanswered discussions will appear here</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowNewPostForm(true)}>
                    Start a New Discussion
                  </Button>
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
