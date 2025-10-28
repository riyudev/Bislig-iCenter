import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Shop from "./pages/Shop";
import Laptop from "./pages/Laptop";
import Iphone from "./pages/Iphone";
import Ipad from "./pages/Ipad";
import Android from "./pages/Android";
import PcBuild from "./pages/PcBuild";
import LoginSignup from "./pages/LoginSignup";
import Cart from "./pages/Cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="bg-creamyWhite min-h-screen">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/laptop" element={<Laptop />} />
          <Route path="/iphone" element={<Iphone />} />
          <Route path="/ipad" element={<Ipad />} />
          <Route path="/android" element={<Android />} />
          <Route path="/pc-build" element={<PcBuild />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
