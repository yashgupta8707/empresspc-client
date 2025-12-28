// Enhanced Product Card with Professional Animations & 3D Effects
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const EnhancedProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      rotateY: 5,
      transition: { duration: 0.4 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 card-3d">

        {/* Badge */}
        {product.featured && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-4 left-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-r-full text-sm font-semibold shadow-lg"
          >
            Featured
          </motion.div>
        )}

        {/* Discount Badge */}
        {product.discount && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute top-4 right-4 z-10 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse-glow"
          >
            -{product.discount}%
          </motion.div>
        )}

        {/* Image Container */}
        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4"
            variants={imageVariants}
            animate={isHovered ? 'hover' : 'initial'}
          />

          {/* Quick View Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => onViewDetails(product)}
              className="bg-white text-gray-800 p-3 rounded-full hover-glow"
            >
              <Eye size={20} />
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full transition-colors ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.button>
          </motion.div>

          {/* Shimmer Effect */}
          <div className="absolute inset-0 hover-shine pointer-events-none" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="text-sm text-purple-600 font-semibold mb-2 uppercase tracking-wide">
            {product.category}
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ₹{product.price.toLocaleString()}
              </div>
              {product.originalPrice && (
                <div className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className={`text-sm font-semibold ${
              product.stock > 10 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>

          {/* Specifications Preview */}
          {product.specs && (
            <div className="mb-4 space-y-1">
              {product.specs.slice(0, 2).map((spec, index) => (
                <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-1 h-1 bg-purple-600 rounded-full" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          )}

          {/* Add to Cart Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              product.stock > 0
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover-shine'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={20} />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </div>

      {/* Floating Glow Effect */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

export default EnhancedProductCard;

// Usage Example:
/*
import EnhancedProductCard from './components/EnhancedProductCard';

const products = [
  {
    id: 1,
    name: "RTX 4090 Gaming Graphics Card",
    category: "Graphics Cards",
    price: 159999,
    originalPrice: 189999,
    discount: 15,
    image: "/path/to/image.jpg",
    rating: 4.5,
    reviews: 128,
    stock: 5,
    featured: true,
    specs: [
      "24GB GDDR6X Memory",
      "Boost Clock: 2520 MHz",
      "Ray Tracing Support"
    ]
  }
];

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(product => (
    <EnhancedProductCard
      key={product.id}
      product={product}
      onAddToCart={(product) => console.log('Add to cart:', product)}
      onViewDetails={(product) => console.log('View details:', product)}
    />
  ))}
</div>
*/
