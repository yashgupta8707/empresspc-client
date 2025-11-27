import React, { useState, useEffect } from 'react';
import { Sparkles, Waves, Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { eventAPI } from '../services/api';
import ImageWithFallback from './ImageWithFallback';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const EventSchedule = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventSchedule();
  }, []);

  const fetchEventSchedule = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEventSchedule({ limit: 10 });
      setEvents(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching event schedule:', err);
      // Set fallback data on error
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLocation = (location) => {
    return location;
  };

  // Fallback data
  const fallbackEvents = [
    {
      _id: 'fallback-1',
      image: '/images/Event/event1.png',
      date: new Date('2025-06-08'),
      location: 'Lucknow',
      title: 'Valorant Showdown 2025',
      description: 'Join the ultimate gaming competition with prizes up to ₹100,000',
      startTime: '10:00 AM',
      endTime: '6:00 PM'
    },
    {
      _id: 'fallback-2',
      image: '/images/Event/event1.png',
      date: new Date('2025-06-08'),
      location: 'Lucknow',
      title: 'Creator Bootcamp Launch',
      description: 'Learn from industry experts and kickstart your creative journey',
      startTime: '2:00 PM',
      endTime: '4:00 PM'
    },
    {
      _id: 'fallback-3',
      image: '/images/Event/event1.png',
      date: new Date('2025-06-08'),
      location: 'Lucknow',
      title: 'Custom Build Workshop',
      description: 'Hands-on PC building workshop for beginners and enthusiasts',
      startTime: '9:00 AM',
      endTime: '12:00 PM'
    },
    {
      _id: 'fallback-4',
      image: '/images/Event/event1.png',
      date: new Date('2025-06-10'),
      location: 'Delhi',
      title: 'Esports Summit 2025',
      description: 'The biggest esports gathering in India with top professionals',
      startTime: '11:00 AM',
      endTime: '5:00 PM'
    },
    {
      _id: 'fallback-5',
      image: '/images/Event/event1.png',
      date: new Date('2025-06-12'),
      location: 'Mumbai',
      title: 'Future of Gaming Expo',
      description: 'Explore cutting-edge gaming technology and innovations',
      startTime: '10:00 AM',
      endTime: '8:00 PM'
    },
  ];

  const eventsToShow = events.length > 0 ? events : fallbackEvents;

  if (loading) {
    return (
      <section className="bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-12">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
                Upcoming Events Schedule
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0">
                Loading upcoming events...
              </p>
            </div>
          </div>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-12">
          <div className="flex-shrink-0 mr-2 sm:mr-4 z-[10] hidden sm:block">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-orange-300 opacity-50" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
              Upcoming Events Schedule
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto sm:mx-0">
              <span className="text-orange-600 font-semibold">Tech Event 2025</span> showcases groundbreaking innovations, featuring keynote talks,
              interactive workshops, and networking sessions for tech enthusiasts and industry leaders.
            </p>
          </div>

          <div className="flex-shrink-0 ml-2 sm:ml-4 hidden sm:block">
            <Waves className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-orange-300 opacity-50 rotate-90" />
          </div>
        </div>

        {error && (
          <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg mb-6 text-sm">
            Could not load live events. Showing sample content.
            <button
              onClick={fetchEventSchedule}
              className="ml-2 text-orange-900 underline hover:no-underline font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Scrollable Events */}
        <div className="overflow-x-auto hide-scrollbar pb-6 md:pb-8">
          <div className="flex flex-row flex-nowrap gap-x-6 md:gap-x-8 lg:gap-x-10">
            {eventsToShow.map((event, index) => (
              <motion.div
                key={event._id}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]
                  bg-white rounded-2xl shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] hover:-translate-y-1
                  transition-all duration-300 ease-out cursor-pointer 
                  border border-gray-100 overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={index}
                variants={cardVariants}
              >
                {/* Gradient Header with Image */}
                <div className="relative h-48 sm:h-52 md:h-56 bg-gradient-to-br from-orange-500 to-orange-700 rounded-t-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600"></div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-6 left-4 w-8 h-8 bg-white/20 rounded-full blur-lg"></div>
                  <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-white/15 rounded-full blur-md"></div>
                  
                  {/* Event Image Overlay */}
                  <div className="absolute inset-4 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                    <ImageWithFallback
                      src={event.image}
                      alt={`Event banner for ${event.title}`}
                      className="w-full h-full object-cover opacity-80"
                      fallbackSrc="/images/Event/event1.png"
                    />
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                    <div className="flex items-center gap-1 text-orange-600">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-semibold">
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* White Body Content */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  {event.description && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* Event Details */}
                  <div className="space-y-3 pt-2">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{formatLocation(event.location)}</span>
                    </div>

                    {/* Time */}
                    {event.startTime && event.endTime && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-3">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-red-600 
                      text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 
                      shadow-sm hover:shadow-md transform hover:scale-[1.02]">
                      Learn More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default EventSchedule;