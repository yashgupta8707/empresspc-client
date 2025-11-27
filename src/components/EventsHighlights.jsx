import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, ExternalLink } from 'lucide-react';

const EventsHighlights = ({ reels = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0`;
  };

  // Get thumbnail URL
  const getThumbnailUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const nextHighlight = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(reels.length / 2));
  };

  const prevHighlight = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(reels.length / 2)) % Math.ceil(reels.length / 2));
  };

  // Get current pair of reels to display
  const getCurrentPair = () => {
    const startIndex = currentIndex * 2;
    return [
      reels[startIndex],
      reels[startIndex + 1]
    ].filter(Boolean);
  };

  const currentPair = getCurrentPair();

  if (!reels.length) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Events Highlights
        </h2>
        <div className="text-center text-gray-500">
          No highlights available. Add YouTube links to display content.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Events Highlights
        </h2>
      </div>

      {/* Main Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        {Math.ceil(reels.length / 2) > 1 && (
          <>
            <button
              onClick={prevHighlight}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextHighlight}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Video Pair Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentPair.map((reel, index) => (
            <div key={`${currentIndex}-${index}`} className="group">
              {/* Orange Border Container */}
              <div className="relative bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 p-1 rounded-2xl shadow-2xl">
                <div className="bg-black rounded-xl overflow-hidden">
                  {/* Video Container */}
                  <div className="relative aspect-[9/16] max-h-[500px]">
                    {/* Thumbnail Background */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${getThumbnailUrl(reel.url)})`
                      }}
                    >
                      <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    {/* YouTube Embed */}
                    <iframe
                      src={getEmbedUrl(reel.url)}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={reel.title || `Highlight ${currentIndex * 2 + index + 1}`}
                    />

                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                      {/* Title and Description */}
                      <div className="text-white">
                        {reel.title && (
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">
                            {reel.title}
                          </h3>
                        )}
                        {reel.description && (
                          <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                            {reel.description}
                          </p>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <a
                            href={reel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                          >
                            <Play size={16} />
                            Watch Full
                          </a>
                          <button className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Orange Accent Corner */}
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-orange-500 rounded-full shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info Below (Optional) */}
              {(reel.category || reel.date) && (
                <div className="mt-4 px-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    {reel.category && (
                      <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                        {reel.category}
                      </span>
                    )}
                    {reel.date && (
                      <span>{reel.date}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        {Math.ceil(reels.length / 2) > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(reels.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-orange-500 w-8'
                    : 'bg-gray-300 hover:bg-orange-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        <div className="text-center mt-4 text-sm text-gray-500">
          Showing {currentIndex * 2 + 1}-{Math.min(currentIndex * 2 + 2, reels.length)} of {reels.length} highlights
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EventsHighlights;