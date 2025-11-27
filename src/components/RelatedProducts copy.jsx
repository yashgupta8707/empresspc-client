import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const RelatedProducts = ({ currentProduct, allSampleProducts, category }) => {
  const scrollRef = useRef();
  const navigate = useNavigate();

  // Single useInView for the entire section instead of individual cards
  const { ref: sectionRef, inView: sectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const related = allSampleProducts[category]?.filter(
    (p) => p.id !== currentProduct.id
  ) || [];

  if (!related.length) return null;

  return (
    <section ref={sectionRef} className="py-12 px-4 md:px-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold">Related Products</h2>

        <div className="flex items-center gap-4">
          <button onClick={() => scroll("left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <ChevronLeft />
          </button>
          <button onClick={() => scroll("right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Product Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {related.map((product, index) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className={`bg-white rounded-lg shadow p-4 w-[280px] flex-shrink-0 cursor-pointer transition-all duration-500 ease-out
              ${sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
            style={{
              transitionDelay: sectionInView ? `${index * 50}ms` : "0ms",
            }}
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-3"
            />

            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {product.name}
              </h3>
              <button className="text-[#F47C5A] hover:text-purple-800">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-2 text-gray-600 text-sm">
              ₹{product.price.toLocaleString()}
              {product.originalPrice && (
                <span className="line-through text-xs text-gray-400 ml-2">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div className="text-yellow-500 text-sm mb-1">
              {"★".repeat(product.rating)}{" "}
              <span className="text-gray-500 text-xs">
                ({product.reviews})
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Hide Scrollbar for WebKit */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default RelatedProducts;