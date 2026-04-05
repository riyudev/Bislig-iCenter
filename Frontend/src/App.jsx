import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Shop from "./pages/Shop";
import ShopCategory from "./pages/ShopCategory";
import LoginSignup from "./pages/LoginSignup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Footer from "./Components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import SearchResults from "./pages/SearchResults";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./helpers/ScrollToTop";

function App() {
  return (
    <div className="bg-ghostWhite min-h-screen">
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          {/* Main Shop Page */}
          <Route path="/" element={<Shop />} />

          {/* Dynamic Category Page */}
          {/* e.g. /category/iphone, /category/laptop, etc. */}
          <Route path="/laptop" element={<ShopCategory category="laptop" />} />
          <Route path="/iphone" element={<ShopCategory category="iphone" />} />
          <Route path="/ipad" element={<ShopCategory category="ipad" />} />
          <Route
            path="/android"
            element={<ShopCategory category="android" />}
          />

          {/* Other Pages */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/:category/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>

        <Footer />
      </Router>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
