import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className="py-12 border-t-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-sm">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Shopease.</h3>
          <p className="text-sm opacity-40 leading-relaxed font-medium uppercase tracking-widest">
            A New Standard in Modern Commerce. Curating the finest pieces for the minimal lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Shop</h4>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">New Arrivals</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">All Products</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Featured</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Service</h4>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">FAQ</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Shipping</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Return Policy</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Social</h4>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Instagram</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Twitter</a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-10 border-t border-current opacity-10 flex justify-between items-center overflow-hidden">
        <p className="text-[8px] font-black uppercase tracking-[0.5em]">&copy; 2026 SHOPEASE. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 text-[8px] font-black uppercase tracking-[0.5em]">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
