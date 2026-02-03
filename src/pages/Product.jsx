import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star, ShoppingCart, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { ProductContext } from "../context/ProductContext";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Skeleton from "../components/ui/Skeleton";
import LazyImage from "../components/ui/LazyImage";

const Product = () => {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const { state } = useContext(ProductContext);

  useEffect(() => {
    if (state.products.length > 0) {
      const foundProduct = state.products.find((p) => p.id === Number(id));
      setProduct(foundProduct || {});
    }
  }, [id, state.products]);

  if (!product?.id) {
    return (
      <div className="min-h-screen pt-32 pb-32 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <Skeleton className="aspect-square w-full rounded-[3rem]" />
          <div className="space-y-8 mt-12">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className={`min-h-screen pt-0 pb-32 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={16} /> Back to Collection
        </button>

        <div className="grid lg:grid-cols-2 gap-24 items-start">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`aspect-square w-full flex items-center justify-center p-12 rounded-[3rem] overflow-hidden bg-white dark:bg-black border-2 border-black dark:border-white shadow-2xl relative`}
          >
            <LazyImage
              src={product.images?.[0] || product.thumbnail}
              alt={product.title}
              className="w-full h-full"
              containerClassName="w-full h-full"
            />
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 mb-4 block">
              {product.brand}
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-10 leading-[0.85] text-black dark:text-white">
              {product.title}
            </h1>

            <div className="flex items-center gap-8 mb-10 pb-10 border-b-2 border-black dark:border-white">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-black dark:border-white">
                <Star size={12} className="fill-current text-black dark:text-white" />
                <span className="text-[10px] font-black tracking-widest">{product.rating}</span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">
                Availability: <span className="text-black dark:text-white opacity-100">{product.stock > 0 ? "In Stock" : "Limited Piece"}</span>
              </p>
            </div>

            <p className="text-base md:text-lg opacity-50 leading-relaxed mb-12 max-w-xl tracking-tight">
              {product.description}
            </p>

            <div className="mb-14">
              <p className="text-6xl font-black tracking-tighter mb-4">${product.price}</p>
              {product.discountPercentage && (
                <div className="inline-block px-3 py-1 bg-black dark:bg-white rounded-full">
                   <p className="text-[9px] font-black uppercase tracking-widest text-white dark:text-black">
                    - {product.discountPercentage}% Final Sale
                  </p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-4 mb-14">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black dark:text-white opacity-40">Quantity Selector</p>
              <div className="flex items-center w-fit rounded-2xl border-2 border-black dark:border-white overflow-hidden">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-8 py-5 font-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  -
                </button>
                <div className="px-10 font-black text-sm w-24 text-center">{quantity}</div>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-8 py-5 font-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-6 mb-20">
              <button
                onClick={handleAddToCart}
                className="btn-premium flex-1 !py-6"
              >
                Add to Bag
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-premium flex-1 !py-6 !bg-transparent !text-current transition-colors border-2 border-black dark:border-white hover:!bg-black dark:hover:!bg-white hover:!text-white dark:hover:!text-black"
              >
                Instant Selection
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-16 border-t-2 border-black dark:border-white">
              <div className="flex flex-col items-start gap-4">
                <Truck size={20} className="opacity-50" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60 text-black dark:text-white">Global <br /> Curated Delivery</p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <ShieldCheck size={20} className="opacity-50" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60 text-black dark:text-white">Certified <br /> Authenticity</p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <RefreshCw size={20} className="opacity-50" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-60 text-black dark:text-white">Seamless <br /> Exchanges</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Product;
