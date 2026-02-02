import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Checkout = () => {
  const { theme } = useContext(ThemeContext);
  const { items, clearCart, totalPrice } = useContext(CartContext);
  const { placeOrder, user, showOrderSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [loadingPincode, setLoadingPincode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      pincode: user?.shippingAddress?.pincode || "",
      city: user?.shippingAddress?.city || "",
      state: user?.shippingAddress?.state || "",
      street: user?.shippingAddress?.street || "",
    },
  });

  const pincode = watch("pincode");

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        phone: user.phone || user.shippingAddress?.phone || "",
        pincode: user.shippingAddress?.pincode || "",
        city: user.shippingAddress?.city || "",
        state: user.shippingAddress?.state || "",
        street: user.shippingAddress?.street || "",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    const fetchPincodeDetails = async (pin) => {
      if (pin.length === 6) {
        setLoadingPincode(true);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await response.json();
          
          if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            setValue("city", details.District, { shouldValidate: true });
            setValue("state", details.State, { shouldValidate: true });
            toast.success(`Located: ${details.District}, ${details.State}`);
          } else {
            toast.error("Invalid Pincode");
          }
        } catch (error) {
          console.error("Pincode API Error:", error);
        } finally {
          setLoadingPincode(false);
        }
      }
    };

    if (pincode) {
      fetchPincodeDetails(pincode);
    }
  }, [pincode, setValue]);

  useEffect(() => {
    if (items.length === 0 && !placingOrder && !showOrderSuccess) {
      navigate("/cart");
    }
  }, [items, navigate, placingOrder, showOrderSuccess]);

  const onSubmit = async (data) => {
    setPlacingOrder(true);
    try {
      await placeOrder(items, totalPrice, data);
      setPlacingOrder(false);
      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Checkout Error:", error);
      setPlacingOrder(false);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen pt-0 pb-20 transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-[1400px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white mb-6 block">Order Details</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] text-black dark:text-white">
            Secure <br /> Checkout
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Shipping Form */}
          <div className="space-y-12">
            <div className={`premium-card p-12 transition-colors duration-500 bg-white dark:bg-black border border-black/10 dark:border-white/10`}>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] mb-12 text-black dark:text-white">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <input
                    {...register("fullName", { required: "Full name is required" })}
                    placeholder="Full Name"
                    className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-5 outline-none font-bold text-[11px] tracking-[0.1em] placeholder:text-black/40 dark:placeholder:text-white/40 transition-all text-black dark:text-white"
                  />
                  {errors.fullName && <p className="text-[9px] text-red-500 mt-3 font-bold uppercase tracking-widest">{errors.fullName.message}</p>}
                </div>
                
                <div className="col-span-2">
                  <input
                    {...register("street", { required: "Street address is required" })}
                    placeholder="Street Address"
                    className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-5 outline-none font-bold text-[11px] tracking-[0.1em] placeholder:text-black/40 dark:placeholder:text-white/40 transition-all text-black dark:text-white"
                  />
                  {errors.street && <p className="text-[9px] text-red-500 mt-3 font-bold uppercase tracking-widest">{errors.street.message}</p>}
                </div>
 
                <div className="relative">
                  <input
                    {...register("pincode", { 
                      required: "ZIP / Postal Code is required",
                      pattern: { value: /^[0-9]{6}$/, message: "Must be a 6-digit number" }
                    })}
                    placeholder="ZIP / Postal Code (6 Digits)"
                    className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-5 outline-none font-bold text-[11px] tracking-[0.1em] placeholder:text-black/40 dark:placeholder:text-white/40 transition-all text-black dark:text-white"
                  />
                  {loadingPincode && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  {errors.pincode && <p className="text-[9px] text-red-500 mt-3 font-bold uppercase tracking-widest">{errors.pincode.message}</p>}
                </div>
 
                <div className="col-span-2 grid grid-cols-2 gap-8">
                  <div>
                    <input
                      {...register("city", { required: "City is required" })}
                      placeholder="City"
                      className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-5 outline-none font-bold text-[11px] tracking-[0.1em] placeholder:text-black/40 dark:placeholder:text-white/40 transition-all text-black dark:text-white"
                    />
                    {errors.city && <p className="text-[9px] text-red-500 mt-3 font-bold uppercase tracking-widest">{errors.city.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register("state", { required: "State is required" })}
                      placeholder="State"
                      className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-5 outline-none font-bold text-[11px] tracking-[0.1em] placeholder:text-black/40 dark:placeholder:text-white/40 transition-all text-black dark:text-white"
                    />
                    {errors.state && <p className="text-[9px] text-red-500 mt-3 font-bold uppercase tracking-widest">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="col-span-2">
                  <input
                    {...register("phone", { required: "Phone number is required" })}
                    placeholder="Phone Number"
                    className="w-full bg-transparent border-b-2 border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white py-5 outline-none font-bold text-[11px] tracking-[0.1em] placeholder:text-black/40 dark:placeholder:text-white/40 transition-all text-black dark:text-white"
                  />
                  {errors.phone && <p className="text-[9px] text-red-500 mt-3 font-bold uppercase tracking-widest">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            <div className={`premium-card p-12 transition-colors duration-500 bg-white dark:bg-black border border-black/10 dark:border-white/10`}>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] mb-12 text-black dark:text-white">Payment Method</h2>
              <div className="flex flex-col gap-6">
                <label className="flex items-center justify-between cursor-pointer p-8 rounded-[1.5rem] border-2 border-black dark:border-white bg-white dark:bg-black transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                  <div className="flex items-center gap-6">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4 accent-black dark:accent-white" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-black dark:text-white">Cash on Delivery (COD)</span>
                  </div>
                </label>
                <div className="p-8 rounded-[1.5rem] border border-black/5 dark:border-white/5 opacity-30 cursor-not-allowed">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em]">Credit Card (Soon)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Order Summary */}
          <div className="premium-card p-12 sticky top-32 transition-colors duration-500 bg-white dark:bg-black border-2 border-black dark:border-white shadow-xl">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.3em] mb-12 text-black dark:text-white">Order Summary</h2>
            
            <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto pr-6 scrollbar-hide">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center pb-8 border-b-2 border-black/10 dark:border-white/20 transition-opacity">
                  <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/20 p-2 flex items-center justify-center">
                       <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-tight leading-tight line-clamp-1 max-w-[150px]">{item.title}</p>
                      <p className="text-[9px] font-bold text-black/50 dark:text-white/50 uppercase tracking-[0.1em] mt-2">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-xl font-black tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6 mb-12 pb-12 border-b-2 border-black/10 dark:border-white/20 text-[11px] font-bold uppercase tracking-[0.1em]">
                <div className="flex justify-between items-center">
                  <span className="opacity-60">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-60">Shipping</span>
                  <span className="text-black dark:text-white font-bold">Free</span>
                </div>
            </div>

            <div className="flex justify-between items-end mb-16">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-30">Total Amount</span>
              <span className="text-5xl font-black tracking-tighter">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="btn-premium w-full !py-6 disabled:opacity-20"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>

            <p className="mt-10 text-[10px] font-medium text-center opacity-40 leading-relaxed">
              By placing this order, you agree to our terms of service and shipping policies.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
