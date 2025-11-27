"use client";

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useInView } from "react-intersection-observer";
import { Trophy, Medal, Crown } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

export default function WinnersCarousel() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    setWinners(winnersData);
  }, []);

  // Compact winners data
  const winnersData = [
    {
      _id: 'winner-1',
      // name: "Team Phoenix",
      // player: "Alex Johnson",
      image: "https://i.ibb.co/mk7qsvS/winner5.webp",
      event: "Empress Mortal Combat Tournament",
      // position: "1st",
      // prize: "₹5,00,000"
    },
    {
      _id: 'winner-2',
      // name: "Storm Riders",
      // player: "Sarah Chen",
      image: "https://i.ibb.co/MDyQFr8m/winner1.webp",
      event: "Empress X Colorful Tournament",
      // position: "1st",
      // prize: "₹7,50,000"
    },
    {
      _id: 'winner-3',
      // name: "Digital Legends",
      // player: "Mike Rodriguez",
      image: "https://i.ibb.co/XkbYRv70/winner4.webp",
      event: "Empress Mortal Combat Tournament",
      // position: "1st",
      // prize: "₹10,00,000"
    },
    {
      _id: 'winner-4',
      // name: "FC Digital",
      // player: "Emma Wilson",
      image: "https://i.ibb.co/HTySccPb/winner3.webp",
      event: "Empress Mortal Combat Tournament",
      // position: "1st",
      // prize: "₹3,50,000"
    },
    {
      _id: 'winner-5',
      // name: "Battle Royals",
      // player: "Jake Smith",
      image: "https://i.ibb.co/HTzmMWW0/winner2.webp",
      event: "Nvidia Super Day Final Gamers Connect",
      // position: "1st",
      // prize: "₹6,00,000"
    }
  ];

  const getPositionIcon = (position) => {
    switch (position) {
      case "1st":
        return <Crown className="w-4 h-4 text-amber-500" />;
      case "2nd":
        return <Medal className="w-4 h-4 text-gray-400" />;
      case "3rd":
        return <Trophy className="w-4 h-4 text-orange-400" />;
      default:
        return <Trophy className="w-4 h-4 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <section ref={ref} className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">WINNERS</h2>
          </div>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`bg-white py-8 md:py-12 transition-all duration-700 ${
        inView ? "animate-fadeIn" : "opacity-0"
      }`}>
      
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            HALL OF CHAMPIONS
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
            Celebrating our tournament winners and esports champions
          </p>
        </div>

        {/* Winners Carousel */}
        <div className="relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: '.winners-pagination',
            }}
            breakpoints={{
              640: { 
                slidesPerView: 2,
                spaceBetween: 24
              },
              1024: { 
                slidesPerView: 3,
                spaceBetween: 28
              },
              1280: { 
                slidesPerView: 4,
                spaceBetween: 32
              }
            }}
            modules={[Pagination, Autoplay]}
            className="winners-swiper pb-12"
          >
            {winners.map((winner, index) => (
              <SwiperSlide key={winner._id}>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  
                  {/* Winner Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <ImageWithFallback
                      src={winner.image}
                      alt={winner.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      fallbackSrc="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop"
                    />
                    
                    {/* Position Badge */}
                    {/* <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                      <div className="flex items-center gap-1">
                        {getPositionIcon(winner.position)}
                        <span className="text-xs font-bold text-gray-900">
                          {winner.position}
                        </span>
                      </div>
                    </div> */}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    {/* Team & Player Names */}
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                        {winner.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {winner.player}
                      </p>
                    </div>

                    {/* Event Name */}
                    <div className="text-center">
                      <p className="text-xs md:text-sm text-gray-700 font-medium">
                        {winner.event}
                      </p>
                    </div>

                    {/* Prize Money */}
                    {/* <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                      <p className="text-orange-600 font-bold text-lg md:text-xl">
                        {winner.prize}
                      </p>
                      <p className="text-orange-500 text-xs">Prize Money</p>
                    </div> */}

                    {/* Action Button */}
                    {/* <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200">
                      View Details
                    </button> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Pagination */}
          <div className="winners-pagination flex justify-center mt-6"></div>
        </div>

        {/* Bottom Stats - Compact */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {/* <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-200">
            <Trophy className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900">{winners.length}</p>
            <p className="text-gray-600 text-xs">Champions</p>
          </div> */}
          {/* <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-200">
            <Medal className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900">12+</p>
            <p className="text-gray-600 text-xs">Tournaments</p>
          </div> */}
          {/* <div className="text-center bg-gray-50 rounded-xl p-4 border border-gray-200">
            <Crown className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900">₹50L+</p>
            <p className="text-gray-600 text-xs">Total Prizes</p>
          </div> */}
        </div>
      </div>

      <style jsx global>{`
        .winners-pagination .swiper-pagination-bullet {
          background: #BDBDBD;
          width: 10px;
          height: 10px;
          margin: 0 4px;
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .winners-pagination .swiper-pagination-bullet:hover {
          background: #E65100;
          transform: scale(1.1);
        }
        
        .winners-pagination .swiper-pagination-bullet-active {
          background: #E65100;
          transform: scale(1.2);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}