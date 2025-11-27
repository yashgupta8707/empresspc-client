import { useState, useEffect } from 'react';

// Updated API service that handles connection errors properly
const carouselAPI = {
  // Get all slides for admin
  getAllSlidesAdmin: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:5174/api/slides/admin${queryString ? `?${queryString}` : ''}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.slides || data; // Handle both paginated and direct array responses
    } catch (error) {
      console.error('Error fetching slides:', error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  },

  // Create slide with proper error handling
  createSlide: async (slideData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5174/api/slides/admin', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData
        },
        body: slideData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Request failed`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create slide error:', error);
      throw error;
    }
  },

  // Update slide
  updateSlide: async (id, slideData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5174/api/slides/admin/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: slideData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Request failed`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update slide error:', error);
      throw error;
    }
  },

  // Delete slide
  deleteSlide: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5174/api/slides/admin/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Request failed`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete slide error:', error);
      throw error;
    }
  },

  // Reorder slides
  reorderSlides: async (slideIds) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5174/api/slides/admin/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ slideIds }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Request failed`);
      }

      return await response.json();
    } catch (error) {
      console.error('Reorder slides error:', error);
      throw error;
    }
  },

  // Validate slide data
  validateSlideData: (data) => {
    const errors = [];

    if (!data.id || data.id.trim().length < 2) {
      errors.push('Slide ID must be at least 2 characters long');
    }

    if (!data.title || data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (data.order && (data.order < 1 || data.order > 100)) {
      errors.push('Order must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Format slide data for API
  formatSlideData: (formData, imageFile = null) => {
    const data = new FormData();

    // Required fields
    data.append('id', formData.id?.trim() || '');
    data.append('title', formData.title?.trim() || '');
    data.append('description', formData.description?.trim() || '');
    data.append('order', formData.order || 1);

    // Boolean fields
    data.append('isActive', formData.isActive !== false);

    // Image file
    if (imageFile) {
      data.append('image', imageFile);
    } else if (formData.image && typeof formData.image === 'string') {
      data.append('imageUrl', formData.image);
    }

    return data;
  },

  // Handle API errors
  handleApiError: (error) => {
    console.error('Carousel API Error:', error);

    if (error.message.includes('ERR_CONNECTION')) {
      return 'Cannot connect to server. Please check if the server is running.';
    }

    if (error.message.includes('401')) {
      return 'Session expired. Please login again.';
    }

    if (error.message.includes('403')) {
      return 'You do not have permission to perform this action.';
    }

    if (error.message.includes('404')) {
      return 'Slide not found.';
    }

    if (error.message.includes('413')) {
      return 'File too large. Please choose a smaller image.';
    }

    return error.message || 'An unexpected error occurred.';
  },
};

export default function CarouselAdminPanel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [draggedSlide, setDraggedSlide] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    isActive: true,
    order: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Load slides
  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setLoading(true);
    setError('');
    try {
      const slidesData = await carouselAPI.getAllSlidesAdmin();
      setSlides(Array.isArray(slidesData) ? slidesData.sort((a, b) => a.order - b.order) : []);
    } catch (error) {
      console.error('Error loading slides:', error);
      const errorMessage = carouselAPI.handleApiError(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      // Validate data
      const validation = carouselAPI.validateSlideData(formData);
      if (!validation.isValid) {
        setError('Validation errors:\n' + validation.errors.join('\n'));
        return;
      }

      // Check if image is provided
      if (!imageFile && !formData.image) {
        setError('Please select an image for the slide');
        return;
      }

      const slideData = carouselAPI.formatSlideData(formData, imageFile);

      if (editingSlide) {
        await carouselAPI.updateSlide(editingSlide._id, slideData);
      } else {
        await carouselAPI.createSlide(slideData);
      }

      await loadSlides();
      resetForm();
      setShowModal(false);
      alert(editingSlide ? 'Slide updated successfully!' : 'Slide created successfully!');
    } catch (error) {
      console.error('Error saving slide:', error);
      const errorMessage = carouselAPI.handleApiError(error);
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      id: slide.id,
      title: slide.title,
      description: slide.description,
      image: slide.image,
      isActive: slide.isActive,
      order: slide.order
    });
    setImageFile(null);
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;

    try {
      await carouselAPI.deleteSlide(slideId);
      await loadSlides();
      alert('Slide deleted successfully!');
    } catch (error) {
      console.error('Error deleting slide:', error);
      const errorMessage = carouselAPI.handleApiError(error);
      alert('Failed to delete slide: ' + errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      image: '',
      isActive: true,
      order: slides.length + 1
    });
    setEditingSlide(null);
    setImageFile(null);
    setError('');
  };

  const handleDragStart = (e, slide) => {
    setDraggedSlide(slide);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetSlide) => {
    e.preventDefault();
    if (!draggedSlide || draggedSlide._id === targetSlide._id) return;

    const newSlides = [...slides];
    const draggedIndex = newSlides.findIndex(s => s._id === draggedSlide._id);
    const targetIndex = newSlides.findIndex(s => s._id === targetSlide._id);

    // Remove dragged slide and insert at new position
    newSlides.splice(draggedIndex, 1);
    newSlides.splice(targetIndex, 0, draggedSlide);

    // Update order values
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      order: index + 1
    }));

    setSlides(updatedSlides);

    // Update order in backend
    try {
      const slideIds = updatedSlides.map(slide => slide._id);
      await carouselAPI.reorderSlides(slideIds);
    } catch (error) {
      console.error('Error updating slide order:', error);
      const errorMessage = carouselAPI.handleApiError(error);
      alert('Failed to update slide order: ' + errorMessage);
      await loadSlides(); // Reload on error
    }

    setDraggedSlide(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading slides...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Carousel Admin Panel</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add New Slide
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Connection Status */}
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Server Status: {error.includes('Cannot connect') ? 
            'Disconnected - Please start your backend server' : 
            'Connected'}
        </div>

        {/* Slides Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {slides.map((slide) => (
                <tr
                  key={slide._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, slide)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slide)}
                  className="hover:bg-gray-50 cursor-move"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {slide.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="h-12 w-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjOUI5QkExIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{slide.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{slide.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      slide.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {slides.length === 0 && !error.includes('Cannot connect') && (
            <div className="text-center py-8 text-gray-500">
              No slides found. Add your first slide to get started.
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                </h3>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slide ID
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({...formData, id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., productivity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img src={formData.image} alt="Current" className="h-20 w-20 object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploading ? 'Saving...' : (editingSlide ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}