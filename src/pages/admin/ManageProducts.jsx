/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */

import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Trash2, Edit2, X, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ManageProducts = () => {
    const { theme } = useContext(ThemeContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    
    // Desktop Guard
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isMobile) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div className="p-6 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 mb-6">
                    <X size={32} />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Desktop Only</h1>
                <p className="text-sm opacity-60 max-w-xs mx-auto mb-8 font-bold tracking-wide">
                    The Inventory Manager is optimized for larger screens to handle complex data tables. Please access this page from a desktop computer.
                </p>
                <Link to="/admin" className="btn-premium px-8 py-3 bg-black text-white dark:bg-white dark:text-black">
                    Return to Dashboard
                </Link>
            </div>
        );
    }
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // null = creating mode
    const [modalLoading, setModalLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        stock: "",
        brand: "",
        category: "",
        thumbnail: "",
        description: ""
    });

    // Fetch Products
    const fetchProducts = async () => {
        setLoading(true);
        let q = supabase.from("products").select("*").order("created_at", { ascending: false });

        if (query) {
             q = q.or(`title.ilike.%${query}%,category.ilike.%${query}%`);
        }

        const { data, error } = await q;

        if (error) {
            toast.error("Failed to load products");
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Handle Modal Open
    const openModal = (product = null) => {
        setEditingProduct(product);
        if (product) {
            setFormData({
                title: product.title,
                price: product.price,
                stock: product.stock,
                brand: product.brand,
                category: product.category,
                thumbnail: product.thumbnail,
                description: product.description || ""
            });
        } else {
            setFormData({ title: "", price: "", stock: "", brand: "", category: "", thumbnail: "", description: "" });
        }
        setIsModalOpen(true);
    };

    // Handle Submit (Create/Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalLoading(true);

        try {
            // Sanitize Payload
            const payload = {
                ...formData,
                category: formData.category.trim().toLowerCase()
            };

            if (editingProduct) {
                // Update
                const { error } = await supabase
                    .from("products")
                    .update(payload)
                    .eq("id", editingProduct.id);
                if (error) throw error;
                toast.success("Product updated!");
            } else {
                // Create
                const { error } = await supabase
                    .from("products")
                    .insert([{ ...payload, created_at: new Date() }]);
                if (error) throw error;
                toast.success("Product created!");
            }

            setIsModalOpen(false);
            fetchProducts(); // Refresh list
        } catch (error) {
            toast.error(error.message);
        } finally {
            setModalLoading(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;
            toast.success("Product deleted");
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className={`min-h-screen pt-24 pb-24 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-[1400px] mx-auto px-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
                >
                    <div>
                        <Link to="/admin" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 mb-4 transition-opacity">
                            <ArrowLeft size={12} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Inventory <br /> Manager
                        </h1>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="btn-premium flex items-center gap-2 px-8 py-4 bg-black text-white dark:bg-white dark:text-black"
                    >
                        <Plus size={16} /> Add Product
                    </button>
                </motion.div>

                {/* Search */}
                <div className={`mb-8 max-w-md flex gap-2 items-center border-2 rounded-xl px-4 py-3 transition-colors ${theme === 'dark' ? 'border-white/20 focus-within:border-white' : 'border-black/20 focus-within:border-black'}`}>
                    <Search className="opacity-40 shrink-0 mr-4" size={18} />
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search inventory..."
                        className="bg-transparent outline-none flex-1 font-bold text-sm tracking-widest placeholder:opacity-50"
                    />
                </div>

                {/* Table */}
                <div className={`overflow-x-auto rounded-[2rem] border-2 ${theme === 'dark' ? 'border-white/20' : 'border-black/20'}`}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b-2 ${theme === 'dark' ? 'border-white/20' : 'border-black/20'} text-[10px] uppercase tracking-[0.2em] font-black opacity-70`}>
                                <th className="p-6">Product</th>
                                <th className="p-6">Category</th>
                                <th className="p-6">Price</th>
                                <th className="p-6">Stock</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-bold tracking-tight">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center opacity-40 uppercase tracking-widest">Loading Inventory...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center opacity-40 uppercase tracking-widest">No products found</td></tr>
                            ) : (
                                products.map(product => (
                                    <tr key={product.id} className={`border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                                        <td className="p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 overflow-hidden shrink-0">
                                                <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="max-w-[200px]">
                                                <p className="truncate">{product.title}</p>
                                                <p className="text-[10px] opacity-40 uppercase tracking-widest">{product.brand}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 uppercase text-xs tracking-wider opacity-80">{product.category}</td>
                                        <td className="p-4">${product.price}</td>
                                        <td className="p-4">{product.stock}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(product)} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit/Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-8 md:p-12 shadow-2xl ${theme === 'dark' ? 'bg-black border-2 border-white' : 'bg-white border-2 border-black'}`}
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"><X size={20} /></button>
                            
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">
                                {editingProduct ? "Edit Product" : "New Product"}
                            </h2>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Title</label>
                                        <input required className="input-premium w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Brand</label>
                                        <input required className="input-premium w-full" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Category</label>
                                        <div className="relative">
                                            <select 
                                                required 
                                                className="input-premium w-full appearance-none cursor-pointer" 
                                                value={formData.category} 
                                                onChange={e => setFormData({...formData, category: e.target.value})}
                                            >
                                                <option value="" disabled>Select Category</option>
                                                <option value="smartphones">Smartphones</option>
                                                <option value="laptops">Laptops</option>
                                                <option value="fragrances">Fragrances</option>
                                                <option value="skincare">Skincare</option>
                                                <option value="groceries">Groceries</option>
                                                <option value="home-decoration">Home Decoration</option>
                                                <option value="furniture">Furniture</option>
                                                <option value="tops">Tops</option>
                                                <option value="womens-dresses">Womens Dresses</option>
                                                <option value="womens-shoes">Womens Shoes</option>
                                                <option value="mens-shirts">Mens Shirts</option>
                                                <option value="mens-shoes">Mens Shoes</option>
                                                <option value="mens-watches">Mens Watches</option>
                                                <option value="womens-watches">Womens Watches</option>
                                                <option value="womens-bags">Womens Bags</option>
                                                <option value="womens-jewellery">Womens Jewellery</option>
                                                <option value="sunglasses">Sunglasses</option>
                                                <option value="automotive">Automotive</option>
                                                <option value="motorcycle">Motorcycle</option>
                                                <option value="lighting">Lighting</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">▼</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Price ($)</label>
                                        <input required type="number" step="0.01" className="input-premium w-full" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Stock</label>
                                        <input required type="number" className="input-premium w-full" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Thumbnail (URL)</label>
                                        <input required className="input-premium w-full" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Description</label>
                                    <textarea className="input-premium w-full h-32 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>
                                
                                <button disabled={modalLoading} className="btn-premium w-full flex justify-center items-center gap-3 mt-4 bg-black text-white dark:bg-white dark:text-black">
                                    {modalLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Product</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProducts;
