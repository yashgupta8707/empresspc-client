import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap, Shield, Cpu, Monitor, Server, Droplets, Settings, TrendingUp, Star, ArrowRight, Package, Gamepad2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // API Base URL from your api.js
  const API_BASE_URL = process.env.NODE_ENV === "production" 
    ? "https://your-production-domain.com/api" 
    : "http://localhost:5000/api";

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        
        if (data.success && data.data.products) {
          // Extract unique categories from products
          const uniqueCategories = [...new Set(
            data.data.products.map(product => product.category)
          )].filter(Boolean);
          
          // Create enhanced category objects
          const categoryData = uniqueCategories.map((category, index) => {
            const categoryProducts = data.data.products.filter(p => p.category === category);
            
            return {
              id: category,
              name: formatCategoryName(category),
              slug: category,
              description: getCategoryDescription(category),
              icon: getCategoryIcon(category),
              productCount: categoryProducts.length,
              priceRange: {
                min: Math.min(...categoryProducts.map(p => p.price)),
                max: Math.max(...categoryProducts.map(p => p.price)),
              },
              bgColor: getCategoryBgColor(category),
              performance: getCategoryPerformance(category),
              badge: getCategoryBadge(category)
            };
          });
          
          setCategories(categoryData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to static categories
        setCategories(getFallbackCategories());
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper functions
  const formatCategoryName = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'gaming-pc': 'Ultimate Gaming Beast',
      'content-creation': 'Creator Powerhouse', 
      'workstation': 'Professional Precision',
      'server': 'Enterprise Solutions',
      'custom-build': 'Tailored Performance',
      'accessories': 'Gaming Arsenal',
      'laptops': 'Portable Power',
      'components': 'Core Components'
    };
    return descriptions[category] || 'High Performance Computing';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'gaming-pc': Gamepad2,
      'content-creation': Zap,
      'workstation': Cpu,
      'server': Server,
      'custom-build': Settings,
      'accessories': Shield,
      'laptops': Monitor,
      'components': Package
    };
    return icons[category] || Monitor;
  };

  const getCategoryBgColor = (category) => {
    const colors = {
      'gaming-pc': 'bg-[#E65100]', // Matte Orange
      'content-creation': 'bg-[#1565C0]', // Matte Tech Blue
      'workstation': 'bg-[#212121]', // Deep Charcoal Black
      'server': 'bg-[#2E7D32]', // Matte Green
      'custom-build': 'bg-[#512DA8]', // Muted Purple Accent
      'accessories': 'bg-[#FFB300]', // Muted Amber
      'laptops': 'bg-[#1565C0]', // Matte Tech Blue
      'components': 'bg-[#E65100]' // Matte Orange
    };
    return colors[category] || 'bg-[#BDBDBD]';
  };

  const getCategoryPerformance = (category) => {
    const performance = {
      'gaming-pc': 'Ultra',
      'content-creation': 'Pro',
      'workstation': 'Enterprise',
      'server': 'Industrial',
      'custom-build': 'Custom',
      'accessories': 'Enhanced',
      'laptops': 'Mobile',
      'components': 'Core'
    };
    return performance[category] || 'High';
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'gaming-pc': 'HOT',
      'content-creation': 'PRO',
      'workstation': 'NEW',
      'server': 'ENTERPRISE',
      'custom-build': 'CUSTOM',
      'accessories': 'TRENDING'
    };
    return badges[category] || null;
  };

  const getFallbackCategories = () => {
    return [
      {
        id: 'gaming-pc',
        name: 'Gaming PCs',
        description: 'Ultimate Gaming Beast',
        icon: Gamepad2,
        bgColor: 'bg-[#E65100]',
        performance: 'Ultra',
        productCount: 12,
        priceRange: { min: 80000, max: 300000 },
        badge: 'HOT'
      },
      {
        id: 'content-creation',
        name: 'Content Creation',
        description: 'Creator Powerhouse',
        icon: Zap,
        bgColor: 'bg-[#1565C0]',
        performance: 'Pro',
        productCount: 8,
        priceRange: { min: 120000, max: 400000 },
        badge: 'PRO'
      },
      {
        id: 'workstation',
        name: 'Workstations',
        description: 'Professional Precision',
        icon: Cpu,
        bgColor: 'bg-[#212121]',
        performance: 'Enterprise',
        productCount: 6,
        priceRange: { min: 150000, max: 500000 },
        badge: 'NEW'
      }
    ];
  };

  const handleCategoryClick = (category) => {
    // Navigate to category page or filter products
    window.location.href = `/products/${category.slug}`;
  };

  if (loading) {
    return (
      <div className="bg-[#FAFAFA] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#BDBDBD] rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-[#E65100] rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#FAFAFA] py-4 relative">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border border-[#BDBDBD] rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-[#E65100]" />
            <span className="text-base font-semibold text-[#212121]">Shop By Categories</span>
          </div>
          
          <h2 className="text-4xl font-bold text-[#212121] mb-4">
            Premium Tech Solutions
          </h2>
          
          <p className="text-lg text-[#757575] max-w-2xl mx-auto">
            Discover Our Cutting-Edge Collection of Gaming Rigs, Workstations, and Custom Builds Engineered for Champions.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-2xl mx-auto">
          <a href="/contact" className="group bg-white border border-[#BDBDBD] rounded-2xl p-6 hover:border-[#E65100] transition-all duration-300 cursor-pointer block">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#E65100] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-[#212121] font-bold text-lg">Expert Help?</h3>
                <span className="text-[#E65100] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  Ask Specialist <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>

          <div className="group bg-white border border-[#BDBDBD] rounded-2xl p-6 hover:border-[#1565C0] transition-all duration-300 cursor-pointer relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#1565C0] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-[#212121] font-bold text-lg">Visit Store</h3>
                <button 
                  onClick={() => setShowMap(!showMap)}
                  className="text-[#1565C0] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
                >
                  Find Location <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Embed Modal */}
        {showMap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowMap(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-[#212121]">Visit Our Store</h3>
                <button 
                  onClick={() => setShowMap(false)}
                  className="text-[#757575] hover:text-[#E65100] transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Store Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-[#212121] mb-2">Empress Computers</h4>
                    <p className="text-[#757575]">Your trusted PC building partner in Lucknow</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 text-[#E65100] mt-0.5">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#212121] font-semibold">Address</p>
                        <p className="text-[#757575]">123 Tech Plaza, Gomti Nagar, Lucknow, UP 226010</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 text-[#E65100] mt-0.5">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#212121] font-semibold">Phone</p>
                        <p className="text-[#757575]">+91 98765 43210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 text-[#E65100] mt-0.5">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#212121] font-semibold">Store Hours</p>
                        <p className="text-[#757575]">Mon-Sat: 10:00 AM - 8:00 PM</p>
                        <p className="text-[#757575]">Sunday: 11:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <a 
                      href="tel:+919876543210"
                      className="flex-1 bg-[#E65100] hover:bg-[#D84315] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 text-center"
                    >
                      Call Store
                    </a>
                    <a 
                      href="https://maps.google.com/directions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 text-center"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="w-full h-80 rounded-xl overflow-hidden border border-[#BDBDBD]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.3512846433127!2d80.93757877489436!3d26.89234436096661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399957e2ed209839%3A0x18c74c3fa5f0c56a!2sEmpress%20Computers%20(empresspc.in)!5e0!3m2!1sen!2sin!4v1759053327500!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Empress Computers Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white border border-[#BDBDBD] hover:border-[#E65100] transition-all duration-300 h-full">
                  {/* Badge */}
                  {category.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFB300] text-[#212121]">
                        {category.badge}
                      </span>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="relative p-6">

                    {/* Category Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#212121] mb-2 group-hover:text-[#E65100] transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-[#757575] text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#757575] font-medium">Products</span>
                          <span className="text-[#212121] font-bold">{category.productCount || 0}</span>
                        </div>
                        
                        {category.priceRange && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#757575] font-medium">Starting</span>
                            <span className="text-[#2E7D32] font-bold">₹{category.priceRange.min?.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#757575] font-medium">Performance</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${category.bgColor} text-white`}>
                            {category.performance}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="w-full mt-6 bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
                        Explore
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white border border-[#BDBDBD] rounded-2xl px-8 py-4">
            <p className="text-[#757575] font-medium">
              Can't find what you're looking for?
            </p>
            <a 
              href="/products"
              className="bg-[#E65100] hover:bg-[#D84315] text-white font-bold px-6 py-3 rounded-xl transition-all duration-300"
            >
              Our Product Offerings
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;