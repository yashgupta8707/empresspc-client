// src/components/PCBuilderComponents/ConfigurationSummary.jsx
import React from 'react';
import { X, ShoppingCart, Share2, Save, AlertTriangle } from 'lucide-react';

const ConfigurationSummary = ({ configuration, onRemoveComponent, showActions = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getComponentsList = () => {
    const components = [];
    const { components: configComponents } = configuration;

    // Add individual components
    Object.entries(configComponents).forEach(([key, component]) => {
      if (key === 'storage') {
        // Handle storage array
        if (Array.isArray(component) && component.length > 0) {
          component.forEach((storageItem, index) => {
            if (storageItem.productId) {
              components.push({
                key: `${key}-${index}`,
                type: key,
                name: storageItem.product.name,
                price: storageItem.product.price,
                quantity: storageItem.quantity,
                image: storageItem.product.image,
                storageIndex: index
              });
            }
          });
        }
      } else if (component?.productId) {
        components.push({
          key,
          type: key,
          name: component.product.name,
          price: component.product.price,
          quantity: component.quantity,
          image: component.product.image
        });
      }
    });

    return components;
  };

  const getComponentTypeLabel = (type) => {
    const labels = {
      processor: 'Processor',
      motherboard: 'Motherboard',
      memory: 'Memory (RAM)',
      graphicsCard: 'Graphics Card',
      storage: 'Storage',
      powerSupply: 'Power Supply',
      pcCase: 'PC Case',
      cooling: 'CPU Cooler'
    };
    return labels[type] || type;
  };

  const components = getComponentsList();
  const hasComponents = components.length > 0;

  const handleAddToCart = () => {
    // Add all components to cart
    console.log('Adding configuration to cart:', configuration);
  };

  const handleShare = () => {
    // Share configuration
    if (navigator.share) {
      navigator.share({
        title: configuration.configName || 'My PC Build',
        text: `Check out my custom PC build - ${formatPrice(configuration.pricing.total)}`,
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSave = () => {
    // Save configuration
    console.log('Saving configuration:', configuration);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Build Summary</h3>
        <p className="text-sm text-gray-600 mt-1">
          {configuration.platform?.toUpperCase()} Platform • {configuration.useCase}
        </p>
      </div>

      <div className="p-4">
        {!hasComponents ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No components selected</h4>
            <p className="text-gray-600">Start by selecting components from the categories above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {components.map((component) => (
              <div key={component.key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={component.image || '/images/placeholder-component.jpg'}
                  alt={component.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getComponentTypeLabel(component.type)}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{component.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(component.price * component.quantity)}
                    </span>
                    {component.quantity > 1 && (
                      <span className="text-xs text-gray-500">Qty: {component.quantity}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveComponent(component.type, component.storageIndex)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove component"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Summary */}
      {hasComponents && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(configuration.pricing.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18% GST)</span>
              <span className="font-medium">{formatPrice(configuration.pricing.tax)}</span>
            </div>
            {configuration.pricing.shipping > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{formatPrice(configuration.pricing.shipping)}</span>
              </div>
            )}
            {configuration.pricing.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">-{formatPrice(configuration.pricing.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(configuration.pricing.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Indicator */}
      {hasComponents && configuration.budget?.target && (
        <div className="p-4 border-t border-gray-200">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">Budget Progress</span>
            <span className="font-medium">
              {formatPrice(configuration.pricing.total)} / {formatPrice(configuration.budget.target)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                configuration.pricing.total > configuration.budget.target
                  ? 'bg-red-500'
                  : configuration.pricing.total > configuration.budget.target * 0.9
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{
                width: `${Math.min(
                  (configuration.pricing.total / configuration.budget.target) * 100,
                  100
                )}%`
              }}
            ></div>
          </div>
          {configuration.pricing.total > configuration.budget.target && (
            <div className="flex items-center space-x-1 mt-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                Over budget by {formatPrice(configuration.pricing.total - configuration.budget.target)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {showActions && hasComponents && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSave}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}

      {/* Component Requirements */}
      <div className="p-4 border-t border-gray-200 bg-blue-50">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Required Components</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {[
            { key: 'processor', label: 'Processor', required: true },
            { key: 'motherboard', label: 'Motherboard', required: true },
            { key: 'memory', label: 'Memory', required: true },
            { key: 'storage', label: 'Storage', required: true },
            { key: 'powerSupply', label: 'Power Supply', required: true },
            { key: 'pcCase', label: 'Case', required: true },
          ].map(({ key, label, required }) => {
            const hasComponent = key === 'storage' 
              ? configuration.components[key]?.length > 0
              : !!configuration.components[key]?.productId;
            
            return (
              <div key={key} className={`flex items-center space-x-1 ${
                required ? (hasComponent ? 'text-green-700' : 'text-red-700') : 'text-blue-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  required ? (hasComponent ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'
                }`}></div>
                <span>{label}</span>
                {required && <span className="text-red-500">*</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSummary;