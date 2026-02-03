import React from "react";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
      <div className="flex flex-col items-center gap-12">
        {/* Kinetic Geometric Loader */}
        <div className="relative flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ height: 20 }}
              animate={{ height: [20, 48, 20] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="w-1.5 bg-black dark:bg-white rounded-full"
            />
          ))}
        </div>
        
        {/* Minimalist System Status */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[9px] font-black uppercase tracking-[0.6em] text-black dark:text-white"
          >
            Establishing Link
          </motion.div>
          <div className="h-[1px] w-32 bg-black/10 dark:bg-white/10 relative overflow-hidden">
             <motion.div 
               animate={{ x: ["-100%", "100%"] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-0 bg-black dark:bg-white w-1/2"
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
