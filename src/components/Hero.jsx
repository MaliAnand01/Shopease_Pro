import React, { useContext, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import LazyImage from "./ui/LazyImage";

// Floating Card Component
const FloatingCard = ({ src, title, price, className, depth, mouseX, mouseY }) => {
  const x = useTransform(mouseX, [0, 1], [-20 * depth, 20 * depth]);
  const y = useTransform(mouseY, [0, 1], [-20 * depth, 20 * depth]);
  
  return (
    <motion.div 
      style={{ x, y }}
      className={`absolute p-4 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl ${className}`}
    >
      <LazyImage 
        src={src} 
        alt={title} 
        className="w-full h-32 md:h-48"
        containerClassName="rounded-2xl mb-3" 
      />
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-black dark:text-white mb-1">{title}</h3>
        <p className="text-[10px] font-bold opacity-60 text-black dark:text-white">{price}</p>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const { theme } = useContext(ThemeContext);
  const ref = useRef(null);
  
  // Mouse Position for Parallax
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section 
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-500 -mt-10"
    >
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10 transition-opacity duration-500">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} 
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-0 -left-20 w-[600px] h-[600px] bg-gray-300 dark:bg-gray-800 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-40 right-0 w-[500px] h-[500px] bg-gray-400 dark:bg-gray-700 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }} 
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gray-200 dark:bg-gray-900 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Typography Content */}
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="overflow-hidden mb-6">
             <motion.span 
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               transition={{ duration: 1, delay: 0.2 }}
               className="inline-block px-4 py-2 border border-black dark:border-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-black dark:text-white"
             >
               New Collection 2026
             </motion.span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-black dark:text-white mb-10">
            <span className="block overflow-hidden">
                <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="block">Pure</motion.span>
            </span>
            <span className="block overflow-hidden">
                <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="block text-black/50 dark:text-white/50">Aesthetic</motion.span>
            </span>
            <span className="block overflow-hidden">
                <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="block opacity-30">Future</motion.span>
            </span>
          </h1>

          <p className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-black dark:text-white mb-12 max-w-md leading-relaxed opacity-70">
            Experience the next generation of digital commerce. Curated for the minimal explorer.
          </p>

          <div className="flex gap-4">
            <a href="#products" className="btn-premium px-10 py-4 flex items-center gap-4 bg-black text-white dark:bg-white dark:text-black group">
              Start Exploring <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </a>
          </div>
        </motion.div>

        {/* Floating Kinetic Cards (Desktop Only mostly) */}
        <div className="relative h-[600px] hidden lg:block perspective-[1000px]">
           {/* Card 1: Watch (Back) */}
           <FloatingCard 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600"
              title="Classic Chrono"
              price="$1,299.00"
              className="top-20 right-20 w-64 rotate-[15deg] z-10"
              depth={1}
              mouseX={mouseX}
              mouseY={mouseY}
           />
           {/* Card 2: Perfume (Middle) */}
           <FloatingCard 
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600"
              title="Midnight Scent"
              price="$149.00"
              className="bottom-40 left-20 w-56 -rotate-[10deg] z-20"
              depth={2}
              mouseX={mouseX}
              mouseY={mouseY}
           />
           {/* Card 3: Shoe (Front) */}
           <FloatingCard 
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600"
              title="Velocity X"
              price="$299.00"
              className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 rotate-[5deg] z-30"
              depth={3}
              mouseX={mouseX}
              mouseY={mouseY}
           />
        </div>
      </div>
    </section>
  );
};
export default Hero;
