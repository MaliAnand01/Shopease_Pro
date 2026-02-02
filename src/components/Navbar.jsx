import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingCart, Sun, Moon, User, LogOut, Settings } from "lucide-react";
import logo from "../assets/logo.png";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState("login");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { totalItems } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openAuthModal = (view = "login") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  // Admin Links
  if (user?.role === "admin") {
    navLinks.push(
      { name: "Dashboard", path: "/admin" },
      { name: "Orders", path: "/admin/orders" }
    );
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white dark:bg-black border-b-2 border-black dark:border-white ${
          isScrolled ? "py-2" : "py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="relative z-10 group">
            <img
              src={logo}
              alt="ShopEase"
              className="h-8 transition-all duration-300 dark:invert group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:opacity-100 ${
                      isActive ? "opacity-100" : "opacity-40"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="h-4 w-px bg-black dark:bg-white opacity-20 mx-2" />

            <div className="flex items-center gap-8">
              <button 
                onClick={toggleTheme} 
                className="p-2 border border-black dark:border-white rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 active:scale-90"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              <Link 
                to="/cart" 
                className="relative p-2 border border-black dark:border-white rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 active:scale-90"
              >
                <ShoppingCart size={14} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white dark:border-black">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                    className="p-2 border border-black dark:border-white rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500 active:scale-90"
                  >
                    <User size={14} />
                  </button>

                  {isAccountDropdownOpen && (
                    <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                      <div className="p-4 border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Authenticated as</p>
                        <p className="text-[10px] font-bold truncate">{user.fullName}</p>
                      </div>
                      
                      <Link 
                        to="/account" 
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 w-full px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        <Settings size={12} /> Account
                      </Link>
                      
                      <button 
                        onClick={() => {
                          logoutUser();
                          setIsAccountDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all border-t border-black/5 dark:border-white/5"
                      >
                        <LogOut size={12} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal("login")}
                  className="btn-premium"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="relative p-3">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 bg-black/5 dark:bg-white/5 rounded-xl ml-2 active:bg-black active:text-white dark:active:bg-white dark:active:text-black transition-colors"
            >
              <Menu size={26} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="fixed inset-0 bg-white dark:bg-black z-[100] md:hidden flex flex-col pt-32 px-10"
            >
              {/* Internal Close Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-10 right-10 p-4 bg-black/5 dark:bg-white/5 rounded-2xl border-2 border-black dark:border-white transition-all"
              >
                <X size={24} />
              </motion.button>

              <div className="flex flex-col gap-5">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30 mb-4">Navigation</p>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => 
                        `text-4xl font-black uppercase tracking-tighter leading-none transition-all ${
                          isActive ? "opacity-100" : "opacity-30 hover:opacity-100"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto pb-16 space-y-12">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-full h-px bg-black/10 dark:bg-white/10"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-6">
                    <motion.button 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleTheme} 
                      className="p-5 border-2 border-black dark:border-white rounded-2xl flex items-center justify-center bg-black/5 dark:bg-white/5"
                    >
                      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    {user && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="p-5 border-2 border-black dark:border-white rounded-2xl flex items-center justify-center bg-black/5 dark:bg-white/5 text-current">
                          <User size={20} />
                        </Link>
                      </motion.div>
                    )}
                  </div>

                  {!user && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openAuthModal("login")}
                      className="btn-premium !py-5 !px-10"
                    >
                      Login
                    </motion.button>
                  )}
                </div>

                {user ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/"
                      className="btn-premium w-full text-center inline-block !py-5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Start Shopping
                    </Link>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openAuthModal("signup")}
                    className="btn-premium w-full !py-5"
                  >
                    Join ShopEase
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={authModalView}
      />
    </>
  );
};

export default Navbar;
