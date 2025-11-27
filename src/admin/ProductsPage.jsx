import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { productAPI } from "../services/api";
import { debounce } from 'lodash';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    price: "",
    originalPrice: "",
    specifications: [
      {
        category: "General",
        items: [
          { label: "", value: "", unit: "" }
        ]
      }
    ],
    keyFeatures: [""],
    images: [""],
    specs: {},
    badge: { text: "New", color: "bg-blue-500" },
    quantity: "",
    colors: [""],
    sizes: [""],
    rating: "",
    reviews: "",
    isActive: true,
    isFeatured: false,
    tags: [""],
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    performance: "Regular",
    useCase: [],
    compatibility: [""],
    warrantyPeriod: "12",
    manufacturer: "",
    model: "",
    minStockLevel: "5",
    maxStockLevel: "100"
  });

  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    search: '',
    page: 1,
    performance: 'all',
    stockStatus: 'all',
    sortBy: 'createdAt',
    order: 'desc'
  });
  
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});

  // Enhanced categories with proper organization
  const categoryGroups = useMemo(() => ({
    'PC Systems': [
      { value: 'gaming-pc', label: 'Gaming PCs' },
      { value: 'workstation-pc', label: 'Workstation PCs' },
      { value: 'productivity-pc', label: 'Productivity PCs' },
      { value: 'budget-pc', label: 'Budget PCs' },
      { value: 'creative-pc', label: 'Creative PCs' },
      { value: 'streaming-pc', label: 'Streaming PCs' },
      { value: 'office-pc', label: 'Office PCs' },
      { value: 'mini-pc', label: 'Mini PCs' }
    ],
    'Components': [
      { value: 'processors', label: 'Processors (CPUs)' },
      { value: 'graphics-cards', label: 'Graphics Cards' },
      { value: 'motherboards', label: 'Motherboards' },
      { value: 'memory', label: 'Memory (RAM)' },
      { value: 'storage', label: 'Storage Solutions' },
      { value: 'power-supplies', label: 'Power Supplies' },
      { value: 'cases', label: 'PC Cases' },
      { value: 'cooling', label: 'Cooling Systems' }
    ],
    'Peripherals': [
      { value: 'monitors', label: 'Monitors' },
      { value: 'keyboards', label: 'Keyboards' },
      { value: 'mice', label: 'Gaming Mice' },
      { value: 'headsets', label: 'Gaming Headsets' },
      { value: 'speakers', label: 'Speakers' },
      { value: 'webcams', label: 'Webcams' },
      { value: 'microphones', label: 'Microphones' },
      { value: 'mouse-pads', label: 'Mouse Pads' }
    ],
    'Laptops': [
      { value: 'gaming-laptops', label: 'Gaming Laptops' },
      { value: 'business-laptops', label: 'Business Laptops' },
      { value: 'ultrabooks', label: 'Ultrabooks' },
      { value: 'budget-laptops', label: 'Budget Laptops' },
      { value: 'creative-laptops', label: 'Creative Laptops' }
    ],
    'Accessories': [
      { value: 'cables-adapters', label: 'Cables & Adapters' },
      { value: 'printers-scanners', label: 'Printers & Scanners' },
      { value: 'networking', label: 'Networking Equipment' },
      { value: 'external-storage', label: 'External Storage' },
      { value: 'mobile-accessories', label: 'Mobile Accessories' },
      { value: 'tablet-accessories', label: 'Tablet Accessories' }
    ]
  }), []);

  const allCategories = useMemo(() => Object.values(categoryGroups).flat(), [categoryGroups]);

  const badgeColors = useMemo(() => [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-orange-500', label: 'Orange' },
    { value: 'bg-cyan-500', label: 'Cyan' },
    { value: 'bg-gray-500', label: 'Gray' }
  ], []);

  const performanceOptions = useMemo(() => ['Beast', 'High', 'Regular', 'Basic'], []);
  const useCaseOptions = useMemo(() => [
    'Gaming', 'Video Editing', '3D Rendering', 'Development', 
    'Design', 'Office Work', 'Content Creation', 'Streaming',
    'Programming', 'Data Analysis', 'CAD', 'Animation'
  ], []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500),
    []
  );

  // Fetch products with error handling and loading states
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: filters.page,
        limit: 20,
        sortBy: filters.sortBy,
        order: filters.order,
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.brand !== 'all' && { brand: filters.brand }),
        ...(filters.performance !== 'all' && { performance: filters.performance }),
        ...(filters.search && { search: filters.search })
      };
      
      const response = await productAPI.getAllProductsAdmin(params);
      
      if (response.success) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || {});
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats with error handling
  const fetchStats = useCallback(async () => {
    try {
      const response = await productAPI.getProductStats();
      if (response.success) {
        setStats(response.data || {});
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Reset form with optimized state update
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      subCategory: "",
      price: "",
      originalPrice: "",
      specifications: [
        {
          category: "General",
          items: [
            { label: "", value: "", unit: "" }
          ]
        }
      ],
      keyFeatures: [""],
      images: [""],
      specs: {},
      badge: { text: "New", color: "bg-blue-500" },
      quantity: "",
      colors: [""],
      sizes: [""],
      rating: "",
      reviews: "",
      isActive: true,
      isFeatured: false,
      tags: [""],
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      performance: "Regular",
      useCase: [],
      compatibility: [""],
      warrantyPeriod: "12",
      manufacturer: "",
      model: "",
      minStockLevel: "5",
      maxStockLevel: "100"
    });
    setEditingProduct(null);
    setShowForm(false);
    setSubmitting(false);
  }, []);

  // Validate image URL
  const isValidImageUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const imagePattern = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
    return urlPattern.test(url) && imagePattern.test(url);
  };

  // Handle image URL change with validation
  const handleImageUrlChange = (index, url) => {
    const newImages = [...formData.images];
    newImages[index] = url;
    setFormData({ ...formData, images: newImages });
  };

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const errors = [];
    
    if (!formData.name?.trim()) errors.push('Product name is required');
    if (!formData.brand?.trim()) errors.push('Brand is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.price || parseFloat(formData.price) <= 0) errors.push('Valid price is required');
    if (!formData.images[0]?.trim()) errors.push('At least one image URL is required');
    
    // Validate image URLs
    const invalidImages = formData.images.filter(img => img && !isValidImageUrl(img));
    if (invalidImages.length > 0) {
      errors.push('Please provide valid image URLs (must end with .jpg, .png, .gif, .webp, etc.)');
    }
    
    if (formData.originalPrice && parseFloat(formData.originalPrice) < parseFloat(formData.price)) {
      errors.push('Original price should be greater than or equal to current price');
    }
    
    return errors;
  }, [formData]);

  // Optimized form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'));
      return;
    }

    try {
      setSubmitting(true);
      
      const submitData = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        subCategory: formData.subCategory?.trim() || undefined,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        specifications: formData.specifications.filter(spec => 
          spec.category?.trim() && spec.items.some(item => item.label?.trim() && item.value?.trim())
        ).map(spec => ({
          ...spec,
          items: spec.items.filter(item => item.label?.trim() && item.value?.trim())
        })),
        keyFeatures: formData.keyFeatures.filter(feature => feature && feature.trim() !== ""),
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: formData.reviews ? parseInt(formData.reviews) : 0,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        warrantyPeriod: formData.warrantyPeriod ? parseInt(formData.warrantyPeriod) : 12,
        minStockLevel: formData.minStockLevel ? parseInt(formData.minStockLevel) : 5,
        maxStockLevel: formData.maxStockLevel ? parseInt(formData.maxStockLevel) : 100,
        performance: formData.performance,
        manufacturer: formData.manufacturer?.trim() || undefined,
        model: formData.model?.trim() || undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        badge: {
          text: formData.badge.text?.trim() || 'New',
          color: formData.badge.color
        },
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : undefined,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : undefined,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : undefined
        },
        images: formData.images.filter(img => img && img.trim() !== ""),
        colors: formData.colors.filter(color => color && color.trim() !== ""),
        sizes: formData.sizes.filter(size => size && size.trim() !== ""),
        tags: formData.tags.filter(tag => tag && tag.trim() !== ""),
        useCase: formData.useCase.filter(use => use && use.trim() !== ""),
        compatibility: formData.compatibility.filter(comp => comp && comp.trim() !== ""),
        specs: Object.fromEntries(
          Object.entries(formData.specs).filter(([key, value]) => key.trim() && value.trim())
        )
      };

      // Remove undefined values
      Object.keys(submitData).forEach(key => 
        submitData[key] === undefined && delete submitData[key]
      );

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, submitData);
        alert('Product updated successfully!');
      } else {
        await productAPI.createProduct(submitData);
        alert('Product created successfully!');
      }
      
      resetForm();
      fetchProducts();
      fetchStats();
    } catch (err) {
      console.error('Submit error:', err);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
    }
  }, [formData, validateForm, editingProduct, resetForm, fetchProducts, fetchStats]);

  // Handle edit with optimized data loading
  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      price: product.price?.toString() || "",
      originalPrice: product.originalPrice?.toString() || "",
      specifications: product.specifications?.length > 0 ? product.specifications : [
        {
          category: "General",
          items: [
            { label: "", value: "", unit: "" }
          ]
        }
      ],
      keyFeatures: product.keyFeatures?.length > 0 ? product.keyFeatures : [""],
      images: product.images?.length > 0 ? product.images : [""],
      specs: product.specs || {},
      badge: product.badge || { text: "New", color: "bg-blue-500" },
      quantity: product.quantity?.toString() || "",
      colors: product.colors?.length > 0 ? product.colors : [""],
      sizes: product.sizes?.length > 0 ? product.sizes : [""],
      rating: product.rating?.toString() || "",
      reviews: product.reviews?.toString() || "",
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: product.isFeatured || false,
      tags: product.tags?.length > 0 ? product.tags : [""],
      weight: product.weight?.toString() || "",
      dimensions: {
        length: product.dimensions?.length?.toString() || "",
        width: product.dimensions?.width?.toString() || "",
        height: product.dimensions?.height?.toString() || ""
      },
      performance: product.performance || "Regular",
      useCase: product.useCase || [],
      compatibility: product.compatibility?.length > 0 ? product.compatibility : [""],
      warrantyPeriod: product.warrantyPeriod?.toString() || "12",
      manufacturer: product.manufacturer || "",
      model: product.model || "",
      minStockLevel: product.minStockLevel?.toString() || "5",
      maxStockLevel: product.maxStockLevel?.toString() || "100"
    });
    setShowForm(true);
  }, []);

  // Optimized delete with confirmation
  const handleDelete = useCallback(async (id, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      setLoading(true);
      await productAPI.deleteProduct(id);
      await Promise.all([fetchProducts(), fetchStats()]);
      alert('Product deleted successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchStats]);

  // Array manipulation handlers
  const handleArrayChange = useCallback((field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  }, []);

  const addArrayField = useCallback((field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  }, []);

  const removeArrayField = useCallback((field, index) => {
    setFormData(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray.length === 0 ? [""] : newArray };
    });
  }, []);

  // Specification handlers
  const handleSpecificationChange = useCallback((specIndex, field, value) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[specIndex][field] = value;
      return { ...prev, specifications: newSpecs };
    });
  }, []);

  const handleSpecificationItemChange = useCallback((specIndex, itemIndex, field, value) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[specIndex].items[itemIndex][field] = value;
      return { ...prev, specifications: newSpecs };
    });
  }, []);

  const addSpecificationCategory = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, {
        category: "",
        items: [{ label: "", value: "", unit: "" }]
      }]
    }));
  }, []);

  const removeSpecificationCategory = useCallback((specIndex) => {
    setFormData(prev => {
      const newSpecs = prev.specifications.filter((_, i) => i !== specIndex);
      return {
        ...prev,
        specifications: newSpecs.length === 0 ? [
          {
            category: "General",
            items: [{ label: "", value: "", unit: "" }]
          }
        ] : newSpecs
      };
    });
  }, []);

  const addSpecificationItem = useCallback((specIndex) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[specIndex].items.push({ label: "", value: "", unit: "" });
      return { ...prev, specifications: newSpecs };
    });
  }, []);

  const removeSpecificationItem = useCallback((specIndex, itemIndex) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[specIndex].items = newSpecs[specIndex].items.filter((_, i) => i !== itemIndex);
      if (newSpecs[specIndex].items.length === 0) {
        newSpecs[specIndex].items.push({ label: "", value: "", unit: "" });
      }
      return { ...prev, specifications: newSpecs };
    });
  }, []);

  // Legacy specs handlers
  const handleSpecChange = useCallback((key, value) => {
    setFormData(prev => ({ 
      ...prev, 
      specs: { ...prev.specs, [key]: value }
    }));
  }, []);

  const addSpecField = useCallback(() => {
    const key = prompt("Enter specification name:");
    if (key && key.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        specs: { ...prev.specs, [key.trim()]: "" }
      }));
    }
  }, []);

  const removeSpecField = useCallback((key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specs };
      delete newSpecs[key];
      return { ...prev, specs: newSpecs };
    });
  }, []);

  // Use case handler
  const handleUseCaseChange = useCallback((useCase) => {
    setFormData(prev => {
      const newUseCases = prev.useCase.includes(useCase)
        ? prev.useCase.filter(u => u !== useCase)
        : [...prev.useCase, useCase];
      return { ...prev, useCase: newUseCases };
    });
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((key, value) => {
    if (key === 'search') {
      debouncedSearch(value);
    } else {
      setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    }
  }, [debouncedSearch]);

  // Utility functions
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  const getStockStatus = useCallback((product) => {
    if (product.quantity === 0) return 'out-of-stock';
    if (product.quantity <= (product.minStockLevel || 5)) return 'low-stock';
    return 'in-stock';
  }, []);

  const getStockStatusColor = useCallback((status) => {
    switch (status) {
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your comprehensive product catalog</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Live Products →
          </a>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            disabled={loading}
          >
            Add New Product
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">×</button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProducts || 0}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">{stats.inStockProducts || 0}</div>
            <div className="text-sm text-gray-600">In Stock</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-red-600">{stats.outOfStockProducts || 0}</div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockProducts || 0}</div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-purple-600">
              ₹{stats.priceStats?.avgPrice ? Math.round(stats.priceStats.avgPrice).toLocaleString() : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Price</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryGroups).map(([groupName, categories]) => (
              <optgroup key={groupName} label={groupName}>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Brands</option>
            {stats.brandStats?.map(brand => (
              <option key={brand._id} value={brand._id}>{brand._id}</option>
            ))}
          </select>
          <select
            value={filters.performance}
            onChange={(e) => handleFilterChange('performance', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Performance</option>
            {performanceOptions.map(perf => (
              <option key={perf} value={perf}>{perf}</option>
            ))}
          </select>
          <select
            value={filters.stockStatus}
            onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <button
            onClick={() => {
              fetchProducts();
              fetchStats();
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={submitting}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                        maxLength={200}
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                      <input
                        type="text"
                        placeholder="Brand"
                        value={formData.brand}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                        maxLength={50}
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                        disabled={submitting}
                      >
                        <option value="">Select Category</option>
                        {Object.entries(categoryGroups).map(([groupName, categories]) => (
                          <optgroup key={groupName} label={groupName}>
                            {categories.map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                      <input
                        type="text"
                        placeholder="Sub Category"
                        value={formData.subCategory}
                        onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                      <input
                        type="text"
                        placeholder="Manufacturer"
                        value={formData.manufacturer}
                        onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        placeholder="Model"
                        value={formData.model}
                        onChange={e => setFormData({ ...formData, model: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing and Inventory */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Pricing & Inventory</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Price"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Original Price"
                        value={formData.originalPrice}
                        onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Performance Level</label>
                      <select
                        value={formData.performance}
                        onChange={e => setFormData({ ...formData, performance: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      >
                        {performanceOptions.map(perf => (
                          <option key={perf} value={perf}>{perf}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Product Images *</h3>
                  <p className="text-sm text-gray-600 mb-3">Enter direct image URLs (must end with .jpg, .png, .gif, .webp, etc.)</p>
                  <div className="space-y-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded">
                        <div className="flex-1">
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={image}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                            className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                              image && !isValidImageUrl(image) ? 'border-red-300 bg-red-50' : ''
                            }`}
                            disabled={submitting}
                          />
                          {image && !isValidImageUrl(image) && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid image URL</p>
                          )}
                        </div>
                        {image && isValidImageUrl(image) && (
                          <div className="flex-shrink-0">
                            <img 
                              src={image} 
                              alt={`Preview ${index + 1}`} 
                              className="w-20 h-20 object-cover rounded border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField('images', index)}
                            className="flex-shrink-0 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                            disabled={submitting}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField('images')}
                      className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                      disabled={submitting}
                    >
                      Add Another Image URL
                    </button>
                  </div>
                </div>

                {/* Specifications */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Product Specifications</h3>
                  <div className="space-y-4">
                    {formData.specifications.map((spec, specIndex) => (
                      <div key={specIndex} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <input
                            type="text"
                            placeholder="Category (e.g., Performance, Display, etc.)"
                            value={spec.category}
                            onChange={e => handleSpecificationChange(specIndex, 'category', e.target.value)}
                            className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mr-3"
                            disabled={submitting}
                          />
                          {formData.specifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSpecificationCategory(specIndex)}
                              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                              disabled={submitting}
                            >
                              Remove Category
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          {spec.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Label (e.g., Processor)"
                                value={item.label}
                                onChange={e => handleSpecificationItemChange(specIndex, itemIndex, 'label', e.target.value)}
                                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                disabled={submitting}
                              />
                              <input
                                type="text"
                                placeholder="Value (e.g., Intel i7-12700K)"
                                value={item.value}
                                onChange={e => handleSpecificationItemChange(specIndex, itemIndex, 'value', e.target.value)}
                                className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                disabled={submitting}
                              />
                              <input
                                type="text"
                                placeholder="Unit (optional)"
                                value={item.unit}
                                onChange={e => handleSpecificationItemChange(specIndex, itemIndex, 'unit', e.target.value)}
                                className="w-24 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                disabled={submitting}
                              />
                              {spec.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSpecificationItem(specIndex, itemIndex)}
                                  className="px-2 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                                  disabled={submitting}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => addSpecificationItem(specIndex)}
                          className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                          disabled={submitting}
                        >
                          Add Item
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addSpecificationCategory}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      disabled={submitting}
                    >
                      Add Specification Category
                    </button>
                  </div>
                </div>

                {/* Key Features */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="space-y-3">
                    {formData.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Key feature or highlight"
                          value={feature}
                          onChange={(e) => handleArrayChange('keyFeatures', index, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          maxLength={200}
                          disabled={submitting}
                        />
                        {formData.keyFeatures.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField('keyFeatures', index)}
                            className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                            disabled={submitting}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayField('keyFeatures')}
                      className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                      disabled={submitting}
                    >
                      Add Feature
                    </button>
                  </div>
                </div>

                {/* Use Cases */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Use Cases</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {useCaseOptions.map(useCase => (
                      <label key={useCase} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.useCase.includes(useCase)}
                          onChange={() => handleUseCaseChange(useCase)}
                          className="mr-2"
                          disabled={submitting}
                        />
                        {useCase}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Display Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Display Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                      <input
                        type="text"
                        placeholder="Badge Text"
                        value={formData.badge.text}
                        onChange={e => setFormData({ 
                          ...formData, 
                          badge: { ...formData.badge, text: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        maxLength={20}
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Badge Color</label>
                      <select
                        value={formData.badge.color}
                        onChange={e => setFormData({ 
                          ...formData, 
                          badge: { ...formData.badge, color: e.target.value }
                        })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      >
                        {badgeColors.map(color => (
                          <option key={color.value} value={color.value}>{color.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="Rating"
                        value={formData.rating}
                        onChange={e => setFormData({ ...formData, rating: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Review count"
                        value={formData.reviews}
                        onChange={e => setFormData({ ...formData, reviews: e.target.value })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                          className="mr-2"
                          disabled={submitting}
                        />
                        <span className="text-sm font-medium text-gray-700">Active Product</span>
                      </label>
                    </div>
                    
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="mr-2"
                          disabled={submitting}
                        />
                        <span className="text-sm font-medium text-gray-700">Featured Product</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {submitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price & Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                      <span className="ml-3 text-gray-600">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-4">📦</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                      <p className="text-sm text-gray-500 mb-4">Get started by creating your first product.</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        disabled={loading}
                      >
                        Add New Product
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const stockColor = getStockStatusColor(stockStatus);
                  const categoryInfo = allCategories.find(cat => cat.value === product.category);
                  
                  return (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/images/placeholder-product.jpg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Brand: {product.brand}
                            </div>
                            {product.model && (
                              <div className="text-xs text-gray-500">
                                Model: {product.model}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {categoryInfo?.label || product.category}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Performance: {product.performance || 'Regular'}
                        </div>
                        {product.useCase && product.useCase.length > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            {product.useCase.slice(0, 2).join(', ')}
                            {product.useCase.length > 2 && ` +${product.useCase.length - 2}`}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatCurrency(product.originalPrice)}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 mt-1">
                          Stock: {product.quantity || 0}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockColor}`}>
                          {stockStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {product.isFeatured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatDate(product.createdAt)}</div>
                        {product.updatedAt !== product.createdAt && (
                          <div className="text-xs text-gray-400 mt-1">
                            Updated: {formatDate(product.updatedAt)}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 text-left transition-colors"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="text-red-600 hover:text-red-900 text-left transition-colors"
                            disabled={loading}
                          >
                            Delete
                          </button>
                          <a
                            href={`/product/${product._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 text-left transition-colors"
                          >
                            View Live
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={!pagination.hasPrevPage || loading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 flex items-center">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={!pagination.hasNextPage || loading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                  {' '}({pagination.total} total products)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                    if (pageNum <= pagination.totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setFilters({ ...filters, page: pageNum })}
                          disabled={loading}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.currentPage
                              ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}