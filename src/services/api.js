// api.js - Complete API configuration for Empress Tech with Enhanced Testimonials
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com/api"
    : "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Enhanced API request helper with better error handling
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    console.log(`🔗 API Request: ${options.method || "GET"} ${url}`);

    const response = await fetch(url, config);

    // Handle different response types
    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        typeof data === "object"
          ? data.message || data.error
          : data || "Something went wrong";
      throw new Error(`HTTP ${response.status}: ${errorMessage}`);
    }

    console.log(`✅ API Success: ${options.method || "GET"} ${url}`);
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${options.method || "GET"} ${url}`, error);

    // Enhanced error handling
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Please check your internet connection and try again."
      );
    }

    if (error.message.includes("401")) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }

    throw error;
  }
};

// ============= ENHANCED TESTIMONIAL API =============
export const testimonialAPI = {
  // ========== PUBLIC ENDPOINTS ==========

  // Get all active testimonials for public display with enhanced filtering
  getAllTestimonials: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/testimonials${queryString ? `?${queryString}` : ""}`);
  },

  // Get featured testimonials with proper error handling
  getFeaturedTestimonials: async (limit = 5) => {
    const params = { featured: "true", limit: limit.toString() };
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/testimonials/featured?${queryString}`);
  },

  // Get testimonial statistics for public display
  getTestimonialStats: async () => {
    return apiRequest("/testimonials/stats");
  },

  // ========== ADMIN ENDPOINTS ==========

  // Get all testimonials for admin management with full filtering support
  getAllTestimonialsAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/testimonials/admin${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get single testimonial for admin with full details
  getTestimonialById: async (id) => {
    if (!id) throw new Error("Testimonial ID is required");
    return apiRequest(`/testimonials/admin/${id}`);
  },

  // Create new testimonial with proper FormData handling
  createTestimonial: async (testimonialData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // If testimonialData is FormData, send it directly
      if (testimonialData instanceof FormData) {
        const response = await fetch(`${API_BASE_URL}/testimonials/admin`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData - browser will set it with boundary
          },
          body: testimonialData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: Request failed`
          );
        }

        return await response.json();
      }

      // Handle regular object data
      return apiRequest("/testimonials/admin", {
        method: "POST",
        body: JSON.stringify(testimonialData),
      });
    } catch (error) {
      console.error("Create testimonial error:", error);
      throw error;
    }
  },

  // Update testimonial with proper FormData handling
  updateTestimonial: async (id, testimonialData) => {
    try {
      if (!id) throw new Error("Testimonial ID is required");

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // If testimonialData is FormData, send it directly
      if (testimonialData instanceof FormData) {
        const response = await fetch(
          `${API_BASE_URL}/testimonials/admin/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              // Don't set Content-Type for FormData
            },
            body: testimonialData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: Request failed`
          );
        }

        return await response.json();
      }

      // Handle regular object data
      return apiRequest(`/testimonials/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(testimonialData),
      });
    } catch (error) {
      console.error("Update testimonial error:", error);
      throw error;
    }
  },

  // Delete testimonial with confirmation
  deleteTestimonial: async (id) => {
    if (!id) throw new Error("Testimonial ID is required");
    return apiRequest(`/testimonials/admin/${id}`, {
      method: "DELETE",
    });
  },

  // Toggle testimonial status (active/inactive/verified/featured)
  toggleTestimonialStatus: async (id, field) => {
    if (!id) throw new Error("Testimonial ID is required");
    if (!["isActive", "verified", "featured"].includes(field)) {
      throw new Error("Invalid field. Allowed: isActive, verified, featured");
    }

    return apiRequest(`/testimonials/admin/${id}/toggle-status`, {
      method: "PATCH",
      body: JSON.stringify({ field }),
    });
  },

  // Get detailed testimonials statistics for admin
  getTestimonialStatsAdmin: async () => {
    return apiRequest("/testimonials/admin/stats");
  },

  // Bulk update testimonials with validation
  bulkUpdateTestimonials: async (testimonialIds, updates) => {
    if (!Array.isArray(testimonialIds) || testimonialIds.length === 0) {
      throw new Error("Please provide testimonial IDs array");
    }

    if (!updates || typeof updates !== "object") {
      throw new Error("Please provide updates object");
    }

    return apiRequest("/testimonials/admin/bulk-update", {
      method: "POST",
      body: JSON.stringify({ testimonialIds, updates }),
    });
  },

  // Upload testimonial image separately with proper error handling
  uploadTestimonialImage: async (imageFile) => {
    try {
      if (!imageFile) throw new Error("Image file is required");

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Validate file type and size
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error("Only JPEG, PNG, WebP and GIF images are allowed");
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        // 5MB
        throw new Error("Image size must be less than 5MB");
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        `${API_BASE_URL}/testimonials/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  },

  // Reorder testimonials for display priority
  reorderTestimonials: async (testimonialIds) => {
    if (!Array.isArray(testimonialIds) || testimonialIds.length === 0) {
      throw new Error("Please provide testimonial IDs array");
    }

    return apiRequest("/testimonials/admin/reorder", {
      method: "POST",
      body: JSON.stringify({ testimonialIds }),
    });
  },

  // Validate testimonial data before submission
  validateTestimonialData: (data) => {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!data.location || data.location.trim().length < 2) {
      errors.push("Location must be at least 2 characters long");
    }

    if (!data.title || data.title.trim().length < 5) {
      errors.push("Title must be at least 5 characters long");
    }

    if (!data.content || data.content.trim().length < 10) {
      errors.push("Content must be at least 10 characters long");
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.push("Rating must be between 1 and 5");
    }

    if (data.rating % 0.5 !== 0) {
      errors.push("Rating must be in increments of 0.5");
    }

    if (
      data.email &&
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)
    ) {
      errors.push("Please enter a valid email address");
    }

    if (data.content && data.content.length > 2000) {
      errors.push("Content cannot exceed 2000 characters");
    }

    if (data.title && data.title.length > 200) {
      errors.push("Title cannot exceed 200 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Helper function to format testimonial data for API
  formatTestimonialData: (formData, imageFile = null) => {
    const data = new FormData();

    // Required fields
    data.append("name", formData.name?.trim() || "");
    data.append("location", formData.location?.trim() || "");
    data.append("title", formData.title?.trim() || "");
    data.append("content", formData.content?.trim() || "");
    data.append("rating", formData.rating || 5);

    // Optional fields
    if (formData.email) data.append("email", formData.email.trim());
    if (formData.phone) data.append("phone", formData.phone.trim());
    if (formData.productPurchased)
      data.append("productPurchased", formData.productPurchased.trim());
    if (formData.purchaseDate)
      data.append("purchaseDate", formData.purchaseDate);
    if (formData.adminNotes)
      data.append("adminNotes", formData.adminNotes.trim());
    if (formData.displayOrder)
      data.append("displayOrder", formData.displayOrder);

    // Boolean fields
    data.append("verified", formData.verified || false);
    data.append("isActive", formData.isActive !== false);
    data.append("featured", formData.featured || false);

    // Image file
    if (imageFile) {
      data.append("image", imageFile);
    }

    return data;
  },

  // Helper function to handle API errors consistently
  handleApiError: (error) => {
    console.error("Testimonial API Error:", error);

    if (error.message.includes("401")) {
      return "Session expired. Please login again.";
    }

    if (error.message.includes("403")) {
      return "You do not have permission to perform this action.";
    }

    if (error.message.includes("404")) {
      return "Testimonial not found.";
    }

    if (error.message.includes("413")) {
      return "File too large. Please choose a smaller image.";
    }

    if (error.message.includes("422")) {
      return "Invalid data provided. Please check your input.";
    }

    if (error.message.includes("429")) {
      return "Too many requests. Please try again later.";
    }

    if (error.message.includes("500")) {
      return "Server error. Please try again later.";
    }

    return error.message || "An unexpected error occurred.";
  },
};

// ============= PAYMENT API =============
export const paymentAPI = {
  // Create Razorpay order
  createRazorpayOrder: (orderData) =>
    apiRequest("/payment/create-razorpay-order", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  // Verify Razorpay payment
  verifyRazorpayPayment: (paymentData) =>
    apiRequest("/payment/verify-razorpay", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),

  // Get payment details (admin)
  getPaymentDetails: (paymentId) => apiRequest(`/payment/payment/${paymentId}`),

  // Process refund (admin)
  processRefund: (refundData) =>
    apiRequest("/payment/refund", {
      method: "POST",
      body: JSON.stringify(refundData),
    }),
};

// ============= AUTH API =============
export const authAPI = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  getProfile: () => apiRequest("/auth/profile"),

  updateProfile: (userData) =>
    apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve({
      success: true,
      message: "Logged out successfully",
    });
  },

  // Verify token validity
  verifyToken: () => apiRequest("/auth/verify-token"),

  // Request password reset
  requestPasswordReset: (email) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Reset password
  resetPassword: (token, newPassword) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: newPassword }),
    }),
};

// ============= ORDER API =============
export const orderAPI = {
  // Create order (main endpoint)
  createOrder: (orderData) =>
    apiRequest("/orders/create", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  // Get order by ID
  getOrderById: (id) => apiRequest(`/orders/${id}`),

  // Get user orders with pagination
  getMyOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/orders/user/myorders${queryString ? `?${queryString}` : ""}`
    );
  },

  // Update order to paid
  updateOrderToPaid: (id, paymentResult) =>
    apiRequest(`/orders/${id}/pay`, {
      method: "PUT",
      body: JSON.stringify(paymentResult),
    }),

  // Cancel order
  cancelOrder: (id, reason = "") =>
    apiRequest(`/orders/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),

  // Get order tracking info
  getOrderTracking: (id) => apiRequest(`/orders/${id}/tracking`),
};

// ============= USER API =============
export const userAPI = {
  // Order management (using orderAPI endpoints)
  placeOrder: (orderData) => orderAPI.createOrder(orderData),

  getMyOrders: (params = {}) => orderAPI.getMyOrders(params),

  getOrderById: (id) => orderAPI.getOrderById(id),

  // Cancel order - updated to use userController endpoint
  cancelOrder: (id, reason) =>
    apiRequest(`/users/cancel-order/${id}`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),

  // Profile management (using authAPI endpoints)
  getUserProfile: () => authAPI.getProfile(),

  updateUserProfile: (userData) => authAPI.updateProfile(userData),

  // Address management
  getAddresses: () => apiRequest("/users/addresses"),

  addAddress: (addressData) =>
    apiRequest("/users/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    }),

  updateAddress: (id, addressData) =>
    apiRequest(`/users/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    }),

  deleteAddress: (id) =>
    apiRequest(`/users/addresses/${id}`, {
      method: "DELETE",
    }),

  // Wishlist management
  getWishlist: () => apiRequest("/users/wishlist"),

  addToWishlist: (productId) =>
    apiRequest("/users/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  removeFromWishlist: (productId) =>
    apiRequest(`/users/wishlist/${productId}`, {
      method: "DELETE",
    }),
};

// ============= PRODUCT API =============
export const productAPI = {
  // ========== PUBLIC ENDPOINTS ==========

  // Get all products with advanced filtering
  getAllProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ""}`);
  },

  // Get single product by ID
  getProductById: (id) => apiRequest(`/products/${id}`),

  // Get products by category
  getProductsByCategory: (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/products/category/${categoryId}${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get featured products
  getFeaturedProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/products/featured${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get categories
  getCategories: () => apiRequest("/products/categories"),

  // Get product reviews
  getProductReviews: (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`
    );
  },

  // Add product review
  addProductReview: (productId, reviewData) =>
    apiRequest(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  // Get related products
  getRelatedProducts: (productId, limit = 4) =>
    apiRequest(`/products/${productId}/related?limit=${limit}`),

  // Search products
  searchProducts: (query, params = {}) => {
    const searchParams = new URLSearchParams({ q: query, ...params });
    return apiRequest(`/products/search?${searchParams.toString()}`);
  },

  // ========== ADMIN ENDPOINTS ==========

  // Get all products for admin
  getAllProductsAdmin: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/products/admin/all${queryString ? `?${queryString}` : ""}`
    );
  },

  // Create product
  createProduct: (productData) =>
    apiRequest("/products/admin/create", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  // Update product
  updateProduct: (id, productData) =>
    apiRequest(`/products/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  // Delete product
  deleteProduct: (id) =>
    apiRequest(`/products/admin/${id}`, {
      method: "DELETE",
    }),

  // Get product stats
  getProductStats: () => apiRequest("/products/admin/stats"),
};

// ============= CATEGORY API =============
export const categoryAPI = {
  getAllCategories: () => apiRequest("/categories"),

  getCategoryById: (categoryId) => apiRequest(`/categories/${categoryId}`),

  // Admin endpoints
  createCategory: (categoryData) =>
    apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  updateCategory: (id, categoryData) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),

  deleteCategory: (id) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
};

// ============= ADMIN API =============
export const adminAPI = {
  // ========== DASHBOARD ==========
  getDashboardStats: () => apiRequest("/admin/dashboard/stats"),

  getRecentActivity: () => apiRequest("/admin/dashboard/recent-activity"),

  getSalesData: (period = "30days") =>
    apiRequest(`/admin/dashboard/sales?period=${period}`),

  // ========== ORDERS ==========
  getAllOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders${queryString ? `?${queryString}` : ""}`);
  },

  getOrderById: (id) => apiRequest(`/admin/orders/${id}`),

  updateOrderStatus: (id, status) =>
    apiRequest(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  markOrderAsPaid: (id) =>
    apiRequest(`/admin/orders/${id}/paid`, {
      method: "PUT",
    }),

  markOrderAsDelivered: (id) =>
    apiRequest(`/admin/orders/${id}/delivered`, {
      method: "PUT",
    }),

  getOrderStats: () => apiRequest("/admin/orders/stats"),

  // ========== USERS ==========
  getAllUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ""}`);
  },

  getUserById: (id) => apiRequest(`/admin/users/${id}`),

  updateUserStatus: (id, status) =>
    apiRequest(`/admin/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  getUserHistory: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/admin/users/${id}/orders${queryString ? `?${queryString}` : ""}`
    );
  },

  // ========== PRODUCTS ==========
  getAllProducts: (params = {}) => productAPI.getAllProductsAdmin(params),
  createProduct: (productData) => productAPI.createProduct(productData),
  updateProduct: (id, productData) => productAPI.updateProduct(id, productData),
  deleteProduct: (id) => productAPI.deleteProduct(id),
  getProductStats: () => productAPI.getProductStats(),

  // ========== CONTACTS ==========
  getAllContacts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/contacts${queryString ? `?${queryString}` : ""}`);
  },

  getContactById: (id) => apiRequest(`/admin/contacts/${id}`),

  updateContact: (id, updateData) =>
    apiRequest(`/admin/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    }),

  deleteContact: (id) =>
    apiRequest(`/admin/contacts/${id}`, {
      method: "DELETE",
    }),

  getContactStats: () => apiRequest("/admin/contacts/stats"),

  // ========== BLOGS (ADMIN) ==========
  getAllBlogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/blogs${queryString ? `?${queryString}` : ""}`);
  },

  createBlog: (blogData) =>
    apiRequest("/admin/blogs", {
      method: "POST",
      body: JSON.stringify(blogData),
    }),

  updateBlog: (id, blogData) =>
    apiRequest(`/admin/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(blogData),
    }),

  deleteBlog: (id) =>
    apiRequest(`/admin/blogs/${id}`, {
      method: "DELETE",
    }),

  getBlogStats: () => apiRequest("/admin/blogs/stats"),

  // ========== TESTIMONIALS (ADMIN) ==========
  getAllTestimonials: (params = {}) =>
    testimonialAPI.getAllTestimonialsAdmin(params),
  getTestimonialById: (id) => testimonialAPI.getTestimonialById(id),
  createTestimonial: (data) => testimonialAPI.createTestimonial(data),
  updateTestimonial: (id, data) => testimonialAPI.updateTestimonial(id, data),
  deleteTestimonial: (id) => testimonialAPI.deleteTestimonial(id),
  getTestimonialStats: () => testimonialAPI.getTestimonialStatsAdmin(),
};

// ============= BLOG API =============
export const blogAPI = {
  // ========== PUBLIC ENDPOINTS ==========
  getAllBlogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/blogs${queryString ? `?${queryString}` : ""}`);
  },

  getBlogById: (id) => apiRequest(`/blogs/${id}`),

  getBlogBySlug: (slug) => apiRequest(`/blogs/slug/${slug}`),

  getBlogsByCategory: (category, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/blogs/category/${category}${queryString ? `?${queryString}` : ""}`
    );
  },

  getFeaturedBlogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/blogs/featured${queryString ? `?${queryString}` : ""}`);
  },

  getEditorsChoiceBlogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/blogs/editors-choice${queryString ? `?${queryString}` : ""}`
    );
  },

  getRecentBlogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/blogs/recent${queryString ? `?${queryString}` : ""}`);
  },

  getPopularBlogs: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/blogs/popular${queryString ? `?${queryString}` : ""}`);
  },

  // ========== ADMIN ENDPOINTS ==========
  getAllBlogsAdmin: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/blogs${queryString ? `?${queryString}` : ""}`);
  },

  createBlog: (blogData) =>
    apiRequest("/admin/blogs", {
      method: "POST",
      body: JSON.stringify(blogData),
    }),

  updateBlog: (id, blogData) =>
    apiRequest(`/admin/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(blogData),
    }),

  deleteBlog: (id) =>
    apiRequest(`/admin/blogs/${id}`, {
      method: "DELETE",
    }),

  getBlogStats: () => apiRequest("/admin/blogs/stats"),
};

// ============= CONTACT API =============
export const contactAPI = {
  submitContact: (contactData) =>
    apiRequest("/contact", {
      method: "POST",
      body: JSON.stringify(contactData),
    }),

  // Admin endpoints are in adminAPI
};

// ============= UPLOAD API =============
export const uploadAPI = {
  uploadImage: async (file, folder = "general") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const token = getAuthToken();

    if (!token) {
      throw new Error("Authentication required for file upload");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Upload failed: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },

  uploadFile: async (file, type = "document") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const token = getAuthToken();

    if (!token) {
      throw new Error("Authentication required for file upload");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/upload/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Upload failed: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },

  deleteFile: (filename) =>
    apiRequest(`/upload/file/${filename}`, {
      method: "DELETE",
    }),
};

// ============= SEARCH API =============
export const searchAPI = {
  search: (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return apiRequest(`/search?${params.toString()}`);
  },

  searchProducts: (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return apiRequest(`/search/products?${params.toString()}`);
  },

  searchBlogs: (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return apiRequest(`/search/blogs?${params.toString()}`);
  },

  getSearchSuggestions: (query) =>
    apiRequest(`/search/suggestions?q=${encodeURIComponent(query)}`),
};

// ============= NEWSLETTER API =============
export const newsletterAPI = {
  subscribe: (email) =>
    apiRequest("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  unsubscribe: (email, token) =>
    apiRequest("/newsletter/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ email, token }),
    }),

  // Admin endpoints
  getAllSubscribers: () => apiRequest("/admin/newsletter/subscribers"),

  sendNewsletter: (newsletterData) =>
    apiRequest("/admin/newsletter/send", {
      method: "POST",
      body: JSON.stringify(newsletterData),
    }),
};

// ============= HEALTH CHECK API =============
export const healthAPI = {
  check: () => apiRequest("/health"),

  // Check specific services
  checkDatabase: () => apiRequest("/health/database"),
  checkPayment: () => apiRequest("/health/payment"),
};

// ============= ANALYTICS API =============
export const analyticsAPI = {
  getPageViews: (period = "30days") =>
    apiRequest(`/analytics/page-views?period=${period}`),

  getUserAnalytics: (period = "30days") =>
    apiRequest(`/analytics/users?period=${period}`),

  getConversionRate: (period = "30days") =>
    apiRequest(`/analytics/conversion-rate?period=${period}`),

  trackEvent: (eventData) =>
    apiRequest("/analytics/track", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),
};

// ============= ABOUT API =============
export const aboutAPI = {
  // Public endpoint
  getAboutPageData: () => apiRequest("/about"),

  // Admin endpoints - Gallery
  getAllGalleryItems: () => apiRequest("/about/admin/gallery"),

  createGalleryItem: (itemData) =>
    apiRequest("/about/admin/gallery", {
      method: "POST",
      body: JSON.stringify(itemData),
    }),

  updateGalleryItem: (id, itemData) =>
    apiRequest(`/about/admin/gallery/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    }),

  deleteGalleryItem: (id) =>
    apiRequest(`/about/admin/gallery/${id}`, {
      method: "DELETE",
    }),

  // Admin endpoints - Team
  getAllTeamMembers: () => apiRequest("/about/admin/team"),

  createTeamMember: (memberData) =>
    apiRequest("/about/admin/team", {
      method: "POST",
      body: JSON.stringify(memberData),
    }),

  updateTeamMember: (id, memberData) =>
    apiRequest(`/about/admin/team/${id}`, {
      method: "PUT",
      body: JSON.stringify(memberData),
    }),

  deleteTeamMember: (id) =>
    apiRequest(`/about/admin/team/${id}`, {
      method: "DELETE",
    }),

  // Admin endpoints - Stats
  getAllStats: () => apiRequest("/about/admin/stats"),

  createStat: (statData) =>
    apiRequest("/about/admin/stats", {
      method: "POST",
      body: JSON.stringify(statData),
    }),

  updateStat: (id, statData) =>
    apiRequest(`/about/admin/stats/${id}`, {
      method: "PUT",
      body: JSON.stringify(statData),
    }),

  deleteStat: (id) =>
    apiRequest(`/about/admin/stats/${id}`, {
      method: "DELETE",
    }),

  // Admin endpoints - Core Values
  getAllCoreValues: () => apiRequest("/about/admin/core-values"),

  createCoreValue: (valueData) =>
    apiRequest("/about/admin/core-values", {
      method: "POST",
      body: JSON.stringify(valueData),
    }),

  updateCoreValue: (id, valueData) =>
    apiRequest(`/about/admin/core-values/${id}`, {
      method: "PUT",
      body: JSON.stringify(valueData),
    }),

  deleteCoreValue: (id) =>
    apiRequest(`/about/admin/core-values/${id}`, {
      method: "DELETE",
    }),

  // Admin endpoints - Company Info
  getCompanyInfo: () => apiRequest("/about/admin/company-info"),

  updateCompanyInfo: (companyData) =>
    apiRequest("/about/admin/company-info", {
      method: "PUT",
      body: JSON.stringify(companyData),
    }),
};

// ============= EVENT API =============
export const eventAPI = {
  // Public endpoints
  getAllEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/events${queryString ? `?${queryString}` : ""}`);
  },

  getUpcomingEvents: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/events/upcoming${queryString ? `?${queryString}` : ""}`
    );
  },

  getEventSchedule: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/events/schedule${queryString ? `?${queryString}` : ""}`
    );
  },

  getEventById: (id) => apiRequest(`/events/${id}`),

  // Admin endpoints
  getAllEventsAdmin: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/events${queryString ? `?${queryString}` : ""}`);
  },

  createEvent: (eventData) =>
    apiRequest("/admin/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    }),

  updateEvent: (id, eventData) =>
    apiRequest(`/admin/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(eventData),
    }),

  deleteEvent: (id) =>
    apiRequest(`/admin/events/${id}`, {
      method: "DELETE",
    }),

  getEventStats: () => apiRequest("/admin/events/stats"),
};

// ============= WINNER API =============
export const winnerAPI = {
  // Public endpoints
  getAllWinners: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/winners${queryString ? `?${queryString}` : ""}`);
  },

  getFeaturedWinners: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/winners/featured${queryString ? `?${queryString}` : ""}`
    );
  },

  // Admin endpoints
  getAllWinnersAdmin: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/winners${queryString ? `?${queryString}` : ""}`);
  },

  createWinner: (winnerData) =>
    apiRequest("/admin/winners", {
      method: "POST",
      body: JSON.stringify(winnerData),
    }),

  updateWinner: (id, winnerData) =>
    apiRequest(`/admin/winners/${id}`, {
      method: "PUT",
      body: JSON.stringify(winnerData),
    }),

  deleteWinner: (id) =>
    apiRequest(`/admin/winners/${id}`, {
      method: "DELETE",
    }),
};

// ============= DASHBOARD API =============
export const dashboardAPI = {
  getAdminStats: () => apiRequest("/admin/dashboard/stats"),

  getRecentActivity: () => apiRequest("/admin/dashboard/recent-activity"),

  getSalesData: (period = "30days") =>
    apiRequest(`/admin/dashboard/sales?period=${period}`),

  getTopProducts: (limit = 5) =>
    apiRequest(`/admin/dashboard/top-products?limit=${limit}`),

  getOrderTrends: () => apiRequest("/admin/dashboard/order-trends"),
};

// ============= CART API =============
export const cartAPI = {
  // Get user's cart
  getUserCart: (userId) =>
    apiRequest(`/cart/${userId}`, {
      method: "GET",
    }),

  // Update user's cart (full replacement)
  updateUserCart: (userId, cartItems) =>
    apiRequest(`/cart/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ items: cartItems }),
    }),

  // Add item to cart
  addToCart: (userId, item) =>
    apiRequest(`/cart/${userId}/add`, {
      method: "POST",
      body: JSON.stringify(item),
    }),

  // Update item quantity in cart
  updateCartItem: (userId, cartItemId, quantity) =>
    apiRequest(`/cart/${userId}/item/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  // Remove item from cart
  removeFromCart: (userId, cartItemId) =>
    apiRequest(`/cart/${userId}/item/${cartItemId}`, {
      method: "DELETE",
    }),

  // Clear entire cart
  clearCart: (userId) =>
    apiRequest(`/cart/${userId}/clear`, {
      method: "DELETE",
    }),

  // Get cart history
  getCartHistory: (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/cart/${userId}/history${queryString ? `?${queryString}` : ""}`
    );
  },

  // Sync cart from multiple devices
  syncCart: (userId, cartItems, lastSyncTime = null) =>
    apiRequest(`/cart/${userId}/sync`, {
      method: "POST",
      body: JSON.stringify({
        items: cartItems,
        lastSyncTime: lastSyncTime || new Date().toISOString(),
      }),
    }),

  // Get cart analytics (for admin)
  getCartAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/admin/cart/analytics${queryString ? `?${queryString}` : ""}`
    );
  },

  // Get abandoned carts (for admin)
  getAbandonedCarts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/admin/cart/abandoned${queryString ? `?${queryString}` : ""}`
    );
  },

  // Validate cart items (check stock, prices, etc.)
  validateCart: (userId) =>
    apiRequest(`/cart/${userId}/validate`, {
      method: "POST",
    }),

  // Apply coupon to cart
  applyCoupon: (userId, couponCode) =>
    apiRequest(`/cart/${userId}/coupon`, {
      method: "POST",
      body: JSON.stringify({ couponCode }),
    }),

  // Remove coupon from cart
  removeCoupon: (userId) =>
    apiRequest(`/cart/${userId}/coupon`, {
      method: "DELETE",
    }),

  // Get cart recommendations
  getCartRecommendations: (userId, limit = 5) =>
    apiRequest(`/cart/${userId}/recommendations?limit=${limit}`),

  // Save cart for later (wishlist-like functionality)
  saveForLater: (userId, cartItemId) =>
    apiRequest(`/cart/${userId}/save-later`, {
      method: "POST",
      body: JSON.stringify({ cartItemId }),
    }),

  // Move saved item back to cart
  moveToCart: (userId, savedItemId) =>
    apiRequest(`/cart/${userId}/move-to-cart`, {
      method: "POST",
      body: JSON.stringify({ savedItemId }),
    }),

  // Get saved items
  getSavedItems: (userId) => apiRequest(`/cart/${userId}/saved-items`),

  // Estimate shipping for cart
  getShippingEstimate: (userId, shippingAddress) =>
    apiRequest(`/cart/${userId}/shipping-estimate`, {
      method: "POST",
      body: JSON.stringify({ shippingAddress }),
    }),

  // Get cart totals with all calculations
  getCartTotals: (userId, couponCode = null, shippingAddress = null) =>
    apiRequest(`/cart/${userId}/totals`, {
      method: "POST",
      body: JSON.stringify({ couponCode, shippingAddress }),
    }),
};

// ============= COUPON API =============
export const couponAPI = {
  // Public endpoints
  validateCoupon: (code) => apiRequest(`/coupons/validate/${code}`),

  // Admin endpoints
  getAllCoupons: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/coupons${queryString ? `?${queryString}` : ""}`);
  },

  createCoupon: (couponData) =>
    apiRequest("/admin/coupons", {
      method: "POST",
      body: JSON.stringify(couponData),
    }),

  updateCoupon: (id, couponData) =>
    apiRequest(`/admin/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(couponData),
    }),

  deleteCoupon: (id) =>
    apiRequest(`/admin/coupons/${id}`, {
      method: "DELETE",
    }),

  getCouponStats: () => apiRequest("/admin/coupons/stats"),
};

// ============= NOTIFICATION API =============
export const notificationAPI = {
  // User notifications
  getUserNotifications: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/notifications${queryString ? `?${queryString}` : ""}`);
  },

  markNotificationAsRead: (id) =>
    apiRequest(`/notifications/${id}/read`, {
      method: "PUT",
    }),

  markAllNotificationsAsRead: () =>
    apiRequest("/notifications/mark-all-read", {
      method: "PUT",
    }),

  deleteNotification: (id) =>
    apiRequest(`/notifications/${id}`, {
      method: "DELETE",
    }),

  // Admin endpoints
  createNotification: (notificationData) =>
    apiRequest("/admin/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    }),

  sendBulkNotification: (notificationData) =>
    apiRequest("/admin/notifications/bulk", {
      method: "POST",
      body: JSON.stringify(notificationData),
    }),
};

// ============= SETTINGS API =============
export const settingsAPI = {
  // Get application settings
  getSettings: () => apiRequest("/settings"),

  // Admin endpoints
  updateSettings: (settingsData) =>
    apiRequest("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    }),

  getSystemInfo: () => apiRequest("/admin/settings/system-info"),

  clearCache: () =>
    apiRequest("/admin/settings/clear-cache", {
      method: "POST",
    }),

  backupDatabase: () =>
    apiRequest("/admin/settings/backup", {
      method: "POST",
    }),
};

// ============= REVIEW API =============
export const reviewAPI = {
  // Get reviews for a product
  getProductReviews: (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(
      `/reviews/product/${productId}${queryString ? `?${queryString}` : ""}`
    );
  },

  // Create a review
  createReview: (reviewData) =>
    apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  // Update a review
  updateReview: (id, reviewData) =>
    apiRequest(`/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    }),

  // Delete a review
  deleteReview: (id) =>
    apiRequest(`/reviews/${id}`, {
      method: "DELETE",
    }),

  // Get user's reviews
  getUserReviews: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/reviews/user${queryString ? `?${queryString}` : ""}`);
  },

  // Admin endpoints
  getAllReviews: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/reviews${queryString ? `?${queryString}` : ""}`);
  },

  moderateReview: (id, action) =>
    apiRequest(`/admin/reviews/${id}/moderate`, {
      method: "PUT",
      body: JSON.stringify({ action }),
    }),

  getReviewStats: () => apiRequest("/admin/reviews/stats"),
};

// ============= DEAL API =============
// export const dealAPI = {
//   // ========== PUBLIC ENDPOINTS ==========

//   // Get current active deal
//   getCurrentDeal: async () => {
//     return apiRequest('/deals/current');
//   },

//   // Get all active deals
//   getActiveDeals: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return apiRequest(`/deals${queryString ? `?${queryString}` : ''}`);
//   },

//   // Get deal by slug
//   getDealBySlug: async (slug) => {
//     if (!slug) throw new Error('Deal slug is required');
//     return apiRequest(`/deals/slug/${slug}`);
//   },

//   // Track deal click
//   trackDealClick: async (dealId) => {
//     if (!dealId) throw new Error('Deal ID is required');
//     return apiRequest(`/deals/${dealId}/click`, {
//       method: 'POST'
//     });
//   },

//   // ========== ADMIN ENDPOINTS ==========

//   // Get all deals for admin management
//   getAllDealsAdmin: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return apiRequest(`/deals/admin${queryString ? `?${queryString}` : ''}`);
//   },

//   // Get single deal for admin with full details
//   getDealByIdAdmin: async (id) => {
//     if (!id) throw new Error('Deal ID is required');
//     return apiRequest(`/deals/admin/${id}`);
//   },

//   // Create new deal with proper FormData handling
//   createDeal: async (dealData) => {
//     try {
//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Authentication required");
//       }

//       // If dealData is FormData, send it directly
//       if (dealData instanceof FormData) {
//         const response = await fetch(`${API_BASE_URL}/deals/admin`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // Don't set Content-Type for FormData - browser will set it with boundary
//           },
//           body: dealData,
//         });

//         if (!response.ok) {
//           const errorData = await response.json().catch(() => ({}));
//           throw new Error(errorData.message || `HTTP ${response.status}: Request failed`);
//         }

//         return await response.json();
//       }

//       // Handle regular object data
//       return apiRequest("/deals/admin", {
//         method: "POST",
//         body: JSON.stringify(dealData),
//       });
//     } catch (error) {
//       console.error('Create deal error:', error);
//       throw error;
//     }
//   },

//   // Update deal with proper FormData handling
//   updateDeal: async (id, dealData) => {
//     try {
//       if (!id) throw new Error('Deal ID is required');

//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Authentication required");
//       }

//       // If dealData is FormData, send it directly
//       if (dealData instanceof FormData) {
//         const response = await fetch(`${API_BASE_URL}/deals/admin/${id}`, {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             // Don't set Content-Type for FormData
//           },
//           body: dealData,
//         });

//         if (!response.ok) {
//           const errorData = await response.json().catch(() => ({}));
//           throw new Error(errorData.message || `HTTP ${response.status}: Request failed`);
//         }

//         return await response.json();
//       }

//       // Handle regular object data
//       return apiRequest(`/deals/admin/${id}`, {
//         method: "PUT",
//         body: JSON.stringify(dealData),
//       });
//     } catch (error) {
//       console.error('Update deal error:', error);
//       throw error;
//     }
//   },

//   // Delete deal with confirmation
//   deleteDeal: async (id) => {
//     if (!id) throw new Error('Deal ID is required');
//     return apiRequest(`/deals/admin/${id}`, {
//       method: "DELETE",
//     });
//   },

//   // Update deal status
//   updateDealStatus: async (id, status) => {
//     if (!id) throw new Error('Deal ID is required');
//     if (!['draft', 'active', 'expired', 'paused'].includes(status)) {
//       throw new Error('Invalid status. Allowed: draft, active, expired, paused');
//     }

//     return apiRequest(`/deals/admin/${id}/status`, {
//       method: "PATCH",
//       body: JSON.stringify({ status }),
//     });
//   },

//   // Get deal analytics
//   getDealAnalytics: async (id) => {
//     if (!id) throw new Error('Deal ID is required');
//     return apiRequest(`/deals/admin/${id}/analytics`);
//   },

//   // Get deal statistics for admin
//   getDealStats: async () => {
//     return apiRequest("/deals/admin/stats");
//   },

//   // Bulk update deal statuses
//   bulkUpdateDealStatus: async (dealIds, status) => {
//     if (!Array.isArray(dealIds) || dealIds.length === 0) {
//       throw new Error('Please provide deal IDs array');
//     }

//     if (!['draft', 'active', 'expired', 'paused'].includes(status)) {
//       throw new Error('Invalid status');
//     }

//     return apiRequest("/deals/admin/bulk-status-update", {
//       method: "POST",
//       body: JSON.stringify({ dealIds, status }),
//     });
//   },

//   // Duplicate deal
//   duplicateDeal: async (id) => {
//     if (!id) throw new Error('Deal ID is required');
//     return apiRequest(`/deals/admin/duplicate/${id}`, {
//       method: "POST",
//     });
//   },

//   // Upload single image for deal
//   uploadDealImage: async (imageFile, folder = 'general') => {
//     try {
//       if (!imageFile) throw new Error('Image file is required');

//       const token = getAuthToken();
//       if (!token) {
//         throw new Error("Authentication required");
//       }

//       // Validate file type and size
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
//       if (!allowedTypes.includes(imageFile.type)) {
//         throw new Error('Only JPEG, PNG, WebP and GIF images are allowed');
//       }

//       if (imageFile.size > 5 * 1024 * 1024) { // 5MB
//         throw new Error('Image size must be less than 5MB');
//       }

//       const formData = new FormData();
//       formData.append('image', imageFile);

//       const response = await fetch(`${API_BASE_URL}/deals/admin/upload-image`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Upload failed: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Deal image upload error:', error);
//       throw error;
//     }
//   },

//   // Delete image from Cloudinary
//   deleteDealImage: async (publicId) => {
//     if (!publicId) throw new Error('Public ID is required');
//     return apiRequest(`/deals/admin/delete-image/${encodeURIComponent(publicId)}`, {
//       method: "DELETE",
//     });
//   },

//   // Validate deal data before submission
//   validateDealData: (data) => {
//     const errors = [];

//     if (!data.title || data.title.trim().length < 5) {
//       errors.push('Title must be at least 5 characters long');
//     }

//     if (!data.description || data.description.trim().length < 10) {
//       errors.push('Description must be at least 10 characters long');
//     }

//     if (!data.product || !data.product.name || data.product.name.trim().length < 2) {
//       errors.push('Product name is required');
//     }

//     if (!data.pricing || !data.pricing.originalPrice || data.pricing.originalPrice <= 0) {
//       errors.push('Original price must be greater than 0');
//     }

//     if (!data.pricing || !data.pricing.salePrice || data.pricing.salePrice <= 0) {
//       errors.push('Sale price must be greater than 0');
//     }

//     if (data.pricing && data.pricing.salePrice >= data.pricing.originalPrice) {
//       errors.push('Sale price must be less than original price');
//     }

//     if (!data.dealTiming || !data.dealTiming.startDate) {
//       errors.push('Deal start date is required');
//     }

//     if (!data.dealTiming || !data.dealTiming.endDate) {
//       errors.push('Deal end date is required');
//     }

//     if (data.dealTiming && data.dealTiming.startDate && data.dealTiming.endDate) {
//       const startDate = new Date(data.dealTiming.startDate);
//       const endDate = new Date(data.dealTiming.endDate);

//       if (endDate <= startDate) {
//         errors.push('End date must be after start date');
//       }
//     }

//     if (data.title && data.title.length > 100) {
//       errors.push('Title cannot exceed 100 characters');
//     }

//     if (data.description && data.description.length > 300) {
//       errors.push('Description cannot exceed 300 characters');
//     }

//     return {
//       isValid: errors.length === 0,
//       errors
//     };
//   },

//   // Helper function to format deal data for API
//   formatDealData: (formData, mainImageFile = null, galleryImageFiles = []) => {
//     const data = new FormData();

//     // Basic deal information
//     data.append('title', formData.title?.trim() || '');
//     data.append('description', formData.description?.trim() || '');

//     // Product information
//     if (formData.product) {
//       data.append('product[name]', formData.product.name?.trim() || '');

//       if (formData.product.specifications && Array.isArray(formData.product.specifications)) {
//         formData.product.specifications.forEach((spec, index) => {
//           data.append(`product[specifications][${index}][label]`, spec.label || '');
//           data.append(`product[specifications][${index}][value]`, spec.value || '');
//         });
//       }

//       if (formData.product.features && Array.isArray(formData.product.features)) {
//         formData.product.features.forEach((feature, index) => {
//           data.append(`product[features][${index}]`, feature);
//         });
//       }
//     }

//     // Pricing information
//     if (formData.pricing) {
//       data.append('pricing[originalPrice]', formData.pricing.originalPrice || 0);
//       data.append('pricing[salePrice]', formData.pricing.salePrice || 0);
//       data.append('pricing[currency]', formData.pricing.currency || 'INR');
//       if (formData.pricing.emiStarting) {
//         data.append('pricing[emiStarting]', formData.pricing.emiStarting);
//       }
//     }

//     // Deal timing
//     if (formData.dealTiming) {
//       data.append('dealTiming[startDate]', formData.dealTiming.startDate || '');
//       data.append('dealTiming[endDate]', formData.dealTiming.endDate || '');
//       data.append('dealTiming[timezone]', formData.dealTiming.timezone || 'Asia/Kolkata');
//     }

//     // Marketing information
//     if (formData.marketing) {
//       data.append('marketing[badgeText]', formData.marketing.badgeText || 'DEAL OF THE DAY');
//       data.append('marketing[urgencyText]', formData.marketing.urgencyText || 'Limited time offer');

//       if (formData.marketing.highlights && Array.isArray(formData.marketing.highlights)) {
//         formData.marketing.highlights.forEach((highlight, index) => {
//           data.append(`marketing[highlights][${index}][icon]`, highlight.icon || '');
//           data.append(`marketing[highlights][${index}][text]`, highlight.text || '');
//           data.append(`marketing[highlights][${index}][value]`, highlight.value || '');
//         });
//       }
//     }

//     // Status and priority
//     data.append('status', formData.status || 'draft');
//     data.append('priority', formData.priority || 0);

//     // SEO information
//     if (formData.seo) {
//       if (formData.seo.slug) data.append('seo[slug]', formData.seo.slug);
//       if (formData.seo.metaTitle) data.append('seo[metaTitle]', formData.seo.metaTitle);
//       if (formData.seo.metaDescription) data.append('seo[metaDescription]', formData.seo.metaDescription);
//     }

//     // Related product
//     if (formData.relatedProduct) {
//       data.append('relatedProduct', formData.relatedProduct);
//     }

//     // Image files
//     if (mainImageFile) {
//       data.append('mainImage', mainImageFile);
//     }

//     if (galleryImageFiles && galleryImageFiles.length > 0) {
//       galleryImageFiles.forEach(file => {
//         data.append('galleryImages', file);
//       });
//     }

//     // Additional options
//     if (formData.replaceGallery !== undefined) {
//       data.append('replaceGallery', formData.replaceGallery);
//     }

//     return data;
//   },

//   // Helper function to handle API errors consistently
//   handleApiError: (error) => {
//     console.error('Deal API Error:', error);

//     if (error.message.includes('401')) {
//       return 'Session expired. Please login again.';
//     }

//     if (error.message.includes('403')) {
//       return 'You do not have permission to perform this action.';
//     }

//     if (error.message.includes('404')) {
//       return 'Deal not found.';
//     }

//     if (error.message.includes('413')) {
//       return 'File too large. Please choose a smaller image.';
//     }

//     if (error.message.includes('422')) {
//       return 'Invalid data provided. Please check your input.';
//     }

//     if (error.message.includes('429')) {
//       return 'Too many requests. Please try again later.';
//     }

//     if (error.message.includes('500')) {
//       return 'Server error. Please try again later.';
//     }

//     return error.message || 'An unexpected error occurred.';
//   }
// };
// ============= DEAL API =============
export const dealAPI = {
  // ========== PUBLIC ENDPOINTS ==========

  // Get current active deal
  getCurrentDeal: async () => {
    return apiRequest("/deals/current");
  },

  // Get all active deals
  getActiveDeals: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/deals${queryString ? `?${queryString}` : ""}`);
  },

  // Get deal by slug
  getDealBySlug: async (slug) => {
    if (!slug) throw new Error("Deal slug is required");
    return apiRequest(`/deals/slug/${slug}`);
  },

  // Track deal click
  trackDealClick: async (dealId) => {
    if (!dealId) throw new Error("Deal ID is required");
    return apiRequest(`/deals/${dealId}/click`, {
      method: "POST",
    });
  },

  // ========== ADMIN ENDPOINTS ==========

  // Get all deals for admin management
  getAllDealsAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/deals/admin${queryString ? `?${queryString}` : ""}`);
  },

  // Get single deal for admin with full details
  getDealByIdAdmin: async (id) => {
    if (!id) throw new Error("Deal ID is required");
    return apiRequest(`/deals/admin/${id}`);
  },

  // Create new deal with proper FormData handling
  createDeal: async (dealData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // If dealData is FormData, send it directly
      if (dealData instanceof FormData) {
        const response = await fetch(`${API_BASE_URL}/deals/admin`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData - browser will set it with boundary
          },
          body: dealData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: Request failed`
          );
        }

        return await response.json();
      }

      // Handle regular object data
      return apiRequest("/deals/admin", {
        method: "POST",
        body: JSON.stringify(dealData),
      });
    } catch (error) {
      console.error("Create deal error:", error);
      throw error;
    }
  },

  // Update deal with proper FormData handling
  updateDeal: async (id, dealData) => {
    try {
      if (!id) throw new Error("Deal ID is required");

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // If dealData is FormData, send it directly
      if (dealData instanceof FormData) {
        const response = await fetch(`${API_BASE_URL}/deals/admin/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData
          },
          body: dealData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: Request failed`
          );
        }

        return await response.json();
      }

      // Handle regular object data
      return apiRequest(`/deals/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(dealData),
      });
    } catch (error) {
      console.error("Update deal error:", error);
      throw error;
    }
  },

  // Delete deal with confirmation
  deleteDeal: async (id) => {
    if (!id) throw new Error("Deal ID is required");
    return apiRequest(`/deals/admin/${id}`, {
      method: "DELETE",
    });
  },

  // Update deal status
  updateDealStatus: async (id, status) => {
    if (!id) throw new Error("Deal ID is required");
    if (!["draft", "active", "expired", "paused"].includes(status)) {
      throw new Error(
        "Invalid status. Allowed: draft, active, expired, paused"
      );
    }

    return apiRequest(`/deals/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Get deal analytics
  getDealAnalytics: async (id) => {
    if (!id) throw new Error("Deal ID is required");
    return apiRequest(`/deals/admin/${id}/analytics`);
  },

  // Get deal statistics for admin
  getDealStats: async () => {
    return apiRequest("/deals/admin/stats");
  },

  // Bulk update deal statuses
  bulkUpdateDealStatus: async (dealIds, status) => {
    if (!Array.isArray(dealIds) || dealIds.length === 0) {
      throw new Error("Please provide deal IDs array");
    }

    if (!["draft", "active", "expired", "paused"].includes(status)) {
      throw new Error("Invalid status");
    }

    return apiRequest("/deals/admin/bulk-status-update", {
      method: "POST",
      body: JSON.stringify({ dealIds, status }),
    });
  },

  // Duplicate deal
  duplicateDeal: async (id) => {
    if (!id) throw new Error("Deal ID is required");
    return apiRequest(`/deals/admin/duplicate/${id}`, {
      method: "POST",
    });
  },

  // Upload single image for deal
  uploadDealImage: async (imageFile, folder = "general") => {
    try {
      if (!imageFile) throw new Error("Image file is required");

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Validate file type and size
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error("Only JPEG, PNG, WebP and GIF images are allowed");
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        // 5MB
        throw new Error("Image size must be less than 5MB");
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/deals/admin/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Deal image upload error:", error);
      throw error;
    }
  },

  // Delete image from Cloudinary
  deleteDealImage: async (publicId) => {
    if (!publicId) throw new Error("Public ID is required");
    return apiRequest(
      `/deals/admin/delete-image/${encodeURIComponent(publicId)}`,
      {
        method: "DELETE",
      }
    );
  },

  // Validate deal data before submission
  validateDealData: (data) => {
    const errors = [];

    if (!data.title || data.title.trim().length < 5) {
      errors.push("Title must be at least 5 characters long");
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.push("Description must be at least 10 characters long");
    }

    if (
      !data.product ||
      !data.product.name ||
      data.product.name.trim().length < 2
    ) {
      errors.push("Product name is required");
    }

    if (
      !data.pricing ||
      !data.pricing.originalPrice ||
      data.pricing.originalPrice <= 0
    ) {
      errors.push("Original price must be greater than 0");
    }

    if (
      !data.pricing ||
      !data.pricing.salePrice ||
      data.pricing.salePrice <= 0
    ) {
      errors.push("Sale price must be greater than 0");
    }

    if (data.pricing && data.pricing.salePrice >= data.pricing.originalPrice) {
      errors.push("Sale price must be less than original price");
    }

    if (!data.dealTiming || !data.dealTiming.startDate) {
      errors.push("Deal start date is required");
    }

    if (!data.dealTiming || !data.dealTiming.endDate) {
      errors.push("Deal end date is required");
    }

    if (
      data.dealTiming &&
      data.dealTiming.startDate &&
      data.dealTiming.endDate
    ) {
      const startDate = new Date(data.dealTiming.startDate);
      const endDate = new Date(data.dealTiming.endDate);

      if (endDate <= startDate) {
        errors.push("End date must be after start date");
      }
    }

    if (data.title && data.title.length > 100) {
      errors.push("Title cannot exceed 100 characters");
    }

    if (data.description && data.description.length > 300) {
      errors.push("Description cannot exceed 300 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Helper function to format deal data for API
  // formatDealData: (formData, mainImageFile = null, galleryImageFiles = []) => {
  //   const data = new FormData();

  //   // Basic deal information
  //   data.append('title', formData.title?.trim() || '');
  //   data.append('description', formData.description?.trim() || '');

  //   // Product information - stringify nested objects
  //   data.append('product', JSON.stringify({
  //     name: formData.product?.name?.trim() || '',
  //     specifications: formData.product?.specifications || [],
  //     features: formData.product?.features || []
  //   }));

  //   // Pricing information - stringify nested object
  //   data.append('pricing', JSON.stringify({
  //     originalPrice: formData.pricing?.originalPrice || 0,
  //     salePrice: formData.pricing?.salePrice || 0,
  //     currency: formData.pricing?.currency || 'INR',
  //     emiStarting: formData.pricing?.emiStarting || 0
  //   }));

  //   // Deal timing - stringify nested object
  //   data.append('dealTiming', JSON.stringify({
  //     startDate: formData.dealTiming?.startDate || '',
  //     endDate: formData.dealTiming?.endDate || '',
  //     timezone: formData.dealTiming?.timezone || 'Asia/Kolkata'
  //   }));

  //   // Marketing information - stringify nested object with proper validation
  //   const marketingData = {
  //     badgeText: formData.marketing?.badgeText || 'DEAL OF THE DAY',
  //     urgencyText: formData.marketing?.urgencyText || 'Limited time offer',
  //     highlights: formData.marketing?.highlights?.filter(h => h.text && h.value) || [
  //       { icon: 'Star', text: 'Customer Rating', value: '4.9/5' }
  //     ]
  //   };
  //   data.append('marketing', JSON.stringify(marketingData));

  //   // Status and priority
  //   data.append('status', formData.status || 'draft');
  //   data.append('priority', formData.priority || 0);

  //   // SEO information - stringify nested object
  //   if (formData.seo) {
  //     data.append('seo', JSON.stringify(formData.seo));
  //   }

  //   // Related product
  //   if (formData.relatedProduct) {
  //     data.append('relatedProduct', formData.relatedProduct);
  //   }

  //   // Image files
  //   if (mainImageFile) {
  //     data.append('mainImage', mainImageFile);
  //   }

  //   if (galleryImageFiles && galleryImageFiles.length > 0) {
  //     galleryImageFiles.forEach(file => {
  //       data.append('galleryImages', file);
  //     });
  //   }

  //   // Additional options
  //   if (formData.replaceGallery !== undefined) {
  //     data.append('replaceGallery', formData.replaceGallery);
  //   }

  //   return data;
  // },

  // Fixed formatDealData function in api.js
  formatDealData: (formData, mainImageFile = null, galleryImageFiles = []) => {
    const data = new FormData();

    // Basic deal information
    data.append("title", formData.title?.trim() || "");
    data.append("description", formData.description?.trim() || "");

    // Product information - stringify nested objects properly
    const productData = {
      name: formData.product?.name?.trim() || "",
      specifications:
        formData.product?.specifications?.filter(
          (spec) => spec.label?.trim() && spec.value?.trim()
        ) || [],
      features:
        formData.product?.features?.filter(
          (feature) => feature && feature.trim()
        ) || [],
    };
    data.append("product", JSON.stringify(productData));

    // Pricing information - stringify nested object
    const pricingData = {
      originalPrice: parseFloat(formData.pricing?.originalPrice) || 0,
      salePrice: parseFloat(formData.pricing?.salePrice) || 0,
      currency: formData.pricing?.currency || "INR",
      emiStarting: parseFloat(formData.pricing?.emiStarting) || 0,
    };
    data.append("pricing", JSON.stringify(pricingData));

    // Deal timing - stringify nested object
    const dealTimingData = {
      startDate: formData.dealTiming?.startDate || "",
      endDate: formData.dealTiming?.endDate || "",
      timezone: formData.dealTiming?.timezone || "Asia/Kolkata",
    };
    data.append("dealTiming", JSON.stringify(dealTimingData));

    // Marketing information - stringify nested object with proper validation
    const marketingData = {
      badgeText: formData.marketing?.badgeText || "DEAL OF THE DAY",
      urgencyText: formData.marketing?.urgencyText || "Limited time offer",
      highlights: formData.marketing?.highlights
        ?.filter((h) => h.text?.trim() && h.value?.trim())
        .map((h) => ({
          icon: h.icon || "Star",
          text: h.text.trim(),
          value: h.value.trim(),
        })) || [
        { icon: "Star", text: "Customer Rating", value: "4.9/5" },
        { icon: "Shield", text: "Warranty", value: "3 Years" },
      ],
    };
    data.append("marketing", JSON.stringify(marketingData));

    // Status and priority
    data.append("status", formData.status || "draft");
    data.append("priority", parseInt(formData.priority) || 0);

    // SEO information - stringify nested object
    if (formData.seo) {
      const seoData = {
        slug: formData.seo.slug?.trim() || "",
        metaTitle: formData.seo.metaTitle?.trim() || "",
        metaDescription: formData.seo.metaDescription?.trim() || "",
      };
      data.append("seo", JSON.stringify(seoData));
    }

    // Related product
    if (formData.relatedProduct) {
      data.append("relatedProduct", formData.relatedProduct);
    }

    // Image files
    if (mainImageFile) {
      data.append("mainImage", mainImageFile);
    }

    if (galleryImageFiles && galleryImageFiles.length > 0) {
      galleryImageFiles.forEach((file) => {
        data.append("galleryImages", file);
      });
    }

    // Additional options
    if (formData.replaceGallery !== undefined) {
      data.append("replaceGallery", formData.replaceGallery);
    }

    return data;
  },

  // Helper function to handle API errors consistently
  handleApiError: (error) => {
    console.error("Deal API Error:", error);

    if (error.message.includes("401")) {
      return "Session expired. Please login again.";
    }

    if (error.message.includes("403")) {
      return "You do not have permission to perform this action.";
    }

    if (error.message.includes("404")) {
      return "Deal not found.";
    }

    if (error.message.includes("413")) {
      return "File too large. Please choose a smaller image.";
    }

    if (error.message.includes("422")) {
      return "Invalid data provided. Please check your input.";
    }

    if (error.message.includes("429")) {
      return "Too many requests. Please try again later.";
    }

    if (error.message.includes("500")) {
      return "Server error. Please try again later.";
    }

    return error.message || "An unexpected error occurred.";
  },
};
// ============= CAROUSEL/SLIDES API =============
// Add this section to your existing api.js file

export const carouselAPI = {
  // ========== PUBLIC ENDPOINTS ==========

  // Get all active slides for public display
  getAllSlides: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/slides${queryString ? `?${queryString}` : ""}`);
  },

  // Get active slides only (what the carousel component uses)
  getActiveSlides: async () => {
    return apiRequest("/slides?active=true");
  },

  // ========== ADMIN ENDPOINTS ==========

  // Get all slides for admin management
  getAllSlidesAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/slides/admin${queryString ? `?${queryString}` : ""}`);
  },

  // Get single slide for admin with full details
  getSlideById: async (id) => {
    if (!id) throw new Error("Slide ID is required");
    return apiRequest(`/slides/admin/${id}`);
  },

  // Create new slide with proper FormData handling
  createSlide: async (slideData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // If slideData is FormData, send it directly
      if (slideData instanceof FormData) {
        const response = await fetch(`${API_BASE_URL}/slides/admin`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData - browser will set it with boundary
          },
          body: slideData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: Request failed`
          );
        }

        return await response.json();
      }

      // Handle regular object data
      return apiRequest("/slides/admin", {
        method: "POST",
        body: JSON.stringify(slideData),
      });
    } catch (error) {
      console.error("Create slide error:", error);
      throw error;
    }
  },

  // Update slide with proper FormData handling
  updateSlide: async (id, slideData) => {
    try {
      if (!id) throw new Error("Slide ID is required");

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // If slideData is FormData, send it directly
      if (slideData instanceof FormData) {
        const response = await fetch(`${API_BASE_URL}/slides/admin/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData
          },
          body: slideData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: Request failed`
          );
        }

        return await response.json();
      }

      // Handle regular object data
      return apiRequest(`/slides/admin/${id}`, {
        method: "PUT",
        body: JSON.stringify(slideData),
      });
    } catch (error) {
      console.error("Update slide error:", error);
      throw error;
    }
  },

  // Delete slide with confirmation
  deleteSlide: async (id) => {
    if (!id) throw new Error("Slide ID is required");
    return apiRequest(`/slides/admin/${id}`, {
      method: "DELETE",
    });
  },

  // Toggle slide status (active/inactive)
  toggleSlideStatus: async (id, field = "isActive") => {
    if (!id) throw new Error("Slide ID is required");
    if (!["isActive"].includes(field)) {
      throw new Error("Invalid field. Allowed: isActive");
    }

    return apiRequest(`/slides/admin/${id}/toggle-status`, {
      method: "PATCH",
      body: JSON.stringify({ field }),
    });
  },

  // Bulk update slides
  bulkUpdateSlides: async (slideIds, updates) => {
    if (!Array.isArray(slideIds) || slideIds.length === 0) {
      throw new Error("Please provide slide IDs array");
    }

    if (!updates || typeof updates !== "object") {
      throw new Error("Please provide updates object");
    }

    return apiRequest("/slides/admin/bulk-update", {
      method: "POST",
      body: JSON.stringify({ slideIds, updates }),
    });
  },

  // Upload slide image separately
  uploadSlideImage: async (imageFile) => {
    try {
      if (!imageFile) throw new Error("Image file is required");

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Validate file type and size
      const allowedTypes = [
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error("Only JPEG, PNG, WebP and GIF images are allowed");
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        // 5MB
        throw new Error("Image size must be less than 5MB");
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/slides/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  },

  // Reorder slides for display priority
  reorderSlides: async (slideIds) => {
    if (!Array.isArray(slideIds) || slideIds.length === 0) {
      throw new Error("Please provide slide IDs array");
    }

    return apiRequest("/slides/admin/reorder", {
      method: "POST",
      body: JSON.stringify({ slideIds }),
    });
  },

  // Get slide statistics for admin
  getSlideStats: async () => {
    return apiRequest("/slides/admin/stats");
  },

  // Validate slide data before submission
  validateSlideData: (data) => {
    const errors = [];

    if (!data.id || data.id.trim().length < 2) {
      errors.push("Slide ID must be at least 2 characters long");
    }

    if (!data.title || data.title.trim().length < 5) {
      errors.push("Title must be at least 5 characters long");
    }

    if (!data.description || data.description.trim().length < 10) {
      errors.push("Description must be at least 10 characters long");
    }

    if (!data.image || data.image.trim().length === 0) {
      errors.push("Image is required");
    }

    if (data.order && (data.order < 1 || data.order > 100)) {
      errors.push("Order must be between 1 and 100");
    }

    if (data.title && data.title.length > 100) {
      errors.push("Title cannot exceed 100 characters");
    }

    if (data.description && data.description.length > 500) {
      errors.push("Description cannot exceed 500 characters");
    }

    if (data.id && data.id.length > 50) {
      errors.push("Slide ID cannot exceed 50 characters");
    }

    // Validate slide ID format (alphanumeric, hyphens, underscores only)
    if (data.id && !/^[a-zA-Z0-9_-]+$/.test(data.id)) {
      errors.push("Slide ID can only contain letters, numbers, hyphens, and underscores");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Helper function to format slide data for API
  formatSlideData: (formData, imageFile = null) => {
    const data = new FormData();

    // Required fields
    data.append("id", formData.id?.trim() || "");
    data.append("title", formData.title?.trim() || "");
    data.append("description", formData.description?.trim() || "");
    data.append("order", formData.order || 1);

    // Optional fields
    if (formData.buttonText) data.append("buttonText", formData.buttonText.trim());
    if (formData.buttonLink) data.append("buttonLink", formData.buttonLink.trim());
    if (formData.category) data.append("category", formData.category.trim());

    // Boolean fields
    data.append("isActive", formData.isActive !== false);

    // Image file
    if (imageFile) {
      data.append("image", imageFile);
    } else if (formData.image && typeof formData.image === "string") {
      data.append("imageUrl", formData.image);
    }

    return data;
  },

  // Helper function to handle API errors consistently
  handleApiError: (error) => {
    console.error("Carousel API Error:", error);

    if (error.message.includes("401")) {
      return "Session expired. Please login again.";
    }

    if (error.message.includes("403")) {
      return "You do not have permission to perform this action.";
    }

    if (error.message.includes("404")) {
      return "Slide not found.";
    }

    if (error.message.includes("413")) {
      return "File too large. Please choose a smaller image.";
    }

    if (error.message.includes("422")) {
      return "Invalid data provided. Please check your input.";
    }

    if (error.message.includes("429")) {
      return "Too many requests. Please try again later.";
    }

    if (error.message.includes("500")) {
      return "Server error. Please try again later.";
    }

    return error.message || "An unexpected error occurred.";
  },
};

// ============= DEFAULT EXPORT =============
export default {
  // Core APIs
  auth: authAPI,
  user: userAPI,
  product: productAPI,
  order: orderAPI,
  payment: paymentAPI,
  cart: cartAPI,

  // Content APIs
  blog: blogAPI,
  about: aboutAPI,
  event: eventAPI,
  winner: winnerAPI,
  testimonial: testimonialAPI,
  deal: dealAPI,
  carousel: carouselAPI,

  // Admin APIs
  admin: adminAPI,
  dashboard: dashboardAPI,

  // Utility APIs
  category: categoryAPI,
  contact: contactAPI,
  upload: uploadAPI,
  search: searchAPI,
  newsletter: newsletterAPI,
  analytics: analyticsAPI,
  health: healthAPI,
  coupon: couponAPI,
  notification: notificationAPI,
  settings: settingsAPI,
  review: reviewAPI,
};
