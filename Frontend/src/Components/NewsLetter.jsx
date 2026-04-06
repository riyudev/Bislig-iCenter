import React, { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import { MdEmail } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";

function NewsletterSignup() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please login to subscribe to the newsletter.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert("Successfully subscribed to the newsletter!");
      } else {
        alert(data.message || "Failed to subscribe.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while subscribing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-24">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0a0f1a 0%, #0f1a2e 50%, #060a12 100%)",
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[350px] w-[350px] -translate-y-1/2 rounded-full bg-blue-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-[300px] w-[300px] translate-y-1/2 rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[700px] px-6 text-center">
        {/* Icon */}
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
          <MdEmail className="text-3xl text-blue-400" />
        </div>

        {/* Tag */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold tracking-widest text-blue-400 uppercase">
            <HiSparkles /> Newsletter
          </span>
        </div>

        <h2 className="!text-white mb-4">Stay Updated with Bislig iCenter</h2>

        <p className="mb-8 text-base text-white/50">
          Get exclusive updates on the latest iPhones, laptops, and limited-time offers.
          Subscribe to our newsletter — we promise, no spam.
        </p>

        {/* Perks row */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/40">
          {["Exclusive deals", "New arrivals first", "No spam ever"].map((perk) => (
            <span key={perk} className="flex items-center gap-1.5">
              <HiSparkles className="text-blue-500" />
              {perk}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="group btn-black flex items-center gap-2 px-7 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe Now"}
            {!loading && <BsArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />}
          </button>
        </div>

        <p className="mt-4 text-xs text-white/25">
          By subscribing you agree to receive marketing emails from Bislig iCenter. Unsubscribe
          anytime.
        </p>
      </div>
    </section>
  );
}

export default NewsletterSignup;
