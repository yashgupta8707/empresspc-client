import React, { useState } from "react";

const coreValues = {
  Performance: "At Empress PC, we engineer systems that prioritize speed, power, and efficiency — ensuring every build delivers exceptional real-world performance.",
  Precision: "Every detail matters. From cable management to thermal optimization, we build each PC with a craftsman’s precision and a gamer’s mindset.",
  Passion: "We’re more than builders — we’re enthusiasts. Our passion drives us to stay on the cutting edge of technology, so your system is future-proof and flawless.",
};

export default function CoreValues() {
  const [selected, setSelected] = useState("Performance");

  return (
    <section className="bg-white py-8 md:py-16 px-4 md:px-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8">Our Core Values</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {Object.keys(coreValues).map((key) => (
          <button
            key={key}
            className={`px-5 py-2 rounded-full border text-sm md:text-base transition ${
              selected === key
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setSelected(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <p className="max-w-2xl mx-auto text-gray-700 text-base md:text-lg">
        {coreValues[selected]}
      </p>
    </section>
  );
}
