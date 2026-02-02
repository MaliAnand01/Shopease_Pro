import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import ScrollToTop from "./components/ScrollToTop";
import OrderSuccessModal from "./components/OrderSuccessModal";

const Layout = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="min-h-screen font-sans">
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-500 pb-10">
        <ScrollToTop />
        <Navbar />
        <OrderSuccessModal />
        <main className="pt-28">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
