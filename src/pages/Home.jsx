import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import Card from "../components/Card";
import Hero from "../components/Hero";
import { Search, Filter, TrendingUp, Sparkles } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "../components/ui/Skeleton";

const Home = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { theme } = useContext(ThemeContext);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Group definitions
  const categoryGroups = {
    electronics: ['smartphones', 'laptops', 'tablets', 'mobile-accessories'],
    fashion: ['mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-shoes', 'womens-bags', 'tops', 'sunglasses'],
    watches: ['mens-watches', 'womens-watches'],
    beauty: ['fragrances', 'skin-care'],
  };

  // Main pill categories (High level)
  const mainCategories = ["all", "electronics", "fashion", "watches", "beauty"];
  
  // Get all unique categories from products for the "View More" section
  const allGranularCategories = [...new Set(state.products.map(p => p.category))];

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SET_QUERY", payload: query });
    }, 500);
    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleSearch = (e) => setQuery(e.target.value);

  // Advanced Filtering Logic
  const filteredProducts = state.products.filter(p => {
    if (activeCategory === "all") return true;

    // Check if activeCategory is a group
    if (categoryGroups[activeCategory]) {
      return categoryGroups[activeCategory].includes(p.category);
    }
    
    // Otherwise check for exact match (if user selected a granular category)
    return p.category === activeCategory;
  });

  return (
    <div className="pb-20">
      <Hero />

      {/* Categories & Search Header */}
      <section id="products" className="py-12 px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white mb-4">
              <TrendingUp size={12} /> Trending Now
            </p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-black dark:text-white">
              Our <br /> Products
            </h2>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col gap-10 flex-1 lg:max-w-4xl">
            {/* Search */}
            <div className={`w-full relative group border-b-2 transition-all ${theme === 'dark' ? 'border-white focus-within:border-white' : 'border-black focus-within:border-black'}`}>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-0">
                 <Search className="text-black dark:text-white transition-opacity opacity-40 group-focus-within:opacity-100" size={18} />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full bg-transparent py-4 pl-10 pr-4 outline-none text-sm font-bold uppercase tracking-[0.2em] text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-col gap-4">
              {/* Main Categories */}
              <div className="flex flex-wrap gap-4 scrollbar-hide">
                {mainCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setShowAllCategories(false); }}
                    className={`px-6 py-3 sm:px-10 sm:py-4 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all rounded-full border-2 ${
                      activeCategory === cat
                        ? "bg-white scale-95 text-black border-black dark:bg-black dark:text-white dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                        : "border-black dark:border-white opacity-40 hover:opacity-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                
                {/* View More Button */}
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className={`px-6 py-3 sm:px-10 sm:py-4 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all rounded-full border-2 border-black dark:border-white ${showAllCategories ? 'bg-black text-white dark:bg-white dark:text-black' : 'opacity-40 hover:opacity-100'}`}
                >
                  {showAllCategories ? "Hide Filters" : "View All"}
                </button>
              </div>

              {/* Granular Categories (Collapsible) */}
              <AnimatePresence>
                {showAllCategories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-3 pt-4">
                      {allGranularCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${
                            activeCategory === cat
                              ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                              : "border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {state.loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="premium-card aspect-[4/5] rounded-[2rem]" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, index) => (
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
          )}
        </div>

        {!state.loading && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="py-40 text-center"
          >
            <Sparkles className="mx-auto mb-6 opacity-10" size={64} />
            <p className="text-2xl font-black tracking-tighter uppercase opacity-20">No products found</p>
          </motion.div>
        )}
      </section>

      {/* Newsletter / Feature Section */}
      <section className="px-8 pb-12">
        <div className={`max-w-[1400px] mx-auto rounded-[3rem] overflow-hidden bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white`}>
          <div className="grid lg:grid-cols-2 gap-20 items-center p-8 lg:p-16">
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] mb-8 bg-white text-black px-4 py-1">
                Newsletter
              </span>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-12">
                Join our <br /> Community
              </h2>
              <p className="text-lg text-white/70 mb-14 max-w-md tracking-tight leading-relaxed">
                Stay updated with our latest releases and exclusive offers. 
                Sign up for our newsletter today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border-b border-white/40 py-5 outline-none flex-1 font-bold text-[11px] tracking-[0.1em] placeholder:text-white/40 focus:border-white transition-colors text-white"
                />
                <button className="btn-premium !bg-black !text-white dark:!bg-white dark:!text-black !border-transparent px-12">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden">
               <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="w-full h-full"
               >
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000" 
                  alt="Premium" 
                  className="w-full h-full object-cover grayscale brightness-50"
                />
               </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
