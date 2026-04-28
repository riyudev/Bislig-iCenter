import React, { useEffect, useState, useCallback } from "react";
import { fetchJSON, fetchWithRetry } from "../utils/fetchWithRetry";

const Orders = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    orders: [],
    pages: 1,
    page: 1,
  });
  const [filter, setFilter] = useState({ search: "", status: "", paymentMethod: "" });

  const fetchOrders = useCallback(async (page = 1) => {
    const query = new URLSearchParams({
      page,
      limit: 20,
      ...(filter.search && { search: filter.search }),
      ...(filter.status && { status: filter.status }),
      ...(filter.paymentMethod && { paymentMethod: filter.paymentMethod }),
    }).toString();

    setState((p) => ({ ...p, loading: true, error: null }));

    try {
      const { ok, data } = await fetchJSON(`/api/admin/orders?${query}`);
      if (!ok) {
        throw new Error(data?.message || "Failed to load orders");
      }
      setState({
        loading: false,
        error: null,
        orders: data.orders || [],
        pages: data.pages || 1,
        page: data.page || page,
      });
    } catch (err) {
      console.error(err);
      setState((p) => ({
        ...p,
        loading: false,
        error: err?.message || "Failed to load orders",
      }));
    }
  }, [filter.search, filter.status, filter.paymentMethod]);

  useEffect(() => {
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.status, filter.paymentMethod]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetchWithRetry(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      fetchOrders(state.page);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.paymentMethod}
          onChange={(e) => setFilter((p) => ({ ...p, paymentMethod: e.target.value }))}
        >
          <option value="">All Payment Methods</option>
          <option value="paypal">PayPal</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {state.error ? (
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-8 text-center space-y-4">
          <p className="text-rose-600 font-medium">{state.error}</p>
          <button
            onClick={() => fetchOrders(state.page)}
            className="btn-black px-6 py-2"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-myblack/10 bg-white">
          <table className="w-full text-left text-sm text-myblack/80">
            <thead className="border-b border-myblack/10 bg-slate-50 text-xs uppercase text-myblack/60">
              <tr>
                <th className="px-3 py-4 font-productSansBold text-left">Order #</th>
                <th className="px-3 py-4 font-productSansBold text-left">Date</th>
                <th className="px-3 py-4 font-productSansBold text-left">Customer</th>
                <th className="px-3 py-4 font-productSansBold text-left">Items</th>
                <th className="px-3 py-4 font-productSansBold text-left">Total</th>
                <th className="px-3 py-4 font-productSansBold text-left">Payment Method</th>
                <th className="px-3 py-4 font-productSansBold text-left">Status</th>
                <th className="px-3 py-4 font-productSansBold text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {state.loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={8}>
                    Loading...
                  </td>
                </tr>
              ) : state.orders.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={8}>
                    No orders.
                  </td>
                </tr>
              ) : (
                state.orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50 border-b border-myblack/5 transition-colors">
                    <td className="px-3 py-3 font-productSansReg text-sm text-myblack">
                      {o.orderNumber}
                    </td>
                    <td className="px-3 py-3 text-sm text-myblack/70">
                      <div className="font-medium text-myblack whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
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
                      {o.paymentMethod === "paypal" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.379 3.034.682 6.028-2.14 7.865-1.798 1.17-4.013 1.394-5.974 1.394H10.67l-1.181 7.487h3.237c.459 0 .85-.334.922-.787l.038-.193.733-4.648.047-.256a.932.932 0 0 1 .922-.787h.58c3.76 0 6.703-1.528 7.561-5.946.36-1.848.173-3.394-.707-4.588z"/>
                          </svg>
                          PayPal
                        </span>
                      )}
                      {o.paymentMethod === "cod" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1C6.477 1 2 5.477 2 11s4.477 10 10 10 10-4.477 10-10S17.523 1 12 1zm.75 14.5h-1.5v-1.5h1.5v1.5zm0-3h-1.5V7h1.5v5.5z"/>
                          </svg>
                          Cash on Delivery
                        </span>
                      )}
                      {!o.paymentMethod && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                          —
                        </span>
                      )}
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
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
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
      )}

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
