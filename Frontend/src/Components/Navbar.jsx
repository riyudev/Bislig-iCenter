import React, { useContext, useState, useEffect } from "react";
import Logo from "../assets/bislig-iCenter-Logo.png";
import { FaFacebookF, FaInstagram, FaRegUser, FaTiktok } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import AccountSidebar from "./AccountSidebar";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(false);
  
  const navLinks = [
    { path: "/", label: "Shop" },
    { path: "/laptop", label: "Laptop" },
    { path: "/iphone", label: "iPhone" },
    { path: "/ipad", label: "iPad" },
    { path: "/android", label: "Android" },
  ];

  const { getTotalCartQuantity } = useContext(ShopContext);
  const cartCount = getTotalCartQuantity();
  const cartCountLabel = cartCount >= 100 ? "99+" : String(cartCount);

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleAccountClick = () => {
    setIsDropdownOpen(false);
    setIsAccountSidebarOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.relative')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <nav className="bg-ghostWhite/80 fixed top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex w-7xl items-center justify-between py-3">
        <div className="flex items-center gap-8">
          <a href="/" className="inline-flex items-center gap-2">
            <img src={Logo} alt="Bislig iCenter Logo" className="w-16" />
            <h4>BiSLIG iCENTER</h4>
          </a>

          <div className="group relative flex w-[420px] max-w-md items-center overflow-hidden rounded-full border bg-white/70 ring-1 ring-slate-200/70 ring-inset focus-within:ring-sky-300">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-transparent px-5 text-sm outline-none placeholder:text-slate-400"
            />
            <button className="btn-black rounded-full px-5 py-2.5">
              <CiSearch className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <p className="tracking-wider">Follow us on</p>
          <a href="#" className="bg-myblack/70 rounded-full p-1">
            <FaFacebookF className="text-sm text-white" />
          </a>

          <a href="#" className="bg-myblack/70 rounded-full p-1">
            <FaInstagram className="text-sm text-white" />
          </a>

          <a href="#" className="bg-myblack/70 rounded-full p-1">
            <FaTiktok className="text-sm text-white" />
          </a>
        </div>
      </div>

      <div className="mx-auto flex w-7xl items-center justify-between gap-2 py-2">
        <p className="ml-[280px] space-x-2.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `inline-flex items-center rounded-full px-4 py-2 text-sm tracking-wide transition ${
                  isActive
                    ? "bg-myblack text-white shadow"
                    : "hover:text-myblack text-slate-700 hover:bg-slate-200"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </p>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={handleUserClick}
              className="flex rounded-full p-2 transition hover:bg-slate-100"
            >
              <p className="mr-2 text-sm">
                {user ? user.name : "Login"}
              </p>
              <FaRegUser className="text-myblack text-2xl" />
            </button>
            
            {user && isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleAccountClick}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
          <NavLink
            to="/cart"
            className="relative rounded-full p-2 transition hover:bg-slate-100"
          >
            <BsCart className="text-myblack text-2xl" />
            <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1.5 text-[11px] text-white shadow">
              {cartCountLabel}
            </span>
          </NavLink>
        </div>
      </div>
      
      <AccountSidebar 
        isOpen={isAccountSidebarOpen} 
        onClose={() => setIsAccountSidebarOpen(false)} 
      />
    </nav>
  );
}

export default Navbar;
