import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaBox,
  FaShoppingBag,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaClock,
  FaMapMarkerAlt,
  FaSpinner,
  FaStar,
  FaRegStar,
  FaUndoAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/* ── Auto-receive countdown helper ─────────────────────────────────── */
function daysUntilAutoReceive(deliveredDate) {
  if (!deliveredDate) return null;
  const AUTO_DAYS = 3;
  const delivered = new Date(deliveredDate);
  const autoDate = new Date(
    delivered.getTime() + AUTO_DAYS * 24 * 60 * 60 * 1000,
  );
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
          className="cursor-pointer text-3xl transition-transform hover:scale-125"
        >
          {star <= (hovered || value) ? (
            <FaStar className="text-amber-400" />
          ) : (
            <FaRegStar className="text-slate-300" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
function MyOrdersSidebar({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cancel modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Order-received flow
  const [receivedOrderId, setReceivedOrderId] = useState(null); // which order is being confirmed
  const [confirmingReceived, setConfirmingReceived] = useState(false);
  // Modal A – success + prompt to rate
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successOrderData, setSuccessOrderData] = useState(null); // { orderId, items }
  // Modal B – rate form
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rateOrderId, setRateOrderId] = useState(null);
  const [rateProductId, setRateProductId] = useState(null);
  const [rateProductName, setRateProductName] = useState("");
  const [starValue, setStarValue] = useState(0);
  const [rateComment, setRateComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

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
      setOrders(
        orders.map((o) =>
          o._id === orderToCancel ? { ...o, status: "cancelled" } : o,
        ),
      );
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
        prev.map((o) =>
          o._id === order._id ? { ...o, status: "completed" } : o,
        ),
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
          orderId: rateOrderId,
          rating: starValue,
          comment: rateComment,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Failed to submit review");
      }
      setReviewSuccess(true);
      
      // Update local orders state to mark it as rated instantly
      setOrders((prev) =>
        prev.map((o) =>
          o._id === rateOrderId ? { ...o, isRated: true } : o
        )
      );

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
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "out_for_delivery":
        return 4;
      case "delivered":
        return 5;
      case "completed":
        return 6;
      case "cancelled":
        return -1;
      default:
        return 1;
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
    { key: "pending", label: "Pending", icon: FaClock },
    { key: "processing", label: "Processing", icon: FaSpinner },
    { key: "shipped", label: "Shipped", icon: FaTruck },
    {
      key: "out_for_delivery",
      label: "Out for Delivery",
      icon: FaMapMarkerAlt,
    },
    { key: "delivered", label: "Delivered", icon: FaBox },
    { key: "completed", label: "Completed", icon: FaCheckCircle },
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
        className={`laptop:w-[480px] absolute top-0 right-0 flex h-screen w-full flex-col bg-slate-50 shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-700 px-6 py-5 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <FaShoppingBag className="text-lg" />
            </div>
            <h2 className="font-robotoBold text-xl tracking-wide">My Orders</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/20 hover:text-white"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-8">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
              <p>{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="animate-fade-in flex h-[50vh] flex-col items-center justify-center space-y-5 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-100 to-cyan-50 text-indigo-300">
                <FaBox className="text-4xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  No Orders yet
                </h3>
                <p className="mt-1 max-w-[250px] text-slate-500">
                  Looks like you haven't placed an order yet.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate("/");
                }}
                className="mt-2 cursor-pointer rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 px-8 py-3.5 font-medium tracking-wide text-white shadow-lg shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Check out now
              </button>
            </div>
          ) : (
            <div className="animate-fade-in space-y-6 pb-10">
              {orders.map((order) => {
                const currentStep = getStatusNumber(order.status);
                const isCancelled = order.status === "cancelled";
                const isDelivered = order.status === "delivered";
                const daysLeft = isDelivered
                  ? daysUntilAutoReceive(order.deliveredDate)
                  : null;
                const isConfirmingThis =
                  confirmingReceived && receivedOrderId === order._id;

                const completedDate = order.completedDate ? new Date(order.completedDate) : new Date(order.updatedAt || order.orderDate);
                const diffTime = Date.now() - completedDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const returnDaysLeft = Math.max(0, 30 - diffDays);
                const canReturn = returnDaysLeft > 0;

                return (
                  <div
                    key={order._id}
                    className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-5">
                      <div>
                        <p className="mb-1 text-xs font-bold tracking-widest text-indigo-500 uppercase">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        <h4 className="font-robotoBold text-lg text-slate-800">
                          Order{" "}
                          <span className="font-normal text-slate-500">
                            #{order.orderNumber}
                          </span>
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="mb-1 text-xs text-slate-500">
                          Total Amount
                        </p>
                        <p className="font-bold text-slate-800">
                          ₱{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Tracker */}
                    <div className="relative px-2 pt-2 pb-4">
                      {isCancelled ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-500">
                          <FaTimesCircle className="shrink-0 text-xl" />
                          <div>
                            <p className="text-sm font-bold">Order Cancelled</p>
                            <p className="mt-0.5 text-xs text-red-400">
                              This order has been cancelled.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="-mx-1 overflow-x-auto px-1 pb-2">
                          <div
                            className="relative"
                            style={{ minWidth: `${statusSteps.length * 80}px` }}
                          >
                            {/* Progress Line */}
                            <div className="absolute top-[16px] right-[7%] left-[7%] h-[3px] overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out"
                                style={{
                                  width: `${(Math.max(0, currentStep - 1) / (statusSteps.length - 1)) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="relative z-10 flex justify-between">
                              {statusSteps.map((step, idx) => {
                                const isCompleted = currentStep > idx + 1;
                                const isCurrent = currentStep === idx + 1;
                                const stepIcon = step.icon;

                                let iconColor = "text-slate-300";
                                let bgColor = "bg-slate-100 border-white";
                                let textColor = "text-slate-400";

                                if (isCompleted || isCurrent) {
                                  iconColor = isCurrent
                                    ? "text-indigo-600"
                                    : "text-white";
                                  bgColor = isCurrent
                                    ? "bg-indigo-50 border-indigo-200"
                                    : "bg-gradient-to-r from-indigo-500 to-cyan-500 border-white";
                                  textColor = isCurrent
                                    ? "text-indigo-700 font-semibold"
                                    : "text-slate-600";
                                }

                                return (
                                  <div
                                    key={step.key}
                                    className="flex flex-col items-center"
                                    style={{
                                      width: `${100 / statusSteps.length}%`,
                                    }}
                                  >
                                    <div
                                      className={`flex h-8 w-8 items-center justify-center rounded-full border-[3px] ${bgColor} ${iconColor} z-10 mx-auto shadow-sm transition-colors duration-500`}
                                    >
                                      {isCompleted ? (
                                        <FaCheckCircle className="text-xs" />
                                      ) : (
                                        React.createElement(stepIcon, {
                                          className: "text-xs",
                                        })
                                      )}
                                    </div>
                                    <span
                                      className={`mt-1.5 text-[9px] ${textColor} w-full px-0.5 text-center leading-tight tracking-wide uppercase transition-colors duration-300`}
                                    >
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
                    <div className="-mx-6 -mb-6 border-t border-slate-100 bg-slate-50 px-6 py-4">
                      <div className="mb-3 flex w-full flex-col gap-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex w-full items-start justify-between text-sm"
                          >
                            <div className="flex flex-col">
                              <span className="font-productSansReg pr-4 leading-tight text-slate-800">
                                {item.name}
                              </span>
                              <span className="font-productSansReg mt-1 text-xs text-slate-500">
                                {item.variant && item.variant !== "Default"
                                  ? `${formatVariant(item.variant)} | `
                                  : ""}
                                {item.color}
                              </span>
                            </div>
                            <span className="font-productSansReg shrink-0 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                        {order.status === "pending" ? (
                          <button
                            onClick={() => handleCancelClick(order._id)}
                            className="text-left text-xs font-medium text-red-500 underline hover:text-red-700"
                          >
                            Cancel Order
                          </button>
                        ) : (
                          <div />
                        )}
                        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium tracking-wider text-indigo-600 uppercase">
                          {order.items.reduce(
                            (acc, curr) => acc + curr.quantity,
                            0,
                          )}{" "}
                          Item
                          {order.items.reduce(
                            (acc, curr) => acc + curr.quantity,
                            0,
                          ) > 1
                            ? "s"
                            : ""}
                        </span>
                      </div>

                      {/* Delivered action buttons – at the very bottom */}
                      {isDelivered && (
                        <div className="-mx-6 mt-4 -mb-4 rounded-2xl border-t border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 pt-4 pb-0">
                          <p className="mb-1 text-xs font-semibold text-emerald-700">
                            📦 Your order has been delivered!
                          </p>
                          <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
                            Please confirm once you've received the item.
                            {daysLeft !== null && daysLeft > 0
                              ? ` If not confirmed, it will be automatically marked as received in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.`
                              : " Your order will be auto-received shortly."}
                          </p>
                          <div className="flex gap-2 pb-4">
                            <button
                              onClick={() => handleOrderReceived(order)}
                              disabled={isConfirmingThis}
                              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-semibold text-white shadow shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                            >
                              {isConfirmingThis ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              ) : (
                                <>
                                  <FaCheckCircle className="text-sm" /> Order
                                  Received
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                /* refund/return – TBD */
                              }}
                              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:border-rose-300 hover:text-rose-600"
                            >
                              <FaUndoAlt className="text-xs" /> Refund / Return
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Persistent Rate This Product button for completed orders */}
                      {order.status === "completed" && (
                        <div className="-mx-6 mt-4 -mb-4 border-t border-indigo-100 px-6 pt-4 pb-4">
                          {order.isRated ? (
                            canReturn ? (
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => {
                                    /* refund/return handle – TBD */
                                  }}
                                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-2.5 text-xs font-semibold text-rose-600 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50"
                                >
                                  <FaUndoAlt className="text-sm" /> Request Refund / Return
                                </button>
                                <p className="text-center text-[10px] text-slate-400">
                                  You have {returnDaysLeft} day{returnDaysLeft !== 1 ? 's' : ''} left to request a refund or return.
                                </p>
                              </div>
                            ) : (
                              <p className="text-center text-xs text-slate-500">
                                The 30-day return window for this order has expired.
                              </p>
                            )
                          ) : (
                            <button
                              onClick={() => {
                                const firstItem = order.items?.[0];
                                if (firstItem)
                                  openRateModal(
                                    order._id,
                                    firstItem.productId,
                                    firstItem.name,
                                  );
                              }}
                              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 py-2.5 text-xs font-semibold text-white shadow shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                              <FaStar className="text-sm" /> Rate This Product
                            </button>
                          )}
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
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !cancelling && setCancelModalOpen(false)}
          />
          <div className="animate-fade-in-down relative z-10 mx-4 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-500">
              <FaTimesCircle />
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-slate-800">
              Cancel Order?
            </h3>
            <p className="mb-8 text-center text-slate-500">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelling}
                className="flex-1 rounded-xl bg-slate-100 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                No, keep it
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelling}
                className="flex flex-1 items-center justify-center rounded-xl bg-red-500 py-3 font-medium text-white shadow-lg shadow-red-500/30 transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {cancelling ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  "Yes, cancel it"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal A: Order Received Success ───────────────────────── */}
      {successModalOpen && successOrderData && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSuccessModalOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            {/* X skip */}
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
            >
              <FaTimes />
            </button>

            {/* Success animation */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
              <FaCheckCircle className="text-3xl text-white" />
            </div>

            <h3 className="mb-1 text-2xl font-bold text-slate-800">
              Thank you! 🎉
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              Your order has been marked as received. We hope you love your
              purchase!
            </p>

            {/* Rate button – shows first item by default */}
            <button
              onClick={() => {
                const firstItem = successOrderData.items?.[0];
                if (firstItem) {
                  openRateModal(
                    successOrderData.orderId,
                    firstItem.productId,
                    firstItem.name,
                  );
                }
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 py-3.5 font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <FaStar /> Rate Our Product
            </button>
            <button
              onClick={() => setSuccessModalOpen(false)}
              className="mt-3 w-full cursor-pointer py-2.5 text-sm text-slate-400 transition-colors hover:text-slate-600"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* ── Modal B: Rate Product ─────────────────────────────────── */}
      {rateModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !submittingReview && setRateModalOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                Rate Your Purchase
              </h3>
              <button
                onClick={() => setRateModalOpen(false)}
                disabled={submittingReview}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-500">
                  <FaCheckCircle />
                </div>
                <p className="font-semibold text-slate-800">
                  Review submitted!
                </p>
                <p className="text-sm text-slate-500">
                  Thank you for your feedback.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-1 text-sm text-slate-500">Reviewing:</p>
                <p className="mb-5 line-clamp-2 font-semibold text-slate-800">
                  {rateProductName}
                </p>

                {/* Stars */}
                <div className="mb-4">
                  <p className="mb-3 text-center text-xs tracking-wider text-slate-400 uppercase">
                    Your rating
                  </p>
                  <StarPicker value={starValue} onChange={setStarValue} />
                  {starValue > 0 && (
                    <p className="mt-2 text-center text-xs font-medium text-amber-500">
                      {
                        ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                          starValue
                        ]
                      }
                    </p>
                  )}
                </div>

                {/* Comment */}
                <textarea
                  value={rateComment}
                  onChange={(e) => setRateComment(e.target.value)}
                  placeholder="Share your experience (optional)…"
                  rows={3}
                  className="mb-5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                />

                <button
                  onClick={submitReview}
                  disabled={starValue === 0 || submittingReview}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3.5 font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submittingReview ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "Submit Review"
                  )}
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
