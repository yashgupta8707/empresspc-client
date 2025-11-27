// Fixed EditorsChoice.jsx - Remove JSX style tag
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { blogAPI } from "../services/api";

export default function EditorsChoice() {
  const scrollRef = useRef(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [editorPosts, setEditorPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEditorsChoiceBlogs();
  }, []);

  const fetchEditorsChoiceBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getEditorsChoiceBlogs();
      setEditorPosts(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching editors choice blogs:', err);
      // Set fallback data on error
      setEditorPosts(fallbackPosts);
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
  const fallbackPosts = [
    {
      _id: 'fallback-1',
      category: "Mobile",
      title: "Using Automated Test Results To Improve",
      publishedAt: new Date().toISOString(),
      image: "/images/img2.JPG",
    },
    {
      _id: 'fallback-2',
      category: "Gadget",
      title: "How To Search For A Developer Job Abroad",
      publishedAt: new Date().toISOString(),
      image: "/images/img3.JPG",
    },
    {
      _id: 'fallback-3',
      category: "Technology",
      title: "New Smashing Front-End & UX Workshops",
      publishedAt: new Date().toISOString(),
      image: "/images/img4.JPG",
    },
    {
      _id: 'fallback-4',
      category: "News",
      title: "Exploring the Future of Augmented Reality",
      publishedAt: new Date().toISOString(),
      image: "/images/img5.JPG",
    },
    {
      _id: 'fallback-5',
      category: "Design",
      title: "Top Figma Plugins for Productivity in 2024",
      publishedAt: new Date().toISOString(),
      image: "/images/img6.JPG",
    },
    {
      _id: 'fallback-6',
      category: "AI",
      title: "How GPT is Changing the Landscape of Content Creation",
      publishedAt: new Date().toISOString(),
      image: "/images/img7.JPG",
    },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth - el.clientWidth;
    const percent = (scrollLeft / scrollWidth) * 100;
    setScrollPercent(scrollWidth > 0 ? percent : 0);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <section className="py-4 px-4 md:px-10 bg-white text-black">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-md md:text-2xl font-bold text-gray-900">Editors Choice</h2>
            <div className="relative mt-1 h-[3px] w-32 bg-gray-200 overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-pink-500 w-0" />
            </div>
          </div>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      </section>
    );
  }

  const postsToShow = editorPosts.length > 0 ? editorPosts : fallbackPosts;

  return (
    <section className="py-4 px-4 md:px-10 bg-white text-black">
      {/* CSS Styles */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-md md:text-2xl font-bold text-gray-900">Editors Choice</h2>
          <div className="relative mt-1 h-[3px] w-32 bg-gray-200 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-pink-500 transition-all duration-300"
              style={{ width: `${scrollPercent}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="border p-2 hover:bg-gray-100 transition rounded"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="border p-2 hover:bg-gray-100 transition rounded"
            disabled={loading}
          >
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4 text-sm">
          Could not load editors choice blogs. Showing sample content.
        </div>
      )}

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-6 no-scrollbar"
      >
        {postsToShow.map((post) => (
          <div
            key={post._id}
            className="min-w-[260px] md:min-w-[360px] bg-white shadow-sm border border-gray-200 flex overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
          >
            {/* Image */}
            <img
              src={post.image}
              alt={post.title}
              className="w-[90px] md:w-1/3 h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/placeholder-blog.jpg';
                e.target.onerror = null;
              }}
            />

            {/* Text */}
            <div className="p-3 md:p-4 w-full md:w-2/3 flex flex-col justify-between">
              <span className="text-xs w-fit border border-gray-300 px-2 py-0.5 text-gray-500 font-medium mb-2 inline-block uppercase">
                {post.category}
              </span>
              <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Retry button for errors */}
      {error && (
        <div className="text-center mt-4">
          <button
            onClick={fetchEditorsChoiceBlogs}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Try loading again
          </button>
        </div>
      )}
    </section>
  );
}