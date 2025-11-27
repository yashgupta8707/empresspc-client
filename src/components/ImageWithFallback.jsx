// // Create this new component: components/ImageWithFallback.jsx
// import { useState } from 'react';

// const ImageWithFallback = ({ 
//   src, 
//   alt, 
//   className = "", 
//   fallbackSrc = "/images/placeholder-blog.jpg",
//   ...props 
// }) => {
//   const [imgSrc, setImgSrc] = useState(src);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);

//   const handleError = () => {
//     if (imgSrc !== fallbackSrc) {
//       setImgSrc(fallbackSrc);
//       setHasError(false);
//     } else {
//       setHasError(true);
//     }
//     setIsLoading(false);
//   };

//   const handleLoad = () => {
//     setIsLoading(false);
//     setHasError(false);
//   };

//   if (hasError) {
//     return (
//       <div className={`bg-gray-200 flex items-center justify-center ${className}`} {...props}>
//         <div className="text-gray-400 text-center p-4">
//           <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//           </svg>
//           <span className="text-xs">No Image</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {isLoading && (
//         <div className={`bg-gray-200 animate-pulse ${className}`} {...props} />
//       )}
//       <img
//         src={imgSrc}
//         alt={alt}
//         className={`${className} ${isLoading ? 'hidden' : 'block'}`}
//         onError={handleError}
//         onLoad={handleLoad}
//         {...props}
//       />
//     </>
//   );
// };

// export default ImageWithFallback;

import React, { useState } from 'react';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/images/placeholder-product.jpg',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imageSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;