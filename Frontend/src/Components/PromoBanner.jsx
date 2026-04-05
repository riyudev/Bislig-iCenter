import React from "react";
import { motion } from "framer-motion";
import iphone17 from "../assets/iphones/iphone17porange.png";
import { FiShoppingBag, FiClock, FiShield, FiZap } from "react-icons/fi";

const perks = [
  { icon: FiClock,   label: "Limited-Time Offer" },
  { icon: FiShield,  label: "1-Year Warranty" },
  { icon: FiZap,     label: "Fast Delivery" },
];

function PromoBanner() {
  return (
    <section className="relative overflow-hidden py-0">
      {/* ── Full-bleed dark background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f10] via-[#1c1206] to-[#0d0800]" />

      {/* Decorative orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-400/15 blur-[100px]"
      />

      {/* Grid noise texture overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)",
        }}
      />

      {/* ── Content wrapper ── */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center laptop:flex-row laptop:justify-between laptop:py-20 laptop:px-16 py-10 px-5 gap-6 laptop:gap-12">

        {/* ── LEFT: Product image ── */}
        <motion.div
          className="relative flex-shrink-0 laptop:w-[42%] flex justify-center"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-150px" }}
        >
          {/* Glowing ring behind phone */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-48 w-48 laptop:h-72 laptop:w-72 rounded-full bg-orange-500/25 blur-3xl" />
          </div>

          {/* Stylised product podium */}
          <div className="relative">
            <img
              src={iphone17}
              alt="iPhone 17 Pro"
              className="relative z-10 w-[180px] laptop:w-[360px] drop-shadow-2xl transition-transform duration-700 hover:-translate-y-3"
            />

            {/* Floating pill badge */}
            <motion.div
              className="absolute -top-3 -right-3 laptop:-top-4 laptop:-right-4 z-20 flex items-center gap-1 laptop:gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-2.5 laptop:px-3.5 py-1 laptop:py-1.5 text-[10px] laptop:text-xs font-bold text-white shadow-lg shadow-rose-500/30"
              initial={{ scale: 0, rotate: -12 }}
              whileInView={{ scale: 1, rotate: -6 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 260 }}
              viewport={{ once: true }}
            >
              ₱5,000 OFF
            </motion.div>

            {/* Subtle reflection */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-8 laptop:h-12 w-32 laptop:w-48 rounded-full bg-orange-400/25 blur-xl" />
          </div>
        </motion.div>

        {/* ── RIGHT: Text content ── */}
        <motion.div
          className="laptop:max-w-[50%] w-full space-y-4 laptop:space-y-7 text-center laptop:text-left"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-150px" }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3.5 laptop:px-4 py-1 laptop:py-1.5 text-[10px] laptop:text-xs font-semibold uppercase tracking-widest text-orange-300">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            Exclusive Deal
          </div>

          {/* Heading */}
          <h2 className="!text-white !text-3xl laptop:!text-5xl leading-tight">
            iPhone&nbsp;17&nbsp;Pro{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 bg-clip-text text-transparent">
              Offer
            </span>
          </h2>

          {/* Body copy */}
          <p className="text-slate-400 text-sm laptop:text-lg leading-relaxed font-productSansLight max-w-[320px] laptop:max-w-none mx-auto laptop:mx-0">
            Experience the future of performance and design. Get up to{" "}
            <span className="font-semibold text-white">₱5,000 off</span> for a
            limited time when you purchase at{" "}
            <span className="text-orange-300">Bislig iCenter</span>.
          </p>

          {/* Perk pills */}
          <ul className="flex flex-wrap justify-center laptop:justify-start gap-2 laptop:gap-3">
            {perks.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1 laptop:gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 laptop:px-3.5 py-1 laptop:py-1.5 text-[10.5px] laptop:text-xs text-slate-300 backdrop-blur-sm"
              >
                <Icon className="h-3 w-3 laptop:h-3.5 laptop:w-3.5 text-orange-400" />
                {label}
              </li>
            ))}
          </ul>

          {/* CTA row */}
          <div className="flex flex-row items-center gap-3 laptop:gap-4 justify-center laptop:justify-start">
            <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 laptop:px-8 py-3 laptop:py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-400/40 active:scale-95">
              <FiShoppingBag className="h-4 w-4" />
              Shop Now
            </button>
            <a
              href="/"
              className="text-sm text-slate-400 underline-offset-2 hover:text-white hover:underline transition-colors duration-200"
            >
              Learn more →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PromoBanner;
