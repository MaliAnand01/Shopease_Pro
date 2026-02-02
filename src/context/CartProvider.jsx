import { useReducer, useEffect, useContext } from "react";
import CartContext from "./CartContext";
import { cartReducer, initialState } from "../reducer/cartReducer";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  const getInitialState = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return initialState;
      }
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  // 1. Local Persistence (Still useful for guest/offline)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  // 2. Fetch remote cart on Login
  useEffect(() => {
    const fetchRemoteCart = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from("carts")
        .select("items")
        .eq("user_id", user.id)
        .single();

      if (data?.items) {
        dispatch({
          type: "SET_CART", // Assuming you'll add this to reducer
          payload: data.items
        });
      }
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching cart:", error);
      }
    };

    fetchRemoteCart();
  }, [user?.id]);

  // 3. Sync local changes to Supabase
  useEffect(() => {
    const syncToSupabase = async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from("carts")
        .upsert({ 
          user_id: user.id, 
          items: state.items,
          updated_at: new Date().toISOString() 
        });

      if (error) console.error("Error syncing cart to Supabase:", error);
    };

    const timer = setTimeout(() => {
      syncToSupabase();
    }, 500); // Debounce sync

    return () => clearTimeout(timer);
  }, [state.items, user?.id]);

  // 4. Listen for remote changes (Realtime)
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`cart_sync_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "carts",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && payload.new.items) {
            dispatch({
              type: "SET_CART",
              payload: payload.new.items
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const addItem = (product, quantity = 1) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product, quantity },
    });
  };

  const removeItem = (productId) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { productId },
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
