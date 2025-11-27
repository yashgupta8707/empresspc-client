import { useEffect, useState, useRef } from "react";
import { aboutAPI } from "../services/api";

export default function Gallery({ galleryItems = [] }) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState(galleryItems);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const carouselRef = useRef(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Fetch gallery items if not provided as props
  useEffect(() => {
    const fetchGalleryItems = async () => {
      if (galleryItems.length > 0) {
        setItems(galleryItems);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching gallery items...');
        const response = await aboutAPI.getAllGalleryItems();
        console.log('Gallery API response:', response);
        
        // Handle the response structure
        let fetchedItems = [];
        if (response.success) {
          fetchedItems = response.galleryItems || response.data || [];
        } else if (response.galleryItems) {
          fetchedItems = response.galleryItems;
        } else if (Array.isArray(response)) {
          fetchedItems = response;
        }
        
        // Validate items structure
        const validItems = fetchedItems.filter(item => 
          item.title && 
          item.image && 
          item.hasOwnProperty('isActive')
        );
        
        console.log('Valid gallery items found:', validItems.length);
        setItems(validItems);
        
      } catch (error) {
        console.error('Error fetching gallery items:', error);
        setError(error.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, [galleryItems]);

  // Filter active gallery items
  const activeItems = items.filter(item => item.isActive);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  // Auto-rotate gallery
  useEffect(() => {
    if (isHovered || activeItems.length === 0 || isDragging || selectedImage) return;
    
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % activeItems.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isHovered, activeItems.length, isDragging, selectedImage]);

  // Smooth scroll to active item
  useEffect(() => {
    if (carouselRef.current && activeItems.length > 0) {
      const carousel = carouselRef.current;
      const itemWidth = window.innerWidth < 768 ? 200 : 250; // Responsive item width
      const scrollPosition = active * itemWidth - (carousel.clientWidth / 2) + (itemWidth / 2);
      
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [active]);

  // Modal functions
  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  // Mouse/Touch handlers for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsHovered(true);
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsHovered(false), 1000);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsHovered(true);
    startXRef.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsHovered(false), 1000);
  };

  // Navigation functions
  const goToNext = () => {
    setActive((prev) => (prev + 1) % activeItems.length);
  };

  const goToPrev = () => {
    setActive((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-orange-500 mb-4"></div>
        <h2 className="text-xl md:text-3xl font-bold mb-2">Loading Gallery...</h2>
        <p className="text-sm md:text-base text-gray-500">Fetching our amazing builds</p>
      </div>
    );
  }

  // Error state
  if (error && activeItems.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-orange-500 mb-4">
          <svg className="w-8 h-8 md:w-12 md:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl md:text-3xl font-bold mb-2 text-gray-800">Unable to Load Gallery</h2>
        <p className="text-sm md:text-base text-gray-500 mb-4 text-center px-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg transition-colors text-sm md:text-base"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (activeItems.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-3xl font-bold mb-4 text-gray-800">Gallery Coming Soon</h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">We're preparing some amazing builds to showcase. Check back soon!</p>
          <p className="text-xs md:text-sm text-gray-500">Admin: Add gallery items in the admin panel to display them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 py-6 md:py-16">
      {/* Header Section */}
      <div className="text-center mb-6 md:mb-12 px-4">
        <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-800">
          Explore Our <span className="text-orange-500">Memories</span>
        </h2>
        {/* <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Explore Our Memories
        </p> */}
        
        {/* Gallery Stats */}
        <div className="flex justify-center gap-6 md:gap-8 mt-4 md:mt-6 text-xs md:text-sm text-gray-500">
          {/* <div className="text-center">
            <div className="font-bold text-base md:text-lg text-orange-500">{activeItems.length}</div>
            <div>Total Builds</div>
          </div> */}
          {/* <div className="text-center">
            <div className="font-bold text-base md:text-lg text-orange-500">{active + 1}</div>
            <div>Currently Viewing</div>
          </div> */}
        </div>
      </div>

      {/* Main Gallery Carousel */}
      <div className="relative w-full">
        {/* Navigation Buttons - Hidden on mobile */}
        <button
          onClick={goToPrev}
          className="hidden md:block absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 hover:text-orange-500 p-2 lg:p-3 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="hidden md:block absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 hover:text-orange-500 p-2 lg:p-3 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable Carousel Container */}
        <div
          ref={carouselRef}
          className="flex gap-3 md:gap-6 overflow-x-auto scrollbar-hide px-4 md:px-8 py-4 cursor-grab select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {activeItems.map((item, idx) => {
            const isActive = idx === active;

            return (
              <div
                key={item._id || idx}
                className={`relative flex-shrink-0 transition-all duration-500 ${
                  isActive ? 'scale-105 md:scale-110' : 'scale-95 opacity-75'
                }`}
                onClick={() => {
                  if (!isDragging) {
                    setActive(idx);
                    openModal(item.image);
                  }
                }}
                onMouseEnter={() => {
                  if (!isDragging) {
                    setIsHovered(true);
                  }
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                }}
              >
                {/* Main Image with Responsive Size and Matte Orange Border */}
                <div className={`relative group cursor-pointer ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
                  <div className="w-40 h-24 sm:w-48 sm:h-32 md:w-55 md:h-35 lg:w-55 lg:h-35 rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-orange-400/60 shadow-lg md:shadow-2xl hover:shadow-xl md:hover:shadow-3xl transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      draggable={false}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Dots */}
      {/* <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8">
        {activeItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              idx === active 
                ? 'bg-orange-500 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`View build ${idx + 1}`}
          />
        ))}
      </div> */}

      {/* Quick Navigation - Mobile Only */}
      <div className="flex justify-center gap-3 mt-4 md:hidden">
        <button
          onClick={goToPrev}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={goToNext}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
        >
          Next
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 md:p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-gray-300 transition-colors z-60 bg-black/50 rounded-full p-2"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Maximized Image */}
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Gallery image maximized"
              className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}