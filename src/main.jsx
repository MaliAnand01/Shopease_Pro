import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ThemeProvider from "./context/ThemeProvider";
import CartProvider from "./context/CartProvider";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "./context/WishlistProvider";
import { ProductProvider } from "./context/ProductContext";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <ProductProvider>
            <WishlistProvider>
              <CartProvider>
                <BrowserRouter>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
                  <Toaster />
                </BrowserRouter>
              </CartProvider>
            </WishlistProvider>
          </ProductProvider>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
