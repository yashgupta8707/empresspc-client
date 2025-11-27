// FeaturedProducts.jsx
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useCart } from "../components/CartContext";
import { productAPI } from "../services/api"; // use live API

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const scrollRef = useRef();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch from backend (uses /api/products/featured)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await productAPI.getFeaturedProducts({ limit: 12 });
        // Backend shape: { success, data: [] }
        const list = Array.isArray(res?.data) ? res.data : [];
        setProducts(list);
      } catch (e) {
        setError(e.message || "Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProductClick = (id) => navigate(`/product/${id}`);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

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

  if (loading) {
    return (
      <section className="py-10 px-4 md:px-8 bg-white">
        <div className="mb-6">
          <p className="text-red-500 text-sm font-semibold">Trending Now</p>
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
        </div>
        <div className="text-gray-500">Loading featured products…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 px-4 md:px-8 bg-white">
        <div className="mb-6">
          <p className="text-red-500 text-sm font-semibold">Trending Now</p>
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
        </div>
        <div className="text-red-600">Error: {error}</div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-10 px-4 md:px-8 bg-white">
        <div className="mb-6">
          <p className="text-red-500 text-sm font-semibold">Trending Now</p>
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
        </div>
        <div className="text-gray-600">No featured products yet.</div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-10 px-4 md:px-8 bg-white">
      {/* Header */}
      <div className="mb-2 md:mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-red-500 text-sm font-semibold">Trending Now</p>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          </div>

          <Link
            to="/products?featured=true"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs md:text-sm font-medium rounded-full shadow hover:bg-red-600 transition whitespace-nowrap"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Product Cards with arrows on sides */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow"
        >
          <ChevronLeft />
        </button>

        {/* Product List */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-2 px-1 sm:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((p, index) => {
            const id = p._id || p.id;
            const img = Array.isArray(p.images) && p.images.length ? p.images[0] : "/placeholder.png";
            const price = p.price ?? 0;
            const mrp = p.originalPrice ?? null;
            const rating = Math.round(p.rating || 0);
            const reviews = p.reviews ?? 0;

            return (
              <div
                key={id}
                onClick={() => handleProductClick(id)}
                className={`bg-white rounded-lg shadow p-3 sm:p-4 w-[200px] sm:w-[280px] flex-shrink-0 transition-all duration-700 ease-out
                  ${sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                style={{ transitionDelay: sectionInView ? `${index * 100}ms` : "0ms" }}
              >
                <img
                  src={img}
                  alt={p.name}
                  className="w-full h-36 sm:h-40 object-cover rounded-md mb-3"
                />

                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {p.name}
                  </h3>
                  <button
                    className="text-[#F47C5A] hover:text-purple-800"
                    onClick={(e) => handleAddToCart(e, p)}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-2 text-gray-600 text-sm">
                  ₹{Number(price).toLocaleString()}{" "}
                  {mrp && mrp > price && (
                    <span className="line-through text-xs text-gray-400">
                      ₹{Number(mrp).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="text-yellow-500 text-sm mb-1">
                  {"★".repeat(Math.max(0, Math.min(5, rating)))}{" "}
                  <span className="text-gray-500 text-xs">({reviews})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow"
        >
          <ChevronRight />
        </button>

        {/* Hide scrollbar on WebKit */}
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </section>
  );
}

export default FeaturedProducts;
