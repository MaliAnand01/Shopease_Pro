import React, { useState, useEffect, useContext } from "react";
import { WishlistContext } from "./WishlistContext";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistProductIds, setWishlistProductIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Wishlist on Login
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        setWishlistProductIds([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_ids")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Wishlist Fetch Error:", error);
        // 406 often means the table hasn't been created yet or PostgREST cache is stale
        if (error.code === '42P01' || error.message?.includes('wishlists')) {
          console.warn("Table 'wishlists' not found. Please ensure SQL was run successfully.");
        }
      }

      if (data?.product_ids) {
        setWishlistProductIds(data.product_ids);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [user?.id]);

  // 2. Sync to Supabase
  const syncToSupabase = async (newIds) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from("wishlists")
      .upsert({
        user_id: user.id,
        product_ids: newIds,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error syncing wishlist:", error);
      toast.error("Failed to sync wishlist");
    }
  };

  // 3. Listen for Realtime changes
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`wishlist_sync_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "wishlists",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && payload.new.product_ids) {
            setWishlistProductIds(payload.new.product_ids);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to use wishlist", { id: "wishlist-login-error" });
      return;
    }

    const isCurrentlyIn = wishlistProductIds.includes(productId);
    let updatedIds;

    if (isCurrentlyIn) {
      updatedIds = wishlistProductIds.filter((id) => id !== productId);
      toast.success("Removed from wishlist");
    } else {
      updatedIds = [...wishlistProductIds, productId];
      toast.success("Added to wishlist");
    }

    setWishlistProductIds(updatedIds);
    await syncToSupabase(updatedIds);
  };

  const isInWishlist = (productId) => wishlistProductIds.includes(productId);

  const clearWishlist = async () => {
    if (!user?.id) return;
    setWishlistProductIds([]);
    await syncToSupabase([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistProductIds,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
