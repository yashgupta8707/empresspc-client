import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Monitor,
  Cpu,
  Gamepad,
  Headphones,
  Laptop,
  Mouse,
  Keyboard,
  HardDrive,
  Zap,
  Camera,
  Smartphone,
  Tablet,
  Speaker,
  Mic,
  Printer,
  Router,
  HardHat,
  Gamepad2,
  ArrowRight,
  Star,
  Package,
  Award,
  Clock,
  Shield
} from "lucide-react";
import { useInView } from 'react-intersection-observer';
import { productAPI } from "../services/api";
import ImageWithFallback from "../components/ImageWithFallback";
import Footer from "../components/Footer";
import EmpressNavbar from "../components/EmpressNavbar";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeGroup, setActiveGroup] = useState('all');

  useEffect(() => {
    fetchCategoriesWithProducts();
  }, []);

  // Complete category mapping with proper organization
  const categoryGroups = {
    'PC Systems': {
      icon: <Monitor className="w-5 h-5" />,
      categories: [
        {
          id: 'gaming-pc',
          name: 'Gaming PCs',
          description: 'High-performance gaming systems for enthusiasts and competitive gamers',
          icon: <Gamepad className="w-5 h-5" />,
          keywords: ['gaming', 'rgb', 'high-performance', 'overclocked']
        },
        {
          id: 'workstation-pc',
          name: 'Workstation PCs',
          description: 'Professional-grade systems for content creation and heavy workloads',
          icon: <Monitor className="w-5 h-5" />,
          keywords: ['professional', 'workstation', 'content', 'rendering']
        },
        {
          id: 'productivity-pc',
          name: 'Productivity PCs',
          description: 'Optimized systems for office work and business applications',
          icon: <HardHat className="w-5 h-5" />,
          keywords: ['office', 'productivity', 'business', 'efficient']
        },
        {
          id: 'budget-pc',
          name: 'Budget PCs',
          description: 'Affordable systems without compromising essential performance',
          icon: <Monitor className="w-5 h-5" />,
          keywords: ['affordable', 'budget', 'value', 'entry-level']
        },
        {
          id: 'creative-pc',
          name: 'Creative PCs',
          description: 'Specialized systems for artists, designers, and content creators',
          icon: <Camera className="w-5 h-5" />,
          keywords: ['creative', 'design', 'artist', 'video editing']
        },
        {
          id: 'streaming-pc',
          name: 'Streaming PCs',
          description: 'Dedicated systems for live streaming and content broadcasting',
          icon: <Gamepad2 className="w-5 h-5" />,
          keywords: ['streaming', 'broadcast', 'twitch', 'youtube']
        },
        {
          id: 'office-pc',
          name: 'Office PCs',
          description: 'Professional business systems for corporate environments',
          icon: <Monitor className="w-5 h-5" />,
          keywords: ['office', 'business', 'corporate', 'professional']
        },
        {
          id: 'mini-pc',
          name: 'Mini PCs',
          description: 'Compact and space-saving desktop solutions',
          icon: <Monitor className="w-5 h-5" />,
          keywords: ['compact', 'mini', 'space-saving', 'small form factor']
        }
      ]
    },
    'Components': {
      icon: <Cpu className="w-5 h-5" />,
      categories: [
        {
          id: 'processors',
          name: 'Processors (CPUs)',
          description: 'Intel and AMD processors for all performance levels',
          icon: <Cpu className="w-5 h-5" />,
          keywords: ['cpu', 'processor', 'intel', 'amd', 'ryzen', 'core']
        },
        {
          id: 'graphics-cards',
          name: 'Graphics Cards',
          description: 'NVIDIA and AMD graphics cards for gaming and professional work',
          icon: <Cpu className="w-5 h-5" />,
          keywords: ['gpu', 'graphics', 'nvidia', 'amd', 'rtx', 'radeon']
        },
        {
          id: 'motherboards',
          name: 'Motherboards',
          description: 'Feature-rich motherboards supporting latest technologies',
          icon: <Cpu className="w-5 h-5" />,
          keywords: ['motherboard', 'mainboard', 'socket', 'chipset']
        },
        {
          id: 'memory',
          name: 'Memory (RAM)',
          description: 'High-speed DDR4 and DDR5 memory modules',
          icon: <HardDrive className="w-5 h-5" />,
          keywords: ['ram', 'memory', 'ddr4', 'ddr5', 'corsair', 'gskill']
        },
        {
          id: 'storage',
          name: 'Storage Solutions',
          description: 'SSDs, HDDs, and NVMe drives for fast data access',
          icon: <HardDrive className="w-5 h-5" />,
          keywords: ['ssd', 'hdd', 'nvme', 'storage', 'samsung', 'wd']
        },
        {
          id: 'power-supplies',
          name: 'Power Supplies',
          description: 'Reliable and efficient PSUs with modular options',
          icon: <Zap className="w-5 h-5" />,
          keywords: ['psu', 'power supply', 'modular', 'efficiency', '80 plus']
        },
        {
          id: 'cases',
          name: 'PC Cases',
          description: 'Stylish cases with excellent airflow and cable management',
          icon: <Monitor className="w-5 h-5" />,
          keywords: ['case', 'chassis', 'tower', 'airflow', 'tempered glass']
        },
        {
          id: 'cooling',
          name: 'Cooling Systems',
          description: 'Air and liquid cooling solutions for optimal temperatures',
          icon: <Cpu className="w-5 h-5" />,
          keywords: ['cooling', 'cooler', 'aio', 'liquid', 'fan', 'thermal']
        }
      ]
    },
    'Peripherals': {
      icon: <Headphones className="w-5 h-5" />,
      categories: [
        {
          id: 'monitors',
          name: 'Monitors',
          description: 'Gaming and professional displays with various sizes and refresh rates',
          icon: <Monitor className="w-5 h-5" />,
          keywords: ['monitor', 'display', '4k', '144hz', 'ultrawide', 'gaming']
        },
        {
          id: 'keyboards',
          name: 'Keyboards',
          description: 'Mechanical and gaming keyboards for enhanced typing experience',
          icon: <Keyboard className="w-5 h-5" />,
          keywords: ['keyboard', 'mechanical', 'gaming', 'rgb', 'wireless']
        },
        {
          id: 'mice',
          name: 'Gaming Mice',
          description: 'Precision gaming and professional mice with high DPI sensors',
          icon: <Mouse className="w-5 h-5" />,
          keywords: ['mouse', 'gaming', 'wireless', 'rgb', 'high dpi']
        },
        {
          id: 'headsets',
          name: 'Gaming Headsets',
          description: 'Premium gaming and professional audio headsets',
          icon: <Headphones className="w-5 h-5" />,
          keywords: ['headset', 'gaming', 'surround', 'wireless', 'microphone']
        },
        {
          id: 'speakers',
          name: 'Speakers',
          description: 'High-quality audio systems and desktop speakers',
          icon: <Speaker className="w-5 h-5" />,
          keywords: ['speakers', 'audio', 'desktop', 'bluetooth', 'subwoofer']
        },
        {
          id: 'webcams',
          name: 'Webcams',
          description: 'HD cameras for streaming, video calls, and content creation',
          icon: <Camera className="w-5 h-5" />,
          keywords: ['webcam', 'camera', 'streaming', '1080p', '4k']
        },
        {
          id: 'microphones',
          name: 'Microphones',
          description: 'Professional microphones for streaming and recording',
          icon: <Mic className="w-5 h-5" />,
          keywords: ['microphone', 'streaming', 'podcast', 'usb', 'condenser']
        },
        {
          id: 'mouse-pads',
          name: 'Mouse Pads',
          description: 'Gaming and ergonomic mouse pads for precision control',
          icon: <Mouse className="w-5 h-5" />,
          keywords: ['mousepad', 'gaming', 'rgb', 'extended', 'precision']
        }
      ]
    },
    // 'Laptops': {
    //   icon: <Laptop className="w-5 h-5" />,
    //   categories: [
    //     {
    //       id: 'gaming-laptops',
    //       name: 'Gaming Laptops',
    //       description: 'Powerful portable gaming machines with high-end graphics',
    //       icon: <Laptop className="w-5 h-5" />,
    //       keywords: ['gaming laptop', 'portable', 'rtx', 'high refresh']
    //     },
    //     {
    //       id: 'business-laptops',
    //       name: 'Business Laptops',
    //       description: 'Professional laptops for business and enterprise use',
    //       icon: <Laptop className="w-5 h-5" />,
    //       keywords: ['business', 'professional', 'enterprise', 'productivity']
    //     },
    //     {
    //       id: 'ultrabooks',
    //       name: 'Ultrabooks',
    //       description: 'Ultra-thin and lightweight laptops for portability',
    //       icon: <Laptop className="w-5 h-5" />,
    //       keywords: ['ultrabook', 'thin', 'lightweight', 'portable', 'premium']
    //     },
    //     {
    //       id: 'budget-laptops',
    //       name: 'Budget Laptops',
    //       description: 'Affordable laptops for everyday computing needs',
    //       icon: <Laptop className="w-5 h-5" />,
    //       keywords: ['budget', 'affordable', 'everyday', 'student', 'basic']
    //     },
    //     {
    //       id: 'creative-laptops',
    //       name: 'Creative Laptops',
    //       description: 'High-performance laptops for content creation and design',
    //       icon: <Laptop className="w-5 h-5" />,
    //       keywords: ['creative', 'content creation', 'design', 'video editing']
    //     }
    //   ]
    // },
    'Accessories': {
      icon: <Smartphone className="w-5 h-5" />,
      categories: [
        {
          id: 'cables-adapters',
          name: 'Cables & Adapters',
          description: 'Essential cables and adapters for connectivity',
          icon: <Router className="w-5 h-5" />,
          keywords: ['cables', 'adapters', 'usb', 'hdmi', 'connectivity']
        },
        {
          id: 'printers-scanners',
          name: 'Printers & Scanners',
          description: 'Office printers and scanning solutions',
          icon: <Printer className="w-5 h-5" />,
          keywords: ['printer', 'scanner', 'office', 'document', 'inkjet', 'laser']
        },
        {
          id: 'networking',
          name: 'Networking Equipment',
          description: 'Routers, switches, and networking accessories',
          icon: <Router className="w-5 h-5" />,
          keywords: ['router', 'networking', 'wifi', 'switch', 'ethernet']
        },
        {
          id: 'external-storage',
          name: 'External Storage',
          description: 'Portable drives and external storage solutions',
          icon: <HardDrive className="w-5 h-5" />,
          keywords: ['external', 'portable', 'backup', 'usb drive', 'external hdd']
        }
      ]
    }
  };

  const fetchCategoriesWithProducts = async () => {
    try {
      setLoading(true);
      
      // Get categories from database
      const categoriesResponse = await productAPI.getCategories();
      const dbCategories = categoriesResponse.data || [];
      
      // Create a flat array of all categories from our structure
      const allDefinedCategories = Object.values(categoryGroups).flatMap(group => group.categories);
      
      // Match with database categories and get sample products
      const enrichedCategories = await Promise.all(
        allDefinedCategories.map(async (cat) => {
          try {
            // Find matching category from database
            const dbCategory = dbCategories.find(dbCat => dbCat._id === cat.id);
            
            if (!dbCategory || dbCategory.count === 0) {
              return null; // Skip categories with no products
            }
            
            // Get sample products for preview
            const productsResponse = await productAPI.getProductsByCategory(cat.id, {
              limit: 3,
              sortBy: 'rating',
              order: 'desc'
            });
            
            return {
              ...cat,
              count: dbCategory.count,
              avgPrice: dbCategory.avgPrice,
              sampleProducts: productsResponse.data?.products || [],
              group: Object.keys(categoryGroups).find(groupKey => 
                categoryGroups[groupKey].categories.some(groupCat => groupCat.id === cat.id)
              )
            };
          } catch (err) {
            console.error(`Error fetching data for ${cat.id}:`, err);
            return null;
          }
        })
      );
      
      // Filter out null categories (those with no products)
      setCategories(enrichedCategories.filter(cat => cat !== null));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAllClick = (categoryId) => {
    navigate(`/products/${categoryId}`);
  };

  const handleGroupFilter = (groupName) => {
    setActiveGroup(groupName);
  };

  const filteredCategories = activeGroup === 'all' 
    ? categories 
    : categories.filter(cat => cat.group === activeGroup);

  const groupNames = ['all', ...Object.keys(categoryGroups)];

  if (loading) {
    return (
      <>
        <EmpressNavbar />
        <div className="pb-20">
          {/* Hero */}
          <section className="bg-[#1E1E1E] text-white text-center p-6 md:p-16 px-4 md:px-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 text-white">
              Premium Tech Solutions
            </h1>
            <p className="text-sm md:text-base text-[#B3B3B3]">
              Loading our premium tech categories...
            </p>
          </section>
          
          <section className="bg-[#2C2C2C] text-white px-4 md:px-10 pt-4 md:pt-16 max-w-7xl mx-auto">
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <EmpressNavbar />
      <div>
        {/* Hero Section */}
        <section className="bg-[#1E1E1E] text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                Premium Tech Solutions
              </h1>
              <p className="text-lg md:text-xl text-[#B3B3B3] max-w-3xl mx-auto mb-6">
                Discover cutting-edge technology across gaming systems, professional workstations, 
                high-performance components, and premium accessories
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#FF6B00]">{categories.length}+</div>
                  <div className="text-sm text-[#B3B3B3]">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#FF6B00]">
                    {categories.reduce((sum, cat) => sum + cat.count, 0)}+
                  </div>
                  <div className="text-sm text-[#B3B3B3]">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#FF1744]">100%</div>
                  <div className="text-sm text-[#B3B3B3]">Genuine</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#FF1744]">24/7</div>
                  <div className="text-sm text-[#B3B3B3]">Support</div>
                </div>
              </div>
              
              {/* Features */}
              <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm font-medium">
                {/* <span className="px-4 py-2 rounded-full bg-[#2C2C2C] border border-[#333333] text-white">
                  <Shield className="w-4 h-4 inline mr-2" />
                  3-Year Warranty
                </span> */}
                <span className="px-4 py-2 rounded-full bg-[#2C2C2C] border border-[#333333] text-white">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Fast Shipping
                </span>
                <span className="px-4 py-2 rounded-full bg-[#2C2C2C] border border-[#333333] text-white">
                  <Award className="w-4 h-4 inline mr-2" />
                  Expert Support
                </span>
                <span className="px-4 py-2 rounded-full bg-[#2C2C2C] border border-[#333333] text-white">
                  <Package className="w-4 h-4 inline mr-2" />
                  Custom Builds
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Group Filter */}
        <section className="bg-[#2C2C2C] border-b border-[#333333]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-wrap justify-center gap-3">
              {groupNames.map((groupName) => (
                <button
                  key={groupName}
                  onClick={() => handleGroupFilter(groupName)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeGroup === groupName
                      ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                      : 'bg-[#1E1E1E] text-[#B3B3B3] border-[#333333] hover:bg-[#2C2C2C] hover:border-[#FF6B00] hover:text-white'
                  }`}
                >
                  {groupName === 'all' ? 'All Categories' : groupName}
                  {groupName !== 'all' && categoryGroups[groupName] && (
                    <span className="ml-2">
                      {categoryGroups[groupName].icon}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="bg-[#1E1E1E] py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {error && (
              <div className="bg-[#FF1744]/10 border border-[#FF1744]/30 text-[#FF1744] px-4 py-3 rounded-lg mb-8 text-sm">
                Could not load live products. Showing available categories.
              </div>
            )}

            <div ref={ref} className="space-y-12 md:space-y-20">
              {Object.entries(categoryGroups).map(([groupName, groupData]) => {
                const groupCategories = filteredCategories.filter(cat => cat.group === groupName);
                
                if (activeGroup !== 'all' && activeGroup !== groupName) return null;
                if (groupCategories.length === 0) return null;

                return (
                  <div 
                    key={groupName}
                    className={`transition-all duration-500 ${
                      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {/* Group Header */}
                    <div className="text-center mb-8 md:mb-12">
                      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#FF6B00] text-white mb-4">
                        {groupData.icon}
                        <h2 className="text-xl md:text-2xl font-bold">{groupName}</h2>
                      </div>
                      <p className="text-[#B3B3B3] max-w-2xl mx-auto">
                        {groupName === 'PC Systems' && 'Complete desktop systems built for specific use cases and performance requirements'}
                        {groupName === 'Components' && 'Individual PC components for custom builds and upgrades'}
                        {groupName === 'Peripherals' && 'Essential accessories to enhance your computing experience'}
                        {groupName === 'Laptops' && 'Portable computing solutions for work, gaming, and creativity'}
                        {groupName === 'Accessories' && 'Additional accessories and supporting equipment for your tech setup'}
                      </p>
                    </div>

                    {/* Categories in this group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupCategories.map((cat, idx) => (
                        <div
                          key={cat.id}
                          className={`group bg-[#2C2C2C] rounded-2xl overflow-hidden border border-[#333333] hover:border-[#FF6B00]/50 transform transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                          style={{
                            transitionDelay: inView ? `${idx * 100}ms` : '0ms',
                          }}
                          onClick={() => handleViewAllClick(cat.id)}
                        >
                          {/* Category Header */}
                          <div className="relative h-48 bg-[#121212] overflow-hidden">
                            <div className="absolute top-4 left-4 bg-[#FF6B00] p-3 rounded-full text-white">
                              {cat.icon}
                            </div>
                            
                            <div className="absolute top-4 right-4 bg-[#2C2C2C]/90 px-3 py-1 rounded-full text-sm font-semibold text-white border border-[#333333]">
                              {cat.count} items
                            </div>

                            {/* Category Image or Icon */}
                            <div className="absolute inset-0 bg-[#121212] flex items-center justify-center">
                              <div className="text-center">
                                <div className="bg-[#FF6B00]/10 p-8 rounded-full text-[#FF6B00] mb-4 mx-auto w-24 h-24 flex items-center justify-center border border-[#FF6B00]/20">
                                  {React.cloneElement(cat.icon, { className: "w-10 h-10" })}
                                </div>
                              </div>
                            </div>

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="text-sm font-medium">Click to explore →</p>
                            </div>
                          </div>

                          {/* Category Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF6B00] transition-colors">
                              {cat.name}
                            </h3>
                            <p className="text-[#B3B3B3] text-sm leading-relaxed mb-4">
                              {cat.description}
                            </p>

                            {/* Stats */}
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-sm text-[#B3B3B3]">
                                <span className="font-semibold text-white">{cat.count}</span> Products
                              </div>
                              {cat.avgPrice > 0 && (
                                <div className="text-sm text-[#B3B3B3]">
                                  Avg: <span className="font-semibold text-[#FF6B00]">₹{Math.round(cat.avgPrice).toLocaleString()}</span>
                                </div>
                              )}
                            </div>

                            {/* Sample Products Preview */}
                            {cat.sampleProducts.length > 0 && (
                              <div className="space-y-2 mb-4">
                                <h4 className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wide">Featured Items:</h4>
                                <div className="space-y-2">
                                  {cat.sampleProducts.slice(0, 2).map((product) => (
                                    <div 
                                      key={product._id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductClick(product._id);
                                      }}
                                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#121212] transition-colors cursor-pointer border border-[#333333]/30"
                                    >
                                      <div className="w-10 h-10 bg-[#121212] rounded overflow-hidden flex-shrink-0 border border-[#333333]">
                                        <ImageWithFallback
                                          src={product.images?.[0]}
                                          alt={product.name}
                                          className="w-full h-full object-contain"
                                          fallbackSrc="/images/placeholder-product.jpg"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-white truncate">{product.name}</p>
                                        <p className="text-xs text-[#FF6B00] font-semibold">₹{product.price?.toLocaleString()}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Button */}
                            <button
                              onClick={() => handleViewAllClick(cat.id)}
                              className="w-full bg-[#FF6B00] hover:bg-[#FF8533] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                              Browse {cat.name}
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Categories Message */}
            {filteredCategories.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#333333]">
                  <Package className="w-8 h-8 text-[#B3B3B3]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No categories found</h3>
                <p className="text-[#B3B3B3] text-lg mb-6">
                  {activeGroup === 'all' 
                    ? "No product categories available at the moment."
                    : `No products found in ${activeGroup} category.`
                  }
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-[#FF6B00] text-white px-6 py-3 rounded-lg hover:bg-[#FF8533] transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="bg-[#2C2C2C] text-white py-16 border-t border-[#333333]">
          <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Help Choosing the Right Product?
            </h2>
            <p className="text-lg md:text-xl text-[#B3B3B3] mb-8">
              Our tech experts are here to help you find the perfect solution for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-[#FF6B00] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#FF8533] transition-colors"
              >
                Contact Expert
              </button>
              <button 
                onClick={() => navigate('/components')}
                className="border-2 border-[#FF1744] text-[#FF1744] px-8 py-3 rounded-lg font-semibold hover:bg-[#FF1744] hover:text-white transition-colors"
              >
                View Components
              </button>
              <button 
                onClick={() => navigate('/workstations')}
                className="border-2 border-[#FF1744] text-[#FF1744] px-8 py-3 rounded-lg font-semibold hover:bg-[#FF1744] hover:text-white transition-colors"
              >
                View Workstations
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CategoriesPage;