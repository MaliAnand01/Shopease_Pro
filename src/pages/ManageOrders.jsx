import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Trash2, X } from "lucide-react";
import Skeleton from "../components/ui/Skeleton";

const ManageOrders = () => {
  const { theme } = useContext(ThemeContext);
  const { getAllOrders, updateOrderStatus, deleteOrder } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    await updateOrderStatus(id, status);
    fetchOrders(); // Refresh
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this order record?")) {
      await deleteOrder(id);
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(searchTerm) || 
    o.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatusButton = ({ orderId, currentStatus, targetStatus, colorClass }) => (
    <button 
      onClick={() => handleStatusUpdate(orderId, targetStatus)}
      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-2 transition-all ${
        currentStatus === targetStatus 
          ? `${colorClass} border-current opacity-100` 
          : "border-black/10 dark:border-white/10 opacity-30 hover:opacity-100"
      }`}
    >
      {targetStatus}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 max-w-[1400px] mx-auto px-8">
        <div className="mb-12 space-y-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-20 w-96" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-0 pb-24 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-[1400px] mx-auto px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block opacity-40">Fulfillment System</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Manage <br /> Orders
          </h1>
        </motion.div>

        <div className="mb-12 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100" size={16} />
            <input 
              type="text" 
              placeholder="Filter by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-2 border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white py-4 pl-14 pr-6 rounded-2xl outline-none font-bold text-xs uppercase tracking-widest transition-all"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-black dark:border-white">
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Entity ID</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Client</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Items</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Net Amount</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Lifecycle Status</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 px-4 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredOrders.map((order, index) => (
                <motion.tr 
                  key={order.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-8 font-black tracking-tighter text-sm">#{order.id.toString().slice(0,8)}</td>
                  <td className="py-8">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-widest text-[10px]">{order.profiles?.full_name || 'Anonymous'}</span>
                      <span className="text-[8px] opacity-30 font-black truncate max-w-[120px]">{order.profiles?.email}</span>
                    </div>
                  </td>
                  <td className="py-8">
                    <span className="text-[10px] font-black opacity-60 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-md">
                      {order.items?.length || 0} Units
                    </span>
                  </td>
                  <td className="py-8 font-black text-sm">${order.total_amount}</td>
                  <td className="py-8">
                    <div className="flex flex-wrap gap-2">
                       <StatusButton orderId={order.id} currentStatus={order.status} targetStatus="orderplaced" colorClass="text-blue-500" />
                       <StatusButton orderId={order.id} currentStatus={order.status} targetStatus="shipped" colorClass="text-yellow-500" />
                       <StatusButton orderId={order.id} currentStatus={order.status} targetStatus="delivered" colorClass="text-green-500" />
                    </div>
                  </td>
                  <td className="py-8 px-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-3 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-6">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 border border-black/10 dark:border-white/10 rounded-3xl bg-white dark:bg-black shadow-sm"
            >
              <div className="flex justify-between items-start mb-6 border-b border-black/5 dark:border-white/5 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 block mb-1">Order ID</span>
                  <span className="font-black tracking-tighter">#{order.id.toString().slice(0,8)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 block mb-1">Total</span>
                  <span className="font-black tracking-tighter text-lg">${order.total_amount}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center font-black text-xs">
                  {order.profiles?.full_name?.charAt(0) || '?'}
                </div>
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest">{order.profiles?.full_name || 'Anonymous'}</p>
                   <p className="text-[10px] opacity-40">{order.items?.length || 0} Items</p>
                </div>
              </div>

              <div className="mb-6">
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-3">Update Status</p>
                 <div className="flex flex-wrap gap-2">
                    <StatusButton orderId={order.id} currentStatus={order.status} targetStatus="orderplaced" colorClass="text-blue-500" />
                    <StatusButton orderId={order.id} currentStatus={order.status} targetStatus="shipped" colorClass="text-yellow-500" />
                    <StatusButton orderId={order.id} currentStatus={order.status} targetStatus="delivered" colorClass="text-green-500" />
                 </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest border border-black/10 dark:border-white/10 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={14} /> View Details
                </button>
                <button 
                  onClick={() => handleDelete(order.id)}
                  className="flex-none p-3 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
          
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center opacity-20">
              <p className="text-xl font-black uppercase tracking-widest">No matching records</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border-2 border-black dark:border-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 md:top-10 md:right-10 p-3 md:p-4 border-2 border-black dark:border-white rounded-xl md:rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                <X size={18} className="md:w-5 md:h-5" />
              </button>

              <div className="mb-10 md:mb-16">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-4 block">Order Reference</span>
                <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">#{selectedOrder.id}</h2>
                <span className={`px-4 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest ${
                  selectedOrder.status === 'orderplaced' ? 'text-blue-500' :
                  selectedOrder.status === 'shipped' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-10 md:mb-16">
                <div className="space-y-6 md:space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 border-b border-black/10 dark:border-white/10 pb-4">Consignee Details</h4>
                  <div>
                    <p className="text-xl font-black tracking-tighter uppercase">{selectedOrder.profiles?.full_name}</p>
                    <p className="opacity-50 text-sm font-bold">{selectedOrder.profiles?.email}</p>
                    <p className="opacity-50 text-sm font-bold">{selectedOrder.profiles?.phone}</p>
                  </div>
                </div>
                <div className="space-y-6 md:space-y-8">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 border-b border-black/10 dark:border-white/10 pb-4">Logistics Target</h4>
                   <p className="text-sm font-bold leading-relaxed opacity-70">
                     {selectedOrder.profiles?.shipping_address?.street}, {selectedOrder.profiles?.shipping_address?.city}<br />
                     {selectedOrder.profiles?.shipping_address?.state}, {selectedOrder.profiles?.shipping_address?.pincode}
                   </p>
                </div>
              </div>

              <div className="space-y-8 md:space-y-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 border-b border-black/10 dark:border-white/10 pb-4">Inventory Breakdown</h4>
                <div className="space-y-6 md:space-y-8">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 md:gap-8 items-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 p-4">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base md:text-lg font-black tracking-tighter uppercase">{item.title}</p>
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-base md:text-lg">${item.price}</p>
                        <p className="text-[10px] font-black opacity-30">QTY: {item.quantity || 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-8 md:pt-10 border-t-2 border-black dark:border-white flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Net Total Valuation</p>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter">${selectedOrder.total_amount}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageOrders;
