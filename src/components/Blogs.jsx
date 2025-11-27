import React, { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Fetch 6 recent blogs for the circular gallery
      const response = await blogAPI.getAllBlogs({
        limit: 6,
        sort: 'publishedAt',
        order: 'desc'
      });
      
      if (response.data && response.data.blogs) {
        setBlogs(response.data.blogs);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.message);
      // Fallback to static data if API fails
      setBlogs([
        {
          _id: 1,
          title: "Prebuilt vs Custom PCs: What's Right for You?",
          image: '/images/img1.JPG',
          summary: "A quick guide to help you choose between convenience and customization.",
        },
        {
          _id: 2,
          title: "Gaming PC Guide: Specs That Matter",
          image: '/images/img2.JPG',
          summary: "Know what to prioritize when building your dream gaming rig.",
        },
        {
          _id: 3,
          title: "Liquid Cooling: Is It Worth It?",
          image: '/images/img4.JPG',
          summary: "Explore if liquid cooling fits your setup and performance goals.",
        },
        {
          _id: 4,
          title: "Inside Our Builds: How We Craft PCs",
          image: '/images/img6.JPG',
          summary: "A peek into our process — from part selection to perfection.",
        },
        {
          _id: 5,
          title: "PCs for Engineers & Researchers",
          image: '/images/img7.JPG',
          summary: "Tailored systems for heavy tasks like simulations and data crunching.",
        },
        {
          _id: 6,
          title: "AI Computing Solutions",
          image: '/images/img8.JPG',
          summary: "Power your machine learning projects with our specialized builds.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format blog data for display
  const formatBlogForDisplay = (blog) => {
    // Truncate description to 50 words or less
    const truncateDescription = (text) => {
      if (!text) return 'No description available.';
      const words = text.split(' ');
      if (words.length <= 50) return text;
      return words.slice(0, 50).join(' ') + '...';
    };

    return {
      id: blog._id || blog.id,
      title: blog.title,
      image: blog.image || '/images/default-blog.jpg',
      description: truncateDescription(blog.summary || blog.description),
    };
  };

  const displayBlogs = blogs.map(formatBlogForDisplay);
  const radius = 160;
  const centerX = 200;
  const centerY = 200;

  // Calculate positions for circular arrangement
  const getItemPosition = (index, total) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y, angle };
  };

  const handleItemClick = (index) => {
    setSelectedIndex(index);
  };

  if (error && blogs.length === 0) {
    return (
      <section className="bg-white py-12 sm:py-20 px-4 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-4">
            Blogs & Articles
          </h2>
          <p className="text-red-500">
            Unable to load blogs at the moment. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 sm:py-20 px-4 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-2">
            Blogs & Articles
          </h2>
          <p className="text-gray-500 text-xs sm:text-base max-w-md mx-auto">
            Explore insights, guides, and deep dives into performance computing.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F47C5A]"></div>
          </div>
        )}

        {/* Circular Gallery */}
        {!loading && displayBlogs.length > 0 && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            {/* Circular Arrangement */}
            <div className="relative">
              <svg
                width="400"
                height="400"
                className="overflow-visible"
                viewBox="0 0 400 400"
              >
                {displayBlogs.map((blog, index) => {
                  const { x, y } = getItemPosition(index, displayBlogs.length);
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <g key={blog.id}>
                      {/* Blog Circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? "45" : "35"}
                        fill="white"
                        stroke={isSelected ? "#F47C5A" : "#E5E7EB"}
                        strokeWidth={isSelected ? "3" : "2"}
                        className="cursor-pointer transition-all duration-300 hover:stroke-[#F47C5A] filter drop-shadow-md"
                        onClick={() => handleItemClick(index)}
                      />
                      
                      {/* Blog Image */}
                      <foreignObject
                        x={x - (isSelected ? 40 : 30)}
                        y={y - (isSelected ? 40 : 30)}
                        width={isSelected ? "80" : "60"}
                        height={isSelected ? "80" : "60"}
                        className="cursor-pointer"
                        onClick={() => handleItemClick(index)}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              e.target.src = '/images/default-blog.jpg';
                            }}
                          />
                        </div>
                      </foreignObject>

                      {/* Blog Number */}
                      <text
                        x={x}
                        y={y + (isSelected ? 65 : 55)}
                        textAnchor="middle"
                        className="fill-gray-600 text-sm font-medium"
                      >
                        {index + 1}
                      </text>
                    </g>
                  );
                })}

                {/* Center Circle */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="60"
                  fill="#F47C5A"
                  className="filter drop-shadow-lg"
                />
                <text
                  x={centerX}
                  y={centerY - 10}
                  textAnchor="middle"
                  className="fill-white text-lg font-bold"
                >
                  BLOGS
                </text>
                <text
                  x={centerX}
                  y={centerY + 10}
                  textAnchor="middle"
                  className="fill-white text-sm"
                >
                  & ARTICLES
                </text>
              </svg>
            </div>

            {/* Selected Blog Details */}
            <div className="max-w-md">
              {displayBlogs[selectedIndex] && (
                <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
                  <div className="mb-4">
                    <img
                      src={displayBlogs[selectedIndex].image}
                      alt={displayBlogs[selectedIndex].title}
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src = '/images/default-blog.jpg';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {displayBlogs[selectedIndex].title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {displayBlogs[selectedIndex].description}
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#F47C5A] text-white font-semibold text-sm rounded-full shadow hover:bg-white hover:text-[#F47C5A] border border-[#F47C5A] transition duration-300">
                    Read More →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Dots */}
        {!loading && displayBlogs.length > 0 && (
          <div className="flex justify-center mt-8 gap-2">
            {displayBlogs.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'bg-[#F47C5A] scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayBlogs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No blogs available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-8 text-center">
          <a
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F47C5A] text-white font-semibold text-sm rounded-full shadow hover:bg-white hover:text-[#F47C5A] border border-[#F47C5A] transition duration-300"
          >
            View All Blogs →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blogs;