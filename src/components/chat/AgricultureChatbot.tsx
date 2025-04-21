
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, User, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AgricultureChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your agriculture assistant. Ask me anything about farming, crops, or traditional practices!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("agriculture-chatbot", {
        body: { message: userMessage }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Add assistant response to chat
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: data?.response || "Sorry, I couldn't process your question. Please try again."
        }]);
        setIsLoading(false);
      }, 300); // Small delay for better UX
    } catch (error) {
      console.error("Error calling chatbot:", error);
      setIsLoading(false);
      
      // Add error message
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again later." 
      }]);
      
      toast({
        title: "Error",
        description: "Could not connect to the agriculture chatbot service.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl mx-auto">
      <div className="bg-agri-green p-4 text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">Agriculture Assistant</h2>
        <p className="text-sm opacity-90">Ask about farming, crops, pests, and traditional practices</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`
                flex items-start space-x-2 max-w-[80%] 
                ${message.role === "user" 
                  ? "bg-agri-green-dark text-white rounded-l-lg rounded-tr-lg" 
                  : "bg-agri-cream text-gray-800 rounded-r-lg rounded-tl-lg"}
                p-3
              `}
            >
              <div className="flex-shrink-0 mt-1">
                {message.role === "user" 
                  ? <User className="h-5 w-5" /> 
                  : <Bot className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-agri-cream text-gray-800 rounded-r-lg rounded-tl-lg p-3 flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a farming question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default AgricultureChatbot;
