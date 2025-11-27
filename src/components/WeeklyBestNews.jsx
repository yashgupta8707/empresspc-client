// Fixed WeeklyBestNews.jsx with proper CSS
import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { blogAPI } from "../services/api";

export default function WeeklyBestNews() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogsData();
  }, []);

  const fetchBlogsData = async () => {
    try {
      setLoading(true);
      const [recentResponse, popularResponse] = await Promise.all([
        blogAPI.getRecentBlogs({ limit: 4 }),
        blogAPI.getPopularBlogs({ limit: 4 })
      ]);
      
      setRecentPosts(recentResponse.data);
      setPopularPosts(popularResponse.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blogs data:', err);
      // Set fallback data on error
      setRecentPosts(fallbackRecentPosts);
      setPopularPosts(fallbackPopularPosts);
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

  // Fallback data
  const fallbackRecentPosts = [
    {
      _id: 'recent-1',
      category: "Technology",
      title: "WordPress Full-Site Editing: A Deep Dive Into The Future",
      publishedAt: new Date().toISOString(),
      readTime: "20 mins",
      summary: "Browned Butter And Brown Sugar Caramelly Goodness Crispy Edges...",
      image: "/images/img1.JPG",
    },
    {
      _id: 'recent-2',
      category: "News",
      title: "Effective Communication For Everyday Meetings",
      publishedAt: new Date().toISOString(),
      readTime: "20 mins",
      summary: "Browned Butter And Brown Sugar Caramelly Goodness Crispy Edges...",
      image: "/images/img2.JPG",
    },
    {
      _id: 'recent-3',
      category: "Gadget",
      title: "A Roadmap For Building A Business Chatbot",
      publishedAt: new Date().toISOString(),
      readTime: "20 mins",
      summary: "Browned Butter And Brown Sugar Caramelly Goodness Crispy Edges...",
      image: "/images/img3.JPG",
    },
    {
      _id: 'recent-4',
      category: "Mobile",
      title: "Easy Fluid Typography With Clamp() Using Sass Functions",
      publishedAt: new Date().toISOString(),
      readTime: "20 mins",
      summary: "Browned Butter And Brown Sugar Caramelly Goodness Crispy Edges...",
      image: "/images/img4.JPG",
    },
  ];

  const fallbackPopularPosts = [
    {
      _id: 'popular-1',
      category: "Technology",
      title: "Racing Games Browned Ae Cookies Daily Breakfast",
      publishedAt: new Date().toISOString(),
      readTime: "20 mins",
      image: "/images/img5.JPG",
    },
    {
      _id: 'popular-2',
      category: "Mobile",
      title: "Effective For Everyday Meetings",
      publishedAt: new Date().toISOString(),
      image: "/images/img2.JPG",
    },
    {
      _id: 'popular-3',
      category: "News",
      title: "The Butter Chocolate Cookies Daily",
      publishedAt: new Date().toISOString(),
      image: "/images/img1.JPG",
    },
    {
      _id: 'popular-4',
      category: "Gadget",
      title: "The Anatomy Of Themed Design",
      publishedAt: new Date().toISOString(),
      image: "/images/img6.JPG",
    },
  ];

  const postsToShow = recentPosts.length > 0 ? recentPosts : fallbackRecentPosts;
  const popularToShow = popularPosts.length > 0 ? popularPosts : fallbackPopularPosts;

  if (loading) {
    return (
      <section className="px-4 md:px-20 py-10 bg-white text-black">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <h2 className="text-lg md:text-xl font-bold text-blue-950 mb-6">
              Weekly Best News
            </h2>
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-end">
              <div className="w-full md:w-[80%] h-80 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-20 py-10 bg-white text-black">
      {/* CSS Styles */}
      <style>
        {`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT SIDE - 3/4 span */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-bold text-blue-950">
              Weekly Best News
            </h2>
            <button className="text-xs flex items-center gap-1 text-gray-500 hover:text-black transition-colors">
              VIEW ALL <span className="text-xs">↗</span>
            </button>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded text-sm">
              Could not load recent blogs. Showing sample content.
            </div>
          )}

          {/* Content grid */}
          <div className="space-y-6">
            {postsToShow.map((post) => (
              <div
                key={post._id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                {/* Left column - Text content */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase text-white bg-red-500 w-fit px-2 py-1">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-sm text-blue-950 leading-snug">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.publishedAt)}
                    </div>
                    {post.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">
                    {post.summary || post.description || "Discover the latest insights and trends in technology..."}
                  </p>
                  <button className="text-xs flex items-center gap-1 mt-2 border px-3 py-1 w-fit text-blue-800 border-blue-200 hover:border-blue-800 transition-colors">
                    READ MORE ↗
                  </button>
                </div>

                {/* Right column - Image */}
                <div>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-blog.jpg';
                      e.target.onerror = null;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - 1/4 span */}
        <div className="space-y-6">
          {/* Banner */}
          <div className="flex justify-end">
            <img
              src="/images/Discount.jpg"
              alt="Ad banner"
              className="w-full md:w-[80%] h-80 object-cover rounded"
              onError={(e) => {
                e.target.src = '/images/placeholder-ad.jpg';
                e.target.onerror = null;
              }}
            />
          </div>

          {/* Highlighted Card */}
          {popularToShow.length > 0 && (
            <div className="relative overflow-hidden rounded cursor-pointer">
              <img
                src={popularToShow[0].image}
                alt={popularToShow[0].title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/placeholder-blog.jpg';
                  e.target.onerror = null;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="bg-red-500 text-xs px-2 py-0.5 w-fit uppercase mb-1 font-medium">
                  {popularToShow[0].category}
                </span>
                <h4 className="text-sm font-semibold leading-tight">
                  {popularToShow[0].title}
                </h4>
                <div className="flex items-center text-xs gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(popularToShow[0].publishedAt)}
                  </span>
                  {popularToShow[0].readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {popularToShow[0].readTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Popular Tech Title */}
          <h3 className="text-sm font-semibold text-gray-800">Popular Tech</h3>

          {/* Smaller List Items */}
          <div className="space-y-4">
            {popularToShow.slice(1).map((post) => (
              <div key={post._id} className="flex gap-4 items-start cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-blog.jpg';
                    e.target.onerror = null;
                  }}
                />
                <div className="flex-1">
                  <span className="text-[10px] text-gray-500 border px-1.5 py-0.5 uppercase font-medium">
                    {post.category}
                  </span>
                  <h5 className="text-sm font-semibold leading-snug mt-1 text-gray-800 line-clamp-2">
                    {post.title}
                  </h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {formatDate(post.publishedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Retry button for errors */}
          {error && (
            <div className="text-center">
              <button
                onClick={fetchBlogsData}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Try loading again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}