// Interactive 3D Card with Tilt Effect
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Interactive3DCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth mouse tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring configuration for smooth, natural movement
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (event) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -0.5 to 0.5 range
    const normalizedX = (event.clientX - centerX) / (rect.width / 2);
    const normalizedY = (event.clientY - centerY) / (rect.height / 2);

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-2xl"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div style={{ transform: 'translateZ(50px)' }}>{children}</div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${x.get() * 50 + 50}% ${
            y.get() * 50 + 50
          }%, rgba(255,255,255,0.2), transparent 50%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
      />
    </motion.div>
  );
};

export default Interactive3DCard;

// Usage Example:
/*
<Interactive3DCard className="max-w-md mx-auto">
  <div className="bg-white rounded-2xl p-8 shadow-xl">
    <h2 className="text-2xl font-bold mb-4">3D Interactive Card</h2>
    <p>Hover over me to see the 3D tilt effect!</p>
  </div>
</Interactive3DCard>
*/
