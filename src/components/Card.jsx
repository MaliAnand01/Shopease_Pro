import React, { memo, useContext } from "react";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import LazyImage from "./ui/LazyImage";

const Card = ({
  image,
  title,
  tag1,
  price,
  brand,
  rating,
  pId,
  product,
}) => {
  const { addItem } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product) {
      addItem(product, 1);
    } else {
      addItem({ id: pId, title, price, thumbnail: image, brand }, 1);
    }
    toast.success("Added to cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col w-full premium-card card-hover-shadow transition-all duration-500 bg-white dark:bg-black border-2 border-black dark:border-white`}
    >
      {/* Image Container */}
      <Link to={`/product/${pId}`} className="relative aspect-square w-full overflow-hidden bg-transparent border-b-2 border-black dark:border-white">
        <LazyImage
          src={image}
          alt={title}
          className="p-10 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
        />
        
        {/* Top Tag */}
        {tag1 && (
          <div className={`absolute top-6 left-6 text-[9px] font-black uppercase px-4 py-2 tracking-[0.2em] border-2 rounded-full ${
            theme === "dark" ? "bg-white text-black border-white" : "bg-black text-white border-black"
          }`}>
            {tag1}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black dark:text-white">{brand}</p>
          <div className={`flex items-center gap-1.5 text-[10px] font-black tracking-widest px-3 py-1 border-2 border-black dark:border-white rounded-lg`}>
            <Star size={10} className="fill-current" /> {rating}
          </div>
        </div>
        
        <Link to={`/product/${pId}`} className="group/title">
          <h3 className="text-xl font-black tracking-tighter uppercase mb-8 group-hover/title:opacity-60 transition-opacity line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>
        </Link>

        <div className="mt-auto space-y-8">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black tracking-tighter">${price}</p>
            <ArrowRight size={24} className="text-black dark:text-white opacity-20 group-hover:opacity-100 group-active:opacity-100 transition-opacity" />
          </div>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="btn-premium w-full !py-6 text-center flex items-center justify-center gap-4 group/btn shadow-[0_4px_0_0_rgba(0,0,0,1)] dark:shadow-[0_4px_0_0_rgba(255,255,255,1)] active:shadow-none active:translate-y-[2px] transition-all"
          >
            <ShoppingCart size={18} />
            <span className="text-[11px] font-black uppercase tracking-widest">Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(Card);
