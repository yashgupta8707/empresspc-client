// Create this as a temporary debug component: components/APIDebugHelper.jsx

import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';

const APIDebugHelper = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testProductId, setTestProductId] = useState('');

  const testEndpoints = async () => {
    const results = {};
    
    try {
      // Test 1: Get categories
      console.log('Testing categories endpoint...');
      const categoriesResponse = await productAPI.getCategories();
      results.categories = {
        success: true,
        data: categoriesResponse,
        count: categoriesResponse?.data?.length || 0
      };
    } catch (error) {
      results.categories = {
        success: false,
        error: error.message
      };
    }

    try {
      // Test 2: Get products by category
      console.log('Testing products by category...');
      const productsResponse = await productAPI.getProductsByCategory('cases', {
        limit: 5
      });
      results.productsByCategory = {
        success: true,
        data: productsResponse,
        count: productsResponse?.data?.products?.length || 0
      };
      
      // Get first product ID for testing
      if (productsResponse?.data?.products?.length > 0) {
        const firstProduct = productsResponse.data.products[0];
        setTestProductId(firstProduct._id || firstProduct.id);
        results.firstProductId = firstProduct._id || firstProduct.id;
      }
    } catch (error) {
      results.productsByCategory = {
        success: false,
        error: error.message
      };
    }

    try {
      // Test 3: Get all products
      console.log('Testing all products endpoint...');
      const allProductsResponse = await productAPI.getAllProducts({
        limit: 5
      });
      results.allProducts = {
        success: true,
        data: allProductsResponse,
        count: allProductsResponse?.data?.products?.length || 0
      };
    } catch (error) {
      results.allProducts = {
        success: false,
        error: error.message
      };
    }

    setDebugInfo(results);
  };

  const testSpecificProduct = async (productId) => {
    if (!productId) return;
    
    const results = { ...debugInfo };
    
    try {
      console.log('Testing specific product:', productId);
      const productResponse = await productAPI.getProductById(productId);
      results.specificProduct = {
        success: true,
        data: productResponse,
        productId
      };
    } catch (error) {
      results.specificProduct = {
        success: false,
        error: error.message,
        productId
      };
    }

    // Test alternative endpoints
    try {
      const directResponse = await fetch(`http://localhost:5000/api/products/public/${productId}`);
      const directData = await directResponse.json();
      results.directFetch = {
        success: directResponse.ok,
        data: directData,
        status: directResponse.status
      };
    } catch (error) {
      results.directFetch = {
        success: false,
        error: error.message
      };
    }

    setDebugInfo(results);
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-md z-50 border">
      <h3 className="font-bold text-lg mb-2">API Debug Info</h3>
      
      <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
        {/* Categories Test */}
        <div className="p-2 border rounded">
          <h4 className="font-semibold">Categories API:</h4>
          <div className={`${debugInfo.categories?.success ? 'text-green-600' : 'text-red-600'}`}>
            {debugInfo.categories?.success ? 
              `✅ Success (${debugInfo.categories.count} categories)` : 
              `❌ Failed: ${debugInfo.categories?.error}`
            }
          </div>
        </div>

        {/* Products by Category Test */}
        <div className="p-2 border rounded">
          <h4 className="font-semibold">Products by Category:</h4>
          <div className={`${debugInfo.productsByCategory?.success ? 'text-green-600' : 'text-red-600'}`}>
            {debugInfo.productsByCategory?.success ? 
              `✅ Success (${debugInfo.productsByCategory.count} products)` : 
              `❌ Failed: ${debugInfo.productsByCategory?.error}`
            }
          </div>
        </div>

        {/* All Products Test */}
        <div className="p-2 border rounded">
          <h4 className="font-semibold">All Products:</h4>
          <div className={`${debugInfo.allProducts?.success ? 'text-green-600' : 'text-red-600'}`}>
            {debugInfo.allProducts?.success ? 
              `✅ Success (${debugInfo.allProducts.count} products)` : 
              `❌ Failed: ${debugInfo.allProducts?.error}`
            }
          </div>
        </div>

        {/* Test Product Detail */}
        <div className="p-2 border rounded">
          <h4 className="font-semibold">Product Detail Test:</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={testProductId}
              onChange={(e) => setTestProductId(e.target.value)}
              placeholder="Product ID"
              className="flex-1 px-2 py-1 border rounded text-xs"
            />
            <button
              onClick={() => testSpecificProduct(testProductId)}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
            >
              Test
            </button>
          </div>
          
          {debugInfo.specificProduct && (
            <div className={`${debugInfo.specificProduct.success ? 'text-green-600' : 'text-red-600'}`}>
              {debugInfo.specificProduct.success ? 
                `✅ Product found` : 
                `❌ Failed: ${debugInfo.specificProduct.error}`
              }
            </div>
          )}
          
          {debugInfo.directFetch && (
            <div className={`${debugInfo.directFetch.success ? 'text-green-600' : 'text-red-600'}`}></div>