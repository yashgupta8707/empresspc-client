import React from 'react';

const EventsExperience = () => {
  return (
    <section className="bg-black text-white py-8 md:py-12  
                        px-2 sm:px-4 md:px-6 lg:px-8"> {/* Responsive horizontal padding */}
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between flex-nowrap 
                      gap-x-2 sm:gap-x-4 md:gap-x-8 lg:gap-x-12"> {/* Responsive gaps between main sections, flex-nowrap to keep horizontal */}

        {/* Left Image */}
        <div className="flex-shrink-0 
                        w-[80px] h-[120px]   /* Smallest mobile size */
                        sm:w-[120px] sm:h-[180px] /* Small screen size */
                        md:w-[250px] md:h-[350px] /* Medium screen size */
                        lg:w-[300px] lg:h-[400px] /* Desktop size */
                        relative overflow-hidden 
                        rounded-b-full /* KEY FIX: Half-pill on left, small curve on right */
                        sm:rounded-b-full
                        md:rounded-b-full shadow-lg">
          <img
            src="/images/Event/hero1.png" // Replace with your actual image path
            alt="Taipei Game Show Event"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 text-center flex-shrink-0"> {/* KEY FIX: text-left universally for consistency with desktop */}
          <h2 className="text-sm sm:text-2xl md:text-4xl lg:text-5xl font-extrabold mb-1 sm:mb-2 md:mb-4 leading-tight"> {/* Scaled heading */}
            Events & Experiences
          </h2>
          <p className="text-[0.5rem] sm:text-sm md:text-base lg:text-lg text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-lg mx-auto"> {/* Scaled paragraph */}
            Connect with fellow builders, enthusiasts, and pros at our upcoming events.
          </p>

          {/* Event Listings - Will scale down to fit side-by-side, but text will be small */}
          <div className="flex flex-row justify-center items-center gap-x-1 sm:gap-x-2 md:gap-x-8 lg:gap-x-16 gap-y-0"> {/* KEY FIX: justify-start for event listings */}
            {/* Event 1 */}
            {/* <div className="text-left"> 
              <h3 className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold text-gray-100 mb-0.5 sm:mb-1 md:mb-2">Sarah Johnson</h3> 
              <p className="text-[0.5rem] sm:text-xs md:text-base text-gray-400 leading-tight">Dec 15, 2025</p>
              <p className="text-[0.5rem] sm:text-xs md:text-base text-gray-400 leading-tight">10:00 - 11:30</p>
            </div> */}
            {/* Event 2 */}
            {/* <div className="text-left">
              <h3 className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold text-gray-100 mb-0.5 sm:mb-1 md:mb-2">Christopher Wilson</h3> 
              <p className="text-[0.5rem] sm:text-xs md:text-base text-gray-400 leading-tight">Dec 17, 2025</p>
              <p className="text-[0.5rem] sm:text-xs md:text-base text-gray-400 leading-tight">12:00 - 2:00 PM</p>
            </div> */}
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-shrink-0 
                        w-[80px] h-[120px] 
                        sm:w-[120px] sm:h-[180px] 
                        md:w-[250px] md:h-[350px] 
                        lg:w-[300px] lg:h-[400px] 
                        relative overflow-hidden 
                        rounded-t-full  /* KEY FIX: Half-pill on right, small curve on left */
                        sm:rounded-t-full  
                        md:rounded-t-full shadow-lg">
          <img
            src="/images/Event/hero2.png" // Replace with your actual image path
            alt="Gamer at PC setup"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default EventsExperience;