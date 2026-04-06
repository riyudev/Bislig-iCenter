import React, { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import SlideModal from "../Components/SlideModal";
import SectionManager from "../Components/SectionManager";

const API = "/api/admin";
const getToken = () => localStorage.getItem("admin_token");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

// ─── Main Shop Page ────────────────────────────────────────────────────────
const Shop = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalSlide, setModalSlide] = useState(undefined); // undefined = closed, null = new, obj = edit
  const [deleting, setDeleting] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API}/products?limit=1000`, { headers: authHeader() });
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/hero-slides`, { headers: authHeader() });
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch {
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    await fetch(`${API}/hero-slides/${id}`, { method: "DELETE", headers: authHeader() });
    setConfirmDeleteId(null);
    setDeleting(null);
    load();
  };

  const handleUpdateProduct = async (productId, updateData) => {
    await fetch(`${API}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(updateData),
    });
    loadProducts();
  };

  const toggleActive = async (slide) => {
    await fetch(`${API}/hero-slides/${slide._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ isActive: !slide.isActive }),
    });
    load();
  };

  const moveOrder = async (slide, dir) => {
    await fetch(`${API}/hero-slides/${slide._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ order: (slide.order ?? 0) + dir }),
    });
    load();
  };

  return (
    <div className="min-h-full space-y-8 p-8">
      {/* Page Header */}
      <div>
        <h2 className="text-myblack">Shop</h2>
        <p className="mt-0.5 text-sm text-myblack/60">
          Manage the content components shown on the frontend shop page.
        </p>
      </div>

      {/* Hero Carousel Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-myblack">Hero Carousel</h3>
            <p className="mt-0.5 text-sm text-myblack/60">
              Manage the hero slides shown at the top of the shop page.
            </p>
          </div>
          <button
            onClick={() => setModalSlide(null)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <FaPlus className="text-xs" />
            New Slide
          </button>
        </div>

        {/* Slides grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <HiSparkles className="text-4xl text-slate-300" />
          <p className="font-productSansReg text-myblack/60">No hero slides yet.</p>
          <button
            onClick={() => setModalSlide(null)}
            className="mt-1 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create your first slide
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {slides.map((slide) => (
            <div
              key={slide._id}
              className={`group relative overflow-hidden rounded-2xl shadow-sm ring-1 ${
                slide.isActive ? "ring-black/5" : "opacity-60 ring-black/5"
              }`}
            >
              {/* Mini hero preview */}
              <div
                className={`relative flex h-40 items-center justify-between overflow-hidden bg-gradient-to-br px-5 ${slide.accent}`}
              >
                <div className="z-10 flex flex-col gap-1.5">
                  <span
                    className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${slide.pill}`}
                  >
                    <HiSparkles className="text-[9px]" />
                    {slide.tag}
                  </span>
                  <div className="text-sm font-extrabold leading-tight text-white">
                    {(slide.headline || []).filter(Boolean).map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                  <p className="line-clamp-1 text-[10px] leading-tight text-white/60">
                    {slide.sub}
                  </p>
                </div>
                {slide.image && (
                  <img
                    src={
                      slide.image?.startsWith("http")
                        ? slide.image
                        : `${import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`}${slide.image}`
                    }
                    alt={slide.tag}
                    className="absolute right-3 top-1/2 z-10 h-32 w-auto max-w-[130px] -translate-y-1/2 object-contain drop-shadow-lg"
                  />
                )}
                <div
                  className={`pointer-events-none absolute right-[15%] top-1/2 h-32 w-32 -translate-y-1/2 rounded-full blur-3xl opacity-70 ${slide.glow}`}
                />
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      slide.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {slide.isActive
                      ? <FaEye className="text-[9px]" />
                      : <FaEyeSlash className="text-[9px]" />}
                    {slide.isActive ? "Visible" : "Hidden"}
                  </span>
                  <span className="text-xs text-slate-400">Order: {slide.order ?? 0}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    title="Move up"
                    onClick={() => moveOrder(slide, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <FaChevronUp className="text-[10px]" />
                  </button>
                  <button
                    title="Move down"
                    onClick={() => moveOrder(slide, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <FaChevronDown className="text-[10px]" />
                  </button>
                  <button
                    title={slide.isActive ? "Hide slide" : "Show slide"}
                    onClick={() => toggleActive(slide)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    {slide.isActive
                      ? <FaToggleOn className="text-sm text-emerald-500" />
                      : <FaToggleOff className="text-sm text-slate-400" />}
                  </button>
                  <button
                    title="Edit"
                    onClick={() => setModalSlide(slide)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50"
                  >
                    <FaEdit className="text-[11px]" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setConfirmDeleteId(slide._id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <FaTrash className="text-[11px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      <SectionManager
        title="Best Sellers"
        description="Select up to 3 products to display in the Best Seller section."
        flag="isBestSeller"
        maxCount={3}
        products={products}
        onUpdateProduct={handleUpdateProduct}
      />

      <SectionManager
        title="Latest Products"
        description="Select up to 4 products to feature in the Just Arrived section."
        flag="isNew"
        maxCount={4}
        products={products}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* Slide modal */}
      {modalSlide !== undefined && (
        <SlideModal
          slide={modalSlide || null}
          onClose={() => setModalSlide(undefined)}
          onSaved={() => { setModalSlide(undefined); load(); }}
        />
      )}

      {/* Delete confirm */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h4 className="font-productSansReg text-myblack mb-2">Delete Slide?</h4>
            <p className="mb-5 text-sm text-myblack/60">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={!!deleting}
                onClick={() => handleDelete(confirmDeleteId)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
