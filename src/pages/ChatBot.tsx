
import React from 'react';
import Layout from '@/components/layout/Layout';
import AgricultureChatbot from '@/components/chat/AgricultureChatbot';

const ChatbotPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-agri-green-dark mb-4">Agriculture Assistant</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get answers to your farming questions, learn about traditional practices, 
              and receive advice on crops, soil management, pest control, and more.
            </p>
          </div>
          
          <AgricultureChatbot />
          
          <div className="mt-10 bg-agri-cream-light p-6 rounded-lg">
            <h2 className="text-xl font-bold text-agri-green-dark mb-4">
              Common Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Crop rotation benefits",
                "Natural pest control",
                "Water conservation",
                "Soil health improvement",
                "Organic farming practices",
                "Traditional seed storage"
              ].map((topic, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-agri-green-dark">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatbotPage;
