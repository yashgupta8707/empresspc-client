import React, { useState, useEffect } from "react";
import { dealAPI } from "../services/api";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  TrendingUp,
  Image as ImageIcon,
  Save,
  X,
  RefreshCw,
} from "lucide-react";

const AdminDealManagement = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData());
  const [imageFiles, setImageFiles] = useState({ main: null, gallery: [] });
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState(null);

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log('AdminDealManagement mounted or dependencies changed');
    fetchDeals();
    fetchStats();
  }, [currentPage, statusFilter, searchTerm]);

  function getInitialFormData() {
    return {
      title: "",
      description: "",
      product: {
        name: "",
        specifications: [{ label: "", value: "" }],
        features: [""],
      },
      pricing: {
        originalPrice: "",
        salePrice: "",
        currency: "INR",
        emiStarting: "",
      },
      dealTiming: {
        startDate: "",
        endDate: "",
        timezone: "Asia/Kolkata",
      },
      marketing: {
        badgeText: "DEAL OF THE DAY",
        urgencyText: "Limited time offer",
        highlights: [{ icon: "Star", text: "", value: "" }],
      },
      status: "draft",
      priority: 0,
      seo: {
        slug: "",
        metaTitle: "",
        metaDescription: "",
      },
    };
  }

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
      };

      console.log('🔍 Fetching deals with params:', params);
      console.log('🔑 Auth token exists:', !!localStorage.getItem("token"));
      
      // Try direct fetch first to debug
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      // Build query string manually
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value);
        }
      });

      const url = `/api/deals/admin${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('📡 Making request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Full API response:', result);
      
      if (result.success) {
        console.log('✅ Deals data:', result.data);
        console.log('✅ Deals array:', result.data.deals);
        console.log('✅ Number of deals:', result.data.deals?.length);
        
        const dealsArray = result.data.deals || [];
        setDeals(dealsArray);
        
        if (dealsArray.length === 0) {
          console.log('⚠️ No deals found in response');
        } else {
          console.log('✅ Successfully set deals:', dealsArray.length, 'deals');
        }
      } else {
        console.error('❌ API returned success: false', result);
        setError(result.message || 'Failed to fetch deals');
        setDeals([]);
      }
    } catch (err) {
      console.error("❌ Error fetching deals:", err);
      setError("Failed to fetch deals: " + err.message);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching stats...');
      const token = localStorage.getItem("token");
      
      const response = await fetch('/api/deals/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('❌ Stats response error:', response.status);
        return;
      }

      const result = await response.json();
      console.log('📊 Stats response:', result);
      
      if (result.success) {
        setStats(result.data.stats);
      } else {
        console.error('❌ Stats API returned success: false', result);
      }
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      console.log("📝 Submitting form data:", formData);
      console.log("🖼️ Image files:", imageFiles);

      // Validate form data before API call
      const validation = dealAPI.validateDealData(formData);
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        setSubmitting(false);
        return;
      }

      // Validate dates
      const startDate = new Date(formData.dealTiming.startDate);
      const endDate = new Date(formData.dealTiming.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError("Please provide valid start and end dates");
        setSubmitting(false);
        return;
      }

      if (endDate <= startDate) {
        setError("End date must be after start date");
        setSubmitting(false);
        return;
      }

      // Validate pricing
      if (
        parseFloat(formData.pricing.salePrice) >=
        parseFloat(formData.pricing.originalPrice)
      ) {
        setError("Sale price must be less than original price");
        setSubmitting(false);
        return;
      }

      // Prepare form data for API
      const apiFormData = dealAPI.formatDealData(
        formData,
        imageFiles.main,
        imageFiles.gallery
      );

      console.log("📡 Sending API request...");

      let response;
      if (editingDeal) {
        response = await dealAPI.updateDeal(editingDeal._id, apiFormData);
      } else {
        response = await dealAPI.createDeal(apiFormData);
      }

      console.log("📊 API response:", response);

      if (response.success) {
        setShowForm(false);
        setEditingDeal(null);
        setFormData(getInitialFormData());
        setImageFiles({ main: null, gallery: [] });
        await fetchDeals(); // Refresh deals
        setError("");

        alert(
          editingDeal
            ? "Deal updated successfully!"
            : "Deal created successfully!"
        );
      } else {
        setError(response.message || "Failed to save deal");
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      const errorMessage = dealAPI.handleApiError ? dealAPI.handleApiError(err) : err.message;
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const testCreateDeal = async () => {
    try {
      const testData = {
        title: `Test Deal ${Date.now()}`, // Make unique
        description: "This is a test deal to check functionality",
        product: {
          name: "Test Product",
          specifications: [
            { label: "Processor", value: "Test CPU" },
            { label: "Memory", value: "8GB RAM" },
          ],
          features: ["Feature 1", "Feature 2"],
        },
        pricing: {
          originalPrice: 50000,
          salePrice: 40000,
          currency: "INR",
          emiStarting: 3333,
        },
        dealTiming: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          timezone: "Asia/Kolkata",
        },
        marketing: {
          badgeText: "TEST DEAL",
          urgencyText: "Limited time test",
          highlights: [{ icon: "Star", text: "Rating", value: "5/5" }],
        },
        status: "active",
        priority: 1,
      };

      console.log("🧪 Testing with data:", testData);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/deals/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      console.log("🧪 Test result:", result);

      if (result.success) {
        alert("Test deal created successfully!");
        await fetchDeals(); // Refresh the list
      } else {
        alert("Test failed: " + result.message);
      }
    } catch (error) {
      console.error("🧪 Test error:", error);
      alert("Test error: " + error.message);
    }
  };

  const activateTestDeal = async () => {
    try {
      // Get the deal ID from the current deals
      let dealId = null;
      
      if (deals.length > 0) {
        const testDeal = deals.find(deal => deal.title?.includes("Test Deal"));
        dealId = testDeal?._id;
      }
      
      if (!dealId) {
        alert("No test deal found. Please create a deal first.");
        return;
      }
      
      const updateData = {
        status: 'active',
        dealTiming: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          timezone: 'Asia/Kolkata'
        }
      };

      console.log('🔄 Updating deal with data:', updateData);

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/deals/admin/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      console.log('🔄 Update result:', result);

      if (result.success) {
        alert('Deal activated successfully!');
        await fetchDeals();
      } else {
        alert('Failed to activate deal: ' + result.message);
      }
    } catch (error) {
      console.error('🔄 Error activating deal:', error);
      alert('Error: ' + error.message);
    }
  };

  const checkDealsInDB = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log('🔍 Checking deals in DB...');
      
      const response = await fetch('/api/deals/admin?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      console.log('🔍 All deals in database:', result);
      
      if (result.success) {
        const count = result.data?.deals?.length || 0;
        alert(`Found ${count} deals in database. Check console for details.`);
        
        // Also log individual deals for debugging
        if (result.data?.deals) {
          result.data.deals.forEach((deal, index) => {
            console.log(`Deal ${index + 1}:`, {
              id: deal._id,
              title: deal.title,
              status: deal.status,
              createdAt: deal.createdAt
            });
          });
        }
      } else {
        alert('Failed to fetch deals: ' + result.message);
      }
    } catch (error) {
      console.error('🔍 Error checking deals:', error);
      alert('Error checking deals: ' + error.message);
    }
  };

  const refreshDeals = async () => {
    console.log('🔄 Manual refresh triggered');
    await fetchDeals();
    await fetchStats();
  };

  const handleEdit = (deal) => {
    console.log('✏️ Editing deal:', deal);
    setEditingDeal(deal);
    setFormData({
      title: deal.title || "",
      description: deal.description || "",
      product: {
        name: deal.product?.name || "",
        specifications:
          deal.product?.specifications?.length > 0
            ? deal.product.specifications
            : [{ label: "", value: "" }],
        features:
          deal.product?.features?.length > 0 ? deal.product.features : [""],
      },
      pricing: {
        originalPrice: deal.pricing?.originalPrice || "",
        salePrice: deal.pricing?.salePrice || "",
        currency: deal.pricing?.currency || "INR",
        emiStarting: deal.pricing?.emiStarting || "",
      },
      dealTiming: {
        startDate: deal.dealTiming?.startDate
          ? new Date(deal.dealTiming.startDate).toISOString().slice(0, 16)
          : "",
        endDate: deal.dealTiming?.endDate
          ? new Date(deal.dealTiming.endDate).toISOString().slice(0, 16)
          : "",
        timezone: deal.dealTiming?.timezone || "Asia/Kolkata",
      },
      marketing: {
        badgeText: deal.marketing?.badgeText || "DEAL OF THE DAY",
        urgencyText: deal.marketing?.urgencyText || "Limited time offer",
        highlights:
          deal.marketing?.highlights?.length > 0
            ? deal.marketing.highlights
            : [{ icon: "Star", text: "", value: "" }],
      },
      status: deal.status || "draft",
      priority: deal.priority || 0,
      seo: {
        slug: deal.seo?.slug || "",
        metaTitle: deal.seo?.metaTitle || "",
        metaDescription: deal.seo?.metaDescription || "",
      },
    });
    setShowForm(true);
  };

  const handleDelete = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;

    try {
      console.log('🗑️ Deleting deal:', dealId);
      const response = await dealAPI.deleteDeal(dealId);
      if (response.success) {
        await fetchDeals();
        alert("Deal deleted successfully!");
      } else {
        setError("Failed to delete deal: " + response.message);
      }
    } catch (err) {
      console.error('🗑️ Delete error:', err);
      setError("Failed to delete deal: " + err.message);
    }
  };

  const handleStatusChange = async (dealId, newStatus) => {
    try {
      console.log('🔄 Changing status for deal:', dealId, 'to:', newStatus);
      const response = await dealAPI.updateDealStatus(dealId, newStatus);
      if (response.success) {
        await fetchDeals();
      } else {
        setError("Failed to update status: " + response.message);
      }
    } catch (err) {
      console.error('🔄 Status change error:', err);
      setError("Failed to update status: " + err.message);
    }
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      product: {
        ...formData.product,
        specifications: [
          ...formData.product.specifications,
          { label: "", value: "" },
        ],
      },
    });
  };

  const removeSpecification = (index) => {
    const newSpecs = formData.product.specifications.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      product: {
        ...formData.product,
        specifications: newSpecs,
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Debug component state
  console.log('🏗️ AdminDealManagement render state:', {
    dealsCount: deals.length,
    loading,
    error,
    statusFilter,
    searchTerm
  });

  return (
    <div className="p-6">
      {/* Debug buttons */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={checkDealsInDB}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Check DB Deals
        </button>
        <button
          type="button"
          onClick={testCreateDeal}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Test Create Deal
        </button>
        <button
          type="button"
          onClick={activateTestDeal}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Activate Test Deal
        </button>
        <button
          type="button"
          onClick={refreshDeals}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Deal Management</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingDeal(null);
              setFormData(getInitialFormData());
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Deal
          </button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Total Deals
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Active Deals
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    Total Views
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalViews}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-indigo-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ₹{stats.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              console.log('🔍 Status filter changed to:', e.target.value);
              setStatusFilter(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
            <option value="paused">Paused</option>
          </select>
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => {
              console.log('🔍 Search term changed to:', e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1 max-w-md"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Deals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Analytics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deals && deals.length > 0 ? (
                  deals.map((deal) => (
                    <tr key={deal._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {deal.images?.main?.url ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={deal.images.main.url}
                                alt={deal.title}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center" style={{display: deal.images?.main?.url ? 'none' : 'flex'}}>
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {deal.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {deal.product?.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="line-through text-gray-500">
                            ₹{deal.pricing?.originalPrice?.toLocaleString() || 0}
                          </span>
                          <div className="font-semibold">
                            ₹{deal.pricing?.salePrice?.toLocaleString() || 0}
                          </div>
                          <div className="text-xs text-green-600">
                            {deal.discountPercentage || 0}% OFF
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={deal.status}
                          onChange={(e) =>
                            handleStatusChange(deal._id, e.target.value)
                          }
                          className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(
                            deal.status
                          )}`}
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="expired">Expired</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          Start: {formatDateTime(deal.dealTiming?.startDate)}
                        </div>
                        <div>End: {formatDateTime(deal.dealTiming?.endDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Views: {deal.analytics?.views || 0}</div>
                        <div>Clicks: {deal.analytics?.clicks || 0}</div>
                        <div>Conversions: {deal.analytics?.conversions || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(deal)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Deal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(deal._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Deal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      <div className="py-8">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">No deals found</p>
                        <p className="text-sm mb-4">Create your first deal to get started</p>
                        <div className="space-y-2 text-xs text-gray-400">
                          <p>Debug info:</p>
                          <p>Loading: {loading ? 'Yes' : 'No'}</p>
                          <p>Error: {error || 'None'}</p>
                          <p>Status Filter: {statusFilter}</p>
                          <p>Search Term: {searchTerm || 'None'}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingDeal ? "Edit Deal" : "Create New Deal"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deal Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.product.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product: {
                            ...formData.product,
                            name: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="3"
                    required
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price *
                    </label>
                    <input
                      type="number"
                      value={formData.pricing.originalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            originalPrice: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price *
                    </label>
                    <input
                      type="number"
                      value={formData.pricing.salePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            salePrice: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EMI Starting
                    </label>
                    <input
                      type="number"
                      value={formData.pricing.emiStarting}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pricing: {
                            ...formData.pricing,
                            emiStarting: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* Deal Timing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dealTiming.startDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dealTiming: {
                            ...formData.dealTiming,
                            startDate: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dealTiming.endDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dealTiming: {
                            ...formData.dealTiming,
                            endDate: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFiles({
                          ...imageFiles,
                          main: e.target.files[0],
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gallery Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setImageFiles({
                          ...imageFiles,
                          gallery: Array.from(e.target.files),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                {/* Product Specifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Specifications
                  </label>
                  {formData.product.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Label (e.g., Processor)"
                        value={spec.label}
                        onChange={(e) => {
                          const newSpecs = [...formData.product.specifications];
                          newSpecs[index].label = e.target.value;
                          setFormData({
                            ...formData,
                            product: {
                              ...formData.product,
                              specifications: newSpecs,
                            },
                          });
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g., Intel i7-13700KF)"
                        value={spec.value}
                        onChange={(e) => {
                          const newSpecs = [...formData.product.specifications];
                          newSpecs[index].value = e.target.value;
                          setFormData({
                            ...formData,
                            product: {
                              ...formData.product,
                              specifications: newSpecs,
                            },
                          });
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    + Add Specification
                  </button>
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (0-10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority:
                            e.target.value === "" ? 0 : Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {submitting ? "Saving..." : "Save Deal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDealManagement;