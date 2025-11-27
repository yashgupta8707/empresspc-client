import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInView } from "react-intersection-observer";
import { productAPI } from '../services/api';
import RelatedProducts from '../components/RelatedProducts';
import { useCart } from '../components/CartContext';
import ImageWithFallback from '../components/ImageWithFallback';
import Footer from '../components/Footer';
import EmpressNavbar from '../components/EmpressNavbar';

const ProductDetailPage = () => {
  const { addToCart } = useCart();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeSpecTab, setActiveSpecTab] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await productAPI.getProductById(productId);
      
      if (response.success) {
        setProduct(response.data.product);
        setRelatedProducts(response.data.relatedProducts || []);
        setMainImage(response.data.product.images?.[0] || '');
        
        // Set default selections
        if (response.data.product.colors?.length > 0) {
          setSelectedColor(response.data.product.colors[0]);
        }
        if (response.data.product.sizes?.length > 0) {
          setSelectedSize(response.data.product.sizes[0]);
        }
      } else {
        throw new Error('Product not found');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
      // Redirect to products page after 3 seconds
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  const handleBuyNow = () => {
    if (product.quantity === 0) {
      alert('Product is out of stock');
      return;
    }
    
    console.log(`Buying ${product.name} now!`);
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    if (product.quantity === 0) {
      alert('Product is out of stock');
      return;
    }
    
    addToCart(product, quantity, selectedColor, selectedSize);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isPC = product.category === 'gaming' || product.category === 'workstations';

  return (
    <>
    <EmpressNavbar />
    <div
      ref={ref}
      className={`min-h-screen bg-white transition-opacity duration-1000 ${
        inView ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-4 lg:p-6 lg:grid lg:grid-cols-2 lg:gap-8 flex flex-col">
        {/* Back to Products Link */}
        <div className="col-span-full mt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-700 hover:text-indigo-600 transition-colors text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
        </div>

        {/* Left Section: Image Gallery */}
        <div className="flex flex-col items-center lg:items-start lg:col-span-1">
          {/* Main Image */}
          <div className="relative w-full max-w-md lg:max-w-lg h-80 lg:h-96 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-4 mb-4 shadow-md">
            <ImageWithFallback
              src={mainImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              fallbackSrc="/images/placeholder-product.jpg"
            />
            
            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {product.badge && (
                <span className={`${product.badge.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                  {product.badge.text}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>
            
            {product.quantity === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                <span className="bg-red-600 text-white px-4 py-2 text-sm rounded-md font-bold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center w-full max-w-md lg:max-w-lg">
              {product.images.map((imgSrc, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-md overflow-hidden border-2 cursor-pointer transition-all duration-200
                              ${mainImage === imgSrc ? 'border-purple-600 shadow-sm' : 'border-gray-200 hover:border-purple-300'}`}
                  onClick={() => handleThumbnailClick(imgSrc)}
                >
                  <ImageWithFallback
                    src={imgSrc}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    fallbackSrc="/images/placeholder-product.jpg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Details */}
        <div className="mt-6 lg:mt-0 px-2 lg:px-0">
          {/* Brand and Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wide">
              {product.brand}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 capitalize">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="text-yellow-500 text-sm">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-gray-600 text-sm">
                {product.rating} ({product.reviews || 0} reviews)
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl lg:text-4xl font-bold text-purple-700">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            {product.originalPrice && product.price < product.originalPrice && (
              <span className="ml-2 text-green-600 font-semibold text-sm">
                Save ₹{(product.originalPrice - product.price).toLocaleString()}!
              </span>
            )}
          </div>

          {/* Key Features */}
          {product.keyFeatures && product.keyFeatures.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications with Tabs */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
                Detailed Specifications
              </h3>
              
              {/* Specification Category Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="flex space-x-8">
                  {product.specifications.map((spec, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSpecTab(index)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeSpecTab === index
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {spec.category}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Active Specification Content */}
              {product.specifications[activeSpecTab] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                  {product.specifications[activeSpecTab].items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">{item.label}:</span>
                      <span className="text-gray-800 text-right">
                        {item.value}{item.unit ? ` ${item.unit}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Legacy Specifications (for backward compatibility) */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
                Additional Specifications
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1">
                    <span className="font-medium text-gray-600">{key}:</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Available Colors:</h4>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 text-xs border rounded-md hover:bg-gray-100 transition ${
                      selectedColor === color ? 'border-purple-600 bg-purple-50 font-semibold' : 'border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Available Sizes:</h4>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 text-xs border rounded-md hover:bg-gray-100 transition ${
                      selectedSize === size ? 'border-purple-600 bg-purple-50 font-semibold' : 'border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <button
                className="w-8 h-8 text-lg font-bold hover:bg-gray-100"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-4 font-medium text-sm">{quantity}</span>
              <button
                className="w-8 h-8 text-lg font-bold hover:bg-gray-100"
                onClick={() => setQuantity(q => Math.min(product.quantity || 10, q + 1))}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="flex-1 bg-white border-2 border-purple-600 text-purple-700 text-base font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-purple-50 hover:border-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.quantity === 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-base font-semibold py-3 px-6 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Buy Now
            </button>
          </div>

          {/* Product Features */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-lg">🚚</span>
              <div>
                <strong>Free Delivery</strong><br />
                <span className="text-gray-600">Free shipping on orders above ₹1000</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">↩️</span>
              <div>
                <strong>Return Policy</strong><br />
                <span className="text-gray-600">30 days return policy</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🛡️</span>
              <div>
                <strong>Warranty</strong><br />
                <span className="text-gray-600">
                  {product.warrantyPeriod || 12} month{(product.warrantyPeriod || 12) !== 1 ? 's' : ''} manufacturer warranty
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts
          currentProduct={product}
          relatedProducts={relatedProducts}
          category={product.category}
        />
      )}
    </div>
    <Footer />
    </>
  );
};

export default ProductDetailPage;