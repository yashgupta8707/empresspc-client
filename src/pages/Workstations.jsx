import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star, X, Filter } from "lucide-react";
import { useCart } from "../components/CartContext";
import { productAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import ImageWithFallback from "../components/ImageWithFallback";
import EmpressNavbar from "../components/EmpressNavbar";
import Footer from "../components/Footer";

const Workstations = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { addToCart } = useCart();

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableBrands, setAvailableBrands] = useState([]);
  const [pagination, setPagination] = useState({});

  // Filter states
  const [selectedUseCase, setSelectedUseCase] = useState("");
  const [selectedPerformance, setSelectedPerformance] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sort, setSort] = useState("createdAt-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchWorkstations();
  }, [sort, currentPage]);

  const fetchWorkstations = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Filter for workstation categories
      const workstationCategories = [
        'workstation-pc',
        'creative-pc', 
        'productivity-pc',
        'professional-pc',
        'development-pc'
      ];

      let allProducts = [];
      let allBrands = new Set();

      // Fetch products from multiple workstation categories
      for (const category of workstationCategories) {
        try {
          const [sortBy, order] = sort.split('-');
          const params = {
            page: 1,
            limit: 50, // Get more products per category
            sortBy,
            order,
            ...(selectedBrand && { brand: selectedBrand })
          };
          
          const response = await productAPI.getProductsByCategory(category, params);
          
          if (response.success && response.data.products) {
            allProducts = [...allProducts, ...response.data.products];
            if (response.data.availableBrands) {
              response.data.availableBrands.forEach(brand => allBrands.add(brand));
            }
          }
        } catch (categoryError) {
          console.error(`Error fetching ${category}:`, categoryError);
        }
      }

      // Remove duplicates and apply filters
      const uniqueProducts = allProducts.filter((product, index, self) => 
        index === self.findIndex(p => p._id === product._id)
      );

      const filteredProducts = applyFilters(uniqueProducts);
      
      // Pagination
      const limit = 12;
      const totalPages = Math.ceil(filteredProducts.length / limit);
      const startIndex = (currentPage - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

      setProducts(paginatedProducts);
      setAvailableBrands(Array.from(allBrands));
      setPagination({
        currentPage,
        totalPages,
        total: filteredProducts.length,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      });

    } catch (err) {
      setError(err.message);
      console.error('Error fetching workstations:', err);
      // Set fallback products if needed
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (productList) => {
    return productList.filter((product) => {
      // Use Case filter (based on product name/description)
      const matchUseCase = !selectedUseCase || 
        product.name.toLowerCase().includes(selectedUseCase.toLowerCase()) ||
        product.description1?.toLowerCase().includes(selectedUseCase.toLowerCase()) ||
        (selectedUseCase === "Video Editing" && (
          product.name.toLowerCase().includes("video") || 
          product.name.toLowerCase().includes("creative") ||
          product.description1?.toLowerCase().includes("video")
        )) ||
        (selectedUseCase === "3D Rendering" && (
          product.name.toLowerCase().includes("render") || 
          product.name.toLowerCase().includes("3d") ||
          product.description1?.toLowerCase().includes("render")
        )) ||
        (selectedUseCase === "Development" && (
          product.name.toLowerCase().includes("dev") || 
          product.name.toLowerCase().includes("programming") ||
          product.description1?.toLowerCase().includes("development")
        ));

      // Performance filter (based on price ranges as proxy)
      const matchPerf = !selectedPerformance || 
        (selectedPerformance === "Beast" && product.price >= 500000) ||
        (selectedPerformance === "High" && product.price >= 200000 && product.price < 500000) ||
        (selectedPerformance === "Regular" && product.price < 200000);

      // Price filter
      const matchPrice = !selectedPriceRange ||
        (selectedPriceRange === "<3k" && product.price < 300000) ||
        (selectedPriceRange === "3k-5k" && product.price >= 300000 && product.price <= 500000) ||
        (selectedPriceRange === ">5k" && product.price > 500000);

      // Brand filter
      const matchBrand = !selectedBrand || 
        product.brand.toLowerCase().includes(selectedBrand.toLowerCase());

      return matchUseCase && matchPerf && matchPrice && matchBrand;
    });
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchWorkstations();
    setIsSidebarOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedUseCase("");
    setSelectedPerformance("");
    setSelectedPriceRange("");
    setSelectedBrand("");
    setSort("createdAt-desc");
    setCurrentPage(1);
    setIsSidebarOpen(false);
    fetchWorkstations();
  };

  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handleRadioClick = (currentValue, setter) => {
    setter((prev) => (prev === currentValue ? "" : currentValue));
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.quantity === 0) {
      alert('Product is out of stock');
      return;
    }
    console.log(`Added ${product.name} to cart!`);
    addToCart(product);
  };

  const handleProductClick = (productId) => {
    navigate('/product/' + productId);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Workstations...</h2>
          <p className="text-gray-500">Finding the best professional systems for you</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <EmpressNavbar />
    <div className="min-h-screen bg-gray-50 mt-8">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Workstations</h1>
              <p className="text-gray-600 mt-1">Professional Computing Systems for Demanding Work</p>
              {!loading && products.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {pagination.total} professional systems found
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={toggleSidebar}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <select
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-purple-300 text-sm min-w-[160px]"
                onChange={(e) => handleSortChange(e.target.value)}
                value={sort}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name A-Z</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside
          className={`
            bg-white shadow-lg w-[280px] p-6 space-y-6 z-20 transition-transform duration-300
            ${isSidebarOpen ? "fixed top-0 bottom-0 left-0 translate-x-0" : "fixed top-0 bottom-0 left-0 -translate-x-full"}
            lg:static lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
          `}
        >
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-between items-center mb-4 pb-4 border-b">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button onClick={closeSidebar}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Performance Filter */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              ⚡ Performance Level
            </h3>
            <div className="space-y-2">
              {["Beast", "High", "Regular"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="performance"
                    checked={selectedPerformance === type}
                    onChange={() => handleRadioClick(type, setSelectedPerformance)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{type} Performance</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {type === "Beast" && "₹5L+"}
                    {type === "High" && "₹2L-5L"}
                    {type === "Regular" && "<₹2L"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Use Case Filter */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              🎯 Use Case
            </h3>
            <div className="space-y-2">
              {["Video Editing", "3D Rendering", "Development", "Design"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="usecase"
                    checked={selectedUseCase === type}
                    onChange={() => handleRadioClick(type, setSelectedUseCase)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                🏷️ Brand
              </h3>
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-300 text-sm"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {availableBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              💰 Price Range
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === "<3k"}
                  onChange={() => handleRadioClick("<3k", setSelectedPriceRange)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Under ₹3,00,000</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === "3k-5k"}
                  onChange={() => handleRadioClick("3k-5k", setSelectedPriceRange)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">₹3,00,000 - ₹5,00,000</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange === ">5k"}
                  onChange={() => handleRadioClick(">5k", setSelectedPriceRange)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Above ₹5,00,000</span>
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <button 
              onClick={handleApplyFilters} 
              className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button 
              onClick={handleClearFilters} 
              className="w-full text-sm text-gray-600 underline hover:text-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content */}
        <section className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p>Error loading workstations: {error}</p>
              <button
                onClick={fetchWorkstations}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div 
              ref={ref}
              className={`transition-opacity duration-500 ${
                inView ? "opacity-100" : "opacity-0"
              }`}
            >
              {products.length === 0 ? (
                <div className="text-center text-gray-600 py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold mb-2">No workstations found</h3>
                  <p className="text-gray-500 mb-4">
                    {selectedUseCase || selectedPerformance || selectedPriceRange || selectedBrand
                      ? "Try adjusting your filters" 
                      : "No workstations available at the moment"
                    }
                  </p>
                  {(selectedUseCase || selectedPerformance || selectedPriceRange || selectedBrand) && (
                    <button
                      onClick={handleClearFilters}
                      className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                        className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-purple-200 transition-all duration-500
                          ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}
                        style={{
                          transitionDelay: inView ? `${index * 50}ms` : '0ms',
                        }}
                      >
                        {/* Product Image */}
                        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                          <ImageWithFallback
                            src={product.images?.[0]}
                            alt={product.name}
                            className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-300 group-hover:scale-110"
                            fallbackSrc="/images/placeholder-product.jpg"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            {product.badge && (
                              <div className={`${product.badge.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                                {product.badge.text}
                              </div>
                            )}
                            {product.discountPercentage > 0 && (
                              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                -{product.discountPercentage}%
                              </div>
                            )}
                          </div>

                          {/* Heart Button */}
                          <button className="absolute top-3 left-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                          </button>
                          
                          {product.quantity === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Content */}
                        <div className="p-6">
                          <div className="h-[240px] flex flex-col">
                            <div className="text-xs text-purple-600 uppercase tracking-wide font-semibold mb-2">
                              {product.brand}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                              {product.description1 || 'High-performance workstation designed for professional computing tasks.'}
                            </p>

                            {/* Specs Preview */}
                            {product.specs && Object.keys(product.specs).length > 0 && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1">
                                {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">{key}:</span>
                                    <span className="text-gray-700 font-semibold truncate ml-2">{value}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                              {product.rating > 0 ? (
                                <>
                                  <div className="flex text-yellow-500">
                                    {Array(5).fill().map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.floor(product.rating) ? "fill-yellow-500" : "stroke-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-gray-500 text-xs ml-1">
                                    ({product.reviews || 0} reviews)
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-400 text-xs">No ratings yet</span>
                              )}
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-800">
                                ₹{product.price?.toLocaleString()}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              disabled={product.quantity === 0}
                              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm flex items-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 3 ||
                          pageNum === currentPage + 3
                        ) {
                          return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
}
export default Workstations;