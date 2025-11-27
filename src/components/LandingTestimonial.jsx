import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Users, Play, Pause } from "lucide-react";

const testimonials = [
  {
    title: "Flawless Performance",
    rating: 5,
    content:
      "Got my custom gaming rig from Empress PC, and it runs every AAA title on ultra settings without breaking a sweat. Absolutely loving the build quality.",
    name: "Jordan Smith",
    location: "Seattle, Washington",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    verified: true,
    purchaseDate: "2024-01-15"
  },
  {
    title: "Expert Support",
    rating: 5,
    content:
      "Had a few doubts before ordering, but their support team helped me pick the perfect configuration. Even followed up after delivery to ensure everything was smooth.",
    name: "Taylor Christos",
    location: "Austin, Texas",
    img: "https://randomuser.me/api/portraits/men/52.jpg",
    verified: true,
    purchaseDate: "2024-02-20"
  },
  {
    title: "Fully Custom, Fully Satisfied",
    rating: 4.5,
    content:
      "Loved how I could choose every part. They even gave me thermal and airflow optimization tips. My workstation looks clean and runs cooler than expected.",
    name: "Alex Williams",
    location: "London, England",
    img: "https://randomuser.me/api/portraits/women/22.jpg",
    verified: true,
    purchaseDate: "2024-01-08"
  },
  {
    title: "Delivered Fast & Ready",
    rating: 5,
    content:
      "PC arrived earlier than estimated and was perfectly assembled. Plug and play—no hassles. Packaging was secure, and the aesthetics were exactly as I imagined.",
    name: "Reena Desai",
    location: "Mumbai, India",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
    purchaseDate: "2024-03-10"
  },
  {
    title: "Clean Build, Killer Looks",
    rating: 4.5,
    content:
      "Ordered a liquid-cooled editing rig for my studio work. The RGB sync, cable management, and quiet fans make it a dream setup.",
    name: "Diego Morales",
    location: "Barcelona, Spain",
    img: "https://randomuser.me/api/portraits/men/72.jpg",
    verified: true,
    purchaseDate: "2024-02-28"
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(nextSlide, 6000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center justify-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < fullStars
                ? "text-amber-400 fill-amber-400"
                : i === fullStars && hasHalfStar
                ? "text-amber-400 fill-amber-400/50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating}/5
        </span>
      </div>
    );
  };

  const t = testimonials[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-12 md:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/20 mb-6">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Customer Stories</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Don't take our word for it...
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what our customers love about their custom PC builds
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative max-w-5xl mx-auto mb-12">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white group"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          </button>

          {/* Autoplay Control */}
          <button
            onClick={toggleAutoplay}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white group"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
            ) : (
              <Play className="w-4 h-4 text-gray-600 group-hover:text-gray-800 ml-0.5" />
            )}
          </button>

          {/* Main Card */}
          <div 
            className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden transition-all duration-700 mx-16 sm:mx-8 lg:mx-0"
            onMouseEnter={() => setHoveredCard(current)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative p-8 sm:p-12 lg:p-16">
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 opacity-10">
                <Quote className="w-16 h-16 text-blue-600" />
              </div>

              {/* Verified Badge */}
              {t.verified && (
                <div className="absolute top-6 right-6 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Verified Purchase
                </div>
              )}

              <div className="relative z-10 text-center space-y-8">
                {/* Rating */}
                <div className="space-y-2">
                  {renderStars(t.rating)}
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {t.title}
                  </h3>
                </div>

                {/* Content */}
                <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto italic">
                  "{t.content}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                  <div className="relative">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white transition-transform duration-300 hover:scale-110"
                    />
                    {t.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <p className="text-xl font-bold text-gray-900">{t.name}</p>
                    <p className="text-gray-600 text-sm">{t.location}</p>
                    {t.purchaseDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Customer since {new Date(t.purchaseDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative group transition-all duration-300 ${
                index === current ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <img
                src={testimonial.img}
                alt={testimonial.name}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-lg transition-all duration-300 ${
                  index === current
                    ? 'ring-4 ring-blue-500 ring-offset-2'
                    : 'ring-2 ring-gray-200 hover:ring-gray-300 grayscale hover:grayscale-0'
                }`}
              />
              
              {/* Active indicator */}
              {index === current && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-3 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === current
                  ? 'w-8 h-3 bg-blue-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:bg-white/80">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                {testimonials.length}+
              </div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:bg-white/80">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
              </div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:bg-white/80">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
                100%
              </div>
              <p className="text-gray-600 font-medium">Satisfaction Rate</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-white/60 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All reviews verified</span>
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Real customer experiences</span>
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Quote className="w-4 h-4 text-blue-500" />
              <span>Authentic feedback</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${((current + 1) / testimonials.length) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1</span>
            <span>{testimonials.length}</span>
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-8 right-8 z-30">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20">
          <span className="text-sm font-semibold">Share Your Story</span>
        </div>
      </div>
    </section>
  );
}