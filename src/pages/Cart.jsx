import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useAuth } from "../context/AuthContext";
import { productAPI, cartAPI } from "../services/api";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Tag,
  Heart,
  AlertCircle,
  RefreshCw,
  Clock,
  Wifi,
  WifiOff
} from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import Footer from "../components/Footer";
import EmpressNavbar from "../components/EmpressNavbar";

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getTotalPrice,
    getTotalOriginalPrice,
    getTotalSavings,
    getTotalItems,
    isLoading,
    isSyncing,
    forceSync
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [cartValidation, setCartValidation] = useState({ valid: true, issues: [] });
  const [isValidating, setIsValidating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Validate cart when user logs in or cart changes
  useEffect(() => {
    if (isAuthenticated() && user?._id && cart.length > 0) {
      validateCartItems();
    }
  }, [cart, user, isAuthenticated]);

  // Fetch recommended products
  useEffect(() => {
    if (cart.length > 0) {
      fetchRecommendedProducts();
    }
  }, [cart]);

  // Auto-sync cart periodically when online
  useEffect(() => {
    if (isAuthenticated() && user?._id && isOnline) {
      const syncInterval = setInterval(() => {
        forceSync();
        setLastSyncTime(new Date());
      }, 30000); // Sync every 30 seconds

      return () => clearInterval(syncInterval);
    }
  }, [isAuthenticated, user, isOnline, forceSync]);

  const validateCartItems = async () => {
    if (!isAuthenticated() || !user?._id) return;

    try {
      setIsValidating(true);
      const response = await cartAPI.validateCart(user._id);
      
      if (response.success) {
        setCartValidation({
          valid: response.valid,
          issues: response.issues || []
        });
      }
    } catch (error) {
      console.error('Error validating cart:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      setLoadingRecommended(true);
      
      if (isAuthenticated() && user?._id) {
        // Get recommendations from server for logged-in users
        const response = await cartAPI.getCartRecommendations(user._id, 3);
        if (response.success) {
          setRecommendedProducts(response.recommendations);
        }
      } else {
        // Fallback to category-based recommendations for guest users
        const categories = [...new Set(cart.map(item => item.category))];
        
        if (categories.length > 0) {
          const response = await productAPI.getProductsByCategory(categories[0], {
            limit: 4,
            sortBy: 'rating',
            order: 'desc'
          });
          
          if (response.success) {
            const cartProductIds = cart.map(item => item._id || item.id);
            const filtered = response.data.products.filter(
              product => !cartProductIds.includes(product._id)
            );
            setRecommendedProducts(filtered.slice(0, 3));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      if (isAuthenticated() && user?._id) {
        // Apply coupon via server for logged-in users
        const response = await cartAPI.applyCoupon(user._id, couponCode);
        
        if (response.success) {
          setAppliedCoupon(response.appliedCoupon);
          setCouponDiscount(calculateCouponDiscount(response.appliedCoupon));
          setCouponError("");
        }
      } else {
        // Local coupon validation for guest users
        const validCoupons = {
          'SAVE10': { discount: 10, type: 'percentage', minOrder: 0 },
          'SAVE500': { discount: 500, type: 'fixed', minOrder: 5000 },
          'FIRST20': { discount: 20, type: 'percentage', minOrder: 10000 },
          'WELCOME15': { discount: 15, type: 'percentage', minOrder: 0 }
        };

        const coupon = validCoupons[couponCode.toUpperCase()];
        
        if (!coupon) {
          setCouponError("Invalid coupon code");
          return;
        }

        const subtotal = getTotalPrice();
        
        if (subtotal < coupon.minOrder) {
          setCouponError(`Minimum order amount ₹${coupon.minOrder.toLocaleString()} required`);
          return;
        }

        let discount = 0;
        if (coupon.type === 'percentage') {
          discount = (subtotal * coupon.discount) / 100;
        } else {
          discount = coupon.discount;
        }

        setCouponDiscount(discount);
        setAppliedCoupon(coupon);
        setCouponError("");
      }
    } catch (error) {
      setCouponError(error.message || "Error applying coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const calculateCouponDiscount = (coupon) => {
    if (!coupon) return 0;
    
    const subtotal = getTotalPrice();
    if (coupon.type === 'percentage') {
      return (subtotal * coupon.discount) / 100;
    }
    return coupon.discount;
  };

  const removeCoupon = async () => {
    try {
      if (isAuthenticated() && user?._id) {
        await cartAPI.removeCoupon(user._id);
      }
      
      setCouponDiscount(0);
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");
    } catch (error) {
      console.error('Error removing coupon:', error);
    }
  };

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(cartItemId, newQuantity);
  };

  const handleAddRecommended = async (product) => {
    try {
      navigate(`/product/${product._id}`);
    } catch (error) {
      console.error('Error adding recommended product:', error);
    }
  };

  const handleForceSync = async () => {
    try {
      await forceSync();
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const handleFixCartIssue = async (issue) => {
    try {
      switch (issue.issue) {
        case 'insufficient_stock':
          if (issue.availableQuantity > 0) {
            updateQuantity(issue.cartItemId, issue.availableQuantity);
          } else {
            removeFromCart(issue.cartItemId);
          }
          break;
        case 'product_not_found':
          removeFromCart(issue.cartItemId);
          break;
        case 'price_changed':
          // Price changes are automatically handled by the cart context
          break;
        default:
          break;
      }
      
      // Re-validate after fixing
      await validateCartItems();
    } catch (error) {
      console.error('Error fixing cart issue:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your cart...</h2>
          {isSyncing && (
            <p className="text-sm text-gray-500 mt-2">Syncing with server...</p>
          )}
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <EmpressNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet. 
              Start shopping to fill it up!
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/products")}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </button>
              <button
                onClick={() => navigate("/components")}
                className="w-full border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Browse Components
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const subtotal = getTotalPrice();
  const originalTotal = getTotalOriginalPrice();
  const savings = getTotalSavings();
  const finalTotal = subtotal - couponDiscount;
  const totalItems = getTotalItems();

  return (
    <>
      <EmpressNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </button>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                {/* Sync Status */}
                <div className="flex items-center gap-2">
                  {!isOnline ? (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <WifiOff className="w-4 h-4" />
                      Offline
                    </div>
                  ) : isSyncing ? (
                    <div className="flex items-center gap-1 text-blue-500 text-sm">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Syncing...
                    </div>
                  ) : isAuthenticated() && (
                    <button
                      onClick={handleForceSync}
                      className="flex items-center gap-1 text-green-500 hover:text-green-600 text-sm transition-colors"
                      title="Force sync cart"
                    >
                      <Wifi className="w-4 h-4" />
                      Synced
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
              {lastSyncTime && (
                <p className="text-xs text-gray-400">
                  Last synced: {lastSyncTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {/* Cart Validation Issues */}
          {!cartValidation.valid && cartValidation.issues.length > 0 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Cart Issues Detected</h3>
              </div>
              <div className="space-y-2">
                {cartValidation.issues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                      <p className="text-xs text-gray-500">Item: {issue.cartItemId}</p>
                    </div>
                    <button
                      onClick={() => handleFixCartIssue(issue)}
                      className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Fix
                    </button>
                  </div>
                ))}
              </div>
              {isValidating && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Validating cart...
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.cartItemId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                          fallbackSrc="/images/placeholder-product.jpg"
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{item.brand}</p>

                      {/* Item Variants */}
                      {(item.selectedColor || item.selectedSize) && (
                        <div className="flex gap-4 mb-3">
                          {item.selectedColor && (
                            <span className="text-sm text-gray-600">
                              Color: <span className="font-medium">{item.selectedColor}</span>
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-sm text-gray-600">
                              Size: <span className="font-medium">{item.selectedSize}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                              disabled={item.quantity >= (item.originalProduct?.quantity || 99)}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Stock Warning */}
                          {item.originalProduct?.quantity <= 5 && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs">Only {item.originalProduct.quantity} left</span>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{(item.originalPrice * item.quantity).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="text-center pt-4">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Clear entire cart
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="space-y-6">
              {/* Coupon Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Apply Coupon
                </h3>
                
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">
                          Coupon "{couponCode}" applied!
                        </p>
                        <p className="text-sm text-green-600">
                          {appliedCoupon.type === 'percentage' 
                            ? `${appliedCoupon.discount}% discount` 
                            : `₹${appliedCoupon.discount} off`
                          }
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    
                    {couponError && (
                      <p className="text-red-600 text-sm">{couponError}</p>
                    )}

                    <div className="text-xs text-gray-500">
                      <p>Available coupons: SAVE10, SAVE500, FIRST20, WELCOME15</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Product Savings</span>
                      <span>-₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>

                  {originalTotal > finalTotal && (
                    <p className="text-sm text-gray-500">
                      You save ₹{(originalTotal - finalTotal).toLocaleString()}!
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      navigate('/auth', { state: { from: '/checkout' } });
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Secure checkout powered by SSL encryption
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          {recommendedProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleAddRecommended(product)}
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <ImageWithFallback
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                        fallbackSrc="/images/placeholder-product.jpg"
                      />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-purple-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button className="text-purple-600 hover:text-purple-800 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;