import React from "react";
import { motion } from "framer-motion";
import Store from "../assets/bisligiCenterStore.jpg";

function AboutStore() {
  return (
    <section className="bg-ghostWhite laptop:py-20 laptop:px-24 px-6 py-16">
      <div className="laptop:flex-row flex flex-col items-center justify-between gap-12">
        {/* Left Side — Image */}
        <motion.div
          className="laptop:w-1/2"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <img
            src={Store}
            alt="Bislig iCenter Store"
            className="mx-auto w-full max-w-[450px] rounded-2xl shadow-xl"
          />
        </motion.div>

        {/* Right Side — Text */}
        <motion.div
          className="laptop:w-1/2 laptop:text-left space-y-6 text-center"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-myblack">About Bislig iCenter</h2>
          <p className="text-myblack/80 laptop:text-lg">
            Bislig iCenter is your trusted local Apple reseller and tech shop
            based in Bislig City. We specialize in offering the latest{" "}
            <strong>iPhones</strong>, <strong>MacBooks</strong>,
            <strong> iPads</strong>, and select <strong>Android devices</strong>{" "}
            — with genuine products, warranty support, and personalized customer
            service.
          </p>
          <p className="text-myblack/80 laptop:text-lg">
            Our mission is to make cutting-edge technology accessible to
            everyone in Bislig and beyond, blending affordability with
            authenticity.
          </p>
          <button className="btn-black px-8 py-3">Learn More</button>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutStore;
