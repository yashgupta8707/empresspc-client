import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const YouTubeReels = ({ reels = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const containerRef = useRef(null);

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=${isAutoPlay ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0`;
  };

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const nextReel = () => {
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const prevReel = () => {
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const goToReel = (index) => {
    setCurrentIndex(index);
  };

  // Auto-advance reels
  useEffect(() => {
    if (isAutoPlay && reels.length > 1) {
      const interval = setInterval(() => {
        nextReel();
      }, 15000); // Auto advance every 15 seconds
      return () => clearInterval(interval);
    }
  }, [currentIndex, isAutoPlay, reels.length]);

  if (!reels.length) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Events Highlights
        </h2>
        <div className="text-center text-gray-500">
          No reels available. Add YouTube links to display content.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Events Highlights
        </h2>
        <p className="text-gray-600">
          Watch the best moments from our gaming events
        </p>
      </div>

      {/* Main Reel Container */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* Orange Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 p-1 rounded-2xl">
          <div className="w-full h-full bg-black rounded-xl overflow-hidden">
            {/* Current Reel */}
            <div className="relative w-full h-[600px] lg:h-[700px]">
              <iframe
                ref={containerRef}
                src={getEmbedUrl(reels[currentIndex].url)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={reels[currentIndex].title || `Reel ${currentIndex + 1}`}
              />

              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none">
                {/* Navigation Arrows */}
                {reels.length > 1 && (
                  <>
                    <button
                      onClick={prevReel}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 pointer-events-auto backdrop-blur-sm"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextReel}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 pointer-events-auto backdrop-blur-sm"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Bottom Info Panel */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
                  <div className="flex items-end justify-between">
                    {/* Reel Info */}
                    <div className="flex-1">
                      {reels[currentIndex].title && (
                        <h3 className="text-white text-xl font-bold mb-2">
                          {reels[currentIndex].title}
                        </h3>
                      )}
                      {reels[currentIndex].description && (
                        <p className="text-gray-300 text-sm mb-3 max-w-md">
                          {reels[currentIndex].description}
                        </p>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <button
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                          isAutoPlay 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                            : 'bg-black/30 hover:bg-black/50 text-white'
                        }`}
                      >
                        Auto Play
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reel Indicators/Thumbnails */}
      {reels.length > 1 && (
        <div className="mt-6">
          <div className="flex justify-center gap-3 overflow-x-auto pb-2">
            {reels.map((reel, index) => (
              <button
                key={index}
                onClick={() => goToReel(index)}
                className={`flex-shrink-0 relative w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === currentIndex
                    ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-100'
                    : 'hover:ring-2 hover:ring-orange-300 hover:ring-offset-1 hover:ring-offset-gray-100'
                }`}
              >
                <img
                  src={`https://img.youtube.com/vi/${extractVideoId(reel.url)}/mqdefault.jpg`}
                  alt={reel.title || `Reel ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {reels.length > 1 && isAutoPlay && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-600 h-1 rounded-full transition-all duration-100"
              style={{
                width: `${((currentIndex + 1) / reels.length) * 100}%`
              }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            {currentIndex + 1} of {reels.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeReels;