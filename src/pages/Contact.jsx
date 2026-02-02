import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen pt-0 pb-24 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-[1400px] mx-auto px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">Get in Touch</span>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
            Contact <br /> Us
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-start gap-8">
                <div className="p-4 rounded-2xl border-2 border-black dark:border-white">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Email</p>
                  <p className="text-xl font-black uppercase">hello@shopease.com</p>
                </div>
              </div>

              <div className="flex items-start gap-8">
                <div className="p-4 rounded-2xl border-2 border-black dark:border-white">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Phone</p>
                  <p className="text-xl font-black uppercase">+1 (888) 000-SHOP</p>
                </div>
              </div>

              <div className="flex items-start gap-8">
                <div className="p-4 rounded-2xl border-2 border-black dark:border-white">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Address</p>
                  <p className="text-xl font-black uppercase">7th Avenue, New York, NY</p>
                </div>
              </div>
            </div>

            <div className="p-10 border-2 border-black dark:border-white rounded-[2rem] bg-white dark:bg-black shadow-xl">
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Support</h3>
               <p className="text-sm font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                 Our team is here to help 24/7. Average response time: <span className="text-black dark:text-white opacity-100">{'< 4 Hours'}</span>.
               </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-12 border-2 border-black dark:border-white rounded-[3rem] bg-white dark:bg-black shadow-2xl">
            <form className="space-y-10">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Identifier</label>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-4 outline-none font-bold text-xs tracking-widest uppercase transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Return Protocol</label>
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-4 outline-none font-bold text-xs tracking-widest uppercase transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Brief Message</label>
                <textarea 
                  rows="4"
                  placeholder="How can we assist?"
                  className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-4 outline-none font-bold text-xs tracking-widest uppercase transition-all resize-none"
                ></textarea>
              </div>

              <button className="btn-premium w-full flex items-center justify-center gap-4 !py-6">
                Transmit Inquiry <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
