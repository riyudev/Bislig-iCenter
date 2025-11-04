import React from "react";
import { motion } from "framer-motion";
import iphone17 from "../assets/iphones/iphone17porange.png";

function PromoBanner() {
  return (
    <section className="to-creamyWhite laptop:flex-row laptop:justify-between laptop:py-20 laptop:px-24 flex flex-col items-center justify-center bg-gradient-to-b from-sky-200/50 via-sky-100/50 py-16 text-center">
      {/* Text Side */}
      <motion.div
        className="laptop:max-w-[45%] space-y-6 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-200px" }}
      >
        <h2 className="text-myblack">Exclusive iPhone 17 Pro Offer</h2>
        <p className="text-myblack/80 laptop:text-lg">
          Experience the future of performance and design. Get up to ₱5,000 off
          for a limited time when you purchase at Bislig iCenter.
        </p>

        <button className="btn-blue laptop:w-fit w-full cursor-pointer px-8 py-3">
          Shop Now
        </button>
      </motion.div>

      {/* Image Side */}
      <motion.div
        className="laptop:mt-0 laptop:w-[40%] mt-10"
        initial={{ opacity: 0, x: 70 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-200px" }}
      >
        <img
          src={iphone17}
          alt="iPhone 17 Pro"
          className="laptop:w-[400px] mx-auto w-[280px] drop-shadow-2xl"
        />
      </motion.div>
    </section>
  );
}

export default PromoBanner;
