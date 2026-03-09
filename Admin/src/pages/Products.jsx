import React, { useEffect, useState } from "react";

const Products = () => {
  const [state, setState] = useState({ loading: true, products: [], pages: 1, page: 1 });
  const [filter, setFilter] = useState({ search: "", category: "", status: "" });

  const fetchProducts = async (page = 1) => {
    const token = localStorage.getItem("admin_token");
    const query = new URLSearchParams({
      page,
      limit: 20,
      ...(filter.search && { search: filter.search }),
      ...(filter.category && { category: filter.category }),
      ...(filter.status && { status: filter.status }),
    }).toString();

    setState((p) => ({ ...p, loading: true }));
    const res = await fetch(`/api/admin/products?${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    setState({
      loading: false,
      products: data.products || [],
      pages: data.pages || 1,
      page: data.page || page,
    });
  };

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.category, filter.status]);

  const deactivate = async (id) => {
    if (!confirm("Deactivate this product?") ) return;
    const adminToken = localStorage.getItem("admin_token");
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
    });
    fetchProducts(state.page);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2>Products</h2>
          <p className="text-myblack/70">Manage your catalog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          placeholder="Search..."
          value={filter.search}
          onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchProducts(1);
          }}
        />
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.category}
          onChange={(e) => setFilter((p) => ({ ...p, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="iphone">iPhone</option>
          <option value="ipad">iPad</option>
          <option value="laptop">Laptop</option>
          <option value="android">Android</option>
        </select>
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.status}
          onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Product</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Active</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {state.loading ? (
              <tr>
                <td className="px-6 py-6" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : state.products.length === 0 ? (
              <tr>
                <td className="px-6 py-6" colSpan={5}>
                  No products found.
                </td>
              </tr>
            ) : (
              state.products.map((p) => (
                <tr key={p._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img className="h-10 w-10 rounded-xl object-cover" src={p.image} alt={p.name} />
                      <div>
                        <p className="font-productSansReg text-myblack">{p.name}</p>
                        <p className="text-xs text-myblack/60">{p._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-myblack/70">{p.category}</td>
                  <td className="px-6 py-4 text-sm text-myblack">₱{Number(p.newPrice || 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deactivate(p._id)}
                      className="rounded-full border border-myblack/10 bg-white px-4 py-2 hover:border-rose-500"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: state.pages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchProducts(i + 1)}
            className={`rounded-full px-4 py-2 ${state.page === i + 1 ? "bg-blue-600 text-white" : "bg-white ring-1 ring-myblack/10 hover:ring-blue-500"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Products;
