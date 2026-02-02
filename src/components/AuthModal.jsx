import React, { useState, useContext } from "react";
import { X, Mail, Lock, User, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose, initialView = "login" }) => {
  const [view, setView] = useState(initialView);
  const { loginUser, registerUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
  });

  const watchPassword = watch("password");

  const handleRegister = async (data) => {
    try {
      await registerUser(data);
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (data) => {
    try {
      await loginUser(data);
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    const normalizedData = { ...data, email: data.email.toLowerCase() };

    if (view === "login") {
      await handleLogin(normalizedData);
    } else {
      await handleRegister(normalizedData);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 cursor-pointer" 
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-black border-2 border-black dark:border-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 bg-black/5 dark:bg-white/5 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
          >
            <X size={18} />
          </motion.button>

          <div className="flex-1 overflow-y-auto p-8 pt-16 scrollbar-hide">
            <div className="mb-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2 text-black dark:text-white">ShopEase Store</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none text-black dark:text-white">
                {view === "login" ? "Welcome \nBack" : "Create \nAccount"}
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {view === "signup" && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-2">Full Name</label>
                  <input
                    {...register("fullName", { required: "Name is required" })}
                    type="text"
                    placeholder="John Doe"
                    className={`w-full bg-transparent border-b-2 py-3 px-4 outline-none transition-all font-bold text-[11px] tracking-[0.1em] uppercase placeholder:text-black/20 dark:placeholder:text-white/20 ${
                      theme === "dark" ? "border-white/20 focus:border-white" : "border-black/20 focus:border-black"
                    }`}
                  />
                  {errors.fullName && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.fullName.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-2">Email Address</label>
                <input
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                  })}
                  type="email"
                  placeholder="EMAIL@EXAMPLE.COM"
                  className={`w-full bg-transparent border-b-2 py-3 px-4 outline-none transition-all font-bold text-[11px] tracking-[0.1em] placeholder:text-black/20 dark:placeholder:text-white/20 ${
                    theme === "dark" ? "border-white/20 focus:border-white" : "border-black/20 focus:border-black"
                  }`}
                />
                {errors.email && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.email.message}</p>}
              </div>

              {view === "signup" && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-2">Phone Number</label>
                  <input
                    {...register("phone", { required: "Phone is required" })}
                    type="tel"
                    placeholder="+1 234 567 890"
                    className={`w-full bg-transparent border-b-2 py-3 px-4 outline-none transition-all font-bold text-[11px] tracking-[0.1em] uppercase placeholder:text-black/20 dark:placeholder:text-white/20 ${
                      theme === "dark" ? "border-white/20 focus:border-white" : "border-black/20 focus:border-black"
                    }`}
                  />
                  {errors.phone && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.phone.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-2">Password</label>
                <input
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" }
                  })}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-transparent border-b-2 py-3 px-4 outline-none transition-all font-bold text-[11px] tracking-[0.1em] placeholder:text-black/20 dark:placeholder:text-white/20 ${
                    theme === "dark" ? "border-white/20 focus:border-white" : "border-black/20 focus:border-black"
                  }`}
                />
                {errors.password && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.password.message}</p>}
              </div>

              {view === "signup" && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-2">Confirm Password</label>
                  <input
                    {...register("cnfPassword", { 
                      required: "Please confirm password",
                      validate: val => val === watchPassword || "Passwords do not match"
                    })}
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-transparent border-b-2 py-3 px-4 outline-none transition-all font-bold text-[11px] tracking-[0.1em] uppercase placeholder:text-black/20 dark:placeholder:text-white/20 ${
                      theme === "dark" ? "border-white/20 focus:border-white" : "border-black/20 focus:border-black"
                    }`}
                  />
                  {errors.cnfPassword && <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest ml-4">{errors.cnfPassword.message}</p>}
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-premium w-full mt-8 !py-5 text-[11px] tracking-[0.2em] font-black rounded-xl"
              >
                {view === "login" ? "CONTINUE TO STORE" : "JOIN COMMUNITY"}
              </motion.button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-black/5 dark:border-white/5">
              {view === "login" ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                  New to ShopEase?{" "}
                  <button
                    onClick={() => { setView("signup"); reset(); }}
                    className="text-black dark:text-white underline underline-offset-4 opacity-100 hover:opacity-60 transition-opacity"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                  Already a member?{" "}
                  <button
                    onClick={() => { setView("login"); reset(); }}
                    className="text-black dark:text-white underline underline-offset-4 opacity-100 hover:opacity-60 transition-opacity"
                  >
                    Login Now
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
