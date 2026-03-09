import React, { useEffect, useState } from "react";

const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const load = async () => {
    const token = localStorage.getItem("admin_token");
    setLoading(true);
    const res = await fetch("/api/admin/products/low-stock", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const adjust = async (productId, variant, color, delta) => {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/admin/products/${productId}/adjust-stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ variant, color, delta }),
    });
    load();
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2>Inventory</h2>
        <p className="text-myblack/70">Low stock overview and quick adjustments.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Variant</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Color</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td className="px-6 py-6" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td className="px-6 py-6" colSpan={5}>
                  No low-stock items.
                </td>
              </tr>
            ) : (
              products.flatMap((p) =>
                (p.stockItems || []).map((s, idx) => (
                  <tr key={`${p._id}-${idx}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img className="h-10 w-10 rounded-xl object-cover" src={p.image} alt={p.name} />
                        <div>
                          <p className="font-productSansReg text-myblack">{p.name}</p>
                          <p className="text-xs text-myblack/60">threshold: {p.lowStockThreshold ?? 5}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-myblack/70">{s.variant}</td>
                    <td className="px-6 py-4 text-myblack/70">{s.color}</td>
                    <td className="px-6 py-4 text-myblack">
                      <span className={`${s.stock <= (p.lowStockThreshold ?? 5) ? "text-rose-600" : ""}`}>
                        {s.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="rounded-full bg-white px-4 py-2 ring-1 ring-myblack/10 hover:ring-blue-500"
                          onClick={() => adjust(p._id, s.variant, s.color, 1)}
                        >
                          +1
                        </button>
                        <button
                          className="rounded-full bg-white px-4 py-2 ring-1 ring-myblack/10 hover:ring-blue-500"
                          onClick={() => adjust(p._id, s.variant, s.color, -1)}
                        >
                          -1
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
