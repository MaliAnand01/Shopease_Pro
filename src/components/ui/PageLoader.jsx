import React from "react";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Brand Logo/Icon */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 border-4 border-black dark:border-white rounded-full opacity-20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 border-t-4 border-black dark:border-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-black dark:text-white"
        >
          Loading Experience
        </motion.p>
      </div>
    </div>
  );
};

export default PageLoader;
