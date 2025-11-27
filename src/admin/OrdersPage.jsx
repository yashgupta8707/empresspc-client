import { useEffect, useState } from "react";
import { adminAPI } from "../services/api";
import { 
  Package, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter,
  Download,
  Search,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Edit3,
  Trash2,
  RefreshCw
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
    search: '',
    isPaid: 'all',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
    pending: 0,
    delivered: 0
  });

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [filters]);

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = {
        ...filters,
        ...(filters.isPaid !== 'all' && { isPaid: filters.isPaid === 'paid' })
      };
      
      // Remove 'all' values from query params
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === 'all') {
          delete queryParams[key];
        }
      });

      const data = await adminAPI.getAllOrders(queryParams);
      const ordersArray = data.orders || data || [];
      setOrders(ordersArray);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        total: ordersArray.length
      });
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const data = await adminAPI.getOrderStats();
      if (data.success) {
        setStats({
          total: data.stats.totalOrders,
          revenue: data.stats.totalRevenue,
          pending: data.stats.ordersByStatus.pending,
          delivered: data.stats.ordersByStatus.delivered
        });
      }
    } catch (err) {
      console.error('Error fetching order stats:', err);
    }
  };

  const calculateStats = () => {
    const total = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const pending = orders.filter(o => o.status === 'Pending').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    
    // Only update if we don't have stats from API
    if (stats.total === 0) {
      setStats({ total, revenue, pending, delivered });
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      if (orderDetails[orderId]) return;
      
      const data = await adminAPI.getOrderById(orderId);
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: data.order || data
      }));
    } catch (err) {
      console.error('Error fetching order details:', err);
      const order = orders.find(o => o._id === orderId);
      if (order) {
        setOrderDetails(prev => ({
          ...prev,
          [orderId]: order
        }));
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);

      setOrders(prev => prev.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      if (orderDetails[orderId]) {
        setOrderDetails(prev => ({
          ...prev,
          [orderId]: { ...prev[orderId], status: newStatus }
        }));
      }

      // Refresh stats
      fetchOrderStats();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Failed to update order status: ${error.message}`);
    }
  };

  const markAsPaid = async (orderId) => {
    try {
      await adminAPI.markOrderAsPaid(orderId);

      setOrders(prev => prev.map(order => 
        order._id === orderId ? { 
          ...order, 
          isPaid: true, 
          paidAt: new Date().toISOString(),
          status: order.status === 'Pending' ? 'Processing' : order.status
        } : order
      ));
      
      if (orderDetails[orderId]) {
        setOrderDetails(prev => ({
          ...prev,
          [orderId]: { 
            ...prev[orderId], 
            isPaid: true, 
            paidAt: new Date().toISOString(),
            status: prev[orderId].status === 'Pending' ? 'Processing' : prev[orderId].status
          }
        }));
      }

      fetchOrderStats();
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert(`Failed to mark order as paid: ${error.message}`);
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      await adminAPI.markOrderAsDelivered(orderId);

      setOrders(prev => prev.map(order => 
        order._id === orderId ? { 
          ...order, 
          isDelivered: true, 
          deliveredAt: new Date().toISOString(),
          status: 'Delivered'
        } : order
      ));
      
      if (orderDetails[orderId]) {
        setOrderDetails(prev => ({
          ...prev,
          [orderId]: { 
            ...prev[orderId], 
            isDelivered: true, 
            deliveredAt: new Date().toISOString(),
            status: 'Delivered'
          }
        }));
      }

      fetchOrderStats();
    } catch (error) {
      console.error('Error marking as delivered:', error);
      alert(`Failed to mark order as delivered: ${error.message}`);
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(orderId);
      fetchOrderDetails(orderId);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentIcon = (paymentMethod, isPaid) => {
    if (paymentMethod === 'cod') {
      return <Truck className="w-4 h-4 text-orange-600" />;
    }
    return isPaid ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };

  const exportOrders = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Order ID,Customer,Email,Total,Status,Payment,Date\n"
      + orders.map(order => 
          `${order._id},${order.user?.name || 'N/A'},${order.user?.email || 'N/A'},₹${order.totalPrice},${order.status},${order.paymentMethod},${new Date(order.createdAt).toLocaleDateString()}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={exportOrders}
            disabled={orders.length === 0}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-red-300"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          
          <select
            value={filters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300"
          >
            <option value="all">All Payment Methods</option>
            <option value="online">Online Payment</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          <select
            value={filters.isPaid}
            onChange={(e) => handleFilterChange('isPaid', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
          
          <button
            onClick={() => setFilters({
              status: 'all',
              paymentMethod: 'all',
              search: '',
              isPaid: 'all',
              page: 1,
              limit: 20
            })}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filters.search || filters.status !== 'all' || filters.paymentMethod !== 'all' || filters.isPaid !== 'all'
              ? 'No orders match your current filters.'
              : 'No orders placed yet.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => {
              const details = orderDetails[order._id] || order;
              const isExpanded = selectedOrder === order._id;
              
              return (
                <div key={order._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Order Summary */}
                  <div 
                    className="p-4 sm:p-6 cursor-pointer"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Order ID</p>
                            <p className="font-mono text-sm">#{order._id?.slice(-8)}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Customer</p>
                            <p className="font-medium text-sm">{order.user?.name || order.shippingAddress?.firstName + ' ' + order.shippingAddress?.lastName || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{order.user?.email || order.shippingAddress?.email || 'N/A'}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Payment</p>
                            <div className="flex items-center gap-2">
                              {getPaymentIcon(order.paymentMethod, order.isPaid)}
                              <div>
                                <p className="text-sm capitalize">{order.paymentMethod || 'N/A'}</p>
                                <p className={`text-xs ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                                  {order.isPaid ? 'Paid' : 'Unpaid'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Date</p>
                            <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                          </div>
                          
                          <div className="sm:text-right">
                            <p className="text-sm text-gray-600 mb-1">Total</p>
                            <p className="font-bold text-lg text-red-600">
                              ₹{(order.totalPrice || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(order.status || 'Pending')}`}>
                          {order.status || 'Pending'}
                        </span>
                        
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg 
                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-4 sm:p-6">
                      {details ? (
                        <div className="space-y-6">
                          {/* Customer & Shipping Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Customer Information
                              </h3>
                              <div className="space-y-2 text-sm bg-white p-4 rounded-lg">
                                <p><strong>Name:</strong> {details.user?.name || details.shippingAddress?.firstName + ' ' + details.shippingAddress?.lastName || 'N/A'}</p>
                                <p><strong>Email:</strong> {details.user?.email || details.shippingAddress?.email || 'N/A'}</p>
                                <p><strong>Phone:</strong> {details.user?.phone || details.shippingAddress?.phone || 'N/A'}</p>
                                {details.user?.address && (
                                  <p><strong>Address:</strong> {details.user.address}</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Shipping Address
                              </h3>
                              {details.shippingAddress ? (
                                <div className="text-sm space-y-1 bg-white p-4 rounded-lg">
                                  <p>{details.shippingAddress.firstName} {details.shippingAddress.lastName}</p>
                                  {details.shippingAddress.company && (
                                    <p>{details.shippingAddress.company}</p>
                                  )}
                                  <p>{details.shippingAddress.address}</p>
                                  {details.shippingAddress.apartment && (
                                    <p>{details.shippingAddress.apartment}</p>
                                  )}
                                  <p>{details.shippingAddress.city}, {details.shippingAddress.state} {details.shippingAddress.pincode}</p>
                                  <p>Phone: {details.shippingAddress.phone}</p>
                                  <p>Email: {details.shippingAddress.email}</p>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">No shipping address available</p>
                              )}
                            </div>
                          </div>

                          {/* Payment Information */}
                          {details.paymentResult && (
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Payment Information
                              </h3>
                              <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                                <p><strong>Payment Method:</strong> {details.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                                <p><strong>Payment Status:</strong> 
                                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${details.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {details.isPaid ? 'Paid' : 'Unpaid'}
                                  </span>
                                </p>
                                {details.paymentResult.razorpay_payment_id && (
                                  <p><strong>Payment ID:</strong> {details.paymentResult.razorpay_payment_id}</p>
                                )}
                                {details.paymentResult.razorpay_order_id && (
                                  <p><strong>Razorpay Order ID:</strong> {details.paymentResult.razorpay_order_id}</p>
                                )}
                                {details.paidAt && (
                                  <p><strong>Paid At:</strong> {new Date(details.paidAt).toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Order Items */}
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Order Items ({details.orderItems?.length || 0})
                            </h3>
                            {details.orderItems && details.orderItems.length > 0 ? (
                              <div className="space-y-3">
                                {details.orderItems.map((item, idx) => (
                                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded border">
                                    <div className="flex-1">
                                      <p className="font-medium">{item.product?.name || 'Product Name'}</p>
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <p>Quantity: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                                        {item.selectedColor && (
                                          <p>Color: {item.selectedColor}</p>
                                        )}
                                        {item.selectedSize && (
                                          <p>Size: {item.selectedSize}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 sm:text-right">
                                      <p className="font-semibold text-lg">
                                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 bg-white p-4 rounded-lg">No items found</p>
                            )}
                          </div>

                          {/* Order Summary */}
                          <div className="border-t pt-4">
                            <div className="bg-white p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 text-sm">
                                  <p><strong>Order Status:</strong> 
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(details.status || 'Pending')}`}>
                                      {details.status || 'Pending'}
                                    </span>
                                  </p>
                                  <p><strong>Order Date:</strong> {new Date(details.createdAt).toLocaleString()}</p>
                                  {details.isDelivered && details.deliveredAt && (
                                    <p><strong>Delivered At:</strong> {new Date(details.deliveredAt).toLocaleString()}</p>
                                  )}
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-red-600">
                                    Total: ₹{(details.totalPrice || 0).toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-600">Including all taxes</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t">
                            <select
                              value={details.status || 'Pending'}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            {!details.isPaid && (
                              <button 
                                onClick={() => markAsPaid(order._id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Mark as Paid
                              </button>
                            )}

                            {!details.isDelivered && details.status !== 'Cancelled' && (
                              <button 
                                onClick={() => markAsDelivered(order._id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                              >
                                <Truck className="w-4 h-4" />
                                Mark as Delivered
                              </button>
                            )}

                            <button
                              onClick={() => {
                                const orderData = JSON.stringify(details, null, 2);
                                const blob = new Blob([orderData], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `order-${order._id}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download Details
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.total)} of {pagination.total} orders
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg">
                  {pagination.currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}