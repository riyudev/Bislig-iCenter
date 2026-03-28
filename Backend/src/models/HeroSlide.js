import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true, trim: true },
    headline: [{ type: String, required: true }],
    sub: { type: String, default: "" },
    cta: { type: String, default: "Shop Now" },
    ctaLink: { type: String, default: "/" },
    image: { type: String, required: true },
    accent: { type: String, default: "from-slate-950 via-[#0a0f1a] to-black" },
    pill: { type: String, default: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    glow: { type: String, default: "bg-blue-500/20" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

heroSlideSchema.index({ order: 1 });
heroSlideSchema.index({ isActive: 1 });

export default mongoose.model("HeroSlide", heroSlideSchema);
