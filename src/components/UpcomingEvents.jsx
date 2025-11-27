import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { eventAPI } from '../services/api';
import ImageWithFallback from './ImageWithFallback';

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getUpcomingEvents({ limit: 8 });
      setEvents(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching upcoming events:', err);
      // Set fallback data on error
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    return `${startTime} - ${endTime}`;
  };

  // Fallback data
  const fallbackEvents = [
    {
      _id: 'fallback-1',
      title: "The Future of Digital Innovation",
      speaker: {
        name: "Make Torello",
        image: "/images/team/member2.png"
      },
      description:
        "Harnessing emerging technologies to revolutionize industries, enhance user experiences, and drive unprecedented growth in a rapidly evolving digital landscape.",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      category: "gaming",
    },
    {
      _id: 'fallback-2',
      title: "Trends AI and Machine Learning",
      speaker: {
        name: "David Brown",
        image: "/images/team/member3.png"
      },
      description:
        "AI and Machine Learning are revolutionizing industries by enabling advanced data analysis, personalized experiences, and intelligent automation.",
      startTime: "11:15 AM",
      endTime: "12:30 PM",
      category: "conference",
    },
    {
      _id: 'fallback-3',
      title: "Lunch Break & Networking",
      speaker: null,
      description: "Take a break and network with fellow attendees",
      startTime: "12:30 PM",
      endTime: "2:00 PM",
      category: "break",
    },
    {
      _id: 'fallback-4',
      title: "Digital Marketing for a New Era",
      speaker: {
        name: "Jenifer Moore",
        image: "/images/team/member4.png"
      },
      description:
        "Navigate the evolving landscape of digital marketing using innovative strategies and technologies to create compelling campaigns.",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      category: "workshop",
    },
    {
      _id: 'fallback-5',
      title: "Introduction to Blockchain",
      speaker: {
        name: "Emily Davis",
        image: "/images/team/member5.png"
      },
      description:
        "Blockchain introduction: Decentralized ledger tech records secure, transparent, immutable transactions across networks.",
      startTime: "3:00 PM",
      endTime: "4:00 PM",
      category: "conference",
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      gaming: 'bg-yellow-100',
      workshop: 'bg-purple-100',
      conference: 'bg-blue-100',
      tournament: 'bg-red-100',
      expo: 'bg-green-100',
      summit: 'bg-indigo-100',
      break: 'bg-gray-100'
    };
    return colors[category] || 'bg-gray-100';
  };

  const eventsToShow = events.length > 0 ? events : fallbackEvents;

  if (loading) {
    return (
      <section className="pb-10 px-4 bg-white text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">UPCOMING GAMING EVENTS</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-2">
            Loading upcoming events...
          </p>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-10 px-4 bg-white text-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">UPCOMING GAMING EVENTS</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-2">
          Explore the complete event schedule to find sessions, speakers, and activities that match your interests and needs.
        </p>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm">
            Could not load live events. Showing sample content.
            <button
              onClick={fetchUpcomingEvents}
              className="ml-2 text-yellow-900 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-w-4xl mx-auto">
        {eventsToShow.map((event, index) => (
          <div
            ref={ref}
            key={event._id}
            className={`flex flex-col md:flex-row justify-between items-start md:items-center ${getCategoryColor(event.category)} rounded-xl p-2 md:p-4 shadow transition-all duration-500
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  transitionDelay: inView ? `${index * 100}ms` : '0ms',
                }}
          >
            {event.speaker && event.speaker.image ? (
              <div className="flex items-center gap-4 w-full md:w-3/4">
                <ImageWithFallback
                  src={event.speaker.image}
                  alt={event.speaker.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-300"
                  fallbackSrc="/images/team/default-avatar.png"
                />
                <div>
                  <h3 className="text-sm sm:text-lg md:font-semibold">{event.title}</h3>
                  <p className="text-[0.7rem] sm:text-sm text-gray-800">By {event.speaker.name}</p>
                  <p className="text-[0.7rem] sm:text-sm text-gray-600 mt-1">{event.description}</p>
                </div>
              </div>
            ) : (
              <div className="w-full text-center">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                )}
              </div>
            )}
            <div className="text-[0.5rem] sm:text-sm text-gray-700 sm:font-medium md:text-right w-full md:w-1/4 text-right">
              {formatTime(event.startTime, event.endTime)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium text-sm">
          See All Schedule
        </button>
      </div>
    </section>
  );
}



// import { useState, useEffect } from 'react';
// import { useInView } from 'react-intersection-observer';
// import { eventAPI } from '../services/api';
// import ImageWithFallback from './ImageWithFallback';

// export default function UpcomingEvents() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   useEffect(() => {
//     fetchUpcomingEvents();
//   }, []);

//   const fetchUpcomingEvents = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await eventAPI.getUpcomingEvents({ limit: 8 });
      
//       console.log('API Response:', response); // Debug log
      
//       if (response.success && response.data) {
//         setEvents(response.data);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching upcoming events:', err);
//       // Set fallback data on error
//       setEvents(fallbackEvents);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (startTime, endTime) => {
//     if (!startTime || !endTime) return '';
    
//     // Handle different time formats
//     const formatTimeString = (timeStr) => {
//       if (!timeStr) return '';
      
//       // If it's already in AM/PM format, return as is
//       if (timeStr.includes('AM') || timeStr.includes('PM')) {
//         return timeStr;
//       }
      
//       // If it's in 24-hour format (HH:MM), convert to 12-hour
//       const [hours, minutes] = timeStr.split(':');
//       if (hours && minutes) {
//         const hour = parseInt(hours);
//         const ampm = hour >= 12 ? 'PM' : 'AM';
//         const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//         return `${displayHour}:${minutes} ${ampm}`;
//       }
      
//       return timeStr;
//     };

//     return `${formatTimeString(startTime)} - ${formatTimeString(endTime)}`;
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       gaming: 'bg-yellow-100',
//       workshop: 'bg-purple-100',
//       conference: 'bg-blue-100',
//       tournament: 'bg-red-100',
//       expo: 'bg-green-100',
//       summit: 'bg-indigo-100',
//       break: 'bg-gray-100'
//     };
//     return colors[category] || 'bg-gray-100';
//   };

//   // Fallback data - matches the expected structure
//   const fallbackEvents = [
//     {
//       _id: 'fallback-1',
//       title: "The Future of Digital Innovation",
//       speaker: {
//         name: "Make Torello",
//         image: "/images/team/member2.png"
//       },
//       description:
//         "Harnessing emerging technologies to revolutionize industries, enhance user experiences, and drive unprecedented growth in a rapidly evolving digital landscape.",
//       startTime: "10:00",
//       endTime: "11:00",
//       category: "gaming",
//     },
//     {
//       _id: 'fallback-2',
//       title: "Trends AI and Machine Learning",
//       speaker: {
//         name: "David Brown",
//         image: "/images/team/member3.png"
//       },
//       description:
//         "AI and Machine Learning are revolutionizing industries by enabling advanced data analysis, personalized experiences, and intelligent automation.",
//       startTime: "11:15",
//       endTime: "12:30",
//       category: "conference",
//     },
//     {
//       _id: 'fallback-3',
//       title: "Lunch Break & Networking",
//       speaker: null,
//       description: "Take a break and network with fellow attendees",
//       startTime: "12:30",
//       endTime: "14:00",
//       category: "break",
//     },
//     {
//       _id: 'fallback-4',
//       title: "Digital Marketing for a New Era",
//       speaker: {
//         name: "Jenifer Moore",
//         image: "/images/team/member4.png"
//       },
//       description:
//         "Navigate the evolving landscape of digital marketing using innovative strategies and technologies to create compelling campaigns.",
//       startTime: "14:00",
//       endTime: "15:00",
//       category: "workshop",
//     },
//     {
//       _id: 'fallback-5',
//       title: "Introduction to Blockchain",
//       speaker: {
//         name: "Emily Davis",
//         image: "/images/team/member5.png"
//       },
//       description:
//         "Blockchain introduction: Decentralized ledger tech records secure, transparent, immutable transactions across networks.",
//       startTime: "15:00",
//       endTime: "16:00",
//       category: "conference",
//     },
//   ];

//   // Use API data if available, otherwise fallback
//   const eventsToShow = events.length > 0 ? events : (error ? fallbackEvents : []);

//   if (loading) {
//     return (
//       <section className="pb-10 px-4 bg-white text-black">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-2">UPCOMING GAMING EVENTS</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto mb-2">
//             Loading upcoming events...
//           </p>
//           <div className="flex justify-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="pb-10 px-4 bg-white text-black">
//       <div className="max-w-4xl mx-auto text-center">
//         <h2 className="text-3xl md:text-4xl font-bold mb-2">UPCOMING GAMING EVENTS</h2>
//         <p className="text-gray-600 max-w-2xl mx-auto mb-2">
//           Explore the complete event schedule to find sessions, speakers, and activities that match your interests and needs.
//         </p>
//       </div>

//       {error && (
//         <div className="max-w-4xl mx-auto mb-4">
//           <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm">
//             Could not load live events. Showing sample content.
//             <button
//               onClick={fetchUpcomingEvents}
//               className="ml-2 text-yellow-900 underline hover:no-underline"
//             >
//               Try again
//             </button>
//           </div>
//         </div>
//       )}

//       {eventsToShow.length === 0 && !loading ? (
//         <div className="max-w-4xl mx-auto text-center py-8">
//           <p className="text-gray-500">No upcoming events found.</p>
//         </div>
//       ) : (
//         <div className="space-y-2 max-w-4xl mx-auto">
//           {eventsToShow.map((event, index) => (
//             <div
//               ref={ref}
//               key={event._id}
//               className={`flex flex-col md:flex-row justify-between items-start md:items-center ${getCategoryColor(event.category)} rounded-xl p-2 md:p-4 shadow transition-all duration-500
//                     ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
//                   `}
//                   style={{
//                     transitionDelay: inView ? `${index * 100}ms` : '0ms',
//                   }}
//             >
//               {event.speaker && event.speaker.image ? (
//                 <div className="flex items-center gap-4 w-full md:w-3/4">
//                   <ImageWithFallback
//                     src={event.speaker.image}
//                     alt={event.speaker.name}
//                     className="w-16 h-16 rounded-full object-cover border border-gray-300"
//                     fallbackSrc="/images/team/default-avatar.png"
//                   />
//                   <div>
//                     <h3 className="text-sm sm:text-lg md:font-semibold">{event.title}</h3>
//                     <p className="text-[0.7rem] sm:text-sm text-gray-800">By {event.speaker.name}</p>
//                     <p className="text-[0.7rem] sm:text-sm text-gray-600 mt-1">{event.description}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="w-full md:w-3/4">
//                   <h3 className="text-lg font-semibold">{event.title}</h3>
//                   {event.description && (
//                     <p className="text-sm text-gray-600 mt-1">{event.description}</p>
//                   )}
//                   {event.location && (
//                     <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>
//                   )}
//                 </div>
//               )}
//               <div className="text-[0.5rem] sm:text-sm text-gray-700 sm:font-medium md:text-right w-full md:w-1/4 text-right">
//                 {formatTime(event.startTime, event.endTime)}
//                 {event.date && (
//                   <div className="text-xs text-gray-500 mt-1">
//                     {new Date(event.date).toLocaleDateString()}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-6 flex justify-center">
//         <button 
//           onClick={() => window.location.href = '/events'}
//           className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium text-sm"
//         >
//           See All Schedule
//         </button>
//       </div>
//     </section>
//   );
// }