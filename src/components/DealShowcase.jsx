import React, { useState, useEffect, useRef } from 'react';
import { Clock, Star, Zap, Shield, Cpu, MonitorSpeaker, ShoppingCart, Heart } from 'lucide-react';
import { useInView } from "react-intersection-observer";
import { dealAPI } from '../services/api';

const DealShowcase = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const [deal, setDeal] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('DealShowcase component mounted, fetching current deal...');
    fetchCurrentDeal();
  }, []);

  const fetchCurrentDeal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching current deal...');
      
      const response = await dealAPI.getCurrentDeal();
      console.log('Current deal API response:', response);
      
      if (response.success && response.data.deal) {
        console.log('Deal found:', response.data.deal);
        setDeal(response.data.deal);
        // Initialize timer with actual end time
        if (response.data.deal.dealTiming?.endDate) {
          updateTimeLeft(response.data.deal.dealTiming.endDate);
        }
      } else {
        console.log('No active deal found, using fallback');
        setError('No active deal found');
        // Use fallback static data
        setDeal(getFallbackDeal());
      }
    } catch (err) {
      console.error('Error fetching current deal:', err);
      console.log('API call failed, using fallback deal');
      setError(`API Error: ${err.message}`);
      // Use fallback static data
      setDeal(getFallbackDeal());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackDeal = () => ({
    _id: 'fallback',
    title: 'High Spec Gaming PC',
    description: 'Ultimate performance meets unbeatable price. Limited time offer on our premium gaming build.',
    product: {
      name: 'Gaming Beast PC',
      specifications: [
        { label: 'Processor', value: 'Intel i7-13700KF' },
        { label: 'Graphics', value: 'RTX 4070 Super' },
        { label: 'Memory', value: '32GB DDR5' },
        { label: 'Storage', value: '1TB NVMe SSD' },
        { label: 'Cooling', value: 'AIO Liquid Cooling' }
      ]
    },
    pricing: {
      originalPrice: 249999,
      salePrice: 199999,
      currency: 'INR',
      emiStarting: 8333
    },
    images: {
      main: {
        url: '/images/Emperor.png',
        alt: 'Gaming Beast PC'
      }
    },
    marketing: {
      badgeText: 'DEAL OF THE DAY',
      urgencyText: 'Limited time offer',
      highlights: [
        { icon: 'Star', text: 'Customer Rating', value: '4.9/5' },
        { icon: 'Shield', text: 'Warranty', value: '3 Years' }
      ]
    },
    dealTiming: {
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    },
    discountPercentage: 20,
    savingsAmount: 50000
  });

  const updateTimeLeft = (endDate) => {
    if (!endDate) return;
    
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft({ hours, minutes, seconds });
  };

  useEffect(() => {
    if (!deal?.dealTiming?.endDate) return;

    const timer = setInterval(() => {
      updateTimeLeft(deal.dealTiming.endDate);
    }, 1000);

    return () => clearInterval(timer);
  }, [deal]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const container = containerRef.current;
    if (container && window.innerWidth >= 1024) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleBuyNow = async () => {
    if (deal && deal._id !== 'fallback') {
      try {
        await dealAPI.trackDealClick(deal._id);
      } catch (err) {
        console.error('Error tracking click:', err);
      }
    }
    // Add your buy now logic here
    console.log('Buy now clicked for deal:', deal);
  };

  const handleAddToWishlist = async () => {
    if (deal && deal._id !== 'fallback') {
      try {
        await dealAPI.trackDealClick(deal._id);
      } catch (err) {
        console.error('Error tracking click:', err);
      }
    }
    // Add your wishlist logic here
    console.log('Add to wishlist clicked for deal:', deal);
  };

  const formatPrice = (price, currency = 'INR') => {
    if (!price) return '₹0';
    
    if (currency === 'INR') {
      return `₹${price.toLocaleString()}`;
    }
    return `${currency} ${price.toLocaleString()}`;
  };

  const getIconComponent = (iconName) => {
    const icons = { Star, Shield, Clock, Zap, Cpu, MonitorSpeaker };
    return icons[iconName] || Star;
  };

  // Calculate discount percentage and savings if not provided
  const getDiscountPercentage = () => {
    if (deal?.discountPercentage) return deal.discountPercentage;
    
    const originalPrice = deal?.pricing?.originalPrice || 0;
    const salePrice = deal?.pricing?.salePrice || 0;
    
    if (originalPrice > 0 && salePrice > 0) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }
    return 20; // fallback
  };

  const getSavingsAmount = () => {
    if (deal?.savingsAmount) return deal.savingsAmount;
    
    const originalPrice = deal?.pricing?.originalPrice || 0;
    const salePrice = deal?.pricing?.salePrice || 0;
    
    return originalPrice - salePrice;
  };

  // Add debugging logs
  console.log('DealShowcase render - deal:', deal);
  console.log('DealShowcase render - loading:', loading);
  console.log('DealShowcase render - error:', error);

  if (loading) {
    return (
      <div className="relative mx-auto my-4 px-3 sm:px-4 rounded-2xl overflow-hidden min-h-screen lg:min-h-0 max-w-7xl bg-gradient-to-br from-orange-100 to-red-100">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error && !deal) {
    return (
      <div className="relative mx-auto my-4 px-3 sm:px-4 rounded-2xl overflow-hidden min-h-screen lg:min-h-0 max-w-7xl bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No active deals at the moment</p>
            <p className="text-sm text-gray-500 mb-4">Error: {error}</p>
            <button 
              onClick={fetchCurrentDeal}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`
        relative
        mx-6
        my-4
        px-3 sm:px-4
        rounded-2xl
        overflow-hidden
        transition-opacity duration-1000
        ${inView ? "animate-fadeInFromBack" : "opacity-0"}
        min-h-screen lg:min-h-0
        max-w-screen
      `}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(251, 146, 60, 0.3) 0%,
            rgba(239, 68, 68, 0.2) 25%,
            rgba(168, 85, 247, 0.2) 50%,
            rgba(59, 130, 246, 0.1) 75%,
            rgba(16, 185, 129, 0.1) 100%
          ),
          linear-gradient(135deg,
            #fff7ed 0%,
            #fed7aa 15%,
            #fdba74 30%,
            #fb923c 45%,
            #ea580c 60%,
            #dc2626 75%,
            #991b1b 90%,
            #450a0a 100%
          )
        `,
        transition: 'background 0.3s ease-out'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated shapes - hidden on mobile, visible on lg screens */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute animate-float hidden lg:block"
            style={{
              left: `${15 + (i * 7)}%`,
              top: `${10 + (i * 6)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          >
            <div
              className={`
                w-${6 + (i % 4) * 2} h-${6 + (i % 4) * 2}
                bg-gradient-to-br from-orange-400/30 to-red-500/20
                rounded-full blur-sm
                transform-gpu perspective-1000
              `}
              style={{
                transform: `rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`,
                boxShadow: `
                  0 ${8 + i * 1.5}px ${15 + i * 2}px rgba(251, 146, 60, 0.3),
                  inset 0 0 ${10 + i}px rgba(255, 255, 255, 0.1)
                `,
                transition: 'transform 0.1s ease-out'
              }}
            />
          </div>
        ))}

        {/* Particles - hidden on mobile, visible on lg screens */}
        {[...Array(60)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-pulse hidden lg:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          >
            <div
              className="w-0.5 h-0.5 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"
              style={{
                boxShadow: '0 0 6px currentColor',
                filter: `hue-rotate(${i * 4}deg)`
              }}
            />
          </div>
        ))}

        {/* Circuit SVG - hidden on mobile, visible on lg screens */}
        <svg className="absolute inset-0 w-full h-full opacity-30 hidden lg:block" viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="circuit1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#glow)">
            <path
              d="M100,300 Q400,200 800,300 T1500,300"
              stroke="url(#circuit1)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDuration: '3s' }}
            />
            <path
              d="M200,500 Q600,600 1000,500 T1600,500"
              stroke="url(#circuit1)"
              strokeWidth="1.5"
              fill="none"
              className="animate-pulse"
              style={{ animationDuration: '4s', animationDelay: '1s' }}
            />
            <path
              d="M150,700 Q500,800 900,700 T1400,700"
              stroke="url(#circuit1)"
              strokeWidth="1.5"
              fill="none"
              className="animate-pulse"
              style={{ animationDuration: '5s', animationDelay: '2s' }}
            />
          </g>
        </svg>

        {/* Wings - hidden on mobile, visible on lg screens */}
        <div className="absolute inset-0 hidden lg:block">
          {[...Array(4)].map((_, i) => (
            <div
              key={`wing-${i}`}
              className="absolute opacity-20"
              style={{
                left: `${25 + i * 18}%`,
                top: `${35 + i * 10}%`,
                transform: `rotate(${i * 40}deg)`,
              }}
            >
              <div
                className="w-24 h-1.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full animate-pulse"
                style={{
                  animationDuration: `${3 + i}s`,
                  animationDelay: `${i * 0.5}s`,
                  filter: 'blur(0.5px)'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="relative z-10 h-full flex items-center py-6 lg:py-8">
        <div className="w-full max-w-4xl mx-auto px-4 lg:px-6">

          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium mb-3 border border-white/30 shadow-md">
              <Zap className="w-4 h-4 animate-pulse text-yellow-300" />
              <span className="font-semibold">{deal?.marketing?.badgeText || 'DEAL OF THE DAY'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent drop-shadow-xl leading-tight">
              {deal?.title || 'High Spec Gaming PC'}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl mx-auto font-light leading-relaxed">
              {deal?.description || 'Ultimate performance meets unbeatable price. Limited time offer on our premium gaming build.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">

            <div className="lg:col-span-5 space-y-4">
              <div className="group relative">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/15">
                  <div className="aspect-[3/3] rounded-lg overflow-hidden relative">
                    <img
                      src={deal?.images?.main?.url || "/images/Emperor.png"}
                      alt={deal?.images?.main?.alt || deal?.product?.name || "Gaming PC"}
                      className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/images/Emperor.png";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[Cpu, MonitorSpeaker, Shield].map((Icon, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl rounded-lg p-2 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110 group">
                    <div className="aspect-square bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-md flex items-center justify-center">
                      <Icon className="w-5 h-5 text-orange-300 group-hover:text-orange-200 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Cpu className="w-4 h-4 mr-2 text-orange-300" />
                  Specifications
                </h3>
                <div className="space-y-2">
                  {deal?.product?.specifications && deal.product.specifications.length > 0 ? (
                    deal.product.specifications.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-sm">
                        <span className="text-white/80 font-medium">{spec.label}</span>
                        <span className="text-white font-semibold">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    // Fallback specifications
                    [
                      { label: 'Processor', value: 'Intel i7-13700KF' },
                      { label: 'Graphics', value: 'RTX 4070 Super' },
                      { label: 'Memory', value: '32GB DDR5' },
                      { label: 'Storage', value: '1TB NVMe SSD' },
                      { label: 'Cooling', value: 'AIO Liquid Cooling' }
                    ].map((spec, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-sm">
                        <span className="text-white/80 font-medium">{spec.label}</span>
                        <span className="text-white font-semibold">{spec.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {deal?.marketing?.highlights && deal.marketing.highlights.length > 0 ? (
                  deal.marketing.highlights.map((highlight, i) => {
                    const IconComponent = getIconComponent(highlight.icon);
                    return (
                      <div key={i} className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-pulse" />
                        <div className="text-white text-xl font-bold">{highlight.value}</div>
                        <div className="text-white/70 text-xs">{highlight.text}</div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback highlights
                  [
                    { icon: 'Star', text: 'Customer Rating', value: '4.9/5' },
                    { icon: 'Shield', text: 'Warranty', value: '3 Years' }
                  ].map((highlight, i) => {
                    const IconComponent = getIconComponent(highlight.icon);
                    return (
                      <div key={i} className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-pulse" />
                        <div className="text-white text-xl font-bold">{highlight.value}</div>
                        <div className="text-white/70 text-xs">{highlight.text}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-orange-300 animate-pulse" />
                  <span className="text-white text-base font-semibold">Deal Ends In</span>
                </div>
                <div className="flex justify-center space-x-2">
                  {[
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Min' },
                    { value: timeLeft.seconds, label: 'Sec' }
                  ].map((time, i) => (
                    <div key={i} className="bg-orange-500/30 backdrop-blur-sm rounded-lg p-3 min-w-[50px] border border-orange-400/30">
                      <div className="text-white text-lg font-bold">{time.value.toString().padStart(2, '0')}</div>
                      <div className="text-orange-200 text-xs font-medium">{time.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg text-center">
                <div className="space-y-3 mb-6">
                  <div className="text-white/60 line-through text-base">
                    {formatPrice(deal?.pricing?.originalPrice || 249999, deal?.pricing?.currency)}
                  </div>
                  <div className="text-white text-2xl font-bold">
                    {formatPrice(deal?.pricing?.salePrice || 199999, deal?.pricing?.currency)}
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2.5 py-1 rounded-full inline-block font-semibold shadow-md">
                    Save {formatPrice(getSavingsAmount(), deal?.pricing?.currency)} ({getDiscountPercentage()}% OFF)
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-base"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                  <button 
                    onClick={handleAddToWishlist}
                    className="w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30 flex items-center justify-center space-x-2 text-base"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Add to Wishlist</span>
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-center space-x-4 text-xs text-white/90">
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      <span>Free Shipping</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      <span>Easy Returns</span>
                    </span>
                  </div>
                  {deal?.pricing?.emiStarting && deal.pricing.emiStarting > 0 && (
                    <div className="text-xs text-white/70 font-medium">
                      EMI starting from {formatPrice(deal.pricing.emiStarting, deal?.pricing?.currency)}/month
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(150deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeInFromBack {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInFromBack {
          animation: fadeInFromBack 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DealShowcase;