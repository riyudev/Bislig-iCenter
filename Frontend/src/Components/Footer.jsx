import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { MdLocalShipping, MdSecurity, MdVerified } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import Logo from "../assets/bislig-iCenter-Logo.png";

function Footer() {
  const SURANCE_PERKS = [
    {
      icon: <MdLocalShipping className="text-xl text-cyan-400" />,
      title: "Free Nationwide Shipping",
      desc: "For orders above ₱2,000",
    },
    {
      icon: <MdSecurity className="text-xl text-cyan-400" />,
      title: "1-Year Official Warranty",
      desc: "Guaranteed authentic",
    },
    {
      icon: <BiSupport className="text-xl text-cyan-400" />,
      title: "24/7 Premium Support",
      desc: "Dedicated tech rescue",
    },
    {
      icon: <MdVerified className="text-xl text-cyan-400" />,
      title: "Certified Authentic",
      desc: "100% Genuine products",
    },
  ];

  const location = useLocation();
  if (location.pathname === "/checkout") {
    return null;
  }

  return (
    <footer className="bg-myblack text-ghostWhite relative overflow-hidden pt-16 pb-8">
      {/* Premium Glow Accents */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="pointer-events-none absolute top-[-100px] -left-[20%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-[20%] bottom-[-100px] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="laptop:px-8 relative z-10 mx-auto max-w-7xl px-6">
        {/* Perks Section */}
        <div className="tablet:grid-cols-2 laptop:grid-cols-4 mb-16 grid grid-cols-1 gap-8 border-b border-white/10 pb-12">
          {SURANCE_PERKS.map((perk, i) => (
            <div
              key={i}
              className="laptop:items-start laptop:text-left group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-colors group-hover:bg-cyan-500/20">
                {perk.icon}
              </div>
              <h4 className="mb-1 text-sm font-semibold tracking-wide text-white uppercase">
                {perk.title}
              </h4>
              <p className="font-productSansLight text-sm text-gray-400 transition-colors group-hover:text-gray-300">
                {perk.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="laptop:flex-row laptop:items-start laptop:justify-between laptop:gap-8 flex flex-col items-center gap-12">
          {/* Logo & About */}
          <div className="laptop:max-w-md laptop:text-left space-y-6 text-center">
            <div className="laptop:justify-start flex justify-center">
              <Link
                to="/"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl p-1 shadow-lg shadow-cyan-500/20"
                  style={{
                    background: "linear-gradient(135deg, #f0f4ff, #dbeafe)",
                  }}
                >
                  <img
                    src={Logo}
                    alt="Bislig iCenter Logo"
                    className="w-[85%] object-contain"
                  />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="font-productSansBold text-[19px] tracking-[0.06em] text-white">
                    BiSLIG
                  </span>
                  <span className="font-productSansBold text-[11px] tracking-[0.18em] text-cyan-400">
                    iCENTER
                  </span>
                </div>
              </Link>
            </div>
            <p className="font-productSansLight text-sm leading-relaxed text-gray-400">
              Your ultimate destination for premium tech in Bislig City. We
              offer the complete Apple ecosystem and elite Android flagships
              with unparalleled service, guaranteed authenticity, and
              cutting-edge accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div className="laptop:text-left space-y-5 text-center">
            <h5 className="text-sm font-bold tracking-widest text-white uppercase">
              Quick Links
            </h5>
            <ul className="test-sm font-productSansLight space-y-3 text-gray-400">
              {["Shop", "Laptop", "iPhone", "iPad", "Android"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Shop" ? "/" : `/${item.toLowerCase()}`}
                    className="relative inline-flex items-center transition-all duration-300 hover:translate-x-1 hover:text-cyan-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials - No Subscribe Box */}
          <div className="laptop:items-start flex flex-col items-center space-y-6">
            <h5 className="text-sm font-bold tracking-widest text-white uppercase">
              Connect With Us
            </h5>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-pink-500 hover:bg-pink-600 hover:shadow-[0_0_15px_rgba(219,39,119,0.4)]"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-500 hover:bg-gray-700 hover:shadow-[0_0_15px_rgba(75,85,99,0.4)]"
              >
                <FaTiktok className="text-sm" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="tablet:flex-row tablet:text-left tablet:space-y-0 font-productSansLight mt-16 flex flex-col items-center justify-between space-y-4 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Bislig iCenter. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
