import React from "react";
import { useInView } from "react-intersection-observer";
import { Waves } from 'lucide-react'; // For the squiggle at the bottom

export default function GalleryGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // IMPORTANT: Replace these with your actual image paths (12 images needed).
  const images = [
    "/images/img1.JPG", // Item 1 - Rectangular (Tall)
    "/images/img2.JPG", // Item 2 - Square
    "/images/img3.JPG", // Item 3 - Rectangular (Tall)
    "/images/img4.JPG", // Item 4 - Square
    "/images/img5.JPG", // Item 5 - Rectangular (Less Vertical)
    "/images/img6.JPG", // Item 6 - Rectangular (Less Vertical)
    "/images/img7.JPG", // Item 7 - Rectangular (Less Vertical)
    "/images/img1.JPG", // Item 8 - Rectangular (Less Vertical)
    "/images/img2.JPG", // Item 9 - Square
    "/images/img3.JPG", // Item 10 - Rectangular (Tall)
    "/images/img4.JPG", // Item 11 - Square
    "/images/img5.JPG", // Item 12 - Rectangular (Tall)
  ];

  // These classes define the exact grid position and span for each item on desktop (md and up).
  // The order in this array corresponds to the image `idx` from the `images` array.
  const gridItemClasses = [
    "row-span-4",
    "row-span-3",
    "row-span-4",
    "row-span-3",
    "row-span-4",
    "row-span-4",
    "row-span-4",
    "row-span-4",
    "row-span-4",
    "row-span-4",
    "row-span-3",
    "row-span-3",
  ];

  return (
    <div
      ref={ref}
      className={`mx-2 lg:mx-25 xl:mx-40 my-4 bg-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow-md transition-opacity duration-1000 ${
        inView ? "animate-fadeInFromBack" : "opacity-0"
      }`}
    >
      {/* Header Section */}
      <div className="text-center mb-2 md:mb-12">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-gray-900 mb-1 md:mb-2">
          Our Latest Creations
        </h2>
        <p className="text-xs sm:text-base text-gray-600 max-w-xl mx-auto">
          Explore a diverse collection of our recent projects, showcasing innovation and design excellence.
        </p>
      </div>

      {/* Main Grid Container */}
      <div
        className="
          grid
          grid-cols-4
          grid-rows-11
          auto-rows-[minmax(40px,auto)] 
          h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] 2xl:h-[85vh] /* Responsive overall grid height */
          gap-1 md:gap-4
        "
      >
        {images.map((src, idx) => {
          const sharedClass = `
            rounded-sm sm:rounded-lg 
            overflow-hidden 
            shadow-md 
            transition-transform 
            duration-300 
            hover:scale-[1.02] 
            hover:shadow-lg 
            hover:shadow-gray-200 
            group
          `;

          const imageClass = "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105";

          return (
            <div key={idx} className={`${gridItemClasses[idx]} ${sharedClass}`}>
              <img src={src} alt={`Creation ${idx + 1}`} className={imageClass} />
            </div>
          );
        })}
      </div>

      {/* Bottom Section: Squiggle and Button */}
      <div className="flex flex-col items-center mt-2 md:mt-8">
        {/* Squiggle Icon */}
        <Waves className="w-6 h-6 md:w-16 md:h-16 text-gray-400 opacity-70 rotate-135 mb-2 md:mb-4" />
        
        {/* View All Gallery Button */}
        {/* <button className="bg-red-500 hover:bg-red-600 text-xs md:text-md text-white md:font-bold py-1 md:py-3 px-2 md:px-8 rounded-sm md:rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75">
          View All
        </button> */}
      </div>
    </div>
  );
}