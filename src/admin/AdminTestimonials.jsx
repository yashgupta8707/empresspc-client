import { useEffect, useState } from "react";
import { Star, Plus, Edit, Trash2, Upload, X, Check, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    title: '',
    content: '',
    rating: 5,
    email: '',
    phone: '',
    purchaseDate: '',
    verified: true,
    isActive: true
  });

  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    verified: 'all'
  });

  useEffect(() => {
    fetchTestimonials();
  }, [filters]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.rating !== 'all') queryParams.append('rating', filters.rating);
      if (filters.verified !== 'all') queryParams.append('verified', filters.verified);

      // Mock data for demo - replace with: const response = await adminAPI.getTestimonials(queryParams);
      const mockData = [
        {
          _id: '1',
          name: 'Jordan Smith',
          location: 'Seattle, Washington',
          title: 'Flawless Performance',
          content: 'Got my custom gaming rig from Empress PC, and it runs every AAA title on ultra settings without breaking a sweat.',
          rating: 5,
          email: 'jordan@example.com',
          phone: '+1-555-0101',
          purchaseDate: '2024-01-15',
          verified: true,
          isActive: true,
          img: 'https://randomuser.me/api/portraits/men/32.jpg',
          createdAt: '2024-01-16T10:00:00Z'
        },
        {
          _id: '2',
          name: 'Taylor Christos',
          location: 'Austin, Texas',
          title: 'Expert Support',
          content: 'Their support team helped me pick the perfect configuration. Even followed up after delivery.',
          rating: 5,
          email: 'taylor@example.com',
          phone: '+1-555-0102',
          purchaseDate: '2024-02-20',
          verified: true,
          isActive: true,
          img: 'https://randomuser.me/api/portraits/men/52.jpg',
          createdAt: '2024-02-21T14:30:00Z'
        }
      ];
      
      setTestimonials(mockData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const testimonialData = {
        ...formData,
        img: selectedImage || 'https://randomuser.me/api/portraits/lego/1.jpg'
      };

      if (editingId) {
        // Update existing testimonial
        const updatedTestimonials = testimonials.map(t => 
          t._id === editingId ? { ...t, ...testimonialData } : t
        );
        setTestimonials(updatedTestimonials);
      } else {
        // Add new testimonial
        const newTestimonial = {
          _id: Date.now().toString(),
          ...testimonialData,
          createdAt: new Date().toISOString()
        };
        setTestimonials([newTestimonial, ...testimonials]);
      }

      resetForm();
      alert(editingId ? 'Testimonial updated successfully!' : 'Testimonial added successfully!');
    } catch (err) {
      alert('Error saving testimonial: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      title: '',
      content: '',
      rating: 5,
      email: '',
      phone: '',
      purchaseDate: '',
      verified: true,
      isActive: true
    });
    setSelectedImage(null);
    setShowForm(false);
    setEditingId(null);
  };

  const editTestimonial = (testimonial) => {
    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      title: testimonial.title,
      content: testimonial.content,
      rating: testimonial.rating,
      email: testimonial.email || '',
      phone: testimonial.phone || '',
      purchaseDate: testimonial.purchaseDate || '',
      verified: testimonial.verified,
      isActive: testimonial.isActive
    });
    setSelectedImage(testimonial.img);
    setEditingId(testimonial._id);
    setShowForm(true);
  };

  const deleteTestimonial = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      setTestimonials(testimonials.filter(t => t._id !== id));
      alert('Testimonial deleted successfully!');
    } catch (err) {
      alert('Error deleting testimonial: ' + err.message);
    }
  };

  const toggleStatus = async (id, field) => {
    try {
      const updatedTestimonials = testimonials.map(t => 
        t._id === id ? { ...t, [field]: !t[field] } : t
      );
      setTestimonials(updatedTestimonials);
    } catch (err) {
      alert('Error updating testimonial: ' + err.message);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        {interactive && (
          <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
        )}
      </div>
    );
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filters.status !== 'all') {
      if (filters.status === 'active' && !testimonial.isActive) return false;
      if (filters.status === 'inactive' && testimonial.isActive) return false;
    }
    if (filters.rating !== 'all' && testimonial.rating !== parseInt(filters.rating)) return false;
    if (filters.verified !== 'all') {
      if (filters.verified === 'verified' && !testimonial.verified) return false;
      if (filters.verified === 'unverified' && testimonial.verified) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-1">Manage customer testimonials and reviews</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Total Testimonials</h3>
          <p className="text-3xl font-bold text-blue-600">{testimonials.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-2">Active</h3>
          <p className="text-3xl font-bold text-green-600">
            {testimonials.filter(t => t.isActive).length}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-800 mb-2">Verified</h3>
          <p className="text-3xl font-bold text-purple-600">
            {testimonials.filter(t => t.verified).length}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">Avg Rating</h3>
          <p className="text-3xl font-bold text-amber-600">
            {testimonials.length > 0 ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1) : '0.0'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
            <select
              value={filters.verified}
              onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit' : 'Add'} Testimonial
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Customer Photo</label>
                <div className="flex items-center gap-6">
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors border border-gray-300"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Recommended: 400x400px, max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Customer's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>

              {/* Testimonial Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief title for the testimonial"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Customer's testimonial content..."
                />
                <p className="text-xs text-gray-500 mt-1">{formData.content.length}/500 characters</p>
              </div>

              {/* Rating and Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Rating *</label>
                  {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <span className="font-medium text-gray-900">Verified Purchase</span>
                    <p className="text-sm text-gray-600">Mark as verified customer</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, verified: !formData.verified })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.verified ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.verified ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <span className="font-medium text-gray-900">Active Status</span>
                    <p className="text-sm text-gray-600">Show on website</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                >
                  {editingId ? 'Update' : 'Add'} Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">No testimonials found.</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or add a new testimonial.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div 
              key={testimonial._id} 
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={testimonial.img}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                      {testimonial.purchaseDate && (
                        <p className="text-xs text-gray-500">
                          Purchased: {new Date(testimonial.purchaseDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(testimonial._id, 'isActive')}
                      className={`p-2 rounded-full transition-colors ${
                        testimonial.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={testimonial.isActive ? 'Hide from website' : 'Show on website'}
                    >
                      {testimonial.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Rating and Title */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(testimonial.rating)}
                    {testimonial.verified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                        Verified
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      testimonial.isActive 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.title}</h4>
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Contact Info */}
                {(testimonial.email || testimonial.phone) && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                    <h5 className="text-sm font-semibold text-gray-800">Contact Information</h5>
                    {testimonial.email && (
                      <p className="text-sm text-gray-600">Email: {testimonial.email}</p>
                    )}
                    {testimonial.phone && (
                      <p className="text-sm text-gray-600">Phone: {testimonial.phone}</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Added: {new Date(testimonial.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(testimonial._id, 'verified')}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        testimonial.verified
                          ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {testimonial.verified ? 'Verified' : 'Verify'}
                    </button>
                    
                    <button
                      onClick={() => editTestimonial(testimonial)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit testimonial"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => deleteTestimonial(testimonial._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}