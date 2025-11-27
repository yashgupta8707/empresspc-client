import { useState, useEffect } from "react";
import { blogAPI } from "../services/api";
import ImageWithFallback from "./ImageWithFallback"; // Import the new component

export default function BlogsHero() {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);

  const fetchFeaturedBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getFeaturedBlogs();
      // Take first 4 blogs for the hero layout
      setFeaturedBlogs(response.data.slice(0, 4));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching featured blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fallback data if API fails or no featured blogs
  const fallbackBlogs = [
    {
      _id: 'fallback-1',
      category: "Technology",
      title: "Game Changing Virtual Reality Console Technologies Profit To Serve The Community",
      authorName: "Admin",
      publishedAt: new Date().toISOString(),
      readTime: "20 mins",
      image: "/images/img1.JPG",
    },
    {
      _id: 'fallback-2',
      category: "Mobile",
      title: "New Modern iPhone 14 Pro Max Extra Revolutionary Features",
      publishedAt: new Date().toISOString(),
      image: "/images/img2.JPG",
    },
    {
      _id: 'fallback-3',
      category: "Gadget",
      title: "A Guide To Image Optimization On Jamstack Sites",
      publishedAt: new Date().toISOString(),
      image: "/images/img3.JPG",
    },
    {
      _id: 'fallback-4',
      category: "News",
      title: "Using Automated Test Results To Improve Accessibility",
      publishedAt: new Date().toISOString(),
      image: "/images/img4.JPG",
    },
  ];

  const blogPosts = featuredBlogs.length > 0 ? featuredBlogs : fallbackBlogs;

  if (loading) {
    return (
      <section className="py-8 px-4 md:px-30 bg-white text-black">
        <h1 className="text-4xl font-bold text-center mb-4 text-pink-400">
          Blogs & Articles
        </h1>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-4 md:px-30 bg-white text-black">
        <h1 className="text-4xl font-bold text-center mb-4 text-pink-400">
          Blogs & Articles
        </h1>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error loading featured content: {error}</p>
          <button 
            onClick={fetchFeaturedBlogs}
            className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 md:px-30 bg-white text-black">
      <h1 className="text-4xl font-bold text-center mb-4 text-pink-400">
        Blogs & Articles
      </h1>

      <div className="hidden md:grid grid-cols-3 grid-rows-3 gap-6 h-[600px]">
        {/* Big left card spans 2 cols and all 3 rows */}
        <div className="col-span-2 row-span-3 relative overflow-hidden group cursor-pointer">
          <ImageWithFallback
            src={blogPosts[0].image}
            alt={blogPosts[0].title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="bg-red-500 text-xs px-3 py-1 w-fit mb-2 uppercase font-medium">
              {blogPosts[0].category}
            </span>
            <h3 className="text-sm md:text-xl md:font-semibold mb-2 leading-snug">
              {blogPosts[0].title}
            </h3>
            <div className="flex items-center text-xs gap-4 opacity-80">
              <span>👤 {blogPosts[0].authorName || 'Admin'}</span>
              <span>📅 {formatDate(blogPosts[0].publishedAt)}</span>
              {blogPosts[0].readTime && <span>⏱️ {blogPosts[0].readTime}</span>}
            </div>
          </div>
        </div>

        {/* Right column: 3 stacked cards */}
        {blogPosts.slice(1).map((post) => (
          <div
            key={post._id}
            className="relative overflow-hidden group cursor-pointer"
          >
            <ImageWithFallback
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="bg-red-500 text-xs px-2 py-1 w-fit mb-1 uppercase font-medium">
                {post.category}
              </span>
              <h4 className="text-sm font-semibold leading-tight">
                {post.title}
              </h4>
              <p className="text-xs mt-1 opacity-80">📅 {formatDate(post.publishedAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile view (stacked cards) */}
      <div className="md:hidden space-y-6">
        {blogPosts.map((post, index) => (
          <div key={post._id} className="relative overflow-hidden cursor-pointer">
            <ImageWithFallback
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="bg-red-500 text-xs px-2 py-1 w-fit mb-1 uppercase font-medium">
                {post.category}
              </span>
              <h4 className="text-base font-semibold leading-tight">
                {post.title}
              </h4>
              {index === 0 && (
                <div className="flex items-center text-xs gap-4 mt-1 opacity-80">
                  <span>👤 {post.authorName || 'Admin'}</span>
                  <span>📅 {formatDate(post.publishedAt)}</span>
                  {post.readTime && <span>⏱️ {post.readTime}</span>}
                </div>
              )}
              {index !== 0 && (
                <p className="text-xs mt-1 opacity-80">📅 {formatDate(post.publishedAt)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}