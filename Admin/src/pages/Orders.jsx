import React, { useEffect, useState } from "react";

const Orders = () => {
  const [state, setState] = useState({
    loading: true,
    orders: [],
    pages: 1,
    page: 1,
  });
  const [filter, setFilter] = useState({ search: "", status: "" });

  const fetchOrders = async (page = 1) => {
    const token = localStorage.getItem("admin_token");
    const query = new URLSearchParams({
      page,
      limit: 20,
      ...(filter.search && { search: filter.search }),
      ...(filter.status && { status: filter.status }),
    }).toString();

    setState((p) => ({ ...p, loading: true }));
    const res = await fetch(`/api/admin/orders?${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    setState({
      loading: false,
      orders: data.orders || [],
      pages: data.pages || 1,
      page: data.page || page,
    });
  };

  useEffect(() => {
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.status]);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    fetchOrders(state.page);
  };

  const formatVariant = (variantStr) => {
    if (!variantStr || variantStr === "Default") return "";
    const parts = variantStr.split("+").map(p => p.trim());
    if (parts.length === 2) {
      const match0 = parts[0].match(/^(\d+)(GB|TB)$/i);
      const match1 = parts[1].match(/^(\d+)(GB|TB)$/i);
      if (match0 && match1) {
        const val0 = parseInt(match0[1]);
        const unit0 = match0[2].toUpperCase();
        const val1 = parseInt(match1[1]);
        const unit1 = match1[2].toUpperCase();
        
        let isPart0Storage = false;
        if (unit0 === "TB") isPart0Storage = true;
        else if (unit1 === "TB") isPart0Storage = false;
        else if (val0 > val1 && val0 >= 32) isPart0Storage = true;
        
        if (isPart0Storage) {
          return `${parts[1]} + ${parts[0]}`;
        }
      }
    }
    return variantStr;
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2>Orders</h2>
        <p className="text-myblack/70">Manage COD/manual orders.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          placeholder="Search by order #, name, item..."
          value={filter.search}
          onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
          onKeyDown={(e) => {
            fetchOrders(1);
          }}
        />
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.status}
          onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Order #
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Customer
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Items
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Total
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {state.loading ? (
              <tr>
                <td className="px-4 py-6" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : state.orders.length === 0 ? (
              <tr>
                <td className="px-4 py-6" colSpan={6}>
                  No orders.
                </td>
              </tr>
            ) : (
              state.orders.map((o) => (
                <tr key={o._id}>
                  <td className="px-3 py-3 font-productSansReg text-sm text-myblack">
                    {o.orderNumber}
                  </td>
                  <td className="px-3 py-3 text-myblack/70">
                    <div className="text-sm font-semibold text-myblack">
                      {o.customer?.name}
                    </div>
                    <div className="text-xs">{o.customer?.phone}</div>
                    {o.customer?.address && (
                      <div
                        className="mt-0.5 text-xs text-slate-500 leading-tight line-clamp-2"
                        title={o.customer.address}
                      >
                        {o.customer.address}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3 text-myblack/70 text-sm max-w-[250px]">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">
                        <div className="text-xs leading-tight font-semibold text-myblack">
                          {item.name}
                          <span className="font-normal text-slate-500 ml-1">
                            ({item.variant && item.variant !== "Default" ? `${formatVariant(item.variant)} | ` : ""}{item.color}) x{item.quantity}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                          ₱{Number(item.unitPrice || 0).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-myblack">
                    ₱{Number(o.total || 0).toLocaleString()}
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      className="rounded-xl border border-myblack/10 bg-white px-3 py-2"
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
            onClick={() => fetchOrders(i + 1)}
            className={`rounded-full px-4 py-2 ${
              state.page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white ring-1 ring-myblack/10 hover:ring-blue-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;
