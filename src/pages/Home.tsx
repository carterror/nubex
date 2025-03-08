import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Clock } from 'lucide-react';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Wide Selection',
      description: 'Browse through thousands of quality products',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your orders delivered within 24-48 hours',
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: '100% secure payment processing',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Customer service available around the clock',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-16 rounded-2xl overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Amazing Products at Great Prices
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Shop the latest trends and find exactly what you're looking for
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-50"></div>
      </div>

      {/* Features Section */}
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Browse our collection of products and find exactly what you're looking for
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}