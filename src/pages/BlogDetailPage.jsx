import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogAPI } from "../services/api";
import Navbar from "../components/EmpressNavbar";
import Footer from "../components/Footer";
import ImageWithFallback from "../components/ImageWithFallback";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug();
    }
  }, [slug]);

  const fetchBlogBySlug = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlogBySlug(slug);
      setBlog(response.data);
      
      // Fetch related blogs from the same category
      if (response.data.category) {
        fetchRelatedBlogs(response.data.category, response.data._id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category, currentBlogId) => {
    try {
      const response = await blogAPI.getBlogsByCategory(category, { limit: 3 });
      const filtered = response.data.blogs.filter(b => b._id !== currentBlogId);
      setRelatedBlogs(filtered.slice(0, 3));
    } catch (err) {
      console.error('Error fetching related blogs:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    // Split content into paragraphs and format
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading (starts with #)
      if (paragraph.startsWith('# ')) {
        return (
          <h2 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">
            {paragraph.replace('# ', '')}
          </h2>
        );
      }
      
      // Check if it's a subheading (starts with ##)
      if (paragraph.startsWith('## ')) {
        return (
          <h3 key={index} className="text-xl md:text-2xl font-semibold text-gray-900 mt-6 mb-3">
            {paragraph.replace('## ', '')}
          </h3>
        );
      }

      // Check if it's a list item (starts with -)
      if (paragraph.includes('- ')) {
        const items = paragraph.split('- ').filter(item => item.trim());
        return (
          <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 leading-relaxed">
                {item.trim()}
              </li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/blogs')}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <ImageWithFallback
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <div className="flex justify-center gap-2 mb-4">
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded uppercase font-semibold">
                {blog.category}
              </span>
              {blog.type && (
                <span className={`text-white text-xs px-3 py-1 rounded uppercase font-semibold ${
                  blog.type === 'article' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {blog.type}
                </span>
              )}
              {blog.isFeatured && (
                <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded font-semibold">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center text-sm space-x-4">
              <span>By {blog.authorName}</span>
              <span>•</span>
              <span>{formatDate(blog.publishedAt)}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
              <span>•</span>
              <span>{blog.views} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Summary */}
        <div className="bg-gray-50 border-l-4 border-purple-500 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Summary</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{blog.summary}</p>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          {formatContent(blog.content)}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share & Actions */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{blog.likes || 0} Likes</span>
              </button>
              
              <button 
                onClick={() => navigator.share ? navigator.share({
                  title: blog.title,
                  text: blog.summary,
                  url: window.location.href
                }) : navigator.clipboard.writeText(window.location.href)}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/blogs')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                >
                  <ImageWithFallback
                    src={relatedBlog.image}
                    alt={relatedBlog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex gap-2 mb-2">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded uppercase">
                        {relatedBlog.category}
                      </span>
                      {relatedBlog.type && (
                        <span className={`text-white text-xs px-2 py-1 rounded uppercase ${
                          relatedBlog.type === 'article' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {relatedBlog.type}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {relatedBlog.summary}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{formatDate(relatedBlog.publishedAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{relatedBlog.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}