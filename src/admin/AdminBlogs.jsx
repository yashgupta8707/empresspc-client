import { useState, useEffect } from "react";
import { blogAPI } from "../services/api";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image: '',
    category: 'tech',
    type: 'blog',
    tags: [],
    readTime: '5 mins',
    isPublished: true,
    isFeatured: false,
    isEditorsChoice: false
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    status: 'all',
    search: '',
    page: 1
  });
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});

  const categories = [
    { value: 'nvidia', label: 'NVIDIA' },
    { value: 'tech', label: 'Tech' },
    { value: 'computing', label: 'Computing' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'gadget', label: 'Gadget' },
    { value: 'technology', label: 'Technology' },
    { value: 'news', label: 'News' },
    { value: 'design', label: 'Design' },
    { value: 'ai', label: 'AI' },
    { value: 'article', label: 'Article' }
  ];

  const contentTypes = [
    { value: 'blog', label: 'Blog Post' },
    { value: 'article', label: 'Article' }
  ];

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: 20,
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      };
      
      const response = await blogAPI.getAllBlogsAdmin(params);
      setBlogs(response.data.blogs);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await blogAPI.getBlogStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      image: '',
      category: 'tech',
      type: 'blog',
      tags: [],
      readTime: '5 mins',
      isPublished: true,
      isFeatured: false,
      isEditorsChoice: false
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  const validateImageUrl = (url) => {
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      alert('Please provide an image URL for the content');
      return;
    }

    if (!validateImageUrl(formData.image)) {
      alert('Please provide a valid image URL');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingBlog) {
        await blogAPI.updateBlog(editingBlog._id, submitData);
        alert(`${formData.type === 'article' ? 'Article' : 'Blog'} updated successfully!`);
      } else {
        await blogAPI.createBlog(submitData);
        alert(`${formData.type === 'article' ? 'Article' : 'Blog'} created successfully!`);
      }
      
      resetForm();
      fetchBlogs();
      fetchStats();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      type: blog.type || 'blog',
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      readTime: blog.readTime,
      isPublished: blog.isPublished,
      isFeatured: blog.isFeatured,
      isEditorsChoice: blog.isEditorsChoice
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      setLoading(true);
      await blogAPI.deleteBlog(id);
      alert('Content deleted successfully!');
      fetchBlogs();
      fetchStats();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (blog) => {
    try {
      await blogAPI.updateBlog(blog._id, { isPublished: !blog.isPublished });
      fetchBlogs();
      fetchStats();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    if (typeof value === 'string') {
      setFormData({ ...formData, tags: value.split(',').map(tag => tag.trim()) });
    } else {
      setFormData({ ...formData, tags: value });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleContentFormat = (text) => {
    // Auto-format content with basic markdown support
    return text
      .replace(/^# (.+)$/gm, '# $1') // Headers
      .replace(/^## (.+)$/gm, '## $1') // Subheaders
      .replace(/^- (.+)$/gm, '- $1'); // List items
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage your blogs and articles</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/blogs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Live Content →
          </a>
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={loading}
          >
            Add New Content
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">×</button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">{stats.totalBlogs || 0}</div>
            <div className="text-sm text-gray-600">Total Content</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">{stats.publishedBlogs || 0}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-gray-600">{stats.draftBlogs || 0}</div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-yellow-600">{stats.featuredBlogs || 0}</div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-purple-600">{stats.totalViews || 0}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search content..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
          />
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Types</option>
            {contentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button
            onClick={() => {
              fetchBlogs();
              fetchStats();
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingBlog ? 'Edit Content' : 'Create New Content'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
                    required
                  >
                    {contentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Image URL Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Featured Image URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
                    required
                  />
                  {formData.image && validateImageUrl(formData.image) && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <p className="text-xs text-green-600 mt-1">Image URL is valid</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Provide a direct link to the image. Supported formats: JPEG, PNG, WebP, GIF
                  </p>
                </div>

                <textarea
                  placeholder="Summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 h-24"
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <div className="text-xs text-gray-500 mb-2">
                    <strong>Formatting Tips:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li>Use "# " for main headings</li>
                      <li>Use "## " for subheadings</li>
                      <li>Use "- " for bullet points</li>
                      <li>Separate paragraphs with double line breaks</li>
                    </ul>
                  </div>
                  <textarea
                    placeholder={`Enter your content here...

Example formatting:
# Main Heading
This is a paragraph with some content.

## Subheading
Another paragraph here.

- First bullet point
- Second bullet point
- Third bullet point

Final paragraph with conclusion.`}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: handleContentFormat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 h-64 font-mono text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                    onChange={handleTagsChange}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Read Time (e.g., 5 mins)"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="mr-2"
                    />
                    Published
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="mr-2"
                    />
                    Featured
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isEditorsChoice}
                      onChange={(e) => setFormData({ ...formData, isEditorsChoice: e.target.checked })}
                      className="mr-2"
                    />
                    Editor's Choice
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingBlog ? 'Update Content' : 'Create Content'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && blogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No content found
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs" style={{display: blog.image ? 'none' : 'flex'}}>
                            No Image
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">
                            {blog.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            By {blog.authorName}
                          </div>
                          <div className="text-xs text-blue-600">
                            /blog/{blog.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.type === 'article' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {blog.type === 'article' ? 'Article' : 'Blog'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {blog.isFeatured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {blog.isEditorsChoice && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Editor's Choice
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Views: {blog.views || 0}</div>
                      <div>Likes: {blog.likes || 0}</div>
                      <div>{blog.readTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(blog.publishedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-900 text-left"
                        >
                          Edit
                        </button>
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 text-left"
                        >
                          View
                        </a>
                        <button
                          onClick={() => toggleStatus(blog)}
                          className={`text-left ${
                            blog.isPublished 
                              ? 'text-orange-600 hover:text-orange-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {blog.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900 text-left"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={!pagination.hasNextPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                  {' '}({pagination.total} total items)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}