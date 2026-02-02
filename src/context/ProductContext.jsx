/* eslint-disable react-refresh/only-export-components */
// src/context/ProductContext.jsx
import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

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
        const url = state.searchQuery
          ? `https://dummyjson.com/products/search?q=${state.searchQuery}`
          : "https://dummyjson.com/products";
        const response = await axios.get(url);
        dispatch({ type: "FETCH_SUCCESS", payload: response.data.products });
      } catch (err) {
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
