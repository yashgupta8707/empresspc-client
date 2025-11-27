
const insights = [
  {
    type: "image",
    src: "/images/img1.JPG",
    alt: "High-performance custom PC build",
  },
  {
    type: "text",
    title: (
      <>
        Power Meets <span className="underline decoration-green-500">Precision</span>
      </>
    ),
    description:
      "Every Empress PC is built with hand-picked components to ensure flawless performance, whether you're gaming, editing, or running simulations.",
  },
  {
    type: "text",
    title: (
      <>
        Built for <span className="underline decoration-purple-400">Your Workflow</span>
      </>
    ),
    description:
      "From liquid-cooled beasts to silent workstations, our custom rigs are engineered for creators, gamers, engineers, and professionals alike.",
  },
  {
    type: "image",
    src: "/images/img2.JPG",
    alt: "Gamer using Empress PC setup",
  },
];


const InsightBlocks = () => {
  return (
    <div className="md:px-30 grid grid-cols-1 md:grid-cols-2 gap-2 px-3 py-3 sm:px-4 bg-gray-50 rounded-lg">
      {insights.map((insight, idx) => {
        // Reorder 3rd and 4th items on mobile only
        let orderClass = "";
        if (idx === 2) orderClass = "order-4 md:order-3";
        else if (idx === 3) orderClass = "order-3 md:order-4";

        const baseClass =
          insight.type === "image"
            ? "rounded-lg overflow-hidden shadow-sm"
            : "bg-white rounded-lg shadow-sm px-3 py-4 sm:px-4 sm:py-5 flex flex-col justify-center text-center";

        return (
          <div key={idx} className={`${baseClass} ${orderClass}`}>
            {insight.type === "image" ? (
              <img
                src={insight.src}
                alt={insight.alt}
                className="w-full object-cover rounded-lg max-h-48 sm:max-h-72"
              />
            ) : (
              <>
                <h3 className="text-sm sm:text-base font-semibold mb-1">{insight.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-snug">{insight.description}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};


export default InsightBlocks;
