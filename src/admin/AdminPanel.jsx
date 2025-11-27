import { useEffect, useState } from "react";
import { adminAPI, dealAPI } from "../services/api";
import { Package, Users, ShoppingCart, FileText, Zap, TrendingUp, Calendar, Eye } from 'lucide-react';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [deals, setDeals] = useState([]);
  const [dealStats, setDealStats] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersData, usersData, productsData, blogsData, dealsData, dealStatsData] = await Promise.all([
        adminAPI.getAllOrders().catch(() => ({ orders: [] })),
        adminAPI.getAllUsers().catch(() => ({ users: [] })),
        adminAPI.getAllProducts().catch(() => ({ products: [] })),
        adminAPI.getAllBlogs().catch(() => ({ blogs: [] })),
        dealAPI.getAllDealsAdmin({ limit: 5 }).catch(() => ({ data: { deals: [] } })),
        dealAPI.getDealStats().catch(() => ({ data: { stats: null } }))
      ]);

      setOrders(ordersData.orders || []);
      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
      setBlogs(blogsData.blogs || []);
      setDeals(dealsData.data?.deals || []);
      setDealStats(dealStatsData.data?.stats || null);

      // Calculate total revenue from orders
      const revenue = (ordersData.orders || []).reduce((acc, order) => {
        return acc + (order.totalPrice || 0);
      }, 0);
      setTotalRevenue(revenue);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStats = () => {
    const pending = orders.filter(order => order.status === "Pending").length;
    const processing = orders.filter(order => order.status === "Processing").length;
    const shipped = orders.filter(order => order.status === "Shipped").length;
    const delivered = orders.filter(order => order.status === "Delivered").length;
    const cancelled = orders.filter(order => order.status === "Cancelled").length;
    
    return { pending, processing, shipped, delivered, cancelled };
  };

  const orderStats = getOrderStats();

  const getDealStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">Total Orders</h2>
              <p className="text-2xl sm:text-3xl font-bold text-red-500">{orders.length}</p>
              <p className="text-sm text-gray-500">All time orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">Total Revenue</h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-500">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">From all orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">Total Users</h2>
              <p className="text-2xl sm:text-3xl font-bold text-blue-500">{users.length}</p>
              <p className="text-sm text-gray-500">Registered users</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">Total Products</h2>
              <p className="text-2xl sm:text-3xl font-bold text-purple-500">{products.length}</p>
              <p className="text-sm text-gray-500">Available products</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">Active Deals</h2>
              <p className="text-2xl sm:text-3xl font-bold text-orange-500">{dealStats?.active || 0}</p>
              <p className="text-sm text-gray-500">Running deals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Stats Overview */}
      {dealStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="text-sm font-semibold text-orange-800 mb-1">Deal Views</h3>
            <p className="text-xl font-bold text-orange-600">{dealStats.totalViews?.toLocaleString() || 0}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">Deal Clicks</h3>
            <p className="text-xl font-bold text-blue-600">{dealStats.totalClicks?.toLocaleString() || 0}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-sm font-semibold text-green-800 mb-1">Conversions</h3>
            <p className="text-xl font-bold text-green-600">{dealStats.totalConversions?.toLocaleString() || 0}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-800 mb-1">Deal Revenue</h3>
            <p className="text-xl font-bold text-purple-600">₹{dealStats.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </div>
      )}

      {/* Order Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">Pending</h3>
          <p className="text-xl font-bold text-yellow-600">{orderStats.pending}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Processing</h3>
          <p className="text-xl font-bold text-blue-600">{orderStats.processing}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-800 mb-1">Shipped</h3>
          <p className="text-xl font-bold text-purple-600">{orderStats.shipped}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-1">Delivered</h3>
          <p className="text-xl font-bold text-green-600">{orderStats.delivered}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-sm font-semibold text-red-800 mb-1">Cancelled</h3>
          <p className="text-xl font-bold text-red-600">{orderStats.cancelled}</p>
        </div>
      </div>

      {/* Content Stats & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Blogs</span>
              <span className="font-semibold text-gray-800">{blogs.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Deals</span>
              <span className="font-semibold text-gray-800">{dealStats?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admin Users</span>
              <span className="font-semibold text-gray-800">
                {users.filter(user => user.isAdmin).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Regular Users</span>
              <span className="font-semibold text-gray-800">
                {users.filter(user => !user.isAdmin).length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/admin/deals'}
              className="w-full text-left px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded border border-orange-200 transition-colors"
            >
              <span className="font-medium text-orange-800 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Manage Deals
              </span>
              <p className="text-sm text-orange-600">Create and manage promotional deals</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/products'}
              className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
            >
              <span className="font-medium text-blue-800 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Manage Products
              </span>
              <p className="text-sm text-blue-600">Add, edit, or remove products</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/orders'}
              className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors"
            >
              <span className="font-medium text-green-800 flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Orders
              </span>
              <p className="text-sm text-green-600">Manage customer orders</p>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
            >
              <span className="font-medium text-purple-800 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </span>
              <p className="text-sm text-purple-600">View and manage users</p>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Deals Section */}
      {deals.length > 0 && (
        <div className="bg-white rounded-lg shadow border overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-semibold flex items-center">
                <Zap className="w-6 h-6 mr-2 text-orange-500" />
                Recent Deals
              </h2>
              <button 
                onClick={() => window.location.href = '/admin/deals'}
                className="text-orange-500 hover:text-orange-600 font-medium text-sm"
              >
                Manage All →
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {/* Mobile Card View for Deals */}
            <div className="block lg:hidden">
              {deals.slice(0, 3).map(deal => (
                <div key={deal._id} className="p-4 border-b">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm">{deal.title}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDealStatusColor(deal.status)}`}>
                        {deal.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">₹{deal.pricing?.salePrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span>{deal.analytics?.views || 0}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Ends: {formatDateTime(deal.dealTiming?.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View for Deals */}
            <table className="hidden lg:table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold">Deal</th>
                  <th className="p-3 text-left font-semibold">Price</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Analytics</th>
                  <th className="p-3 text-left font-semibold">Ends</th>
                </tr>
              </thead>
              <tbody>
                {deals.slice(0, 5).map(deal => (
                  <tr key={deal._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-semibold text-sm">{deal.title}</div>
                        <div className="text-xs text-gray-500">{deal.product?.name}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <span className="line-through text-gray-500">
                          ₹{deal.pricing?.originalPrice?.toLocaleString()}
                        </span>
                        <div className="font-semibold">
                          ₹{deal.pricing?.salePrice?.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getDealStatusColor(deal.status)}`}>
                        {deal.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {deal.analytics?.views || 0}
                        </span>
                        <span>Clicks: {deal.analytics?.clicks || 0}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {formatDateTime(deal.dealTiming?.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2 text-red-500" />
              Recent Orders
            </h2>
            <button 
              onClick={() => window.location.href = '/admin/orders'}
              className="text-red-500 hover:text-red-600 font-medium text-sm"
            >
              View All →
            </button>
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} className="p-4 border-b">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Order ID:</span>
                      <span className="text-sm font-mono">{order._id?.slice(-8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Customer:</span>
                      <span>{order.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Amount:</span>
                      <span className="text-red-600 font-semibold">
                        ₹{(order.totalPrice || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <table className="hidden sm:table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left font-semibold">Order ID</th>
                  <th className="p-3 text-left font-semibold">Customer</th>
                  <th className="p-3 text-left font-semibold">Amount</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-mono">
                      {order._id?.slice(-8)}...
                    </td>
                    <td className="p-3">{order.user?.email || 'N/A'}</td>
                    <td className="p-3 font-semibold text-red-600">
                      ₹{(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}