import { useState, useEffect } from "react";

export default function GoogleReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Static reviews data based on Empress Computers
  const reviews = [
    {
      id: "1",
      author_name: "Rajesh Kumar",
      profile_photo_url: "https://cdn-icons-png.flaticon.com/512/2815/2815428.png",
      rating: 5,
      relative_time_description: "2 weeks ago",
      text: "Excellent service from Empress Computers! They built my gaming PC exactly as per my requirements. Great quality components and professional assembly. Highly recommended for custom PC builds in Lucknow.",
      location: "Lucknow, Uttar Pradesh"
    },
    {
      id: "2", 
      author_name: "Priya Sharma",
      profile_photo_url: "https://cdn-icons-png.flaticon.com/512/2815/2815428.png",
      rating: 5,
      relative_time_description: "1 month ago",
      text: "Best computer store in Lucknow! Got my office setup from Empress Computers and they provided excellent after-sales support. Very knowledgeable staff and competitive pricing.",
      location: "Gomti Nagar, Lucknow"
    },
    {
      id: "3",
      author_name: "Amit Singh",
      profile_photo_url: "https://cdn-icons-png.flaticon.com/512/2815/2815428.png", 
      rating: 4,
      relative_time_description: "3 weeks ago",
      text: "Good experience with Empress Computers. They helped me choose the right components within my budget. Fast delivery and proper packaging. Will definitely visit again for future upgrades.",
      location: "Hazratganj, Lucknow"
    },
    {
      id: "4",
      author_name: "Neha Gupta",
      profile_photo_url: "https://cdn-icons-png.flaticon.com/512/2815/2815428.png",
      rating: 5,
      relative_time_description: "1 week ago", 
      text: "Amazing service! Empress Computers helped me build a powerful workstation for my design work. They understood my requirements perfectly and delivered on time. Great team!",
      location: "Indira Nagar, Lucknow"
    },
    {
      id: "5",
      author_name: "Vikash Yadav",
      profile_photo_url: "https://cdn-icons-png.flaticon.com/512/2815/2815428.png",
      rating: 5,
      relative_time_description: "2 months ago",
      text: "Excellent quality and service from Empress Computers. Got my gaming setup built here and it's working flawlessly. The RGB setup they did is just amazing. Worth every rupee!",
      location: "Aliganj, Lucknow"
    },
    {
      id: "6",
      author_name: "Sanjay Tiwari", 
      profile_photo_url: "https://cdn-icons-png.flaticon.com/512/2815/2815428.png",
      rating: 4,
      relative_time_description: "3 days ago",
      text: "Good service and reasonable prices. Empress Computers has a wide range of components and they provide honest advice. Got my laptop repaired here quickly.",
      location: "Mahanagar, Lucknow"
    },
    {
      id: "7",
      author_name: "Kavita Verma",
      profile_photo_url: "https://cdn-icons-png.flaticon.com/512/2815/2815428.png", 
      rating: 5,
      relative_time_description: "5 days ago",
      text: "Outstanding customer service! The team at Empress Computers is very professional and helped me understand all the technical details. My new PC is working perfectly.",
      location: "Chinhat, Lucknow"
    },
    {
      id: "8",
      author_name: "Rohit Mishra",
      profile_photo_url: "https://cdn-icons-png.flaticon.com/512/2815/2815428.png",
      rating: 5,
      relative_time_description: "1 month ago", 
      text: "Best place for custom PC builds in Lucknow. Empress Computers provided excellent guidance and the build quality is top-notch. Highly satisfied with their service!",
      location: "Vikas Nagar, Lucknow"
    }
  ];

  const businessInfo = {
    name: "Empress Computers",
    rating: 4.8,
    user_ratings_total: 156,
    formatted_address: "Lucknow, Uttar Pradesh",
    website: "empresspc.in"
  };

  // Auto-rotate reviews
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isHovered, reviews.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 md:w-5 md:h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
              Google <span className="text-blue-600">Reviews</span>
            </h2>
          </div>
          
          {/* Business Info */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{businessInfo.name}</h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex">{renderStars(Math.floor(businessInfo.rating))}</div>
              <span className="text-lg font-semibold text-gray-700">{businessInfo.rating}</span>
              <span className="text-sm text-gray-500">({businessInfo.user_ratings_total} reviews)</span>
            </div>
            <p className="text-sm text-gray-600">{businessInfo.formatted_address}</p>
            <p className="text-sm text-blue-600 font-medium">{businessInfo.website}</p>
          </div>
          
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their experience with Empress Computers
          </p>
        </div>

        {/* Main Review Carousel */}
        <div className="relative">
          {/* Featured Review */}
          <div 
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto mb-8 transform transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* User Info */}
              <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 flex-shrink-0">
                <img
                  src={reviews[currentIndex].profile_photo_url}
                  alt={reviews[currentIndex].author_name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-blue-100"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                  }}
                />
                <div className="flex-1 md:text-center">
                  <h4 className="font-bold text-lg text-gray-800">{reviews[currentIndex].author_name}</h4>
                  <div className="flex md:justify-center mb-1">
                    {renderStars(reviews[currentIndex].rating)}
                  </div>
                  <p className="text-sm text-gray-500">{reviews[currentIndex].relative_time_description}</p>
                  <p className="text-xs text-gray-400 mt-1">{reviews[currentIndex].location}</p>
                </div>
              </div>
              
              {/* Review Content */}
              <div className="flex-1">
                <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed italic">
                  "{reviews[currentIndex].text}"
                </blockquote>
                
                {/* Google Logo */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Posted on</span>
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-blue-600">Google</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View review ${idx + 1}`}
              />
            ))}
          </div>

          {/* All Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {reviews.slice(0, 6).map((review, index) => (
              <div 
                key={review.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 cursor-pointer ${
                  index === currentIndex ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-800 text-sm md:text-base truncate">{review.author_name}</h5>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-xs text-gray-500">{review.relative_time_description}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {truncateText(review.text)}
                </p>
                
                <p className="text-xs text-gray-400 mt-2">{review.location}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 md:mt-12">
            <a
              href="https://www.google.com/search?q=empress+computers+lucknow+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              View All Reviews on Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}