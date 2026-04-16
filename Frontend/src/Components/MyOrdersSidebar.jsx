import React, { useState, useEffect } from "react";
import {
  FaTimes, FaBox, FaShoppingBag, FaCheckCircle, FaTimesCircle,
  FaTruck, FaClock, FaMapMarkerAlt, FaSpinner, FaStar, FaRegStar,
  FaUndoAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ── Auto-receive countdown helper ─────────────────────────────────── */
function daysUntilAutoReceive(deliveredDate) {
  if (!deliveredDate) return null;
  const AUTO_DAYS = 3;
  const delivered = new Date(deliveredDate);
  const autoDate  = new Date(delivered.getTime() + AUTO_DAYS * 24 * 60 * 60 * 1000);
  const diff = Math.ceil((autoDate - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

/* ── Star picker sub-component ──────────────────────────────────────── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-3xl transition-transform hover:scale-125 cursor-pointer"
        >
          {star <= (hovered || value)
            ? <FaStar className="text-amber-400" />
            : <FaRegStar className="text-slate-300" />}
        </button>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
function MyOrdersSidebar({ isOpen, onClose }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  // Cancel modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel]     = useState(null);
  const [cancelling, setCancelling]           = useState(false);

  // Order-received flow
  const [receivedOrderId, setReceivedOrderId]   = useState(null);   // which order is being confirmed
  const [confirmingReceived, setConfirmingReceived] = useState(false);
  // Modal A – success + prompt to rate
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successOrderData, setSuccessOrderData] = useState(null);   // { orderId, items }
  // Modal B – rate form
  const [rateModalOpen, setRateModalOpen]       = useState(false);
  const [rateOrderId, setRateOrderId]           = useState(null);
  const [rateProductId, setRateProductId]       = useState(null);
  const [rateProductName, setRateProductName]   = useState("");
  const [starValue, setStarValue]               = useState(0);
  const [rateComment, setRateComment]           = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess]       = useState(false);

  useEffect(() => {
    if (isOpen) fetchOrders();
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      setOrders(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Cancel ─────────────────────────────────────────────────────── */
  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderToCancel}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to cancel order");
      }
      setOrders(orders.map((o) =>
        o._id === orderToCancel ? { ...o, status: "cancelled" } : o
      ));
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
      setCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  /* ── Order Received ─────────────────────────────────────────────── */
  const handleOrderReceived = async (order) => {
    setReceivedOrderId(order._id);
    setConfirmingReceived(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/confirm-received`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to confirm");
      }
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: "completed" } : o))
      );
      // Open success modal A
      setSuccessOrderData({ orderId: order._id, items: order.items });
      setSuccessModalOpen(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setConfirmingReceived(false);
      setReceivedOrderId(null);
    }
  };

  /* ── Rate product (modal B) ─────────────────────────────────────── */
  const openRateModal = (orderId, productId, productName) => {
    setRateOrderId(orderId);
    setRateProductId(productId);
    setRateProductName(productName);
    setStarValue(0);
    setRateComment("");
    setReviewSuccess(false);
    setSuccessModalOpen(false);
    setRateModalOpen(true);
  };

  const submitReview = async () => {
    if (starValue === 0) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: rateProductId,
          orderId:   rateOrderId,
          rating:    starValue,
          comment:   rateComment,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to submit review");
      }
      setReviewSuccess(true);
      setTimeout(() => {
        setRateModalOpen(false);
        setReviewSuccess(false);
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  /* ── Status helpers ─────────────────────────────────────────────── */
  const getStatusNumber = (status) => {
    switch (status) {
      case "pending":          return 1;
      case "processing":       return 2;
      case "shipped":          return 3;
      case "out_for_delivery": return 4;
      case "delivered":        return 5;
      case "completed":        return 6;
      case "cancelled":        return -1;
      default:                 return 1;
    }
  };

  const formatVariant = (variantStr) => {
    if (!variantStr || variantStr === "Default") return "";
    const parts = variantStr.split("+").map((p) => p.trim());
    if (parts.length === 2) {
      const m0 = parts[0].match(/^(\d+)(GB|TB)$/i);
      const m1 = parts[1].match(/^(\d+)(GB|TB)$/i);
      if (m0 && m1) {
        const v0 = parseInt(m0[1]);
        const u0 = m0[2].toUpperCase();
        const v1 = parseInt(m1[1]);
        let isPart0Storage = false;
        if (u0 === "TB") isPart0Storage = true;
        else if (m1[2].toUpperCase() === "TB") isPart0Storage = false;
        else if (v0 > v1 && v0 >= 32) isPart0Storage = true;
        if (isPart0Storage) return `${parts[1]} + ${parts[0]}`;
      }
    }
    return variantStr;
  };

  const statusSteps = [
    { key: "pending",          label: "Pending",          icon: FaClock },
    { key: "processing",       label: "Processing",       icon: FaSpinner },
    { key: "shipped",          label: "Shipped",          icon: FaTruck },
    { key: "out_for_delivery", label: "Out for Delivery", icon: FaMapMarkerAlt },
    { key: "delivered",        label: "Delivered",        icon: FaBox },
    { key: "completed",        label: "Completed",        icon: FaCheckCircle },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-screen w-full laptop:w-[480px] bg-slate-50 shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-700 px-6 py-5 text-white shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <FaShoppingBag className="text-lg" />
            </div>
            <h2 className="font-robotoBold text-xl tracking-wide">My Orders</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/20 hover:text-white cursor-pointer"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100">
              <p>{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 transition-colors rounded-lg text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-5 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-100 to-cyan-50 rounded-full flex items-center justify-center text-indigo-300">
                <FaBox className="text-4xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">No Orders yet</h3>
                <p className="text-slate-500 mt-1 max-w-[250px]">Looks like you haven't placed an order yet.</p>
              </div>
              <button
                onClick={() => { onClose(); navigate("/"); }}
                className="mt-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full font-medium shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 tracking-wide cursor-pointer"
              >
                Check out now
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in pb-10">
              {orders.map((order) => {
                const currentStep = getStatusNumber(order.status);
                const isCancelled = order.status === "cancelled";
                const isDelivered  = order.status === "delivered";
                const daysLeft = isDelivered ? daysUntilAutoReceive(order.deliveredDate) : null;
                const isConfirmingThis = confirmingReceived && receivedOrderId === order._id;

                return (
                  <div key={order._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden relative group hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-5 pb-5 border-b border-slate-100">
                      <div>
                        <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-1">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <h4 className="font-robotoBold text-slate-800 text-lg">
                          Order <span className="text-slate-500 font-normal">#{order.orderNumber}</span>
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                        <p className="font-bold text-slate-800">₱{order.total.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Tracker */}
                    <div className="relative pt-2 pb-4 px-2">
                      {isCancelled ? (
                        <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100">
                          <FaTimesCircle className="text-xl shrink-0" />
                          <div>
                            <p className="font-bold text-sm">Order Cancelled</p>
                            <p className="text-xs text-red-400 mt-0.5">This order has been cancelled.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto pb-2 -mx-1 px-1">
                          <div className="relative" style={{ minWidth: `${statusSteps.length * 80}px` }}>
                            {/* Progress Line */}
                            <div className="absolute top-[16px] left-[7%] right-[7%] h-[3px] bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out"
                                style={{ width: `${(Math.max(0, currentStep - 1) / (statusSteps.length - 1)) * 100}%` }}
                              />
                            </div>
                            <div className="flex justify-between relative z-10">
                              {statusSteps.map((step, idx) => {
                                const isCompleted = currentStep > idx + 1;
                                const isCurrent   = currentStep === idx + 1;
                                const stepIcon    = step.icon;

                                let iconColor = "text-slate-300";
                                let bgColor   = "bg-slate-100 border-white";
                                let textColor = "text-slate-400";

                                if (isCompleted || isCurrent) {
                                  iconColor = isCurrent ? "text-indigo-600" : "text-white";
                                  bgColor   = isCurrent
                                    ? "bg-indigo-50 border-indigo-200"
                                    : "bg-gradient-to-r from-indigo-500 to-cyan-500 border-white";
                                  textColor = isCurrent ? "text-indigo-700 font-semibold" : "text-slate-600";
                                }

                                return (
                                  <div key={step.key} className="flex flex-col items-center" style={{ width: `${100 / statusSteps.length}%` }}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] ${bgColor} ${iconColor} transition-colors duration-500 z-10 shadow-sm mx-auto`}>
                                      {isCompleted
                                        ? <FaCheckCircle className="text-xs" />
                                        : React.createElement(stepIcon, { className: "text-xs" })}
                                    </div>
                                    <span className={`text-[9px] mt-1.5 ${textColor} transition-colors duration-300 text-center uppercase tracking-wide leading-tight px-0.5 w-full`}>
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items Preview */}
                    <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-4 border-t border-slate-100">
                      <div className="flex flex-col gap-3 w-full mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-sm w-full">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-800 leading-tight pr-4">{item.name}</span>
                              <span className="text-xs text-slate-500 mt-1">
                                {item.variant && item.variant !== "Default" ? `${formatVariant(item.variant)} | ` : ""}{item.color}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 rounded-md shrink-0 py-0.5">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                        {order.status === "pending" ? (
                          <button
                            onClick={() => handleCancelClick(order._id)}
                            className="text-xs text-red-500 font-medium hover:text-red-700 underline text-left"
                          >
                            Cancel Order
                          </button>
                        ) : <div />}
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                          {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} Item{order.items.reduce((acc, curr) => acc + curr.quantity, 0) > 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Delivered action buttons – at the very bottom */}
                      {isDelivered && (
                        <div className="mt-4 pt-4 border-t border-emerald-100 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 -mx-6 px-6 pb-0 -mb-4">
                          <p className="text-xs text-emerald-700 font-semibold mb-1">
                            📦 Your order has been delivered!
                          </p>
                          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                            Please confirm once you've received the item.
                            {daysLeft !== null && daysLeft > 0
                              ? ` If not confirmed, it will be automatically marked as received in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.`
                              : " Your order will be auto-received shortly."}
                          </p>
                          <div className="flex gap-2 pb-4">
                            <button
                              onClick={() => handleOrderReceived(order)}
                              disabled={isConfirmingThis}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold shadow shadow-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-60 cursor-pointer"
                            >
                              {isConfirmingThis
                                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <><FaCheckCircle className="text-sm" /> Order Received</>}
                            </button>
                            <button
                              onClick={() => {/* refund/return – TBD */}}
                              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:border-rose-300 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <FaUndoAlt className="text-xs" /> Refund / Return
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Persistent Rate This Product button for completed orders */}
                      {order.status === "completed" && (
                        <div className="mt-4 pt-4 border-t border-indigo-100 -mx-6 px-6 pb-4 -mb-4">
                          <button
                            onClick={() => {
                              const firstItem = order.items?.[0];
                              if (firstItem) openRateModal(order._id, firstItem.productId, firstItem.name);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow shadow-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                          >
                            <FaStar className="text-sm" /> Rate This Product
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Cancel ──────────────────────────────────────────── */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !cancelling && setCancelModalOpen(false)} />
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative z-10 shadow-2xl animate-fade-in-down">
            <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
              <FaTimesCircle />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Cancel Order?</h3>
            <p className="text-center text-slate-500 mb-8">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelling}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                No, keep it
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelling}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-red-500/30 disabled:opacity-50 flex items-center justify-center"
              >
                {cancelling
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : "Yes, cancel it"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal A: Order Received Success ───────────────────────── */}
      {successModalOpen && successOrderData && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSuccessModalOpen(false)} />
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 relative z-10 shadow-2xl text-center">
            {/* X skip */}
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <FaTimes />
            </button>

            {/* Success animation */}
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200">
              <FaCheckCircle className="text-white text-3xl" />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-1">Thank you! 🎉</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Your order has been marked as received. We hope you love your purchase!
            </p>

            {/* Rate button – shows first item by default */}
            <button
              onClick={() => {
                const firstItem = successOrderData.items?.[0];
                if (firstItem) {
                  openRateModal(successOrderData.orderId, firstItem.productId, firstItem.name);
                }
              }}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold rounded-2xl shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaStar /> Rate Our Product
            </button>
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="mt-3 w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* ── Modal B: Rate Product ─────────────────────────────────── */}
      {rateModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !submittingReview && setRateModalOpen(false)} />
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 relative z-10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Rate Your Purchase</h3>
              <button
                onClick={() => setRateModalOpen(false)}
                disabled={submittingReview}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 text-3xl">
                  <FaCheckCircle />
                </div>
                <p className="font-semibold text-slate-800">Review submitted!</p>
                <p className="text-sm text-slate-500">Thank you for your feedback.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-1">Reviewing:</p>
                <p className="font-semibold text-slate-800 mb-5 line-clamp-2">{rateProductName}</p>

                {/* Stars */}
                <div className="mb-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 text-center">Your rating</p>
                  <StarPicker value={starValue} onChange={setStarValue} />
                  {starValue > 0 && (
                    <p className="text-center text-xs text-amber-500 mt-2 font-medium">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][starValue]}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <textarea
                  value={rateComment}
                  onChange={(e) => setRateComment(e.target.value)}
                  placeholder="Share your experience (optional)…"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 mb-5"
                />

                <button
                  onClick={submitReview}
                  disabled={starValue === 0 || submittingReview}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingReview
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : "Submit Review"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrdersSidebar;
