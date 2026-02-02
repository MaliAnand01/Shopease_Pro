import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

const About = () => {
  const { theme } = useContext(ThemeContext);
  
  const brandLogos = [
    "https://cdn-icons-png.flaticon.com/512/732/732084.png",
    "https://cdn-icons-png.flaticon.com/128/732/732160.png",
    "https://cdn-icons-png.flaticon.com/128/5969/5969002.png",
    "https://cdn-icons-png.flaticon.com/128/49/49004.png",
    "https://cdn-icons-png.flaticon.com/128/0/747.png",
    "https://cdn-icons-png.flaticon.com/128/6033/6033713.png",
  ];

  const pillars = [
    {
      title: "Material Integrity",
      desc: "Every artifact in our collection undergoes rigorous structural verification for long-term operational resilience."
    },
    {
      title: "Logistic Velocity",
      desc: "Optimized distribution channels ensure minimum latency between selection and physical acquisition."
    },
    {
      title: "24/7 Concierge",
      desc: "A dedicated support infrastructure providing continuous assistance for a seamless user experience."
    }
  ];

  return (
    <div className={`min-h-screen pt-0 pb-16 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 block">Foundation</span>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
            The <br /> Collective
          </h1>
        </motion.div>

        {/* Mission / Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Mission Blueprint</h2>
            <p className="text-sm md:text-base font-bold uppercase tracking-[0.1em] leading-relaxed opacity-60">
              ShopEase is an architectural e-commerce project designed for simplified living. We identify the intersection of utility and minimalism, curating objects that define the modern environment. Our philosophy is rooted in the removal of the superfluous.
            </p>
          </div>
          
          <div className="p-12 border-2 border-black dark:border-white rounded-[3rem] bg-white dark:bg-black shadow-2xl">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Manifesto</h3>
            <p className="text-sm font-bold uppercase tracking-widest leading-loose">
              "Beauty is the byproduct of structural honesty. By adhering to monochromatic principles and high-contrast logic, we facilitate a clearer interaction between the user and the artifact."
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="p-10 border-2 border-black dark:border-white rounded-[2.5rem] bg-white dark:bg-black transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30 block mb-6">0{idx + 1}</span>
              <h4 className="text-xl font-black uppercase tracking-tighter mb-4">{pillar.title}</h4>
              <p className="text-[11px] font-medium uppercase tracking-[0.1em] leading-relaxed opacity-60">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Collaborative Partners */}
        <div className="pt-20 border-t-2 border-black dark:border-white">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-12 block text-center">Protocol Partners</span>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center">
            {brandLogos.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Partner"
                className={`h-12 w-full object-contain filter grayscale brightness-0 dark:invert transition-opacity duration-300 hover:opacity-100 opacity-40`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
