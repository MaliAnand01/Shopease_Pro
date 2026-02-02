import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, X } from "lucide-react";
import confetti from "canvas-confetti";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const OrderSuccessModal = () => {
  const { theme } = useContext(ThemeContext);
  const { showOrderSuccess, setShowOrderSuccess, recentOrder } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (showOrderSuccess) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        const colors = ['#000000', '#ffffff', '#888888', '#cccccc'];
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: colors
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: colors
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showOrderSuccess]);

  const handleClose = () => {
    setShowOrderSuccess(false);
  };

  const handleReviewOrders = () => {
    setShowOrderSuccess(false);
    navigate("/account");
  };

  return (
    <AnimatePresence>
      {showOrderSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 dark:bg-white/10 backdrop-blur-2xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className={`relative max-w-lg w-full p-12 overflow-hidden border-2 border-black dark:border-white shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-[3rem] ${
              theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {/* Branding Top */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.6em] opacity-20">
              SHOPEASE
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity"
            >
              <X size={20} />
            </button>

            <div className="text-center pt-8">
              <div className="relative mb-10 inline-block">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                    theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  <CheckCircle2 size={28} />
                </motion.div>
              </div>

              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-[0.8]">
                Thank You <br />
                <span className="opacity-20 italic font-light">for your purchase</span>
              </h2>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-10">
                Your order is confirmed and <br /> being prepared for shipment.
              </p>

              <div className="space-y-4 mb-10">
                <div className="inline-block px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">
                  Order ID: {recentOrder?.id || "PROCESSING..."}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleClose}
                  className="btn-premium !py-6 flex items-center justify-center gap-4 transition-all"
                >
                  Continue Shopping <ShoppingBag size={14} />
                </button>
                <button
                  onClick={handleReviewOrders}
                  className="btn-premium !py-6 !bg-transparent !text-current border border-black/10 dark:border-white/10 hover:!bg-black dark:hover:!bg-white hover:!text-white dark:hover:!text-black transition-all flex items-center justify-center gap-4"
                >
                  Review Orders <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessModal;
