import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { MdVerified } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";

// Fallback slides used only when the API returns nothing
const FALLBACK_SLIDES = [
  {
    tag: "Welcome to iCenter",
    headline: ["Premium Gadgets,", "Delivered", "Fast."],
    sub: "Official warranty · Secure Payment · Free shipping",
    cta: "Shop Now",
    ctaLink: "/",
    image: "",
    accent: "from-slate-950 via-[#0a0f1a] to-black",
    pill: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    glow: "bg-blue-500/20",
  },
];

// Tailwind safelist for dynamic classes coming from the backend API
// eslint-disable-next-line no-unused-vars
const THEME_SAFELIST = [
  "from-orange-950",
  "via-[#1a0a00]",
  "to-black",
  "bg-orange-500/20",
  "text-orange-300",
  "border-orange-500/30",
  "from-slate-950",
  "via-[#0a0f1a]",
  "bg-blue-500/20",
  "text-blue-300",
  "border-blue-500/30",
  "from-violet-950",
  "via-[#0d0a1a]",
  "bg-violet-500/20",
  "text-violet-300",
  "border-violet-500/30",
  "from-cyan-950",
  "via-[#00101a]",
  "bg-cyan-500/20",
  "text-cyan-300",
  "border-cyan-500/30",
  "from-rose-950",
  "via-[#1a0007]",
  "bg-rose-500/20",
  "text-rose-300",
  "border-rose-500/30",
  "from-emerald-950",
  "via-[#001a0a]",
  "bg-emerald-500/20",
  "text-emerald-300",
  "border-emerald-500/30",
];

function HeroSkeleton() {
  return (
    <section className="relative flex min-h-[80vh] laptop:min-h-screen w-full items-center overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a0f1a] to-black">
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] animate-pulse flex-col laptop:flex-row items-center justify-between gap-8 px-5 laptop:px-8 pt-20 laptop:pt-32 pb-16">
        <div className="flex w-full laptop:max-w-[560px] flex-col items-center laptop:items-start gap-5">
          <div className="h-5 w-32 laptop:h-6 laptop:w-40 rounded-full bg-white/10" />
          <div className="space-y-3 w-full">
            <div className="h-9 laptop:h-14 w-[80%] rounded-xl bg-white/10 mx-auto laptop:mx-0" />
            <div className="h-9 laptop:h-14 w-[65%] rounded-xl bg-white/10 mx-auto laptop:mx-0" />
            <div className="h-9 laptop:h-14 w-[55%] rounded-xl bg-white/10 mx-auto laptop:mx-0" />
          </div>
          <div className="h-4 w-64 laptop:w-80 rounded-full bg-white/10" />
          <div className="mt-2 flex gap-4">
            <div className="h-10 laptop:h-11 w-32 laptop:w-36 rounded-full bg-white/10" />
            <div className="h-10 laptop:h-11 w-24 laptop:w-28 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="relative hidden flex-1 items-center justify-center laptop:flex">
          <div className="h-[420px] w-[320px] rounded-3xl bg-white/5" />
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hero-slides");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSlides(
          Array.isArray(data) && data.length > 0 ? data : FALLBACK_SLIDES,
        );
      } catch {
        setSlides(FALLBACK_SLIDES);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 350);
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [current, slides.length]);

  if (loading) return <HeroSkeleton />;

  const slide = slides[current] ?? FALLBACK_SLIDES[0];

  return (
    <section
      className={`relative flex min-h-[80vh] laptop:min-h-screen w-full items-center overflow-hidden bg-gradient-to-br ${slide.accent} transition-all duration-700`}
    >
      {/* Background noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow orb */}
      <div
        className={`pointer-events-none absolute top-1/2 right-[10%] h-[600px] w-[600px] -translate-y-1/2 rounded-full blur-[120px] ${slide.glow} opacity-60 transition-all duration-700`}
      />

      {/* Content */}
      {/* Content wrapper */}
      <div
        className={`relative z-10 mx-auto flex w-full max-w-[1280px] flex-col laptop:flex-row items-center justify-between gap-4 laptop:gap-10 px-5 laptop:px-8 pt-20 laptop:pt-28 pb-12 laptop:pb-0 transition-opacity duration-350 ${
          animating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {/* ─── LEFT: Text Column ─── */}
        <div className="flex w-full laptop:max-w-[560px] flex-col items-center laptop:items-start gap-3 laptop:gap-6 text-center laptop:text-left">

          {/* Tag pill */}
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 laptop:px-3.5 py-1 text-[10px] laptop:text-xs font-semibold tracking-widest uppercase ${slide.pill}`}
          >
            <HiSparkles className="text-xs laptop:text-sm" />
            {slide.tag}
          </span>

          {/* Headline */}
          <h1 className="!text-[1.55rem] laptop:!text-6xl leading-[1.12] laptop:leading-[1.05] font-extrabold tracking-tight !text-white">
            {(slide.headline || []).filter(Boolean).map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Product image — mobile only, sits below headline */}
          {slide.image && (
            <div className="flex laptop:hidden w-full items-center justify-center py-1">
              <img
                src={slide.image}
                alt={slide.tag}
                style={{
                  maxHeight: "180px",
                  maxWidth: "160px",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.55))",
                  transition: "all 0.7s",
                }}
              />
            </div>
          )}

          {/* Subtitle */}
          {slide.sub && (
            <p className="text-[12.5px] laptop:text-base tracking-wide text-white/60 max-w-[280px] laptop:max-w-none">{slide.sub}</p>
          )}

          {/* Badges — desktop only */}
          <div className="hidden laptop:flex flex-wrap items-center gap-3">
            {["Official Warranty", "Secure Payment", "Free Shipping"].map(
              (b) => (
                <span
                  key={b}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-sm"
                >
                  <MdVerified className="text-emerald-400" /> {b}
                </span>
              ),
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 laptop:gap-4">
            <a
              href={slide.ctaLink || "/"}
              className="group flex items-center gap-2 rounded-full bg-white px-5 laptop:px-7 py-2.5 laptop:py-3 text-sm font-bold text-black transition-all duration-200 hover:gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
            >
              {slide.cta || "Shop Now"}
              <BsArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="#bestSeller"
              className="hidden laptop:inline text-sm font-medium text-white/50 underline underline-offset-4 transition hover:text-white/80"
            >
              View Best Sellers
            </a>
          </div>
        </div>

        {/* ─── RIGHT: Product image — laptop only ─── */}
        {slide.image && (
          <div className="hidden laptop:flex flex-1 items-center justify-center relative min-w-0">
            <img
              src={slide.image}
              alt={slide.tag}
              style={{
                position: "relative",
                zIndex: 10,
                maxHeight: "380px",
                maxWidth: "300px",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))",
                transition: "all 0.7s",
              }}
            />
          </div>
        )}
      </div>

      {/* Slide controls — only show when multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-4 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-4 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
          >
            <FaChevronRight />
          </button>

          {/* Dots */}
          <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute right-8 bottom-10 z-20 font-mono text-xs text-white/30">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </div>
        </>
      )}

      {/* Bottom fade */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
}

export default Hero;
