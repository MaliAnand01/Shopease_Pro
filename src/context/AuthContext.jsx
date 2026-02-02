/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);

  // Enrich user profile from 'profiles' table (Background task)
  const fetchProfile = async (sessionUser) => {
    console.log("DB_FETCH: Enrichment attempt for", sessionUser.id);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.warn("DB_FETCH: Profile row not found. Using defaults.");
          return;
        }
        throw error;
      }

      console.log("DB_FETCH: Success. Merging profile data.");
      setUser(prev => ({
        ...prev,
        fullName: data.full_name || prev.fullName,
        phone: data.phone || prev.phone,
        profilePic: data.avatar_url || prev.profilePic,
        shippingAddress: data.shipping_address || prev.shippingAddress,
        role: data.role || prev.role,
      }));
    } catch (error) {
      console.error("DB_FETCH: Enrichment failed:", error.message);
    }
  };

  useEffect(() => {
    console.log("AUTH: Initializing Supabase Auth listener...");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`AUTH_EVENT: [${event}]`, session?.user?.email || "No session");
      
      if (session?.user) {
        // 1. SET USER IMMEDIATELY from Auth Session
        const initialUser = {
          ...session.user,
          fullName: session.user.user_metadata?.full_name || "New User",
          role: "user",
          profilePic: null,
          phone: "",
          shippingAddress: {}
        };
        
        console.log("APP_STATE: Setting initial user from session metadata");
        setUser(initialUser);
        
        // 2. FETCH ENRICHMENT IN BACKGROUND (Don't await!)
        fetchProfile(session.user);
      } else {
        console.log("APP_STATE: Clearing user object");
        setUser(null);
      }
      
      setLoading(false);
      console.log("APP_STATE: Loading complete");
    });

    return () => {
      console.log("AUTH: Cleaning up listener");
      subscription.unsubscribe();
    };
  }, []);

  const registerUser = async (data) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;

      toast.success("Registration successful! Please check your email for verification.");
      return authData;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const loginUser = async (data) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      toast.success("Login successful!");
      return authData;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      toast.success("Logout successful!");
    }
  };

  const updateProfilePic = async (imageUrl) => {
    try {
      console.log("DB_SYNC: Updating profile picture...");
      const { error } = await supabase
        .from("profiles")
        .upsert({ 
          id: user.id,
          avatar_url: imageUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setUser(prev => ({ ...prev, profilePic: imageUrl }));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("DB_SYNC: Profile pic update failed:", error);
      toast.error("Failed to save profile picture");
    }
  };

  const updateUser = async (updates) => {
    try {
      console.log("DB_SYNC: Updating user details...", updates);
      
      const mappedUpdates = {
        id: user.id,
        full_name: updates.fullName || user.fullName,
        phone: updates.phone || user.phone,
        shipping_address: updates.shippingAddress || user.shippingAddress,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(mappedUpdates);

      if (error) throw error;

      console.log("DB_SYNC: Profile updated successfully in Supabase");

      setUser(prev => ({ 
        ...prev, 
        fullName: mappedUpdates.full_name,
        phone: mappedUpdates.phone,
        shippingAddress: mappedUpdates.shipping_address 
      }));
      
      toast.success("Details updated successfully!");
    } catch (error) {
      console.error("DB_SYNC: Profile update failed:", error);
      toast.error(error.message);
    }
  };

  const placeOrder = async (cartItems, totalAmount, address) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            items: cartItems,
            total_amount: totalAmount,
            status: 'orderplaced'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update shipping address in profile if it's the first time or changed
      await updateUser({ shippingAddress: address });

      setRecentOrder(data);
      setShowOrderSuccess(true);
      toast.success("Order placed successfully!");
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // --- ADMIN APIs ---

  const getAllOrders = async () => {
    try {
      // Fetch orders and join with profiles to get customer name
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("ADMIN_ERROR: Fetch all orders failed:", error);
      toast.error("Failed to load global orders", { id: "fetch-orders-error" });
      return [];
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      toast.success(`Order marked as ${newStatus}`, { id: "update-status-success" });
      return data;
    } catch (error) {
      toast.error(error.message, { id: "update-status-error" });
      throw error;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order deleted successfully", { id: "delete-order-success" });
      return true;
    } catch (error) {
      toast.error(error.message, { id: "delete-order-error" });
      throw error;
    }
  };

  const getAllStats = async () => {
    try {
      const { data: orders, error: ordersError } = await supabase.from("orders").select("total_amount, status");
      const { count: userCount, error: usersError } = await supabase.from("profiles").select("*", { count: 'exact', head: true });

      if (ordersError || usersError) throw ordersError || usersError;

      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const newOrders = orders.filter(o => o.status === 'orderplaced').length;

      return {
        totalRevenue: totalRevenue.toFixed(2),
        userCount: userCount || 0,
        newOrders
      };
    } catch (error) {
      console.error("ADMIN_ERROR: Stats fetch failed:", error);
      return { totalRevenue: 0, userCount: 0, newOrders: 0 };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        showOrderSuccess,
        setShowOrderSuccess,
        recentOrder,
        registerUser,
        loginUser,
        logoutUser,
        updateProfilePic,
        updateUser,
        placeOrder,
        getAllOrders,
        updateOrderStatus,
        deleteOrder,
        getAllStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
