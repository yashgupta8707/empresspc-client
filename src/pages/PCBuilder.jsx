// src/components/PCBuilder.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, Monitor, Cpu, HardDrive, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import PlatformSelector from './PCBuilderComponents/PlatformSelector';
import ComponentSelector from './PCBuilderComponents/ComponentSelector';
import ConfigurationSummary from './PCBuilderComponents/ConfigurationSummary';
import CompatibilityChecker from './PCBuilderComponents/CompatibilityChecker';

const PCBuilder = () => {
  const [currentStep, setCurrentStep] = useState('platform');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [configuration, setConfiguration] = useState({
    id: null,
    platform: '',
    useCase: 'General',
    budget: { target: 50000 },
    components: {
      processor: null,
      motherboard: null,
      memory: null,
      graphicsCard: null,
      storage: [],
      powerSupply: null,
      pcCase: null,
      cooling: null
    },
    pricing: {
      subtotal: 0,
      tax: 0,
      total: 0
    },
    compatibility: {
      isValid: true,
      issues: [],
      warnings: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const componentCategories = [
    { key: 'processor', label: 'Processor', icon: Cpu, required: true },
    { key: 'motherboard', label: 'Motherboard', icon: Monitor, required: true },
    { key: 'memory', label: 'Memory (RAM)', icon: HardDrive, required: true },
    { key: 'graphicsCard', label: 'Graphics Card', icon: Monitor, required: false },
    { key: 'storage', label: 'Storage', icon: HardDrive, required: true },
    { key: 'powerSupply', label: 'Power Supply', icon: Zap, required: true },
    { key: 'pcCase', label: 'PC Case', icon: Monitor, required: true },
    { key: 'cooling', label: 'CPU Cooler', icon: Monitor, required: false }
  ];

  const steps = [
    { key: 'platform', label: 'Choose Platform', completed: !!selectedPlatform },
    { key: 'components', label: 'Select Components', completed: false },
    { key: 'review', label: 'Review & Order', completed: false }
  ];

  // Initialize configuration
  const initializeConfiguration = async (platform, useCase = 'General', budget = 50000) => {
    setLoading(true);
    try {
      const response = await fetch('/api/pc-builder/configuration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          configName: `${platform.toUpperCase()} Build`,
          platform,
          useCase,
          budget: { target: budget },
          sessionId: sessionStorage.getItem('sessionId') || Date.now().toString()
        })
      });

      if (!response.ok) throw new Error('Failed to create configuration');
      
      const data = await response.json();
      setConfiguration(prev => ({
        ...prev,
        id: data.data._id,
        platform,
        useCase,
        budget: { target: budget }
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformSelect = async (platform) => {
    setSelectedPlatform(platform);
    await initializeConfiguration(platform);
    setCurrentStep('components');
  };

  const handleComponentSelect = async (componentType, product) => {
    if (!configuration.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/pc-builder/configuration/${configuration.id}/component`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          componentType,
          productId: product._id,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Failed to add component');
      
      const data = await response.json();
      setConfiguration(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComponentRemove = async (componentType, storageIndex = null) => {
    if (!configuration.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/pc-builder/configuration/${configuration.id}/component`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          componentType,
          storageIndex
        })
      });

      if (!response.ok) throw new Error('Failed to remove component');
      
      const data = await response.json();
      setConfiguration(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkCompatibility = async () => {
    if (!configuration.id) return;

    try {
      const response = await fetch(`/api/pc-builder/configuration/${configuration.id}/compatibility`);
      if (!response.ok) throw new Error('Failed to check compatibility');
      
      const data = await response.json();
      setConfiguration(prev => ({
        ...prev,
        compatibility: data.data.compatibility
      }));
    } catch (err) {
      console.error('Compatibility check failed:', err);
    }
  };

  useEffect(() => {
    if (configuration.id) {
      checkCompatibility();
    }
  }, [configuration.components]);

  const getStepContent = () => {
    switch (currentStep) {
      case 'platform':
        return (
          <PlatformSelector
            onPlatformSelect={handlePlatformSelect}
            selectedPlatform={selectedPlatform}
            loading={loading}
          />
        );
      case 'components':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ComponentSelector
                platform={selectedPlatform}
                configuration={configuration}
                onComponentSelect={handleComponentSelect}
                onComponentRemove={handleComponentRemove}
                componentCategories={componentCategories}
                loading={loading}
              />
            </div>
            <div className="lg:col-span-1">
              <ConfigurationSummary
                configuration={configuration}
                onRemoveComponent={handleComponentRemove}
              />
              <CompatibilityChecker
                compatibility={configuration.compatibility}
                className="mt-6"
              />
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConfigurationSummary
              configuration={configuration}
              onRemoveComponent={handleComponentRemove}
              showActions={true}
            />
            <div>
              <CompatibilityChecker compatibility={configuration.compatibility} />
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Ready to Order?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Your configuration is ready. Review the compatibility status and proceed to checkout.
                </p>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Add to Cart & Checkout
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">PC Builder</h1>
          <p className="text-gray-600">Build your perfect custom PC with compatible components</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.key}>
                <div className={`flex items-center space-x-2 ${
                  currentStep === step.key ? 'text-blue-600' : 
                  step.completed ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === step.key ? 'bg-blue-100 text-blue-600' :
                    step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className="font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {getStepContent()}
      </div>

      {/* Navigation */}
      {currentStep !== 'platform' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="container mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(currentStep === 'review' ? 'components' : 'platform')}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            
            {currentStep === 'components' && (
              <button
                onClick={() => setCurrentStep('review')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                disabled={!configuration.components.processor || !configuration.components.motherboard}
              >
                Review Configuration
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PCBuilder;