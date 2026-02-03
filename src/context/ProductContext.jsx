/* eslint-disable react-refresh/only-export-components */
// src/context/ProductContext.jsx
import { createContext, useReducer, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const ProductContext = createContext();

const initialState = {
  products: [],
  loading: false,
  error: null,
  searchQuery: "",
};

const productReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_QUERY":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch products whenever searchQuery changes
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        let query = supabase.from('products').select('*');
        
        if (state.searchQuery) {
          const q = state.searchQuery;
          // Search in title, description, category, and brand
          query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%,brand.ilike.%${q}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        console.error("Error fetching products:", err);
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    fetchProducts();
  }, [state.searchQuery]);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
