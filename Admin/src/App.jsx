import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Components/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Shop from "./pages/Shop.jsx";
import Users from "./pages/Users.jsx";
import Login from "./pages/Login.jsx";
import NewsLetters from "./pages/NewsLetters.jsx";
import SalesReport from "./pages/SalesReport.jsx";
import RevenueBreakdown from "./pages/RevenueBreakdown.jsx";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem("admin_token"));

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    // Clear the low-stock alert flag so it shows again on next login
    sessionStorage.removeItem("admin_low_stock_shown");
    setIsAdminLoggedIn(false);
  };

  return (
    <div className="">
      <BrowserRouter>
        {!isAdminLoggedIn ? (
          <Routes>
            <Route path="*" element={<Login onLogin={() => setIsAdminLoggedIn(true)} />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<AdminLayout onLogout={handleLogout} />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="shop" element={<Shop />} />
              <Route path="users" element={<Users />} />
              <Route path="newsletters" element={<NewsLetters />} />
              <Route path="sales-report" element={<SalesReport />} />
              <Route path="revenue-breakdown" element={<RevenueBreakdown />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
