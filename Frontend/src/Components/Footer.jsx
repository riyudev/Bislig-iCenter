import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";

function Footer() {
  return (
    <footer className="bg-myblack text-creamyWhite laptop:py-14 laptop:px-24 px-6 py-10">
      <div className="laptop:flex-row laptop:items-start laptop:gap-0 flex flex-col items-center justify-between gap-10">
        {/* Left: Logo + About */}
        <div className="laptop:text-left space-y-3 text-center">
          <h4 className="text-creamyWhite">Bislig iCenter</h4>
          <p className="laptop:text-base text-creamyWhite/80 max-w-sm text-sm">
            Your trusted Apple and tech partner in Bislig City. Shop iPhones,
            iPads, Laptops, and more — all in one place.
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div className="laptop:items-start flex flex-col items-center space-y-2">
          <h5 className="text-creamyWhite mb-1">Quick Links</h5>
          <ul className="text-creamyWhite/80 laptop:text-base space-y-1 text-sm">
            <li className="cursor-pointer transition hover:text-white">Shop</li>
            <li className="cursor-pointer transition hover:text-white">
              About
            </li>
            <li className="cursor-pointer transition hover:text-white">
              Contact
            </li>
            <li className="cursor-pointer transition hover:text-white">FAQs</li>
          </ul>
        </div>

        {/* Right: Socials */}
        <div className="laptop:items-start flex flex-col items-center space-y-3">
          <h5 className="text-creamyWhite">Follow Us</h5>
          <div className="flex gap-4">
            <a
              href="#"
              className="rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 p-2 transition hover:scale-110"
            >
              <FaFacebookF className="text-lg text-white" />
            </a>
            <a
              href="#"
              className="rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 p-2 transition hover:scale-110"
            >
              <FaInstagram className="text-lg text-white" />
            </a>
            <a
              href="#"
              className="rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 p-2 transition hover:scale-110"
            >
              <FaXTwitter className="text-lg text-white" />
            </a>
            <a
              href="#"
              className="rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 p-2 transition hover:scale-110"
            >
              <FaLinkedinIn className="text-lg text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-creamyWhite/30 text-creamyWhite/60 mt-10 border-t pt-6 text-center text-sm">
        © {new Date().getFullYear()} Bislig iCenter. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
