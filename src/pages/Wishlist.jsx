import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { ProductContext } from "../context/ProductContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import Card from "../components/Card";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Wishlist = () => {
    const { wishlistProductIds, clearWishlist } = useContext(WishlistContext);
    const { state: productState } = useContext(ProductContext);
    const { addItem } = useContext(CartContext);
    const { theme } = useContext(ThemeContext);

    const wishlistedProducts = productState.products.filter(p => wishlistProductIds.includes(p.id));

    const handleAddAllToCart = () => {
        if (wishlistedProducts.length === 0) return;
        
        wishlistedProducts.forEach(product => {
            addItem(product, 1);
        });
        toast.success(`Added ${wishlistedProducts.length} items to bag`);
    };

    return (
        <div className={`min-h-screen pb-32 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-[1400px] mx-auto px-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
                >
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 mb-6 transition-opacity">
                            <ArrowLeft size={12} /> Continue Exploring
                        </Link>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                            Saved <br /> Selections
                        </h1>
                    </div>
                    
                    {wishlistedProducts.length > 0 && (
                        <div className="flex gap-4">
                            <button 
                                onClick={clearWishlist}
                                className="px-8 py-4 border-2 border-black/10 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black dark:hover:border-white transition-all"
                            >
                                Clear All
                            </button>
                            <button 
                                onClick={handleAddAllToCart}
                                className="btn-premium flex items-center gap-3 px-10 py-4 bg-black text-white dark:bg-white dark:text-black"
                            >
                                <ShoppingBag size={16} /> Add All To Bag
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Grid */}
                {wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        <AnimatePresence mode="popLayout">
                            {wishlistedProducts.map((p) => (
                                <Card
                                    key={p.id}
                                    image={p.images?.[0] || p.thumbnail}
                                    brand={p.brand}
                                    title={p.title}
                                    price={p.price}
                                    rating={p.rating}
                                    tag1={p.category}
                                    pId={p.id}
                                    product={p}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="py-40 text-center flex flex-col items-center"
                    >
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-black/20 dark:border-white/20 flex items-center justify-center mb-8">
                            <Heart className="opacity-10" size={40} />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">Your wishlist is empty</h2>
                        <p className="text-sm opacity-40 max-w-xs mb-10 font-bold uppercase tracking-widest">
                            Save items you love to keep track of them and find them easily later.
                        </p>
                        <Link to="/" className="btn-premium px-12 py-4 bg-black text-white dark:bg-white dark:text-black">
                            Discover Products
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
