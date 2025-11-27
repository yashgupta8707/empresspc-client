import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInView } from "react-intersection-observer";
import { ArrowLeft, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../components/CartContext';
import ImageWithFallback from '../components/ImageWithFallback';
import Footer from '../components/Footer';
import EmpressNavbar from '../components/EmpressNavbar';

const ComponentsListingPage = () => {
  const { addToCart } = useCart();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableBrands, setAvailableBrands] = useState([]);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    performance: '',
    inStock: false,
    sortBy: 'createdAt',
    order: 'desc'
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  // Enhanced category mapping with better metadata
  const categoryMetadata = {
    // PC Systems
    'gaming-pc': {
      name: 'Gaming PCs',
      description: 'High-performance gaming systems built for enthusiasts and competitive gamers',
      breadcrumb: 'PC Systems > Gaming PCs',
      filters: ['performance', 'brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'workstation-pc': {
      name: 'Workstation PCs',
      description: 'Professional-grade systems for content creation and intensive workloads',
      breadcrumb: 'PC Systems > Workstation PCs',
      filters: ['performance', 'brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'productivity-pc': {
      name: 'Productivity PCs',
      description: 'Optimized systems for office work and business applications',
      breadcrumb: 'PC Systems > Productivity PCs',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'budget-pc': {
      name: 'Budget PCs',
      description: 'Affordable systems without compromising essential features',
      breadcrumb: 'PC Systems > Budget PCs',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Regular', 'Basic']
    },
    'creative-pc': {
      name: 'Creative PCs',
      description: 'Specialized systems for content creators and digital artists',
      breadcrumb: 'PC Systems > Creative PCs',
      filters: ['performance', 'brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High']
    },
    'streaming-pc': {
      name: 'Streaming PCs',
      description: 'Dedicated systems for live streaming and content broadcasting',
      breadcrumb: 'PC Systems > Streaming PCs',
      filters: ['performance', 'brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'office-pc': {
      name: 'Office PCs',
      description: 'Professional business systems for corporate environments',
      breadcrumb: 'PC Systems > Office PCs',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Regular', 'Basic']
    },
    'mini-pc': {
      name: 'Mini PCs',
      description: 'Compact and space-saving desktop solutions',
      breadcrumb: 'PC Systems > Mini PCs',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Regular', 'Basic']
    },

    // Components
    'processors': {
      name: 'Processors (CPUs)',
      description: 'Intel and AMD processors for all performance levels',
      breadcrumb: 'Components > Processors',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'graphics-cards': {
      name: 'Graphics Cards',
      description: 'NVIDIA and AMD graphics cards for gaming and professional work',
      breadcrumb: 'Components > Graphics Cards',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'motherboards': {
      name: 'Motherboards',
      description: 'Feature-rich motherboards supporting latest technologies',
      breadcrumb: 'Components > Motherboards',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular']
    },
    'memory': {
      name: 'Memory (RAM)',
      description: 'High-speed DDR4 and DDR5 memory modules',
      breadcrumb: 'Components > Memory',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'storage': {
      name: 'Storage Solutions',
      description: 'SSDs, HDDs, and NVMe drives for fast data access',
      breadcrumb: 'Components > Storage',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'power-supplies': {
      name: 'Power Supplies',
      description: 'Reliable and efficient PSUs with modular options',
      breadcrumb: 'Components > Power Supplies',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular']
    },
    'cases': {
      name: 'PC Cases',
      description: 'Stylish cases with excellent airflow and cable management',
      breadcrumb: 'Components > Cases',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular']
    },
    'cooling': {
      name: 'Cooling Systems',
      description: 'Air and liquid cooling solutions for optimal temperatures',
      breadcrumb: 'Components > Cooling',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },

    // Peripherals
    'monitors': {
      name: 'Monitors',
      description: 'Gaming and professional displays with various sizes and refresh rates',
      breadcrumb: 'Peripherals > Monitors',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'keyboards': {
      name: 'Keyboards',
      description: 'Mechanical and gaming keyboards for enhanced typing experience',
      breadcrumb: 'Peripherals > Keyboards',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'mice': {
      name: 'Gaming Mice',
      description: 'Precision gaming and professional mice with high DPI sensors',
      breadcrumb: 'Peripherals > Mice',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'headsets': {
      name: 'Gaming Headsets',
      description: 'Premium gaming and professional audio headsets',
      breadcrumb: 'Peripherals > Headsets',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'speakers': {
      name: 'Speakers',
      description: 'High-quality audio systems and desktop speakers',
      breadcrumb: 'Peripherals > Speakers',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'webcams': {
      name: 'Webcams',
      description: 'HD cameras for streaming, video calls, and content creation',
      breadcrumb: 'Peripherals > Webcams',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'microphones': {
      name: 'Microphones',
      description: 'Professional microphones for streaming and recording',
      breadcrumb: 'Peripherals > Microphones',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'mouse-pads': {
      name: 'Mouse Pads',
      description: 'Gaming and ergonomic mouse pads for precision control',
      breadcrumb: 'Peripherals > Mouse Pads',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Regular', 'Basic']
    },

    // Laptops
    'gaming-laptops': {
      name: 'Gaming Laptops',
      description: 'Powerful portable gaming machines with high-end graphics',
      breadcrumb: 'Laptops > Gaming Laptops',
      filters: ['performance', 'brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High', 'Regular']
    },
    'business-laptops': {
      name: 'Business Laptops',
      description: 'Professional laptops for business and enterprise use',
      breadcrumb: 'Laptops > Business Laptops',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular']
    },
    'ultrabooks': {
      name: 'Ultrabooks',
      description: 'Ultra-thin and lightweight laptops for portability',
      breadcrumb: 'Laptops > Ultrabooks',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular']
    },
    'budget-laptops': {
      name: 'Budget Laptops',
      description: 'Affordable laptops for everyday computing needs',
      breadcrumb: 'Laptops > Budget Laptops',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Regular', 'Basic']
    },
    'creative-laptops': {
      name: 'Creative Laptops',
      description: 'High-performance laptops for content creation and design',
      breadcrumb: 'Laptops > Creative Laptops',
      filters: ['performance', 'brand', 'price', 'stock'],
      performancelevels: ['Beast', 'High']
    },

    // Accessories
    'cables-adapters': {
      name: 'Cables & Adapters',
      description: 'Essential cables and adapters for connectivity',
      breadcrumb: 'Accessories > Cables & Adapters',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Regular', 'Basic']
    },
    'printers-scanners': {
      name: 'Printers & Scanners',
      description: 'Office printers and scanning solutions',
      breadcrumb: 'Accessories > Printers & Scanners',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular']
    },
    'networking': {
      name: 'Networking Equipment',
      description: 'Routers, switches, and networking accessories',
      breadcrumb: 'Accessories > Networking',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'external-storage': {
      name: 'External Storage',
      description: 'Portable drives and external storage solutions',
      breadcrumb: 'Accessories > External Storage',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['High', 'Regular', 'Basic']
    },
    'mobile-accessories': {
      name: 'Mobile Accessories',
      description: 'Chargers, cases, and mobile device accessories',
      breadcrumb: 'Accessories > Mobile Accessories',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Regular', 'Basic']
    },
    'tablet-accessories': {
      name: 'Tablet Accessories',
      description: 'Cases, keyboards, and tablet accessories',
      breadcrumb: 'Accessories > Tablet Accessories',
      filters: ['brand', 'price', 'stock'],
      performancelevels: ['Regular', 'Basic']
    }
  };

  const currentCategory = categoryMetadata[categoryId] || {
    name: categoryId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Products',
    description: 'Browse our collection of premium products',
    breadcrumb: 'Products',
    filters: ['brand', 'price', 'stock'],
    performancelevels: ['Beast', 'High', 'Regular', 'Basic']
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, filters, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 12,
        sortBy: filters.sortBy,
        order: filters.order,
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.performance && { performance: filters.performance }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.inStock && { inStock: true })
      };
      
      const response = await productAPI.getProductsByCategory(categoryId, params);
      
      if (response.success) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || {});
        setAvailableBrands(response.data.availableBrands || []);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.quantity === 0) {
      alert('Product is out of stock');
      return;
    }
    addToCart(product);
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = `${product.name} added to cart!`;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const goToCategories = () => {
    navigate('/products');
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      performance: '',
      inStock: false,
      sortBy: 'createdAt',
      order: 'desc'
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.brand || filters.minPrice || filters.maxPrice || filters.performance || filters.inStock;

  return (
    <>
      <EmpressNavbar />
      <div className="min-h-screen bg-gray-50 mt-8">
        {/* Enhanced Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <button
                onClick={goToCategories}
                className="hover:text-gray-800 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                All Categories
              </button>
              <span className="mx-2">/</span>
              <span className="font-semibold text-gray-800">{currentCategory.breadcrumb}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {currentCategory.name}
                </h1>
                <p className="text-gray-600 mb-4">{currentCategory.description}</p>
                {!loading && products.length > 0 && (
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{pagination.total} products found</span>
                    {hasActiveFilters && (
                      <span className="text-purple-600 font-medium">• Filters applied</span>
                    )}
                  </div>
                )}
              </div>

              {/* View Mode and Filter Controls */}
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-white text-purple-600 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <select
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-purple-300 text-sm min-w-[160px]"
                  value={`${filters.sortBy}-${filters.order}`}
                  onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('order', order);
                  }}
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="popularity-desc">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Enhanced Sidebar Filters */}
            <aside className={`bg-white rounded-lg shadow-sm border h-fit transition-all duration-300 ${
              showFilters ? 'block' : 'hidden'
            } lg:block lg:w-80`}>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Stock Filter */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                  </label>
                </div>

                {/* Brand Filter */}
                {availableBrands.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Brand</label>
                    <select
                      value={filters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">All Brands</option>
                      {availableBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Performance Filter */}
                {currentCategory.filters.includes('performance') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Performance Level</label>
                    <select
                      value={filters.performance}
                      onChange={(e) => handleFilterChange('performance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">All Performance</option>
                      {currentCategory.performancelevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Range Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (₹)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Quick Price Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quick Price Filters</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Under ₹10K', min: '', max: '10000' },
                      { label: '₹10K - ₹25K', min: '10000', max: '25000' },
                      { label: '₹25K - ₹50K', min: '25000', max: '50000' },
                      { label: '₹50K - ₹1L', min: '50000', max: '100000' },
                      { label: '₹1L - ₹2L', min: '100000', max: '200000' },
                      { label: 'Above ₹2L', min: '200000', max: '' }
                    ].map((range) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          handleFilterChange('minPrice', range.min);
                          handleFilterChange('maxPrice', range.max);
                        }}
                        className={`px-3 py-2 text-xs border rounded-lg transition-colors ${
                          filters.minPrice === range.min && filters.maxPrice === range.max
                            ? 'bg-purple-500 text-white border-purple-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Filters Button for Mobile */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <p>Error loading products: {error}</p>
                  <button
                    onClick={fetchProducts}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div 
                  ref={ref}
                  className={`transition-opacity duration-300 ${
                    inView ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {products.length === 0 ? (
                    <div className="text-center text-gray-600 py-20">
                      <div className="text-6xl mb-4">📦</div>
                      <h3 className="text-2xl font-bold mb-2">No products found</h3>
                      <p className="text-gray-500 mb-4">
                        {hasActiveFilters 
                          ? "Try adjusting your filters to see more products" 
                          : "No products available in this category yet"
                        }
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Products Grid/List */}
                      <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-4"
                      }>
                        {products.map((product, index) => (
                          <div
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                            className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-purple-200 ${
                              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                            } ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}
                            style={{
                              transitionDelay: inView ? `${index * 50}ms` : '0ms',
                            }}
                          >
                            {viewMode === 'grid' ? (
                              // Grid View
                              <>
                                {/* Product Image */}
                                <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                  <ImageWithFallback
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-110"
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
                                  <div className="h-[200px] flex flex-col">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                                      {product.brand}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                                      {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                      {product.description1 || 'High-quality product with premium features.'}
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
                                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                                    >
                                      {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                  </div>

                                  {/* Rating */}
                                  {product.rating > 0 && (
                                    <div className="mt-3 flex items-center">
                                      <div className="text-yellow-500 text-sm">
                                        {'★'.repeat(Math.floor(product.rating))}
                                        {'☆'.repeat(5 - Math.floor(product.rating))}
                                      </div>
                                      <span className="text-gray-500 text-xs ml-2">
                                        ({product.reviews || 0} reviews)
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              // List View
                              <>
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                                  <ImageWithFallback
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    fallbackSrc="/images/placeholder-product.jpg"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0 mr-4">
                                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                                        {product.brand}
                                      </div>
                                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                                        {product.name}
                                      </h3>
                                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                        {product.description1 || 'High-quality product with premium features.'}
                                      </p>
                                      {product.rating > 0 && (
                                        <div className="flex items-center mb-2">
                                          <div className="text-yellow-500 text-sm">
                                            {'★'.repeat(Math.floor(product.rating))}
                                            {'☆'.repeat(5 - Math.floor(product.rating))}
                                          </div>
                                          <span className="text-gray-500 text-xs ml-2">
                                            ({product.reviews || 0})
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <div className="text-2xl font-bold text-gray-800 mb-2">
                                        ₹{product.price?.toLocaleString()}
                                      </div>
                                      {product.originalPrice && product.originalPrice > product.price && (
                                        <div className="text-sm text-gray-500 line-through mb-2">
                                          ₹{product.originalPrice.toLocaleString()}
                                        </div>
                                      )}
                                      <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={product.quantity === 0}
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                      >
                                        {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Enhanced Pagination */}
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
            </main>
          </div>
        </div>

        <style jsx>{`
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
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
};

export default ComponentsListingPage;