import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { 
  Cpu, 
  HardDrive, 
  Monitor, 
  Zap, 
  Fan,
  Box,
  MemoryStick,
  CircuitBoard as Motherboard
} from 'lucide-react';
import { productAPI } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import Footer from '../components/Footer';
import EmpressNavbar from '../components/EmpressNavbar';

const ComponentsPage = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Component categories
  const componentCategories = [
    {
      id: 'processors',
      name: 'Processors (CPUs)',
      description: 'Intel and AMD processors for gaming, content creation, and professional work',
      icon: <Cpu className="w-6 h-6" />,
      color: 'bg-yellow-500',
      image: '/images/categories/cpu.jpg',
    },
    {
      id: 'graphics-cards',
      name: 'Graphics Cards',
      description: 'NVIDIA and AMD graphics cards for gaming and professional rendering',
      icon: <Cpu className="w-6 h-6" />,
      color: 'bg-purple-600',
      image: '/images/categories/gpu.jpg',
    },
    {
      id: 'motherboards',
      name: 'Motherboards',
      description: 'Feature-rich motherboards supporting the latest processors and technologies',
      icon: <Motherboard className="w-6 h-6" />,
      color: 'bg-blue-600',
      image: '/images/categories/motherboard.jpg',
    },
    {
      id: 'memory',
      name: 'Memory (RAM)',
      description: 'High-performance DDR4 and DDR5 memory kits for optimal system performance',
      icon: <MemoryStick className="w-6 h-6" />,
      color: 'bg-green-600',
      image: '/images/categories/ram.jpg',
    },
    {
      id: 'storage',
      name: 'Storage',
      description: 'SSDs, HDDs, and NVMe drives for fast data access and storage',
      icon: <HardDrive className="w-6 h-6" />,
      color: 'bg-orange-500',
      image: '/images/categories/storage.jpg',
    },
    {
      id: 'cases',
      name: 'PC Cases',
      description: 'Stylish and functional cases with excellent airflow and cable management',
      icon: <Box className="w-6 h-6" />,
      color: 'bg-gray-600',
      image: '/images/categories/case.jpg',
    },
    {
      id: 'power-supplies',
      name: 'Power Supplies',
      description: 'Reliable and efficient power supplies with modular and non-modular options',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-red-600',
      image: '/images/categories/psu.jpg',
    },
    {
      id: 'cooling',
      name: 'Cooling Systems',
      description: 'Air and liquid cooling solutions to keep your system running cool and quiet',
      icon: <Fan className="w-6 h-6" />,
      color: 'bg-cyan-600',
      image: '/images/categories/cooling.jpg',
    }
  ];

  useEffect(() => {
    fetchComponentsData();
  }, []);

  const fetchComponentsData = async () => {
    try {
      setLoading(true);
      
      // Get categories with product counts
      const categoriesResponse = await productAPI.getCategories();
      const dbCategories = categoriesResponse.data || [];
      
      // Match with our predefined component categories and get product counts
      const enrichedCategories = await Promise.all(
        componentCategories.map(async (category) => {
          try {
            // Find matching category from database
            const dbCategory = dbCategories.find(cat => cat._id === category.id);
            
            // Get sample products for preview
            const productsResponse = await productAPI.getProductsByCategory(category.id, {
              limit: 3,
              sortBy: 'rating',
              order: 'desc'
            });
            
            return {
              ...category,
              count: dbCategory?.count || 0,
              avgPrice: dbCategory?.avgPrice || 0,
              sampleProducts: productsResponse.data?.products || []
            };
          } catch (err) {
            console.error(`Error fetching data for ${category.id}:`, err);
            return {
              ...category,
              count: 0,
              avgPrice: 0,
              sampleProducts: []
            };
          }
        })
      );
      
      // Filter out categories with no products
      setCategories(enrichedCategories.filter(cat => cat.count > 0));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching components data:', err);
      // Set fallback categories
      setCategories(componentCategories.map(cat => ({ ...cat, count: 0, sampleProducts: [] })));
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/products/${categoryId}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading Components...</h2>
            <p className="text-gray-500">Fetching the latest PC hardware</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <EmpressNavbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            PC Components Store
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Build your dream PC with our premium collection of high-performance components
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
              🚀 Latest Technology
            </span>
            <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
              ⚡ High Performance
            </span>
            <span className="px-4 py-2 bg-white/10 rounded-full border border-white/20">
              🛡️ Warranty Included
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            Could not load live data. Showing available component categories.
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Component Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of PC components from trusted brands
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-purple-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                animationDelay: inView ? `${index * 100}ms` : '0ms',
              }}
            >
              {/* Category Header */}
              <div 
                className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className={`absolute top-4 left-4 ${category.color} p-3 rounded-full text-white shadow-lg`}>
                  {category.icon}
                </div>
                
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                  {category.count} items
                </div>

                {/* Category Image or Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`${category.color} p-6 rounded-full text-white mb-4 mx-auto w-20 h-20 flex items-center justify-center shadow-xl`}>
                      {React.cloneElement(category.icon, { className: "w-8 h-8" })}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">Click to explore →</p>
                </div>
              </div>

              {/* Category Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">{category.count}</span> Products
                  </div>
                  {category.avgPrice > 0 && (
                    <div className="text-sm text-gray-500">
                      Avg: <span className="font-semibold text-purple-600">₹{Math.round(category.avgPrice).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Sample Products Preview */}
                {category.sampleProducts.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Featured Items:</h4>
                    <div className="space-y-1">
                      {category.sampleProducts.slice(0, 2).map((product) => (
                        <div 
                          key={product._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product._id);
                          }}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={product.images?.[0]}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              fallbackSrc="/images/placeholder-product.jpg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">{product.name}</p>
                            <p className="text-xs text-purple-600 font-semibold">₹{product.price?.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Browse {category.name}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Categories Message */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔧</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No components available</h3>
            <p className="text-gray-500 text-lg mb-6">Check back later for our component inventory.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Building Your PC?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Our experts are here to help you choose the right components for your build
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/contact')}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Expert
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
};

export default ComponentsPage;