import React, { useContext, useState, useEffect, useRef } from "react";
import Logo from "../assets/bislig-iCenter-Logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaRegUser,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";
import { BsCart3, BsBoxSeam } from "react-icons/bs";
import { HiSparkles, HiMenu, HiX } from "react-icons/hi";
import { MdLocalShipping, MdSecurity, MdStar } from "react-icons/md";
import { BsBagCheck } from "react-icons/bs";
import { IoSearch, IoClose } from "react-icons/io5";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import AccountSidebar from "./AccountSidebar";
import MyOrdersSidebar from "./MyOrdersSidebar";

function MobileNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(false);
  const [isMyOrdersSidebarOpen, setIsMyOrdersSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [promoBanner, setPromoBanner] = useState(true);
  const [promoIndex, setPromoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 870);

  // Track viewport width to hide/show this component
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 870);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const promoMessages = [
    { icon: <MdLocalShipping />, text: "Free Shipping on orders over ₱2,000" },
    { icon: <MdStar />, text: "Authentic Apple — Authorized Retailer" },
    { icon: <BsBagCheck />, text: "0% interest installment available" },
    { icon: <MdSecurity />, text: "1-Year Official Warranty on all devices" },
  ];

  const navLinks = [
    { path: "/", label: "Shop" },
    { path: "/laptop", label: "Laptop" },
    { path: "/iphone", label: "iPhone" },
    { path: "/ipad", label: "iPad" },
    { path: "/android", label: "Android" },
  ];

  const { getTotalCartQuantity, allProducts } = useContext(ShopContext);
  const cartCount = getTotalCartQuantity();
  const cartCountLabel = cartCount >= 100 ? "99+" : String(cartCount);

  // Search suggestions (same logic as desktop Navbar)
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim() || !allProducts) return [];
    const lowerQuery = searchQuery.toLowerCase();
    const suggestions = [];
    allProducts.forEach((product) => {
      if (product.name.toLowerCase().includes(lowerQuery)) {
        suggestions.push(product.name);
      } else if (
        product.category.toLowerCase().includes(lowerQuery) &&
        !suggestions.includes(product.category)
      ) {
        suggestions.push(product.category);
      }
    });
    const unique = [...new Set(suggestions)];
    unique.sort((a, b) => {
      const aL = a.toLowerCase(), bL = b.toLowerCase();
      if (aL.startsWith(lowerQuery) && !bL.startsWith(lowerQuery)) return -1;
      if (!aL.startsWith(lowerQuery) && bL.startsWith(lowerQuery)) return 1;
      return 0;
    });
    return unique.slice(0, 5);
  }, [searchQuery, allProducts]);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setIsSearchFocused(false);
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

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

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsSearchOpen(false);
      setIsDrawerOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDrawerOpen(false);
    navigate("/login");
  };

  const handleAccountClick = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setIsAccountSidebarOpen(true), 300);
  };

  const handleMyOrdersClick = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setIsMyOrdersSidebarOpen(true), 300);
  };

  if (location.pathname === "/checkout") return null;
  if (!isMobile) return null;

  return (
    <>
      {/* ── Promo Announcement Bar ── */}
      {promoBanner && (
        <div
          className="fixed top-0 right-0 left-0 z-[60] flex items-center justify-center gap-2 px-3 py-[6px] text-white"
          style={{
            background:
              "linear-gradient(90deg, #1a1a2e 0%, #16213e 40%, #0f3460 80%, #1a1a2e 100%)",
          }}
        >
          <div className="flex flex-1 items-center justify-center gap-1.5">
            <span className="shrink-0 text-sm text-[#60c8ff]">
              {promoMessages[promoIndex].icon}
            </span>
            <span className="truncate text-[11px] font-medium tracking-[0.03em] text-[#e8f4ff]">
              {promoMessages[promoIndex].text}
            </span>
          </div>
          <button
            onClick={() => setPromoBanner(false)}
            aria-label="Close promo"
            className="shrink-0 cursor-pointer border-none bg-transparent p-1 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <IoClose />
          </button>
        </div>
      )}

      {/* ── Main Mobile Navbar ── */}
      <nav
        className={`fixed right-0 left-0 z-50 border-b border-gray-200/50 backdrop-blur-xl transition-all duration-300 ${
          promoBanner ? "top-[30px]" : "top-0"
        } ${scrolled ? "bg-gray-50/97 shadow-lg" : "bg-gray-50/85 shadow-md"}`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          {/* ── Brand / Logo ── */}
          <a href="/" className="flex shrink-0 items-center gap-2 no-underline">
            <div
              className="flex h-[44px] w-[44px] items-center justify-center rounded-[12px] p-0.5 shadow-[0_2px_10px_rgba(59,130,246,0.15)]"
              style={{ background: "linear-gradient(135deg, #f0f4ff, #dbeafe)" }}
            >
              <img
                src={Logo}
                alt="Bislig iCenter Logo"
                className="w-10 object-contain"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-productSansBold text-[16px] tracking-[0.06em] text-[#1a1a2e]">
                BiSLIG
              </span>
              <span className="font-productSansBold text-[10px] tracking-[0.18em] text-blue-500">
                iCENTER
              </span>
            </div>
          </a>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen((p) => !p)}
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/80 text-[#1a1a2e] transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              aria-label="Search"
            >
              <IoSearch className="text-[17px]" />
            </button>

            {/* Cart */}
            <NavLink
              to="/cart"
              id="mobile-navbar-cart-btn"
              className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full border border-gray-200 bg-white/80 text-[#1a1a2e] no-underline transition-all duration-200 hover:border-blue-300 hover:shadow-md"
            >
              <BsCart3 className="text-[17px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-red-500 to-red-600 px-0.5 text-[9px] font-bold text-white shadow-[0_2px_6px_rgba(239,68,68,0.4)]">
                  {cartCountLabel}
                </span>
              )}
            </NavLink>

            {/* Burger Button */}
            <button
              onClick={() => setIsDrawerOpen((p) => !p)}
              id="mobile-burger-btn"
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/80 text-[#1a1a2e] transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              aria-label="Open menu"
            >
              <HiMenu className="text-[20px]" />
            </button>
          </div>
        </div>

        {/* ── Search Bar (collapsible) ── */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isSearchOpen ? "max-h-[70px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-200/60 px-4 py-2.5">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center overflow-hidden rounded-full border bg-white/90 shadow-sm transition-all duration-200 ${
                isSearchFocused
                  ? "border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                  : "border-gray-200"
              }`}
            >
              <IoSearch className="ml-3 shrink-0 text-base text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
                placeholder="Search products…"
                className="flex-1 bg-transparent px-2 py-2.5 text-[13px] text-[#1a1a2e] outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="flex cursor-pointer items-center border-none bg-transparent px-1.5 text-sm text-gray-400"
                >
                  <IoClose />
                </button>
              )}
              <button
                type="submit"
                className="btn-black m-1 px-4 py-[6px] text-[12px] font-semibold"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* ── Suggestions Dropdown (outside overflow-hidden) ── */}
        {isSearchOpen && isSearchFocused && searchSuggestions.length > 0 && (
          <div className="absolute top-full right-4 left-4 z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            {searchSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-[13px] text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                style={{
                  borderBottom:
                    idx < searchSuggestions.length - 1
                      ? "1px solid #f1f5f9"
                      : "none",
                }}
              >
                <IoSearch className="shrink-0 text-[14px] text-gray-400" />
                <span className="font-productSansReg">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* ── Drawer Overlay ── */}
      <div
        className={`fixed inset-0 z-[80] transition-all duration-300 ${
          isDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{ background: "rgba(15,20,40,0.55)", backdropFilter: "blur(4px)" }}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* ── Slide-in Drawer (right) ── */}
      <aside
        className={`fixed top-0 right-0 z-[90] flex h-full w-[310px] max-w-[92vw] flex-col overflow-hidden bg-white shadow-[0_0_50px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.15,1)] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div
          className="flex shrink-0 items-center justify-between px-5 py-4"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 60%, #1e4d8c 100%)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] shadow-md"
              style={{ background: "linear-gradient(135deg, #f0f4ff, #dbeafe)" }}
            >
              <img src={Logo} alt="Logo" className="w-8 object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-productSansBold text-[15px] tracking-[0.06em] text-white">
                BiSLIG
              </span>
              <span className="font-productSansBold text-[9px] tracking-[0.18em] text-blue-300">
                iCENTER
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20"
          >
            <HiX className="text-[18px]" />
          </button>
        </div>

        {/* ── User Panel ── */}
        {user ? (
          <div
            className="shrink-0 px-5 py-4"
            style={{
              background: "linear-gradient(180deg, #f8faff 0%, #eff6ff 100%)",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #1a1a2e, #3b82f6)",
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-productSansBold truncate text-[15px] text-[#1a1a2e]">
                  {user.name}
                </p>
                <p className="truncate text-[11.5px] text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="shrink-0 px-5 py-4"
            style={{
              background: "linear-gradient(180deg, #f8faff 0%, #eff6ff 100%)",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                navigate("/login");
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-blue-200 bg-white py-3 text-[14px] font-semibold text-blue-600 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
            >
              <FaRegUser />
              Sign in / Register
            </button>
          </div>
        )}

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Account Actions (only if logged in) */}
          {user && (
            <div className="px-4 pt-4 pb-2">
              <p className="mb-2 px-1 text-[10.5px] font-semibold tracking-[0.08em] text-gray-400 uppercase">
                Account
              </p>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* My Account */}
                <button
                  onClick={handleAccountClick}
                  className="flex w-full cursor-pointer items-center gap-3 border-none border-b border-gray-100 bg-transparent px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FaUserCircle className="text-[16px]" />
                  </div>
                  <span className="flex-1 text-[13.5px] font-medium text-gray-700">
                    My Account
                  </span>
                  <FaChevronRight className="text-[11px] text-gray-400" />
                </button>

                {/* My Orders */}
                <button
                  onClick={handleMyOrdersClick}
                  className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-3.5 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BsBoxSeam className="text-[16px]" />
                  </div>
                  <span className="flex-1 text-[13.5px] font-medium text-gray-700">
                    My Orders
                  </span>
                  <FaChevronRight className="text-[11px] text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <div className="px-4 pt-4 pb-2">
            <p className="mb-2 px-1 text-[10.5px] font-semibold tracking-[0.08em] text-gray-400 uppercase">
              Browse
            </p>
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 no-underline px-4 py-3.5 transition-all ${
                      i < navLinks.length - 1 ? "border-b border-gray-100" : ""
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-[#1a1a2e] to-[#2b4a8c] text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <HiSparkles
                        className={`shrink-0 text-sm ${isActive ? "text-amber-300" : "text-amber-400"}`}
                      />
                      <span className="flex-1 text-[13.5px] font-medium">
                        {link.label}
                      </span>
                      <FaChevronRight
                        className={`text-[11px] ${isActive ? "text-white/60" : "text-gray-400"}`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Logout (if logged in) */}
          {user && (
            <div className="px-4 pt-2 pb-4">
              <button
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-left text-[13.5px] font-medium text-red-500 transition-all hover:bg-red-100 hover:text-red-600"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                  <FaSignOutAlt className="text-[15px]" />
                </div>
                Sign Out
              </button>
            </div>
          )}

          {/* Social Links */}
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="mb-3 text-[10.5px] font-semibold tracking-[0.08em] text-gray-400 uppercase">
              Follow Us
            </p>
            <div className="flex gap-2.5">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a2e] text-[13px] text-white no-underline transition-transform duration-200 hover:scale-110 hover:bg-blue-700"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a2e] text-[13px] text-white no-underline transition-transform duration-200 hover:scale-110 hover:bg-pink-600"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a2e] text-[13px] text-white no-underline transition-transform duration-200 hover:scale-110 hover:bg-gray-700"
              >
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="px-5 pb-6">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <MdLocalShipping className="shrink-0 text-blue-500" />
                  Free Shipping on orders over ₱2,000
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <MdSecurity className="shrink-0 text-blue-500" />
                  1-Year Official Warranty
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <BsBagCheck className="shrink-0 text-blue-500" />
                  Cash on Delivery Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── AccountSidebar (works as a layered panel on mobile too) ── */}
      <AccountSidebar
        isOpen={isAccountSidebarOpen}
        onClose={() => setIsAccountSidebarOpen(false)}
      />
      <MyOrdersSidebar
        isOpen={isMyOrdersSidebarOpen}
        onClose={() => setIsMyOrdersSidebarOpen(false)}
      />
    </>
  );
}

export default MobileNavbar;
