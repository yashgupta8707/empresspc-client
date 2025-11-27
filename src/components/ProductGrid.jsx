import React, { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function ProductsGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const images = [
    "/images/img1.JPG",
    "/images/img2.JPG",
    "/images/img3.JPG",
    "/images/img4.JPG",
    "/images/img5.JPG",
    "/images/img6.JPG",
  ];

  const products = [
    { name: "Premium Collection", price: "$299", tag: "Best Seller" },
    { name: "Classic Series", price: "$199", tag: "New" },
    { name: "Modern Design", price: "$249", tag: "Limited" },
    { name: "Luxury Edition", price: "$399", tag: "Exclusive" },
    { name: "Essential Pack", price: "$149", tag: "Popular" },
    { name: "Signature Style", price: "$329", tag: "Featured" },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / rect.width;
        const y = (e.clientY - centerY) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => setMousePosition({ x: 0, y: 0 }));
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', () => setMousePosition({ x: 0, y: 0 }));
      };
    }
  }, []);

  const getCardTransform = (index) => {
    const intensity = 0.1;
    const rotateX = mousePosition.y * intensity * (index % 2 === 0 ? -1 : 1);
    const rotateY = mousePosition.x * intensity * (index % 3 === 0 ? -1 : 1);
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${inView ? 0 : -100}px)`;
  };

  const getTagColor = (tag) => {
    const colors = {
      "Best Seller": "bg-gradient-to-r from-amber-400 to-orange-500",
      "New": "bg-gradient-to-r from-emerald-400 to-teal-500",
      "Limited": "bg-gradient-to-r from-purple-400 to-pink-500",
      "Exclusive": "bg-gradient-to-r from-indigo-400 to-blue-500",
      "Popular": "bg-gradient-to-r from-rose-400 to-red-500",
      "Featured": "bg-gradient-to-r from-cyan-400 to-blue-500",
    };
    return colors[tag] || "bg-gradient-to-r from-gray-400 to-gray-500";
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div
        ref={ref}
        className={`relative z-10 mx-2 sm:mx-4 lg:mx-6 xl:mx-8 pt-8 pb-12 transition-all duration-1000 ${
          inView ? "animate-fadeInFromBack" : "opacity-0 translate-y-20"
        }`}
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 transform hover:scale-105 transition-transform duration-300">
              Featured Products
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-full transform scale-x-0 animate-[scaleX_1s_ease-out_0.5s_forwards]"></div>
          </div>
          <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Discover our carefully curated collection of premium products, each designed with excellence and crafted for perfection.
          </p>
        </div>

        {/* Product Grid */}
        <div
          ref={containerRef}
          className="
            grid 
            grid-cols-2 
            grid-rows-6
            gap-4
            max-w-7xl
            mx-auto
            px-4
            sm:grid-cols-4
            sm:grid-rows-4
            sm:gap-6
            md:grid-cols-6
            md:grid-rows-3
            md:gap-6
            lg:grid-cols-6 
            lg:grid-rows-3
            lg:gap-8
          "
          style={{ minHeight: '70vh' }}
        >
          {images.map((src, idx) => {
            const product = products[idx];
            const sharedClass = `
              rounded-2xl sm:rounded-3xl 
              overflow-hidden 
              shadow-xl
              transition-all
              duration-500
              hover:shadow-2xl 
              hover:shadow-purple-200/50
              group
              relative
              bg-white/10
              backdrop-blur-sm
              border
              border-white/20
            `;

            const imageClass = "w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110";

            const gridItemClasses = [
              "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2",
              "col-span-2 row-span-1 sm:col-span-2 sm:row-span-1 md:col-span-3 md:row-span-1 lg:col-span-3 lg:row-span-1",
              "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1",
              "col-span-1 row-span-2 sm:col-span-1 sm:row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2",
              "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1",
              "col-span-2 row-span-1 sm:col-span-2 sm:row-span-1 md:col-span-3 md:row-span-1 lg:col-span-3 lg:row-span-1",
            ];

            return (
              <div
                key={idx}
                className={`${gridItemClasses[idx]} ${sharedClass}`}
                style={{
                  transform: getCardTransform(idx),
                  transformOrigin: 'center center',
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                {/* Product Tag */}
                <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-white text-sm font-semibold ${getTagColor(product.tag)} shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform duration-300`}>
                  {product.tag}
                </div>

                {/* Image Container */}
                <div className="relative w-full h-full">
                  <img src={src} alt={`${product.name}`} className={imageClass} />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Product Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 drop-shadow-lg">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl sm:text-3xl font-bold text-yellow-400 drop-shadow-lg">{product.price}</span>
                      <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 text-sm font-semibold transform hover:scale-105">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>
                </div>

                {/* 3D Border Effect */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <span className="relative z-10">Explore All Products</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInFromBack {
          from {
            opacity: 0;
            transform: translateZ(-100px) translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateZ(0) translateY(0);
          }
        }
        
        @keyframes scaleX {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        .animate-fadeInFromBack {
          animation: fadeInFromBack 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}