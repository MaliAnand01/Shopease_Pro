import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { BarChart3, Users, ShoppingBag, ArrowUpRight } from "lucide-react";

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const { getAllStats, logoutUser } = useContext(AuthContext);
  const [dashboardStats, setDashboardStats] = useState({ totalRevenue: 0, userCount: 0, newOrders: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // 1. Fetch Stats
      const stats = await getAllStats();
      setDashboardStats(stats);

      // 2. Fetch Recent Activities (Registrations)
      const { data: recentUsers } = await supabase
        .from("profiles")
        .select("full_name, created_at")
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentActivities(recentUsers || []);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Total Revenue", value: `$${dashboardStats.totalRevenue}`, icon: BarChart3, trend: "+12%" },
    { label: "System Users", value: dashboardStats.userCount, icon: Users, trend: "+5%" },
    { label: "Pending Fulfillment", value: dashboardStats.newOrders, icon: ShoppingBag, trend: "+18%" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="text-sm font-black tracking-widest uppercase opacity-20">Analyzing System Metrics...</motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-0 pb-24 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-[1400px] mx-auto px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12 flex justify-between items-end"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block opacity-40">Administrative Suite</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              System <br /> Dashboard
            </h1>
          </div>
          <button onClick={logoutUser} className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 mb-2">Terminate Session</button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 md:p-10 border-2 border-black dark:border-white rounded-[2rem] md:rounded-[2.5rem] bg-white dark:bg-black"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl border-2 border-black dark:border-white">
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-green-500 flex items-center gap-1">
                  {stat.trend} <ArrowUpRight size={10} />
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">{stat.label}</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">{stat.value}</h2>
            </motion.div>
          ))}
        </div>

        <div className="p-6 md:p-12 border-2 border-black dark:border-white rounded-[2rem] md:rounded-[3rem] bg-white dark:bg-black">
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-8">Recent System Activity</h3>
          <div className="space-y-6">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                  <p className="text-xs md:text-sm font-bold uppercase tracking-tight">New registration: {act.full_name}</p>
                </div>
                <span className="text-[9px] md:text-[10px] opacity-40 font-bold uppercase tracking-widest">{new Date(act.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {recentActivities.length === 0 && <p className="opacity-30 uppercase font-black text-xs tracking-widest py-10">No recent activations</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
