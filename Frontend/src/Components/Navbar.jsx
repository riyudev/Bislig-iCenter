import React, { useContext, useState, useEffect, useRef } from "react";
import Logo from "../assets/bislig-iCenter-Logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaRegUser,
  FaTiktok,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { IoSearch, IoClose } from "react-icons/io5";
import { BsCart3, BsBagCheck } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import { MdLocalShipping, MdSecurity, MdStar } from "react-icons/md";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import AccountSidebar from "./AccountSidebar";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [promoBanner, setPromoBanner] = useState(true);
  const [promoIndex, setPromoIndex] = useState(0);
  const dropdownRef = useRef(null);

  const promoMessages = [
    {
      icon: <MdLocalShipping />,
      text: "Free Shipping on orders over ₱2,000 nationwide",
    },
    {
      icon: <MdStar />,
      text: "Authentic Apple products — Authorized Retailer",
    },
    {
      icon: <BsBagCheck />,
      text: "Buy Now, Pay Later — 0% interest installment available",
    },
    { icon: <MdSecurity />, text: "1-Year Official Warranty on all devices" },
  ];

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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Rotate promo messages
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = () => {
    if (!user) navigate("/login");
    else setIsDropdownOpen((prev) => !prev);
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

  if (location.pathname === "/checkout") {
    return null;
  }

  return (
    <>
      {/* ── Promo Announcement Bar ── */}
      {promoBanner && (
        <div
          className="fixed top-0 right-0 left-0 z-[60] flex items-center justify-center gap-3 px-4 py-[7px] text-white"
          style={{
            background:
              "linear-gradient(90deg, #1a1a2e 0%, #16213e 40%, #0f3460 80%, #1a1a2e 100%)",
          }}
        >
          <div className="flex flex-1 items-center justify-center gap-2">
            <span className="shrink-0 text-base text-[#60c8ff]">
              {promoMessages[promoIndex].icon}
            </span>
            <span className="text-[12.5px] font-medium tracking-[0.04em] text-[#e8f4ff]">
              {promoMessages[promoIndex].text}
            </span>
          </div>
          <button
            onClick={() => setPromoBanner(false)}
            aria-label="Close promo"
            className="shrink-0 cursor-pointer border-none bg-transparent p-1 text-base text-white/50 transition-colors hover:text-white/80"
          >
            <IoClose />
          </button>
        </div>
      )}

      {/* ── Main Navbar ── */}
      <nav
        className={`fixed right-0 left-0 z-50 border-b border-gray-200/50 backdrop-blur-xl transition-all duration-300 ${
          promoBanner ? "top-[35px]" : "top-0"
        } ${scrolled ? "bg-gray-50/95 shadow-lg" : "bg-gray-50/80 shadow-md"}`}
      >
        {/* Top Row */}
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-5 px-6 py-[10px]">
          {/* Brand */}
          <a
            href="/"
            className="flex shrink-0 items-center gap-2.5 no-underline"
          >
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] p-1 shadow-[0_2px_12px_rgba(59,130,246,0.15)]"
              style={{
                background: "linear-gradient(135deg, #f0f4ff, #dbeafe)",
              }}
            >
              <img
                src={Logo}
                alt="Bislig iCenter Logo"
                className="w-11 object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-productSansBold text-[18px] tracking-[0.06em] text-[#1a1a2e]">
                BiSLIG
              </span>
              <span className="font-productSansBold text-[11px] tracking-[0.18em] text-blue-500">
                iCENTER
              </span>
            </div>
          </a>

          {/* Search Bar */}
          <div
            className={`flex max-w-[500px] flex-1 items-center overflow-hidden rounded-full border transition-all duration-200 ${
              isSearchFocused
                ? "border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15),0_2px_12px_rgba(0,0,0,0.07)]"
                : "border-gray-200 shadow-[0_1px_6px_rgba(0,0,0,0.05)]"
            } bg-white/85`}
          >
            <IoSearch className="ml-3.5 shrink-0 text-lg text-gray-400" />
            <input
              type="text"
              placeholder="Search products, brands, categories…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 bg-transparent px-2.5 py-[9px] text-[13.5px] text-[#1a1a2e] outline-none placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex cursor-pointer items-center border-none bg-transparent p-1.5 text-base text-gray-400"
              >
                <IoClose />
              </button>
            )}
            <button className="btn-black m-1 px-[18px] py-[7px] text-[13px] font-semibold tracking-[0.03em]">
              Search
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-3.5">
            {/* Social */}
            <div className="flex items-center gap-1.5">
              <p className="mr-0.5 text-[11.5px] tracking-[0.04em] text-gray-500">
                Follow us
              </p>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a2e] text-[12px] text-white no-underline transition-transform duration-200 hover:scale-110 hover:bg-blue-700"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a2e] text-[12px] text-white no-underline transition-transform duration-200 hover:scale-110 hover:bg-pink-600"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a2e] text-[12px] text-white no-underline transition-transform duration-200 hover:scale-110 hover:bg-gray-700"
              >
                <FaTiktok />
              </a>
            </div>

            {/* User */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={handleUserClick}
                id="navbar-user-btn"
                className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white/80 py-1.5 pr-2.5 pl-1.5 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                {/* Avatar */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #1a1a2e, #3b82f6)",
                  }}
                >
                  {user ? (
                    <span className="text-[14px] font-bold">
                      {user.name?.[0]?.toUpperCase()}
                    </span>
                  ) : (
                    <FaRegUser className="text-sm" />
                  )}
                </div>
                {/* Info */}
                <div className="flex flex-col text-left leading-[1.2]">
                  <span className="text-[10px] text-gray-400">
                    {user ? "Hello," : ""}
                  </span>
                  <span className="text-[13px] font-semibold text-[#1a1a2e]">
                    {user ? user.username.split(" ")[0] : "Login"}
                  </span>
                </div>
                {user && (
                  <FaChevronDown
                    className={`text-[10px] text-gray-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </button>

              {/* Dropdown */}
              {user && isDropdownOpen && (
                <div className="absolute top-[calc(100%+10px)] right-0 z-[100] w-[220px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                  {/* Header */}
                  <div
                    className="flex items-center gap-2.5 px-4 py-3.5"
                    style={{
                      background: "linear-gradient(135deg, #f8faff, #eff6ff)",
                    }}
                  >
                    <div
                      className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-white"
                      style={{
                        background: "linear-gradient(135deg, #1a1a2e, #3b82f6)",
                      }}
                    >
                      <span className="text-base font-bold">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-[#1a1a2e]">
                        {user.name}
                      </p>
                      <p className="text-[11.5px] text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <button
                    onClick={handleAccountClick}
                    id="navbar-account-btn"
                    className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-4 py-[11px] text-left text-[13.5px] text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <FaUserCircle className="shrink-0 text-[15px]" />
                    My Account
                  </button>
                  <button
                    onClick={handleLogout}
                    id="navbar-logout-btn"
                    className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-4 py-[11px] text-left text-[13.5px] text-red-500 transition-colors hover:bg-gray-50"
                  >
                    <FaSignOutAlt className="shrink-0 text-[15px]" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <NavLink
              to="/cart"
              id="navbar-cart-btn"
              className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full border border-gray-200 bg-white/80 text-[#1a1a2e] no-underline transition-all duration-200 hover:border-blue-300 hover:shadow-md"
            >
              <BsCart3 className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-red-500 to-red-600 px-1 text-[10px] font-bold text-white shadow-[0_2px_6px_rgba(239,68,68,0.4)]">
                  {cartCountLabel}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        {/* Bottom Row — Nav Links */}
        <div className="mx-auto flex max-w-[1280px] items-center justify-between border-t border-gray-200/50 px-6 pt-1.5 pb-2">
          {/* Nav links */}
          <div className="flex items-center gap-1">
            <HiSparkles className="mr-1.5 text-base text-amber-400" />
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-productSansBold rounded-full px-3.5 py-[5px] text-[13.5px] tracking-[0.02em] no-underline transition-all duration-200 ${
                    isActive
                      ? "text-white shadow-[0_2px_12px_rgba(26,26,46,0.25)]"
                      : "font-productSansBold text-gray-600 hover:bg-gray-100 hover:text-[#1a1a2e]"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #1a1a2e, #2b4a8c)",
                      }
                    : {}
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100/80 px-2.5 py-[3px] text-[11.5px] font-medium tracking-[0.02em] text-gray-500">
              <MdLocalShipping className="shrink-0 text-[13px] text-blue-500" />
              Free Shipping
            </p>
            <p className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100/80 px-2.5 py-[3px] text-[11.5px] font-medium tracking-[0.02em] text-gray-500">
              <MdSecurity className="shrink-0 text-[13px] text-blue-500" />
              Warranty
            </p>
            <p className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100/80 px-2.5 py-[3px] text-[11.5px] font-medium tracking-[0.02em] text-gray-500">
              <BsBagCheck className="shrink-0 text-[13px] text-blue-500" />
              Cash on Delivery
            </p>
          </div>
        </div>
      </nav>

      <AccountSidebar
        isOpen={isAccountSidebarOpen}
        onClose={() => setIsAccountSidebarOpen(false)}
      />
    </>
  );
}

export default Navbar;
