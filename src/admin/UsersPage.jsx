import { useEffect, useState } from "react";
import { adminAPI } from "../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrderHistory = async (userId) => {
    try {
      setLoadingOrders(true);
      const data = await adminAPI.getUserHistory(userId);
      setUserOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching user orders:', err);
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUserClick = (user) => {
    if (selectedUser && selectedUser._id === user._id) {
      setSelectedUser(null);
      setUserOrders([]);
    } else {
      setSelectedUser(user);
      fetchUserOrderHistory(user._id);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminUsers = users.filter(user => user.isAdmin);
  const regularUsers = users.filter(user => !user.isAdmin);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Users</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl font-bold text-blue-500">{users.length}</p>
          <p className="text-sm text-gray-500">All registered users</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Regular Users</h3>
          <p className="text-2xl font-bold text-green-500">{regularUsers.length}</p>
          <p className="text-sm text-gray-500">Customer accounts</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-700">Admin Users</h3>
          <p className="text-2xl font-bold text-red-500">{adminUsers.length}</p>
          <p className="text-sm text-gray-500">Administrator accounts</p>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* User Summary */}
              <div 
                className="p-4 sm:p-6 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Name</p>
                        <p className="font-semibold">{user.name || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-medium">{user.phone || 'N/A'}</p>
                      </div>
                      
                      <div className="sm:text-right">
                        <p className="text-sm text-gray-600 mb-1">Joined</p>
                        <p className="font-medium text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {user.isAdmin && (
                      <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full font-medium">
                        Admin
                      </span>
                    )}
                    
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg 
                        className={`w-5 h-5 transition-transform ${
                          selectedUser && selectedUser._id === user._id ? 'rotate-180' : ''
                        }`}
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

              {/* Expanded User Details */}
              {selectedUser && selectedUser._id === user._id && (
                <div className="border-t bg-gray-50 p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Details */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">User Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Full Name:</span>
                          <span className="font-medium">{user.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{user.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium">{user.address || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <span className={`font-medium ${user.isAdmin ? 'text-red-600' : 'text-green-600'}`}>
                            {user.isAdmin ? 'Administrator' : 'Customer'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since:</span>
                          <span className="font-medium">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order History */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">Order History</h3>
                      {loadingOrders ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                        </div>
                      ) : userOrders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No orders found for this user.</p>
                      ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {userOrders.map((order) => (
                            <div key={order._id} className="bg-white p-3 rounded border">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-sm">
                                    Order #{order._id?.slice(-8)}...
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-red-600">
                                    ₹{(order.totalPrice || 0).toLocaleString()}
                                  </p>
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
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t mt-6">
                    <button 
                      onClick={() => window.location.href = `/admin/orders`}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      View All Orders
                    </button>
                    
                    {!user.isAdmin && (
                      <button 
                        onClick={() => {
                          // Add functionality to promote to admin or delete user
                          alert('User management actions - API endpoints needed');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                      >
                        More Actions
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}