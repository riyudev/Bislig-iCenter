import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Shop from "./pages/Shop";
import ShopCategory from "./pages/ShopCategory";
import LoginSignup from "./pages/LoginSignup";
import Cart from "./pages/Cart";
import Footer from "./Components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-ghostWhite min-h-screen">
      <Router>
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
          <Route path="/:category/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>

        <Footer />
        </Router>
        <Toaster position="top-center" />
      </div>
  );
}

export default App;
