import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useCart } from "./CartContext";
import ImageWithFallback from "./ImageWithFallback";

const RelatedProducts = ({ currentProduct, relatedProducts, category }) => {
  const scrollRef = useRef();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Single useInView for the entire section
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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.quantity === 0) {
      alert('Product is out of stock');
      return;
    }
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-12 px-4 md:px-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Related Products</h2>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll("left")} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll("right")} 
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {relatedProducts.map((product, index) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-[280px] flex-shrink-0 cursor-pointer transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1
              ${sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
            style={{
              transitionDelay: sectionInView ? `${index * 50}ms` : "0ms",
            }}
          >
            {/* Product Image */}
            <div className="relative mb-4">
              <ImageWithFallback
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-40 object-contain rounded-md bg-gray-50"
                fallbackSrc="/images/placeholder-product.jpg"
              />
              
              {/* Badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {product.badge && (
                  <span className={`${product.badge.color} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                    {product.badge.text}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>

              {product.quantity === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-md font-bold text-xs">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              {/* Brand */}
              <div className="text-xs text-gray-500 uppercase font-semibold">
                {product.brand}
              </div>

              {/* Title and Add to Cart */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">
                  {product.name}
                </h3>
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.quantity === 0}
                  className="text-purple-600 hover:text-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-800">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating and Stock */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  {product.rating > 0 ? (
                    <>
                      <div className="text-yellow-500 text-xs">
                        {"★".repeat(Math.floor(product.rating))}
                        {"☆".repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">
                        ({product.reviews || 0})
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs">No ratings yet</span>
                  )}
                </div>
                
                <div className={`text-xs px-2 py-1 rounded-full ${
                  product.quantity > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.quantity > 0 ? `${product.quantity} left` : 'Out of stock'}
                </div>
              </div>

              {/* Category */}
              <div className="text-xs text-gray-500 capitalize">
                {product.category}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hide Scrollbar for WebKit */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default RelatedProducts;