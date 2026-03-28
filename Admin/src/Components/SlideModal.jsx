import React, { useRef, useState } from "react";
import {
  FaImage,
  FaToggleOff,
  FaToggleOn,
  FaTimes,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const API = "/api/admin";
const getToken = () => localStorage.getItem("admin_token");

export const THEME_PRESETS = [
  {
    label: "Orange",
    accent: "from-orange-950 via-[#1a0a00] to-black",
    pill: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    glow: "bg-orange-500/20",
  },
  {
    label: "Slate/Blue",
    accent: "from-slate-950 via-[#0a0f1a] to-black",
    pill: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    glow: "bg-blue-500/20",
  },
  {
    label: "Violet",
    accent: "from-violet-950 via-[#0d0a1a] to-black",
    pill: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    glow: "bg-violet-500/20",
  },
  {
    label: "Cyan",
    accent: "from-cyan-950 via-[#00101a] to-black",
    pill: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    glow: "bg-cyan-500/20",
  },
  {
    label: "Rose",
    accent: "from-rose-950 via-[#1a0007] to-black",
    pill: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    glow: "bg-rose-500/20",
  },
  {
    label: "Emerald",
    accent: "from-emerald-950 via-[#001a0a] to-black",
    pill: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    glow: "bg-emerald-500/20",
  },
];

const CTA_LINK_OPTIONS = [
  { label: "iPhone — /iphone", value: "/iphone" },
  { label: "iPad — /ipad", value: "/ipad" },
  { label: "Android — /android", value: "/android" },
  { label: "Laptop — /laptop", value: "/laptop" },
];

export const BLANK_SLIDE = {
  tag: "",
  headline: ["", "", ""],
  sub: "",
  cta: "Shop Now",
  ctaLink: "/iphone",
  image: "",
  accent: THEME_PRESETS[0].accent,
  pill: THEME_PRESETS[0].pill,
  glow: THEME_PRESETS[0].glow,
  isActive: true,
  order: 0,
};

const inputCls =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelCls =
  "mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider";

function SlideModal({ slide, onClose, onSaved }) {
  const [form, setForm] = useState(
    slide
      ? {
          ...slide,
          headline: Array.isArray(slide.headline)
            ? [...slide.headline, "", "", ""].slice(0, 3)
            : ["", "", ""],
        }
      : { ...BLANK_SLIDE }
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const setLine = (i, val) =>
    setForm((prev) => {
      const h = [...prev.headline];
      h[i] = val;
      return { ...prev, headline: h };
    });

  const handleTheme = (preset) =>
    setForm((prev) => ({
      ...prev,
      accent: preset.accent,
      pill: preset.pill,
      glow: preset.glow,
    }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("image", file);
    const token = getToken();
    try {
      const res = await fetch(`${API}/hero-slides/upload-image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        setError(data?.message || "Image upload failed.");
        return;
      }
      const fullUrl = data.url.startsWith("http")
        ? data.url
        : `http://localhost:5000${data.url}`;
      set("image", fullUrl);
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.tag.trim()) { setError("Tag is required."); return; }
    if (!form.headline[0].trim()) { setError("At least one headline line is required."); return; }
    if (!form.image) { setError("Please upload a product image."); return; }

    setSaving(true);
    setError("");
    const payload = {
      ...form,
      headline: form.headline.filter((l) => l.trim()),
      order: Number(form.order) || 0,
    };
    try {
      const token = getToken();
      const url = slide
        ? `${API}/hero-slides/${slide._id}`
        : `${API}/hero-slides`;
      const res = await fetch(url, {
        method: slide ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      onSaved();
    } catch {
      setError("Failed to save slide.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h3 className="font-productSansReg text-myblack text-lg">
            {slide ? "Edit Hero Slide" : "New Hero Slide"}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <FaTimes className="text-myblack/60" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
          )}

          {/* Tag */}
          <div>
            <label className={labelCls}>Tag / Badge Label</label>
            <input
              className={inputCls}
              placeholder="e.g. New Arrival — iPhone 17 Pro"
              value={form.tag}
              onChange={(e) => set("tag", e.target.value)}
            />
          </div>

          {/* Headline */}
          <div>
            <label className={labelCls}>Headline (up to 3 lines)</label>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  className={inputCls}
                  placeholder={`Line ${i + 1}${i === 0 ? " (required)" : " (optional)"}`}
                  value={form.headline[i] || ""}
                  onChange={(e) => setLine(i, e.target.value)}
                />
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className={labelCls}>Subtitle / Specs</label>
            <input
              className={inputCls}
              placeholder="e.g. 48MP Fusion · A19 Pro chip · Titanium design"
              value={form.sub}
              onChange={(e) => set("sub", e.target.value)}
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>CTA Button Label</label>
              <input
                className={inputCls}
                placeholder="Shop iPhone"
                value={form.cta}
                onChange={(e) => set("cta", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>CTA Link</label>
              <select
                className={inputCls + " cursor-pointer bg-white"}
                value={form.ctaLink}
                onChange={(e) => set("ctaLink", e.target.value)}
              >
                {CTA_LINK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Order & Active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Display Order</label>
              <input
                type="number"
                min="0"
                className={inputCls}
                value={form.order}
                onChange={(e) => set("order", e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className={labelCls}>Status</label>
              <button
                type="button"
                onClick={() => set("isActive", !form.isActive)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  form.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {form.isActive
                  ? <FaToggleOn className="text-emerald-500 text-xl" />
                  : <FaToggleOff className="text-slate-400 text-xl" />}
                {form.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className={labelCls}>Product Image</label>
            <div className="flex items-center gap-4">
              {form.image ? (
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={form.image}
                    alt="hero"
                    className="h-full w-full object-contain"
                  />
                  <button
                    onClick={() => set("image", "")}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500"
                  >
                    <FaTimes className="text-[9px]" />
                  </button>
                </div>
              ) : (
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                  <FaImage className="text-2xl text-slate-300" />
                </div>
              )}
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                >
                  {uploading ? "Uploading…" : form.image ? "Replace Image" : "Upload Image"}
                </button>
                <p className="mt-1.5 text-xs text-slate-400">
                  PNG, JPG, WebP — transparent bg preferred
                </p>
              </div>
            </div>
          </div>

          {/* Colour theme */}
          <div>
            <label className={labelCls}>Colour Theme</label>
            <div className="flex flex-wrap gap-2">
              {THEME_PRESETS.map((preset) => {
                const active = form.accent === preset.accent;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleTheme(preset)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? "border-blue-500 bg-blue-600 text-white shadow"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Live mini-preview */}
            <div
              className={`mt-3 flex h-16 items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br px-4 ${form.accent}`}
            >
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${form.pill}`}
              >
                <HiSparkles className="text-[10px]" />
                {form.tag || "Tag Preview"}
              </span>
              <div className={`ml-auto h-8 w-8 rounded-full blur-lg ${form.glow}`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : slide ? "Save Changes" : "Create Slide"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SlideModal;
