// src/components/PCBuilderComponents/PlatformSelector.jsx
import React, { useState } from 'react';
import { Cpu, Zap, TrendingUp, DollarSign, Loader2 } from 'lucide-react';

const PlatformSelector = ({ onPlatformSelect, selectedPlatform, loading }) => {
  const [hoveredPlatform, setHoveredPlatform] = useState('');

  const platforms = [
    {
      id: 'intel',
      name: 'Intel Platform',
      logo: '/images/intel-logo.png',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-700',
      features: [
        'Latest 13th Gen processors',
        'DDR5 memory support',
        'PCIe 5.0 compatibility',
        'Integrated graphics'
      ],
      useCases: [
        'Gaming & Entertainment',
        'Content Creation',
        'Professional Workloads',
        'General Computing'
      ],
      priceRange: '₹25,000 - ₹2,50,000',
      performance: 'Excellent single-core performance',
      pros: [
        'Superior single-threaded performance',
        'Better gaming performance',
        'Strong integrated graphics',
        'Mature platform with wide compatibility'
      ],
      cons: [
        'Higher power consumption',
        'More expensive than AMD alternatives',
        'Frequent socket changes'
      ]
    },
    {
      id: 'amd',
      name: 'AMD Platform',
      logo: '/images/amd-logo.png',
      color: 'red',
      gradient: 'from-red-500 to-red-700',
      features: [
        'Latest Ryzen 7000 series',
        'DDR5 memory support',
        'PCIe 5.0 compatibility',
        'More cores for the price'
      ],
      useCases: [
        'Multi-threaded Workloads',
        'Content Creation',
        'Streaming & Recording',
        'Value Gaming Builds'
      ],
      priceRange: '₹20,000 - ₹2,00,000',
      performance: 'Excellent multi-core performance',
      pros: [
        'Better multi-threaded performance',
        'More value for money',
        'Lower power consumption',
        'Longer socket support'
      ],
      cons: [
        'Slightly lower single-threaded performance',
        'Weaker integrated graphics',
        'Platform maturity varies'
      ]
    }
  ];

  const handlePlatformSelect = (platformId) => {
    if (loading) return;
    onPlatformSelect(platformId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Platform</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select between Intel or AMD platforms. Each offers different advantages depending on your use case and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 ${
              hoveredPlatform === platform.id ? 'scale-105 shadow-2xl' : 'hover:shadow-xl'
            } ${selectedPlatform === platform.id ? 'ring-4 ring-blue-500' : ''}`}
            onMouseEnter={() => setHoveredPlatform(platform.id)}
            onMouseLeave={() => setHoveredPlatform('')}
            onClick={() => handlePlatformSelect(platform.id)}
          >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${platform.gradient} p-6 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <Cpu className="w-32 h-32 absolute -top-4 -right-4 transform rotate-12" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{platform.name}</h3>
                  <p className="text-lg opacity-90">{platform.performance}</p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Cpu className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Price Range */}
              <div className="flex items-center mb-4">
                <DollarSign className={`w-5 h-5 mr-2 text-${platform.color}-600`} />
                <span className="font-semibold text-gray-800">{platform.priceRange}</span>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Zap className={`w-4 h-4 mr-2 text-${platform.color}-600`} />
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {platform.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 bg-${platform.color}-500 rounded-full mr-3`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <TrendingUp className={`w-4 h-4 mr-2 text-${platform.color}-600`} />
                  Best For
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {platform.useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className={`text-xs px-3 py-1 bg-${platform.color}-50 text-${platform.color}-700 rounded-full text-center`}
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h5 className="font-medium text-green-800 text-sm mb-2">Advantages</h5>
                  <ul className="space-y-1">
                    {platform.pros.slice(0, 2).map((pro, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-orange-800 text-sm mb-2">Considerations</h5>
                  <ul className="space-y-1">
                    {platform.cons.slice(0, 2).map((con, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="text-orange-500 mr-2">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Selection Button */}
            <div className="px-6 pb-6">
              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  selectedPlatform === platform.id
                    ? `bg-${platform.color}-600 text-white`
                    : `bg-${platform.color}-50 text-${platform.color}-700 hover:bg-${platform.color}-100`
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading && selectedPlatform === platform.id ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </div>
                ) : selectedPlatform === platform.id ? (
                  'Selected'
                ) : (
                  `Choose ${platform.name}`
                )}
              </button>
            </div>

            {/* Loading Overlay */}
            {loading && selectedPlatform === platform.id && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 shadow-lg">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Initializing build...</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Platform Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intel
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AMD
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Single-Core Performance</td>
                <td className="px-6 py-4 text-sm text-center text-green-600">Excellent</td>
                <td className="px-6 py-4 text-sm text-center text-yellow-600">Very Good</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Multi-Core Performance</td>
                <td className="px-6 py-4 text-sm text-center text-yellow-600">Very Good</td>
                <td className="px-6 py-4 text-sm text-center text-green-600">Excellent</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Value for Money</td>
                <td className="px-6 py-4 text-sm text-center text-yellow-600">Good</td>
                <td className="px-6 py-4 text-sm text-center text-green-600">Excellent</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Power Efficiency</td>
                <td className="px-6 py-4 text-sm text-center text-yellow-600">Good</td>
                <td className="px-6 py-4 text-sm text-center text-green-600">Very Good</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Gaming Performance</td>
                <td className="px-6 py-4 text-sm text-center text-green-600">Excellent</td>
                <td className="px-6 py-4 text-sm text-center text-green-600">Excellent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;