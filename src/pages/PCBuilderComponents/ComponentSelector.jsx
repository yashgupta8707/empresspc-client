// src/components/PCBuilderComponents/ComponentSelector.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Plus, Check, AlertCircle, Loader2 } from 'lucide-react';

const ComponentSelector = ({ 
  platform, 
  configuration, 
  onComponentSelect, 
  onComponentRemove, 
  componentCategories,
  loading 
}) => {
  const [activeCategory, setActiveCategory] = useState('processor');
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    brand: '',
    socket: '',
    chipset: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    sockets: [],
    chipsets: [],
    priceRanges: []
  });

  // Fetch components when category or platform changes
  useEffect(() => {
    if (platform && activeCategory) {
      fetchComponents();
      fetchAvailableFilters();
    }
  }, [platform, activeCategory]);

  // Apply filters when components or filters change
  useEffect(() => {
    applyFilters();
  }, [components, searchTerm, filters]);

  const fetchComponents = async () => {
    setLoadingComponents(true);
    try {
      let url = `/api/pc-builder/components/${platform}?category=${activeCategory}`;
      
      // Add compatibility filtering based on existing components
      if (configuration.components.processor?.productId && activeCategory === 'motherboards') {
        url += `&compatibleWith=${configuration.components.processor.productId}`;
      }
      if (configuration.components.motherboard?.productId && ['processors', 'memory'].includes(activeCategory)) {
        url += `&compatibleWith=${configuration.components.motherboard.productId}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch components');
      
      const data = await response.json();
      setComponents(data.data || []);
    } catch (error) {
      console.error('Error fetching components:', error);
      setComponents([]);
    } finally {
      setLoadingComponents(false);
    }
  };

  const fetchAvailableFilters = async () => {
    try {
      const response = await fetch(`/api/pc-builder/filters/${platform}`);
      if (!response.ok) throw new Error('Failed to fetch filters');
      
      const data = await response.json();
      setAvailableFilters(data.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...components];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(component =>
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter(component => component.price >= parseInt(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(component => component.price <= parseInt(filters.priceMax));
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(component => 
        component.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    // Socket filter
    if (filters.socket) {
      filtered = filtered.filter(component => {
        const socket = component.pcBuilderSpecs?.processorSpecs?.socket || 
                     component.pcBuilderSpecs?.motherboardSpecs?.socket;
        return socket === filters.socket;
      });
    }

    // Chipset filter
    if (filters.chipset) {
      filtered = filtered.filter(component => 
        component.pcBuilderSpecs?.motherboardSpecs?.chipset === filters.chipset
      );
    }

    setFilteredComponents(filtered);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      brand: '',
      socket: '',
      chipset: ''
    });
    setSearchTerm('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getComponentSpecs = (component) => {
    const specs = [];
    const pcSpecs = component.pcBuilderSpecs;

    switch (activeCategory) {
      case 'processors':
        if (pcSpecs?.processorSpecs) {
          const proc = pcSpecs.processorSpecs;
          specs.push(
            proc.cores && `${proc.cores} Cores`,
            proc.threads && `${proc.threads} Threads`,
            proc.baseClock && `${proc.baseClock} Base`,
            proc.socket && proc.socket
          );
        }
        break;
      case 'motherboards':
        if (pcSpecs?.motherboardSpecs) {
          const mb = pcSpecs.motherboardSpecs;
          specs.push(
            mb.socket && mb.socket,
            mb.chipset && mb.chipset,
            mb.formFactor && mb.formFactor,
            mb.maxMemory && `${mb.maxMemory}GB RAM`
          );
        }
        break;
      case 'memory':
        if (pcSpecs?.memorySpecs) {
          const mem = pcSpecs.memorySpecs;
          specs.push(
            mem.type && mem.type,
            mem.speed && `${mem.speed} MHz`,
            mem.capacity && `${mem.capacity}GB`,
            mem.modules && `${mem.modules} Sticks`
          );
        }
        break;
      case 'graphics-cards':
        if (pcSpecs?.graphicsSpecs) {
          const gpu = pcSpecs.graphicsSpecs;
          specs.push(
            gpu.vram && `${gpu.vram}GB VRAM`,
            gpu.vramType && gpu.vramType,
            gpu.boostClock && `${gpu.boostClock} MHz`,
            gpu.rayTracing && 'Ray Tracing'
          );
        }
        break;
      case 'storage':
        if (pcSpecs?.storageSpecs) {
          const storage = pcSpecs.storageSpecs;
          specs.push(
            storage.capacity && `${storage.capacity}GB`,
            storage.type && storage.type,
            storage.interface && storage.interface,
            storage.readSpeed && `${storage.readSpeed} MB/s Read`
          );
        }
        break;
      case 'power-supplies':
        if (pcSpecs?.psuSpecs) {
          const psu = pcSpecs.psuSpecs;
          specs.push(
            psu.wattage && `${psu.wattage}W`,
            psu.efficiency && psu.efficiency,
            psu.modular && `${psu.modular} Modular`,
            psu.formFactor && psu.formFactor
          );
        }
        break;
    }

    return specs.filter(Boolean);
  };

  const isComponentSelected = (componentId) => {
    const selectedComponent = configuration.components[activeCategory];
    if (Array.isArray(selectedComponent)) {
      return selectedComponent.some(item => item.productId === componentId);
    }
    return selectedComponent?.productId === componentId;
  };

  const getSelectedComponent = () => {
    return configuration.components[activeCategory];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {componentCategories.map((category) => {
            const Icon = category.icon;
            const selectedComp = configuration.components[category.key];
            const hasSelection = Array.isArray(selectedComp) ? selectedComp.length > 0 : !!selectedComp?.productId;
            
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeCategory === category.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
                {category.required && (
                  <span className="text-red-500">*</span>
                )}
                {hasSelection && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${componentCategories.find(c => c.key === activeCategory)?.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="₹0"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="₹999999"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Brands</option>
                {availableFilters.brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            {(['processors', 'motherboards'].includes(activeCategory)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Socket</label>
                <select
                  value={filters.socket}
                  onChange={(e) => handleFilterChange('socket', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sockets</option>
                  {availableFilters.sockets.map(socket => (
                    <option key={socket} value={socket}>{socket}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Component Display */}
      {getSelectedComponent()?.productId && (
        <div className="p-4 bg-green-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Selected Component</p>
                <p className="text-sm text-green-600">{getSelectedComponent().product?.name}</p>
              </div>
            </div>
            <button
              onClick={() => onComponentRemove(activeCategory)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Components List */}
      <div className="p-4">
        {loadingComponents ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading components...</p>
            </div>
          </div>
        ) : filteredComponents.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredComponents.map((component) => (
              <div
                key={component._id}
                className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                  isComponentSelected(component._id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={component.images[0] || '/images/placeholder-component.jpg'}
                        alt={component.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{component.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{component.brand}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(component.price)}
                          </span>
                          {component.originalPrice && component.originalPrice > component.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(component.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Component Specifications */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getComponentSpecs(component).map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`flex items-center space-x-1 ${
                        component.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          component.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span>{component.quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                      </span>
                      {component.rating > 0 && (
                        <span className="text-yellow-500">
                          ★ {component.rating.toFixed(1)} ({component.reviews})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    <button
                      onClick={() => onComponentSelect(activeCategory, component)}
                      disabled={loading || component.quantity === 0 || isComponentSelected(component._id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isComponentSelected(component._id)
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : component.quantity === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isComponentSelected(component._id) ? (
                        'Selected'
                      ) : component.quantity === 0 ? (
                        'Out of Stock'
                      ) : (
                        'Select'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentSelector;