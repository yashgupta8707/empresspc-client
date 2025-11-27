import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogAPI } from "../services/api";
import BlogsHero from "../components/BlogsHero";
import EditorsChoice from "../components/EditorsChoice";
import WeeklyBestNews from "../components/WeeklyBestNews";
import Footer from "../components/Footer";
import Navbar from "../components/EmpressNavbar";
import ImageWithFallback from "../components/ImageWithFallback";

export default function BlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'nvidia', label: 'NVIDIA' },
    { value: 'tech', label: 'Tech' },
    { value: 'computing', label: 'Computing' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'gadget', label: 'Gadget' },
    { value: 'ai', label: 'AI' },
    { value: 'article', label: 'Articles' }
  ];

  const contentTypes = [
    { value: 'all', label: 'All Content' },
    { value: 'blog', label: 'Blogs' },
    { value: 'article', label: 'Articles' }
  ];

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, selectedType, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 6,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedType !== 'all' && { type: selectedType })
      };
      
      const response = await blogAPI.getAllBlogs(params);
      setBlogs(response.data.blogs);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleBlogClick = (blog) => {
    // Navigate to blog detail page using slug
    navigate(`/blog/${blog.slug}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading content: {error}</p>
          <button 
            onClick={fetchBlogs}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <BlogsHero />
      <EditorsChoice />
      
      <div className="bg-white min-h-screen px-4 py-10 md:px-24">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          More Deep Dives..
        </h1>

        {/* Featured Content Section */}
        {blogs.length > 0 && (
          <div 
            className="mx-auto max-w-5xl h-full flex flex-col md:flex-row bg-[#F9FAFB] shadow-lg overflow-hidden mb-16 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleBlogClick(blogs[0])}
          >
            <ImageWithFallback
              src={blogs[0].image}
              alt={blogs[0].title}
              className="md:w-1/2 h-64 object-cover"
            />
            <div className="p-6 md:w-1/2">
              <div className="flex gap-2 mb-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded uppercase">
                  {blogs[0].category}
                </span>
                {blogs[0].type && (
                  <span className={`text-white text-xs px-2 py-1 rounded uppercase ${
                    blogs[0].type === 'article' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {blogs[0].type}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-black mb-2 mt-2">{blogs[0].title}</h2>
              <p className="text-gray-600 mb-4">{blogs[0].summary}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>By {blogs[0].authorName}</span>
                <span className="mx-2">•</span>
                <span>{new Date(blogs[0].publishedAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{blogs[0].readTime}</span>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Read More →
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-4 flex-wrap justify-center mb-6">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              className={`px-4 py-2 border text-sm transition-all duration-200 ${
                selectedType === type.value 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
              }`}
              onClick={() => handleTypeChange(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 flex-wrap justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`px-4 py-2 border text-sm capitalize transition-all duration-200 ${
                selectedCategory === cat.value 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-gray-500'
              }`}
              onClick={() => handleCategoryChange(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && currentPage === 1 && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Content Grid */}
        {!loading && blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No content found for the selected filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} onClick={() => handleBlogClick(blog)} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {pagination.hasNextPage && !loading && (
          <div className="flex justify-center mt-10">
            <button
              className="px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Show More'}
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {pagination.total > 0 && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            Showing {blogs.length} of {pagination.total} items
          </div>
        )}
      </div>
      
      <WeeklyBestNews />
      <Footer />
    </>
  );
}

// Blog Card Component - Updated with onClick handler
function BlogCard({ blog, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="bg-[#F9FAFB] overflow-hidden shadow hover:shadow-md transition-shadow duration-300 group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={blog.image}
          alt={blog.title}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded uppercase font-medium">
            {blog.category}
          </span>
          {blog.type && (
            <span className={`text-white text-xs px-2 py-1 rounded uppercase font-medium ${
              blog.type === 'article' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {blog.type}
            </span>
          )}
        </div>
        {blog.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-black mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.summary}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span>By {blog.authorName}</span>
            <span>•</span>
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>{blog.readTime}</span>
            {blog.views > 0 && (
              <>
                <span>•</span>
                <span>{blog.views} views</span>
              </>
            )}
          </div>
        </div>
        
        <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          Read More →
        </button>
      </div>
    </div>
  );
}