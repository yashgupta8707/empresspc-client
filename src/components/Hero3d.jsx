import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero3d = () => {
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Banner URLs with fallback handling
  const carouselBanners = [
    "https://i.ibb.co/Q126HWj/banner1.png",
    "https://i.ibb.co/1g2kZQ0/banner2.png",
    "https://i.ibb.co/Fqd3TVJb/banner3.png",
  ];

  const sidebarBanner = "https://i.ibb.co/m5YjmLf9/banner4.png";
  const bottomBanner = "https://i.ibb.co/y1nyHXs/banner5.png";

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselBanners.length);
  }, [carouselBanners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselBanners.length) % carouselBanners.length
    );
  }, [carouselBanners.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Auto-slide functionality (only for desktop/tablet with carousel)
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    // Only run auto-slide if we're not on mobile (where carousel is hidden)
    const checkScreenSize = () => window.innerWidth >= 768; // md breakpoint
    
    if (!checkScreenSize()) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  // Keyboard navigation (only for desktop/tablet)
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle keyboard navigation on larger screens
      if (window.innerWidth < 768) return;
      
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "Escape") setIsAutoPlaying(false);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nextSlide, prevSlide]);

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Container with responsive padding - reduced bottom padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 lg:pt-8 pb-2 sm:pb-4">
        
        {/* Main content wrapper - removed min-height constraints */}
        <div className="flex flex-col gap-4 sm:gap-6">
          
          {/* First Row - Responsive layout with fixed heights */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            
            {/* Mobile: Single Banner (no carousel) - same height as other mobile banners */}
            <div className="block md:hidden w-full bg-white rounded-xl shadow-lg border border-gray-200/50 h-32 overflow-hidden">
              <img
                src={carouselBanners[0]}
                alt="Featured Banner"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="eager"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400/6366f1/ffffff?text=Featured+Banner";
                }}
              />
            </div>

            {/* Desktop/Tablet: Carousel - Fixed height, double the bottom banner */}
            <div className="hidden md:block w-full lg:flex-[7] relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200/50 h-48 sm:h-64 md:h-80 lg:h-96">
              
              {/* Carousel Container */}
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {carouselBanners.map((banner, index) => (
                  <div key={index} className="w-full h-full flex-shrink-0 relative">
                    <img
                      src={banner}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/1200x600/6366f1/ffffff?text=Banner+" + (index + 1);
                      }}
                    />
                    {/* Overlay for better text readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-3 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                aria-label="Next slide"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 bg-black/20 backdrop-blur-md rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                {carouselBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-white shadow-lg scale-125"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Auto-play indicator */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="bg-black/20 backdrop-blur-md text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 hover:bg-black/30"
                  aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isAutoPlaying ? (
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Right Sidebar Banner - Fixed height matching carousel */}
            <div className="hidden lg:block lg:flex-[3] bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-200/50 hover:shadow-2xl transition-shadow duration-300 h-48 sm:h-64 md:h-80 lg:h-96">
              <img
                src={sidebarBanner}
                alt="Sidebar Banner"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x600/8b5cf6/ffffff?text=Sidebar+Banner";
                }}
              />
            </div>
          </div>

          {/* Second Row - Bottom Banner - Half the height of top banners */}
          <div className="h-24 sm:h-32 md:h-40 lg:h-48 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-200/50 hover:shadow-2xl transition-shadow duration-300">
            <img
              src={bottomBanner}
              alt="Bottom Banner"
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1200x200/10b981/ffffff?text=Bottom+Banner";
              }}
            />
          </div>

          {/* Mobile-only: Additional banners from carousel */}
          <div className="block md:hidden space-y-4">
            {/* Second banner from carousel - rectangular */}
            <div className="h-32 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
              <img
                src={carouselBanners[1]}
                alt="Mobile Banner 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x200/f59e0b/ffffff?text=Banner+2";
                }}
              />
            </div>

            {/* Third banner from carousel - rectangular */}
            <div className="h-32 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
              <img
                src={carouselBanners[2]}
                alt="Mobile Banner 3"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x200/ef4444/ffffff?text=Banner+3";
                }}
              />
            </div>

            {/* Sidebar banner for mobile - square format with more rounded edges */}
            <div className="w-full max-w-sm mx-auto aspect-square bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
              <img
                src={sidebarBanner}
                alt="Mobile Sidebar Banner"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Sidebar+Banner";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator for images */}
      <style jsx>{`
        img {
          transition: opacity 0.3s ease-in-out;
        }
        
        img[loading="lazy"] {
          opacity: 0;
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Focus styles for accessibility */
        button:focus {
          outline: 2px solid #6366f1;
          outline-offset: 2px;
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Hero3d;