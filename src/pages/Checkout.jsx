// // ===========================
// // 1. FIXED Checkout.jsx - ADD MISSING IMPORT
// // ===========================
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useCart } from "../components/CartContext";
// import { useAuth } from "../context/AuthContext";
// import { userAPI, paymentAPI } from "../services/api"; // FIX: ADD paymentAPI import
// import { 
//   CreditCard, 
//   Truck, 
//   Shield, 
//   AlertCircle, 
//   CheckCircle,
//   ArrowLeft,
//   Lock,
//   User,
//   LogIn,
//   Loader,
//   Smartphone,
//   CreditCard as CardIcon,
//   Building,
//   QrCode
// } from "lucide-react";
// import ImageWithFallback from "../components/ImageWithFallback";

// // Razorpay configuration
// const RAZORPAY_KEY_ID = "rzp_live_ccQKZ3le2mbA7R";

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, token } = useAuth();
//   const { 
//     cart, 
//     clearCart, 
//     getTotalPrice, 
//     getTotalSavings, 
//     getTotalItems 
//   } = useCart();

//   const [loading, setLoading] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [orderError, setOrderError] = useState("");
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [placedOrderId, setPlacedOrderId] = useState(null);

//   const [formData, setFormData] = useState({
//     firstName: user?.name?.split(' ')[0] || "",
//     lastName: user?.name?.split(' ').slice(1).join(' ') || "",
//     company: "",
//     address: user?.address || "",
//     apartment: "",
//     city: "",
//     state: "",
//     pincode: "",
//     phone: user?.phone || "",
//     email: user?.email || "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [saveInfo, setSaveInfo] = useState(true);
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Load Razorpay script
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => {
//       setRazorpayLoaded(true);
//       console.log('Razorpay script loaded successfully');
//     };
//     script.onerror = () => {
//       console.error('Failed to load Razorpay script');
//       setOrderError('Failed to load payment gateway. Please try again.');
//     };
//     document.body.appendChild(script);

//     return () => {
//       const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
//       if (existingScript) {
//         document.body.removeChild(existingScript);
//       }
//     };
//   }, []);

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (cart.length === 0 && !orderPlaced) {
//       navigate('/cart');
//       return;
//     }
//   }, [cart, navigate, orderPlaced]);

//   // Update form data when user changes
//   useEffect(() => {
//     if (user) {
//       setFormData(prev => ({
//         ...prev,
//         firstName: user.name?.split(' ')[0] || prev.firstName,
//         lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
//         email: user.email || prev.email,
//         phone: user.phone || prev.phone,
//         address: user.address || prev.address
//       }));
//     }
//   }, [user]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
//     if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
//     if (!formData.address.trim()) newErrors.address = "Address is required";
//     if (!formData.city.trim()) newErrors.city = "City is required";
//     if (!formData.state.trim()) newErrors.state = "State is required";
//     if (!formData.pincode.trim()) newErrors.pincode = "PIN code is required";
//     if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "PIN code must be 6 digits";
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//     if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be 10 digits";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
//     if (!termsAccepted) newErrors.terms = "Please accept the terms and conditions";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   // FIXED: Using paymentAPI correctly
//   const createRazorpayOrder = async (orderData) => {
//     try {
//       console.log('🔄 Creating Razorpay order...');
//       const response = await paymentAPI.createRazorpayOrder({
//         amount: orderData.totalPrice * 100,
//         currency: 'INR',
//         receipt: `order_${Date.now()}`,
//         notes: {
//           customerName: `${formData.firstName} ${formData.lastName}`,
//           customerEmail: formData.email,
//           itemCount: getTotalItems()
//         }
//       });

//       if (!response.success) {
//         throw new Error(response.message || 'Failed to create Razorpay order');
//       }

//       return response;
//     } catch (error) {
//       console.error('❌ Razorpay order creation failed:', error);
//       throw error;
//     }
//   };

//   const handleRazorpayPayment = async (orderData) => {
//     try {
//       const razorpayOrderResponse = await createRazorpayOrder(orderData);
//       const razorpayOrder = razorpayOrderResponse.order;

//       // Check if this is a mock order
//       if (razorpayOrder.id.includes('mock')) {
//         console.log('🎭 Mock payment - auto-completing...');
        
//         const mockPaymentResponse = {
//           razorpay_order_id: razorpayOrder.id,
//           razorpay_payment_id: `pay_mock_${Date.now()}`,
//           razorpay_signature: 'mock_signature'
//         };

//         const verifyResponse = await paymentAPI.verifyRazorpayPayment({
//           ...mockPaymentResponse,
//           orderData: orderData
//         });

//         if (verifyResponse.success) {
//           setPlacedOrderId(verifyResponse.order._id);
//           setOrderPlaced(true);
//           clearCart();
//           setTimeout(() => navigate('/account', { state: { tab: 'orders' } }), 3000);
//         } else {
//           throw new Error(verifyResponse.message || 'Payment verification failed');
//         }
//         return;
//       }

//       // Real Razorpay integration
//       if (!razorpayLoaded || !window.Razorpay) {
//         throw new Error('Payment gateway not loaded. Please refresh and try again.');
//       }

//       const options = {
//         key: RAZORPAY_KEY_ID,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         name: 'Empress Tech',
//         description: `Order for ${getTotalItems()} items`,
//         order_id: razorpayOrder.id,
//         handler: async function (response) {
//           console.log('Payment successful:', response);
//           setLoading(true);
          
//           try {
//             const verifyResponse = await paymentAPI.verifyRazorpayPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               orderData: orderData
//             });

//             if (verifyResponse.success) {
//               setPlacedOrderId(verifyResponse.order._id);
//               setOrderPlaced(true);
//               clearCart();
//               setTimeout(() => navigate('/account', { state: { tab: 'orders' } }), 3000);
//             } else {
//               throw new Error(verifyResponse.message || 'Payment verification failed');
//             }
//           } catch (error) {
//             console.error('❌ Payment verification error:', error);
//             setOrderError(`Payment verification failed: ${error.message}`);
//           } finally {
//             setLoading(false);
//           }
//         },
//         prefill: {
//           name: `${formData.firstName} ${formData.lastName}`,
//           email: formData.email,
//           contact: formData.phone
//         },
//         theme: {
//           color: '#8B5CF6'
//         },
//         modal: {
//           ondismiss: function() {
//             setLoading(false);
//             setOrderError('Payment was cancelled. Please try again.');
//           }
//         }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
      
//     } catch (error) {
//       console.error('❌ Payment error:', error);
//       setOrderError(error.message);
//       setLoading(false);
//     }
//   };

//   const placeOrderCOD = async (orderData) => {
//     try {
//       console.log('🚚 Placing COD order...');
//       const response = await userAPI.placeOrder({
//         ...orderData,
//         isPaid: false,
//         paymentMethod: 'cod'
//       });

//       if (response.success && response.message === "Order placed successfully") {
//         setPlacedOrderId(response.order._id);
//         setOrderPlaced(true);
//         clearCart();
//         setTimeout(() => navigate('/account', { state: { tab: 'orders' } }), 3000);
//       } else {
//         throw new Error(response.message || 'Failed to place order');
//       }
//     } catch (error) {
//       console.error('❌ COD order error:', error);
//       throw error;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       const firstError = Object.keys(errors)[0];
//       const errorElement = document.querySelector(`[name="${firstError}"]`);
//       if (errorElement) {
//         errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         errorElement.focus();
//       }
//       return;
//     }

//     if (!isAuthenticated) {
//       setOrderError("Please log in to continue with checkout");
//       return;
//     }

//     setLoading(true);
//     setOrderError("");

//     try {
//       // Prepare order data
//       const orderItems = cart.map(item => ({
//         product: item._id || item.id,
//         quantity: item.quantity,
//         price: item.price,
//         selectedColor: item.selectedColor,
//         selectedSize: item.selectedSize
//       }));

//       const shippingAddress = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         company: formData.company,
//         address: formData.address,
//         apartment: formData.apartment,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         phone: formData.phone,
//         email: formData.email
//       };

//       const orderData = {
//         orderItems,
//         shippingAddress,
//         paymentMethod,
//         totalPrice: finalTotal
//       };

//       console.log('Processing order with data:', orderData);

//       if (paymentMethod === 'online') {
//         await handleRazorpayPayment(orderData);
//       } else {
//         await placeOrderCOD(orderData);
//       }

//     } catch (error) {
//       console.error('Error processing order:', error);
//       setOrderError(error.message || 'Failed to process order. Please try again.');
//       setLoading(false);
//     }
//   };

//   // If user is not authenticated, show login prompt
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
//         <div className="flex items-center justify-center min-h-screen px-4">
//           <div className="max-w-md w-full">
//             <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//               <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
//                 <LogIn className="w-10 h-10 text-white" />
//               </div>
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
//               <p className="text-gray-600 mb-8 leading-relaxed">
//                 Please log in to your account to proceed with checkout and place your order securely.
//               </p>
//               <div className="space-y-4">
//                 <Link
//                   to="/auth"
//                   state={{ from: '/checkout' }}
//                   className="block w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-semibold shadow-lg"
//                 >
//                   Sign In / Register
//                 </Link>
//                 <button
//                   onClick={() => navigate('/cart')}
//                   className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                 >
//                   Back to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (orderPlaced) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
//         <div className="flex items-center justify-center min-h-screen px-4">
//           <div className="max-w-md w-full">
//             <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//               <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
//                 <CheckCircle className="w-10 h-10 text-white" />
//               </div>
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h2>
//               <p className="text-gray-600 mb-6 leading-relaxed">
//                 Thank you for your purchase. Your order has been confirmed and will be processed shortly.
//               </p>
//               {placedOrderId && (
//                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                   <p className="text-sm text-gray-600 mb-1">Order ID</p>
//                   <p className="font-mono text-lg font-bold text-gray-900">#{placedOrderId.slice(-8)}</p>
//                 </div>
//               )}
//               <div className="mb-8">
//                 <div className="animate-pulse text-purple-600 mb-2">
//                   <Loader className="w-5 h-5 animate-spin mx-auto" />
//                 </div>
//                 <p className="text-sm text-gray-500">Redirecting to your orders page...</p>
//               </div>
//               <button
//                 onClick={() => navigate('/account')}
//                 className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-semibold"
//               >
//                 View My Orders
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Calculate totals
//   const subtotal = getTotalPrice();
//   const savings = getTotalSavings();
//   const totalItems = getTotalItems();
//   const shippingCost = 0;
//   const tax = Math.round(subtotal * 0.18);
//   const finalTotal = subtotal + tax + shippingCost;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <button
//             onClick={() => navigate('/cart')}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
//           >
//             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//             Back to Cart
//           </button>
//           <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
//             <Lock className="w-5 h-5 text-green-600" />
//             <span className="text-sm text-green-700 font-medium">Secure Checkout</span>
//           </div>
//         </div>

//         {/* User Info Display */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
//           <div className="flex items-center gap-4">
//             <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3">
//               <User className="w-6 h-6 text-white" />
//             </div>
//             <div className="flex-1">
//               <p className="font-semibold text-blue-900 text-lg">Welcome, {user?.name}!</p>
//               <p className="text-blue-700">{user?.email}</p>
//             </div>
//             <button
//               onClick={() => navigate('/auth')}
//               className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
//             >
//               Switch Account
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Billing Information */}
//             <div className="space-y-8">
//               {/* Billing Information */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                   <div className="bg-purple-100 rounded-full p-2">
//                     <User className="w-5 h-5 text-purple-600" />
//                   </div>
//                   Billing Information
//                 </h2>
                
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         First Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={(e) => handleInputChange('firstName', e.target.value)}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
//                           errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         placeholder="Enter first name"
//                       />
//                       {errors.firstName && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                           <AlertCircle className="w-4 h-4" />
//                           {errors.firstName}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Last Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={(e) => handleInputChange('lastName', e.target.value)}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
//                           errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         placeholder="Enter last name"
//                       />
//                       {errors.lastName && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                           <AlertCircle className="w-4 h-4" />
//                           {errors.lastName}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Add more form fields here as needed - company, address, etc. */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Street Address *
//                     </label>
//                     <input
//                       type="text"
//                       name="address"
//                       value={formData.address}
//                       onChange={(e) => handleInputChange('address', e.target.value)}
//                       className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
//                         errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                       placeholder="Enter street address"
//                     />
//                     {errors.address && (
//                       <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                         <AlertCircle className="w-4 h-4" />
//                         {errors.address}
//                       </p>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         City *
//                       </label>
//                       <input
//                         type="text"
//                         name="city"
//                         value={formData.city}
//                         onChange={(e) => handleInputChange('city', e.target.value)}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
//                           errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         placeholder="Enter city"
//                       />
//                       {errors.city && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                           <AlertCircle className="w-4 h-4" />
//                           {errors.city}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         State *
//                       </label>
//                       <input
//                         type="text"
//                         name="state"
//                         value={formData.state}
//                         onChange={(e) => handleInputChange('state', e.target.value)}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
//                           errors.state ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         placeholder="Enter state"
//                       />
//                       {errors.state && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                           <AlertCircle className="w-4 h-4" />
//                           {errors.state}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         PIN Code *
//                       </label>
//                       <input
//                         type="text"
//                         name="pincode"
//                         value={formData.pincode}
//                         onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
//                           errors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         placeholder="123456"
//                         maxLength="6"
//                       />
//                       {errors.pincode && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                           <AlertCircle className="w-4 h-4" />
//                           {errors.pincode}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Phone Number *
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
//                           errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         placeholder="9876543210"
//                         maxLength="10"
//                       />
//                       {errors.phone && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                           <AlertCircle className="w-4 h-4" />
//                           {errors.phone}
//                         </p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={(e) => handleInputChange('email', e.target.value)}
//                         className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
//                           errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         placeholder="Enter email address"
//                       />
//                       {errors.email && (
//                         <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
//                           <AlertCircle className="w-4 h-4" />
//                           {errors.email}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Method */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                   <div className="bg-green-100 rounded-full p-2">
//                     <CreditCard className="w-5 h-5 text-green-600" />
//                   </div>
//                   Payment Method
//                 </h3>
                
//                 <div className="space-y-4">
//                   {/* Cash on Delivery */}
//                   <label className="relative flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all group">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="cod"
//                       checked={paymentMethod === "cod"}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="w-5 h-5 text-orange-600 focus:ring-orange-500"
//                     />
//                     <div className="flex-1">
//                       <div className="font-semibold text-gray-900 flex items-center gap-2">
//                         <Truck className="w-5 h-5 text-orange-600" />
//                         Cash on Delivery
//                       </div>
//                       <div className="text-sm text-gray-600 mt-1">Pay when your order arrives at your doorstep</div>
//                     </div>
//                   </label>

//                   {/* Online Payment */}
//                   <label className="relative flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all group">
//                     <input
//                       type="radio"
//                       name="payment"
//                       value="online"
//                       checked={paymentMethod === "online"}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="w-5 h-5 text-purple-600 focus:ring-purple-500"
//                     />
//                     <div className="flex-1">
//                       <div className="font-semibold text-gray-900 flex items-center gap-2">
//                         <Smartphone className="w-5 h-5 text-purple-600" />
//                         Online Payment
//                       </div>
//                       <div className="text-sm text-gray-600 mt-1">UPI, Cards, Net Banking via Razorpay</div>
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               {/* Terms and Conditions */}
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
//                 <div className="flex items-start gap-4">
//                   <input
//                     type="checkbox"
//                     id="terms"
//                     name="terms"
//                     checked={termsAccepted}
//                     onChange={(e) => setTermsAccepted(e.target.checked)}
//                     className={`mt-1 w-5 h-5 text-purple-600 focus:ring-purple-500 rounded ${
//                       errors.terms ? 'border-red-300' : ''
//                     }`}
//                   />
//                   <div className="flex-1">
//                     <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
//                       I agree to the{" "}
//                       <a href="/terms" className="text-purple-600 hover:text-purple-800 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
//                         Terms and Conditions
//                       </a>
//                       {" "}and{" "}
//                       <a href="/privacy" className="text-purple-600 hover:text-purple-800 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
//                         Privacy Policy
//                       </a>
//                     </label>
//                     {errors.terms && (
//                       <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
//                         <AlertCircle className="w-4 h-4" />
//                         {errors.terms}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Order Summary */}
//             <div className="space-y-6">
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                   <div className="bg-blue-100 rounded-full p-2">
//                     <Shield className="w-5 h-5 text-blue-600" />
//                   </div>
//                   Order Summary
//                 </h3>
                
//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
//                   {cart.map((item) => (
//                     <div key={item.cartItemId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
//                       <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//                         <ImageWithFallback
//                           src={item.images?.[0]}
//                           alt={item.name}
//                           className="w-full h-full object-contain"
//                           fallbackSrc="/images/placeholder-product.jpg"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-sm line-clamp-2 text-gray-900">{item.name}</h4>
//                         <p className="text-xs text-gray-600 mt-1">
//                           {item.brand} • Qty: {item.quantity}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-semibold text-sm text-gray-900">
//                           ₹{(item.price * item.quantity).toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Order Totals */}
//                 <div className="space-y-3 text-sm border-t border-gray-200 pt-6">
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Subtotal ({totalItems} items)</span>
//                     <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
//                   </div>
                  
//                   {savings > 0 && (
//                     <div className="flex justify-between items-center text-green-600">
//                       <span>Product Savings</span>
//                       <span className="font-medium">-₹{savings.toLocaleString()}</span>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Shipping</span>
//                     <span className="font-medium text-green-600">Free</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">GST (18%)</span>
//                     <span className="font-medium text-gray-900">₹{tax.toLocaleString()}</span>
//                   </div>
                  
//                   <div className="border-t border-gray-200 pt-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-lg font-bold text-gray-900">Total</span>
//                       <span className="text-xl font-bold text-purple-600">₹{finalTotal.toLocaleString()}</span>
//                     </div>
//                   </div>

//                   {savings > 0 && (
//                     <div className="bg-green-50 p-3 rounded-lg">
//                       <p className="text-sm text-green-800 font-medium text-center">
//                         🎉 You save ₹{savings.toLocaleString()}!
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Error Message */}
//                 {orderError && (
//                   <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
//                     <div className="flex items-start gap-3">
//                       <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//                       <div>
//                         <p className="text-red-800 font-semibold text-sm">Order Error</p>
//                         <p className="text-red-700 text-sm mt-1">{orderError}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Place Order Button */}
//                 <button
//                   type="submit"
//                   disabled={loading || cart.length === 0}
//                   className="w-full mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-3"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader className="w-6 h-6 animate-spin" />
//                       {paymentMethod === 'online' ? 'Processing Payment...' : 'Placing Order...'}
//                     </>
//                   ) : (
//                     <>
//                       <Shield className="w-6 h-6" />
//                       {paymentMethod === 'online' ? `Pay ₹${finalTotal.toLocaleString()}` : `Place Order - ₹${finalTotal.toLocaleString()}`}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useAuth } from "../context/AuthContext";
import { userAPI, paymentAPI } from "../services/api";
import { 
  CreditCard, 
  Truck, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Lock,
  User,
  LogIn,
  Loader,
  Smartphone,
} from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import EmpressNavbar from "../components/EmpressNavbar";
import Footer from "../components/Footer";

// Razorpay configuration
const RAZORPAY_KEY_ID = "rzp_test_R7DgqKKUBn9gfH";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const { 
    cart, 
    clearCart, 
    getTotalPrice, 
    getTotalSavings, 
    getTotalItems 
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ').slice(1).join(' ') || "",
    company: "",
    address: user?.address || "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [saveInfo, setSaveInfo] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log('Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setOrderError('Failed to load payment gateway. Please try again.');
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/cart');
      return;
    }
  }, [cart, navigate, orderPlaced]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || prev.firstName,
        lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "PIN code is required";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "PIN code must be 6 digits";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be 10 digits";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!termsAccepted) newErrors.terms = "Please accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const createRazorpayOrder = async (orderData) => {
    try {
      console.log('📄 Creating Razorpay order...');
      const response = await paymentAPI.createRazorpayOrder({
        amount: orderData.totalPrice * 100,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          itemCount: getTotalItems()
        }
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to create Razorpay order');
      }

      return response;
    } catch (error) {
      console.error('❌ Razorpay order creation failed:', error);
      throw error;
    }
  };

  const handleRazorpayPayment = async (orderData) => {
    try {
      const razorpayOrderResponse = await createRazorpayOrder(orderData);
      const razorpayOrder = razorpayOrderResponse.order;

      // Check if this is a mock order
      if (razorpayOrder.id.includes('mock')) {
        console.log('🎭 Mock payment - auto-completing...');
        
        const mockPaymentResponse = {
          razorpay_order_id: razorpayOrder.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_signature'
        };

        const verifyResponse = await paymentAPI.verifyRazorpayPayment({
          ...mockPaymentResponse,
          orderData: orderData
        });

        if (verifyResponse.success) {
          setPlacedOrderId(verifyResponse.order._id);
          setOrderPlaced(true);
          clearCart();
          setTimeout(() => navigate('/account', { state: { tab: 'orders' } }), 3000);
        } else {
          throw new Error(verifyResponse.message || 'Payment verification failed');
        }
        return;
      }

      // Real Razorpay integration
      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error('Payment gateway not loaded. Please refresh and try again.');
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Empress Tech',
        description: `Order for ${getTotalItems()} items`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          console.log('Payment successful:', response);
          setLoading(true);
          
          try {
            const verifyResponse = await paymentAPI.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderData
            });

            if (verifyResponse.success) {
              setPlacedOrderId(verifyResponse.order._id);
              setOrderPlaced(true);
              clearCart();
              setTimeout(() => navigate('/account', { state: { tab: 'orders' } }), 3000);
            } else {
              throw new Error(verifyResponse.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error);
            setOrderError(`Payment verification failed: ${error.message}`);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#8B5CF6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setOrderError('Payment was cancelled. Please try again.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('❌ Payment error:', error);
      setOrderError(error.message);
      setLoading(false);
    }
  };

  const placeOrderCOD = async (orderData) => {
    try {
      console.log('🚚 Placing COD order...');
      const response = await userAPI.placeOrder({
        ...orderData,
        isPaid: false,
        paymentMethod: 'cod'
      });

      if (response.success && response.message === "Order placed successfully") {
        setPlacedOrderId(response.order._id);
        setOrderPlaced(true);
        clearCart();
        setTimeout(() => navigate('/account', { state: { tab: 'orders' } }), 3000);
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('❌ COD order error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstError}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    if (!isAuthenticated) {
      setOrderError("Please log in to continue with checkout");
      return;
    }

    setLoading(true);
    setOrderError("");

    try {
      // Prepare order data
      const orderItems = cart.map(item => ({
        product: item._id || item.id,
        quantity: item.quantity,
        price: item.price,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      }));

      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone,
        email: formData.email
      };

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice: finalTotal
      };

      console.log('Processing order with data:', orderData);

      if (paymentMethod === 'online') {
        await handleRazorpayPayment(orderData);
      } else {
        await placeOrderCOD(orderData);
      }

    } catch (error) {
      console.error('Error processing order:', error);
      setOrderError(error.message || 'Failed to process order. Please try again.');
      setLoading(false);
    }
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Please log in to your account to proceed with checkout and place your order securely.
              </p>
              <div className="space-y-4">
                <Link
                  to="/auth"
                  state={{ from: '/checkout' }}
                  className="block w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-semibold shadow-lg"
                >
                  Sign In / Register
                </Link>
                <button
                  onClick={() => navigate('/cart')}
                  className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Thank you for your purchase. Your order has been confirmed and will be processed shortly.
              </p>
              {placedOrderId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-mono text-lg font-bold text-gray-900">#{placedOrderId.slice(-8)}</p>
                </div>
              )}
              <div className="mb-8">
                <div className="animate-pulse text-purple-600 mb-2">
                  <Loader className="w-5 h-5 animate-spin mx-auto" />
                </div>
                <p className="text-sm text-gray-500">Redirecting to your orders page...</p>
              </div>
              <button
                onClick={() => navigate('/account')}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-semibold"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = getTotalPrice();
  const savings = getTotalSavings();
  const totalItems = getTotalItems();
  const shippingCost = 0;
  const tax = Math.round(subtotal * 0.18);
  const finalTotal = subtotal + tax + shippingCost;

  return (
    <>
    <EmpressNavbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </button>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
            <Lock className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Secure Checkout</span>
          </div>
        </div>

        {/* User Info Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 text-lg">Welcome, {user?.name}!</p>
              <p className="text-blue-700">{user?.email}</p>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
            >
              Switch Account
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Billing Information */}
            <div className="space-y-8">
              {/* Billing Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  Billing Information
                </h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
                          errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
                          errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
                        errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      placeholder="Enter street address"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
                          errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter city"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
                          errors.state ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter state"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
                          errors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="123456"
                        maxLength="6"
                      />
                      {errors.pincode && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="9876543210"
                        maxLength="10"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  Payment Method
                </h3>
                
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <label className="relative flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all group">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-orange-600" />
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Pay when your order arrives at your doorstep</div>
                    </div>
                  </label>

                  {/* Online Payment */}
                  <label className="relative flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all group">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        Online Payment
                      </div>
                      <div className="text-sm text-gray-600 mt-1">UPI, Cards, Net Banking via Razorpay</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className={`mt-1 w-5 h-5 text-purple-600 focus:ring-purple-500 rounded ${
                      errors.terms ? 'border-red-300' : ''
                    }`}
                  />
                  <div className="flex-1">
                    <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                      I agree to the{" "}
                      <a href="/terms" className="text-purple-600 hover:text-purple-800 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        Terms and Conditions
                      </a>
                      {" "}and{" "}
                      <a href="/privacy" className="text-purple-600 hover:text-purple-800 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.terms && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.terms}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  Order Summary
                </h3>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          fallbackSrc="/images/placeholder-product.jpg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.brand} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 text-sm border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Product Savings</span>
                      <span className="font-medium">-₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium text-gray-900">₹{tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-purple-600">₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {savings > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800 font-medium text-center">
                        🎉 You save ₹{savings.toLocaleString()}!
                      </p>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {orderError && (
                  <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-semibold text-sm">Order Error</p>
                        <p className="text-red-700 text-sm mt-1">{orderError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading || cart.length === 0}
                  className="w-full mt-8 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      {paymentMethod === 'online' ? 'Processing Payment...' : 'Placing Order...'}
                    </>
                  ) : (
                    <>
                      <Shield className="w-6 h-6" />
                      {paymentMethod === 'online' ? `Pay ₹${finalTotal.toLocaleString()}` : `Place Order - ₹${finalTotal.toLocaleString()}`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Checkout;