
import React from 'react';
import { Card } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  location: string;
  image: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, location, image }) => {
  return (
    <Card className="p-6 border-agri-cream-dark h-full flex flex-col">
      <Quote className="h-8 w-8 text-agri-yellow mb-4" />
      <p className="text-gray-700 mb-6 flex-grow">{quote}</p>
      <div className="flex items-center mt-auto">
        <img
          src={image}
          alt={author}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-bold text-agri-green-dark">{author}</h4>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
      </div>
    </Card>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Agrislove's disease detection saved my tomato crop. The app identified early blight before it spread and recommended an effective organic treatment.",
      author: "Rajesh Patel",
      location: "Gujarat Farmer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    {
      quote: "The crop recommendation system suggested millet for my drought-prone land, and it thrived where rice had failed. My income has increased by 30%!",
      author: "Lakshmi Devi",
      location: "Karnataka Farmer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    {
      quote: "I've been farming for 40 years, but the traditional practices section taught me ancient techniques my grandfather used that work better than modern chemicals.",
      author: "Hariprasad Singh",
      location: "Punjab Farmer",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
  ];

  return (
    <section className="py-16 bg-agri-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-agri-green-dark mb-4">What Farmers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from farmers across India who have transformed their agricultural practices using Agrislove.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              location={testimonial.location}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
