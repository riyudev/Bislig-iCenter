import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./Components/AdminLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Shop from "./pages/Shop.jsx";
import Users from "./pages/Users.jsx";
import Login from "./pages/Login.jsx";
import NewsLetters from "./pages/NewsLetters.jsx";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="shop" element={<Shop />} />
            <Route path="users" element={<Users />} />
            <Route path="newsletters" element={<NewsLetters />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
