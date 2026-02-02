import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

const Hero = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <section className="relative overflow-hidden bg-white dark:bg-black border-b-2 border-black dark:border-white transition-colors duration-500 pt-12 pb-32">
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.5em] text-black dark:text-white mb-8">
            Special Selection
          </span>
          
          <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] text-black dark:text-white mb-10">
            New <br /> 
            <span className="italic font-light opacity-50">Arrivals</span>
          </h1>

          <p className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-black dark:text-white mb-12 max-w-xl mx-auto leading-relaxed">
            Discover our latest selection of handpicked products <br className="hidden md:block"/> designed for the modern minimal explorer.
          </p>

          <div className="flex items-center justify-center">
            <a href="#products" className="btn-premium px-16 !py-5">
              Shop Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
