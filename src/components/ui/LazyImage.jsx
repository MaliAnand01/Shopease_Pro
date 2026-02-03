import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "./Skeleton";

const LazyImage = ({ src, alt, className, containerClassName }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-black/5 dark:bg-white/5 ${containerClassName}`}>
      {/* Background Skeleton/Placeholder */}
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10"
          >
            <Skeleton className="w-full h-full rounded-none" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Kinetic Image */}
      <motion.img
        initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 1.1,
          filter: isLoaded ? "blur(0px)" : "blur(10px)"
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1
        }}
        src={hasError ? "https://dummyjson.com/image/400x400/000000/ffffff?text=No+Image" : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} w-full h-full object-cover transition-all`}
      />
    </div>
  );
};

export default LazyImage;
