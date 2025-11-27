import { useEffect, useState } from "react";

const keywords = [
  "Gaming",
  "Engineering",
  "Liquid",
  "Server",
  "Research",
  "Content-Creation",
];

export default function OurStory() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % keywords.length);
        setFade(true);
      }, 200);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-white">
      {/* Main content container */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-12">
        {/* Store image with thin matte orange border */}
        <div className="mb-8">
          <img
            src="https://i.ibb.co/4Z8skTW2/image.png"
            alt="Empress Computers Store"
            className="w-full max-w-4xl h-auto rounded-lg border-2 border-orange-400 shadow-lg"
          />
        </div>

        {/* Logo and text content */}
        <div className="flex flex-col items-center">
          {/* <img
            src="/images/Logo.png"
            alt="Empress PC Logo"
            className="h-10 md:h-12 mb-4"
          />
          
          <p className="text-lg md:text-xl text-gray-800 mb-6">
            Quality Custom{" "}
            <span
              className={`inline-block transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
              } font-semibold text-orange-500`}
            >
              {keywords[index]}
            </span>{" "}
            PCs
          </p> */}

          {/* Description text */}
          <p className="text-gray-600 text-center max-w-4xl leading-relaxed">
            Welcome To Empress PC, Your Premier Destination For High-Performance To Empress PC, Your Premier Destination For High-Performance Desktops In Lucknow. At Empress PC, We Pride Ourseleves On Delivering Top-Tier Computer Solutions Tailored To Meet the Demanding needs of Enthusiasts, Gamers, and Professionals alike.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 font-medium">
              Visit Our Store
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-medium border border-gray-300">
              Review Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}