// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // API service for slides
// const slideAPI = {
//   // Fetch all slides from backend
//   getSlides: async () => {
//     try {
//       const response = await fetch('/api/slides');
//       if (!response.ok) throw new Error('Failed to fetch slides');
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching slides:', error);
//       // Fallback to default slides if API fails
//       return [
//         {
//           id: "productivity",
//           title: 'Enhance Your Productivity',
//           description: 'Multitask, manage, and move faster with PCs designed for workflows, responsiveness, and seamless business workflows.',
//           image: '/images/img1.JPG',
//           isActive: true,
//           order: 1
//         },
//         {
//           id: "gaming", 
//           title: 'Enhance Your Gaming Experience',
//           description: 'Dominate every game with high-performance PCs built for immersive graphics, fast response times, and smooth gameplay.',
//           image: '/images/img2.JPG',
//           isActive: true,
//           order: 2
//         },
//         {
//           id: "server",
//           title: 'Enhance Your Servers', 
//           description: 'Power your infrastructure with robust servers built for reliability, scalability, and high-performance data management and processing.',
//           image: '/images/img3.JPG',
//           isActive: true,
//           order: 3
//         }
//       ];
//     }
//   },

//   // Create new slide
//   createSlide: async (slideData) => {
//     const response = await fetch('/api/slides', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(slideData)
//     });
//     if (!response.ok) throw new Error('Failed to create slide');
//     return await response.json();
//   },

//   // Update existing slide
//   updateSlide: async (id, slideData) => {
//     const response = await fetch(`/api/slides/${id}`, {
//       method: 'PUT', 
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(slideData)
//     });
//     if (!response.ok) throw new Error('Failed to update slide');
//     return await response.json();
//   },

//   // Delete slide
//   deleteSlide: async (id) => {
//     const response = await fetch(`/api/slides/${id}`, {
//       method: 'DELETE'
//     });
//     if (!response.ok) throw new Error('Failed to delete slide');
//   },

//   // Upload image
//   uploadImage: async (file) => {
//     const formData = new FormData();
//     formData.append('image', file);
//     const response = await fetch('/api/upload', {
//       method: 'POST',
//       body: formData
//     });
//     if (!response.ok) throw new Error('Failed to upload image');
//     const data = await response.json();
//     return data.imageUrl;
//   }
// };

// export default function LandingCarousel() {
//   const navigate = useNavigate();
//   const [slides, setSlides] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Load slides from backend
//   useEffect(() => {
//     const fetchSlides = async () => {
//       setLoading(true);
//       try {
//         const slidesData = await carouselAPI.getActiveSlides();
//         setSlides(slidesData);
//       } catch (error) {
//         console.error('Error loading slides:', error);
//         // Use fallback slides if API fails
//         setSlides(fallbackSlides);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSlides();
//   }, []);

//   // Auto-advance slides
//   useEffect(() => {
//     if (slides.length === 0) return;
    
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % slides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [slides.length]);

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto my-10 px-4">
//         <div className="w-full flex items-center justify-center bg-gray-900 py-20 rounded-xl">
//           <div className="text-white text-lg">Loading slides...</div>
//         </div>
//       </div>
//     );
//   }

//   if (slides.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto my-10 px-4">
//         <div className="w-full flex items-center justify-center bg-gray-900 py-20 rounded-xl">
//           <div className="text-white text-lg">No slides available</div>
//         </div>
//       </div>
//     );
//   }

//   const slide = slides[current];

//   return (
//     <div className="max-w-7xl mx-auto my-10 px-4">
//       <div className="w-full flex flex-col items-center bg-gray-900 py-6 px-4 rounded-xl">

//         {/* Slide card */}
//         <div className="w-full max-w-6xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl flex flex-col md:flex-row items-center justify-between p-6 md:p-8 transition-all duration-500 ease-in-out space-y-6 md:space-y-0">
          
//           {/* Text */}
//           <div className="text-white w-full md:w-1/2 space-y-3 md:space-y-4 text-center md:text-left">
//             <p className="text-green-500 text-xs md:text-sm font-semibold">Featured Category</p>
//             <h2 className="text-2xl md:text-3xl font-bold leading-tight">{slide.title}</h2>
//             <p className="text-sm text-gray-300 hidden md:block">{slide.description}</p>
//             <button 
//               onClick={() => navigate("/" + slide.id)} 
//               className="mt-3 md:mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer transition-colors duration-200"
//             >
//               View More
//             </button>
//           </div>

//           {/* Image */}
//           <img
//             src={slide.image}
//             alt={slide.title}
//             className="w-full md:w-1/2 max-h-60 md:max-h-full object-contain"
//             onError={(e) => {
//               e.target.src = '/images/placeholder.jpg'; // Fallback image
//             }}
//           />
//         </div>

//         {/* Dots below the card */}
//         <div className="flex justify-center mt-4 space-x-2">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrent(index)}
//               className={`h-2 w-2 rounded-full transition-all duration-300 ${
//                 current === index ? 'bg-white scale-125' : 'bg-gray-500'
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: "productivity",
    title: 'Enhance Your Productivity',
    description:
      'Multitask, manage, and move faster with PCs designed for workflows, responsiveness, and seamless business workflows.',
    image: '/images/img1.JPG',
  },
  {
    id: "gaming",
    title: 'Enhance Your Gaming Experience',
    description:
      'Dominate every game with high-performance PCs built for immersive graphics, fast response times, and smooth gameplay.',
    image: '/images/img2.JPG',
  },
  {
    id: "server",
    title: 'Enhance Your Servers',
    description:
      'Power your infrastructure with robust servers built for reliability, scalability, and high-performance data management and processing.',
    image: '/images/img3.JPG',
  },
];

export default function LandingCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="w-full flex flex-col items-center bg-gray-900 py-6 px-4 rounded-xl">

        {/* Slide card */}
        <div className="w-full max-w-6xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl flex flex-col md:flex-row items-center justify-between p-6 md:p-8 transition-all duration-500 ease-in-out space-y-6 md:space-y-0">
          
          {/* Text */}
          <div className="text-white w-full md:w-1/2 space-y-3 md:space-y-4 text-center md:text-left">
            <p className="text-green-500 text-xs md:text-sm font-semibold">Featured Category</p>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">{slide.title}</h2>
            <p className="text-sm text-gray-300 hidden md:block">{slide.description}</p>
            <button onClick={() => navigate("/" + slide.id)} className="mt-3 md:mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer">
              View More
            </button>
          </div>

          {/* Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full md:w-1/2 max-h-60 md:max-h-full object-contain"
          />
        </div>

        {/* Dots below the card */}
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                current === index ? 'bg-white scale-125' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}