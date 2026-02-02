import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Cart = () => {
  const { items, totalPrice, totalItems, removeItem, updateQuantity, clearCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto mb-8 opacity-10" />
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Cart is empty</h2>
          <Link
            to="/"
            className="btn-premium inline-block !px-12 !py-5"
          >
            Start Shipping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-0 pb-24 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-[1400px] mx-auto px-8 mt-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white mb-4 block">Shopping Cart</span>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-black dark:text-white">
              Your <br /> Items
            </h1>
          </motion.div>
          <div className="flex items-center gap-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black dark:text-white">
              Total items: <span className="font-black">{totalItems}</span>
            </p>
            <button onClick={clearCart} className="text-[10px] font-bold uppercase tracking-[0.2em] text-black dark:text-white hover:opacity-60 transition-all underline underline-offset-4">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-10">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 py-8 border-b-2 border-black/10 dark:border-white/10 transition-colors duration-500`}
                >
                  <div className="flex items-center gap-6 flex-1 w-full">
                    {/* Thumbnail */}
                    <Link to={`/product/${item.id}`} className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex items-center justify-center p-3 border-2 border-black dark:border-white bg-white dark:bg-black">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                    </Link>

                    {/* Brand & Title Stacked */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 mb-1">{item.brand}</p>
                      <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-tight truncate">{item.title}</h3>
                      <p className="sm:hidden text-lg font-black tracking-tighter mt-1">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Desktop Price */}
                  <div className="hidden sm:block text-right px-4">
                    <p className="text-xl font-black tracking-tighter">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8">
                    {/* Quantity Controls */}
                    <div className="flex items-center rounded-xl border-2 border-black dark:border-white overflow-hidden bg-white dark:bg-black">
                      <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                        className="p-4 sm:px-4 sm:py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        <Minus size={12} />
                      </motion.button>
                      <span className="px-4 text-[12px] font-black w-8 text-center">{item.quantity}</span>
                      <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="p-4 sm:px-4 sm:py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-xl sm:text-2xl font-black tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)} 
                        className="p-2 -mr-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className={`premium-card p-12 sticky top-32 transition-colors duration-500 scale-100 bg-white dark:bg-black border border-black/10 dark:border-white/10`}>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] mb-12 text-black dark:text-white">Order Summary</h2>
              
              <div className="space-y-8 mb-12 pb-12 border-b border-black/10 dark:border-white/10">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-black dark:text-white">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-black dark:text-white">
                  <span>Shipping</span>
                  <span className="font-black">Free</span>
                </div>
              </div>
 
              <div className="flex justify-between items-end mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-black dark:text-white">Total</span>
                <span className="text-5xl font-black tracking-tighter text-black dark:text-white">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-premium w-full !py-6 flex items-center justify-center gap-4"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
