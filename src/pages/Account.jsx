import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { Heart, ShoppingBag, LogOut, Camera, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "../lib/supabaseClient";

const tabs = ["Overview", "Orders", "Settings"];

const Account = () => {
  const { user, logoutUser, loading, updateProfilePic, updateUser } =
    useContext(AuthContext);
  const { items } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    
    // Theme colors
    const primaryColor = [0, 0, 0];
    const secondaryColor = [150, 150, 150];

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SHOPEASE", 15, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text("OFFICIAL INVOICE", 15, 28);

    // Order Info
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 150, 20);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 150, 25);

    // Customer Info
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 15, 45);
    doc.setFont("helvetica", "normal");
    doc.text(user.fullName, 15, 50);
    doc.text(user.email, 15, 55);

    // Table
    const tableData = order.items.map(item => [
      item.title,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Grand Total: $$${order.total_amount?.toFixed(2)}`, 150, finalY, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...secondaryColor);
    doc.text("Thank you for choosing ShopEase. For any queries, contact support@shopease.com", 105, finalY + 30, { align: 'center' });

    doc.save(`ShopEase-Invoice-${order.id}.pdf`);
  };

  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const onUpdateSubmit = async (data) => {
    await updateUser(data);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading account...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login to access your account.
      </div>
    );
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      await updateProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <section
      className={`min-h-screen pt-0 pb-32 px-8 transition-colors duration-500 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-[1200px] mx-auto space-y-20">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-12"
        >
          <div className="flex items-center gap-10">
            {/* Profile Image - Absolute Monochromatic */}
            <div className="relative group">
              <div className={`h-32 w-32 rounded-full overflow-hidden flex items-center justify-center text-4xl font-black transition-all ${
                theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
              }`}>
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="h-full w-full object-cover grayscale"
                  />
                ) : (
                  user.fullName?.[0]?.toUpperCase()
                )}
              </div>

              <label className={`absolute bottom-0 right-0 p-3 rounded-full cursor-pointer transition-all border-2 ${
                theme === 'dark' ? 'bg-black border-white text-white' : 'bg-white border-black text-black'
              } hover:scale-110`}>
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Name & Email */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white mb-3 block">Account Details</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-3">{user.fullName}</h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 dark:text-white/40">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleLogout} className="btn-premium !bg-transparent !text-current border-2 border-black dark:border-white hover:!border-red-500 hover:!text-red-500">
               Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Grid - Sharp & Solid */}
        <div className="grid sm:grid-cols-3 gap-8">
          <Stat
            icon={<ShoppingBag size={20} />}
            label="Total Orders"
            value={orders?.length || 0}
            theme={theme}
          />
          <Stat icon={<Heart size={20} />} label="Wishlist" value="0" theme={theme} />
          <Stat
            icon={<ShoppingBag size={20} />}
            label="Items in Cart"
            value={items.length}
            theme={theme}
          />
        </div>

        {/* Tabs - Minimalist Selection */}
        <div className="flex gap-10 border-b border-black/5 dark:border-white/5 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === tab
                  ? "opacity-100"
                  : "opacity-20 hover:opacity-100"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-black dark:bg-white" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content - Solid Premium Card */}
        <div
          className={`premium-card p-12 min-h-[400px] transition-colors duration-500 bg-white dark:bg-black border-2 border-black dark:border-white shadow-xl`}
        >
          {/* Overview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === "Overview" && (
                <div className="max-w-2xl">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Overview</h3>
                  <p className="text-base font-medium text-black/60 dark:text-white/60 leading-relaxed tracking-tight">
                    Welcome back, <strong>{user.fullName}</strong>. Here you can view your recent orders and manage your account settings. 
                    You currently have <strong>{orders?.length || 0}</strong> orders in your history.
                  </p>
                </div>
              )}

              {/* Orders */}
              {activeTab === "Orders" && (
                <div className="space-y-8">
                  {loadingOrders ? (
                    <div className="py-20 text-center animate-pulse opacity-20">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em]">Loading Orders...</p>
                    </div>
                  ) : !orders || orders.length === 0 ? (
                    <div className="py-20 text-center opacity-20">
                      <ShoppingBag size={48} className="mx-auto mb-6" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em]">No Orders Found</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="premium-card p-8 border-2 border-black dark:border-white bg-white dark:bg-black transition-all hover:translate-x-1 hover:translate-y-1"
                      >
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-2">Order Number</span>
                            <span className="text-sm font-black tracking-tight">{order.id}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-2">Order Date</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                               {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end">
                           <div className="space-y-4">
                              <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block">Ordered Items</span>
                              <ul className="space-y-2">
                                {order.items.map((item, index) => (
                                  <li key={index} className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                                    • {item.title} × {item.quantity}
                                  </li>
                                ))}
                              </ul>
                           </div>
                            <div className="text-right flex flex-col items-end gap-6">
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 block mb-2">Total Amount</span>
                                <span className="text-3xl font-black tracking-tighter">${order.total_amount?.toFixed(2)}</span>
                              </div>
                              <button 
                                onClick={() => downloadInvoice(order)}
                                className="text-[9px] font-black uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-all flex items-center gap-2"
                              >
                                <FileText size={12} /> Download Invoice
                              </button>
                            </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Settings */}
              {activeTab === "Settings" && (
                <div className="space-y-16">
                  <div className="max-w-2xl">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40">Personal Information</h3>
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4 hover:opacity-60 transition-all"
                      >
                        {isEditing ? "Cancel" : "Edit Details"}
                      </button>
                    </div>

                    {!isEditing ? (
                      <div className="grid sm:grid-cols-2 gap-10">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Full Name</p>
                          <p className="text-sm font-bold uppercase tracking-widest">{user.fullName}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Email Address</p>
                          <p className="text-sm font-bold uppercase tracking-widest">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Phone Number</p>
                          <p className="text-sm font-bold uppercase tracking-widest">{user.phone || "Not set"}</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-10">
                        <div className="grid sm:grid-cols-2 gap-10">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Full Name</label>
                            <input 
                              {...register("fullName", { required: "Name is required" })}
                              className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white py-4 outline-none font-bold text-xs tracking-widest uppercase transition-all"
                            />
                            {errors.fullName && <p className="text-[8px] text-red-500 font-bold uppercase">{errors.fullName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Email Address</label>
                            <input 
                              {...register("email", { 
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                              })}
                              className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white py-4 outline-none font-bold text-xs tracking-widest uppercase transition-all"
                            />
                            {errors.email && <p className="text-[8px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
                          </div>
                          <div className="col-span-2 space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Phone Number</label>
                            <input 
                              {...register("phone")}
                              className="w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white py-4 outline-none font-bold text-xs tracking-widest uppercase transition-all"
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn-premium px-12 !py-4">
                          Save Changes
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="w-full h-px bg-black/5 dark:bg-white/5" />

                  <div className="max-w-md">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40 mb-8">System Access</h3>
                    <button
                      onClick={handleLogout}
                      className="btn-premium !bg-red-500 !text-white !border-transparent w-full flex items-center justify-center gap-4"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                    <p className="mt-8 text-[10px] font-medium text-center opacity-40 leading-relaxed">
                      Your security is important to us. Contact support if you need to update your sensitive information.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ icon, label, value, theme }) => (
  <div
    className={`premium-card p-10 flex flex-col gap-6 transition-colors duration-500 bg-white dark:bg-black border-2 border-black dark:border-white shadow-lg`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
       theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
    }`}>
      {icon}
    </div>
    <div>
      <p className="text-4xl font-black tracking-tighter mb-2">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">{label}</p>
    </div>
  </div>
);

export default Account;
