import React from 'react';
import { useInView } from 'react-intersection-observer';

const brandsRow1 = [
  "/images/brands/1.png", "/images/brands/2.png", "/images/brands/3.png",
  "/images/brands/4.png", "/images/brands/5.png", "/images/brands/6.png",
  "/images/brands/7.png", "/images/brands/8.png", "/images/brands/9.png",
  "/images/brands/10.png", "/images/brands/11.png", "/images/brands/12.png",
];

const brandsRow2 = [
  "/images/brands/13.png", "/images/brands/14.png", "/images/brands/15.png",
  "/images/brands/16.png", "/images/brands/17.png", "/images/brands/18.png",
  "/images/brands/19.png", "/images/brands/20.png", "/images/brands/21.png",
  "/images/brands/22.png", "/images/brands/23.png", "/images/brands/24.png",
];

const SCROLL_DURATION_SECONDS = 30;

export default function TrustedPartners() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`w-full px-4 sm:px-6 bg-white transition-opacity duration-1000 ${
        inView ? "animate-fadeInFromBack" : "opacity-0"
      }`}
    >
      <div className="relative max-w-6xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f1c2c] to-[#928dab] z-0" />
        <div className="absolute -top-10 -left-10 w-52 sm:w-72 h-52 sm:h-72 bg-purple-500 rounded-full opacity-30 blur-3xl z-0" />
        <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-pink-500 rounded-full opacity-20 blur-2xl z-0" />

        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 py-10 sm:py-12">
          <div className="text-center mb-8 sm:mb-10 text-white">
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Our{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Trusted Partners
              </span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto">
              We collaborate with leading brands and businesses to deliver exceptional results and innovative solutions.
            </p>
          </div>

          {/* Scrolling Brands */}
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-33.333%); }
            }
            @keyframes scroll-right {
              0% { transform: translateX(-33.333%); }
              100% { transform: translateX(0%); }
            }
            .scroll-container:hover .scroll-content {
              animation-play-state: paused;
            }
          `}</style>

          <div className="space-y-6 sm:space-y-8">
            {[{ brands: brandsRow1, animation: 'scroll-left' }, { brands: brandsRow2, animation: 'scroll-right' }].map(
              ({ brands, animation }, index) => (
                <div
                  key={index}
                  className="scroll-container overflow-hidden rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <div
                    className="scroll-content flex w-max items-center py-3 sm:py-4"
                    style={{ animation: `${animation} ${SCROLL_DURATION_SECONDS}s linear infinite` }}
                  >
                    {[...brands, ...brands, ...brands].map((src, idx) => (
                      <img
                        key={`${animation}-${idx}`}
                        src={src}
                        alt={`Logo ${idx}`}
                        className="h-10 sm:h-16 mx-4 sm:mx-8 object-contain transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://placehold.co/150x80/6B7280/FFFFFF?text=Logo+${idx}`;
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
