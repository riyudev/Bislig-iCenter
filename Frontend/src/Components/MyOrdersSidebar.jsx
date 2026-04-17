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
import CancelOrderModal from "./CancelOrderModal";
import OrderSuccessModal from "./OrderSuccessModal";
import RateProductModal from "./RateProductModal";
import OrderItemsPreview from "./OrderItemsPreview";

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

                    <OrderItemsPreview
                      order={order}
                      isDelivered={isDelivered}
                      daysLeft={daysLeft}
                      isConfirmingThis={isConfirmingThis}
                      canReturn={canReturn}
                      returnDaysLeft={returnDaysLeft}
                      onCancelClick={handleCancelClick}
                      onOrderReceived={handleOrderReceived}
                      onRateProduct={openRateModal}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={confirmCancel}
        cancelling={cancelling}
      />

      <OrderSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        successOrderData={successOrderData}
        onRateProduct={openRateModal}
      />

      <RateProductModal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        submittingReview={submittingReview}
        reviewSuccess={reviewSuccess}
        rateProductName={rateProductName}
        starValue={starValue}
        setStarValue={setStarValue}
        rateComment={rateComment}
        setRateComment={setRateComment}
        onSubmitReview={submitReview}
      />
    </div>
  );
}

export default MyOrdersSidebar;
