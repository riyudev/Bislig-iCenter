import React from "react";
import { motion } from "framer-motion";
import Store from "../assets/bisligiCenterStore.jpg";
import { FiCheckCircle, FiShield, FiStar, FiArrowRight } from "react-icons/fi";

function AboutStore() {
  const features = [
    { icon: <FiShield className="w-5 h-5" />, text: "100% Genuine Products" },
    { icon: <FiCheckCircle className="w-5 h-5" />, text: "Official Warranty Support" },
    { icon: <FiStar className="w-5 h-5" />, text: "Premium Customer Service" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0a0f1a] py-24">
      {/* ── Abstract Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-[20%] top-0 h-[600px] w-[600px] rounded-full bg-cyan-900/40 blur-[120px]" />
        <div className="absolute -right-[20%] bottom-0 h-[600px] w-[600px] rounded-full bg-blue-900/40 blur-[120px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 laptop:px-8">
        <div className="flex flex-col laptop:flex-row items-center justify-between gap-12 laptop:gap-16 lg:gap-24">
          
          {/* Left Side — Image with Premium Framing */}
          <motion.div
            className="w-full laptop:w-1/2 relative pr-0 laptop:pr-4 lg:pr-8"
            initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative mx-auto max-w-[500px]">
              {/* Outer decorative ring */}
              <div className="absolute -inset-4 rounded-3xl border border-white/10 bg-white/5" />
              {/* Image container */}
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-cyan-900/20 group">
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent opacity-60 z-10 transition-opacity duration-500 group-hover:opacity-40" />
                <img
                  src={Store}
                  alt="Bislig iCenter Store"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Floating stat card */}
              <motion.div 
                className="absolute -bottom-4 right-0 laptop:-bottom-6 laptop:-right-6 z-20 rounded-2xl border border-white/10 bg-[#111827]/80 p-4 laptop:p-5 backdrop-blur-md shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                    <FiStar className="h-6 w-6 fill-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">#1</div>
                    <div className="text-xs font-medium tracking-wider text-slate-400 uppercase">Trusted Reseller</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side — Text & Content */}
          <motion.div
            className="w-full laptop:w-1/2 space-y-6 laptop:space-y-8 text-left"
            initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="space-y-4">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-[11px] font-bold tracking-[0.2em] text-cyan-400 uppercase backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
                </span>
                Our Story
              </div>

              {/* Title */}
              <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
                More Than Just A{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Tech Store
                  </span>
                </span>
              </h2>
            </div>
            
            {/* Description */}
            <div className="space-y-6 text-[15px] laptop:text-[16px] leading-relaxed text-slate-300 xl:text-[18px] font-productSansLight">
              <p>
                Bislig iCenter is your premiere destination for cutting-edge technology in Bislig City. We are dedicated to bringing you the gold standard in digital lifestyle and mobile computing.
              </p>
              <p>
                Specializing in the complete ecosystem of <strong className="font-semibold text-white">Apple devices</strong> including iPhones, MacBooks, and iPads, alongside top-tier Android flagships.
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-4 text-left inline-block w-full max-w-md">
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center gap-3 text-slate-200"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner">
                    {feature.icon}
                  </div>
                  <span className="font-medium tracking-wide text-[15px]">{feature.text}</span>
                </motion.li>
              ))}
            </ul>

            {/* Actions */}
            <div className="pt-2 laptop:pt-4 flex flex-wrap gap-4 justify-start">
              <a 
                href="https://www.facebook.com/bisligicenter" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 laptop:gap-3 rounded-full bg-white px-6 laptop:px-8 py-3 laptop:py-3.5 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
              >
                <span>Discover More</span>
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutStore;
