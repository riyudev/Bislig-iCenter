import React, { useState, useEffect } from "react";
import { FaTimes, FaBox, FaShoppingBag, FaCheckCircle, FaTimesCircle, FaTruck, FaClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function MyOrdersSidebar({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;
    setCancelling(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderToCancel}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to cancel order");
      }
      setOrders(orders.map((o) => (o._id === orderToCancel ? { ...o, status: "cancelled" } : o)));
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
      setCancelModalOpen(false);
      setOrderToCancel(null);
    }
  };

  const getStatusNumber = (status) => {
    switch (status) {
      case "pending":
        return 1;
      case "confirmed":
        return 2;
      case "preparing":
        return 3;
      case "shipped":
        return 4;
      case "completed":
        return 5;
      case "cancelled":
        return -1;
      default:
        return 1;
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

  const statusSteps = [
    { key: "pending", label: "Pending", icon: FaClock },
    { key: "confirmed", label: "Confirmed", icon: FaCheckCircle },
    { key: "preparing", label: "Preparing", icon: FaBox },
    { key: "shipped", label: "Shipped", icon: FaTruck },
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
        className={`absolute top-0 right-0 h-screen w-[480px] max-w-full bg-slate-50 shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out flex flex-col ${
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
              <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
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
                <p className="text-slate-500 mt-1 max-w-[250px]">Looks like you haven't made your menu yet.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate("/");
                }}
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
                    <div className="relative pt-2 pb-6 px-2">
                      {isCancelled ? (
                        <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100">
                          <FaTimesCircle className="text-xl shrink-0" />
                          <div>
                            <p className="font-bold text-sm">Order Cancelled</p>
                            <p className="text-xs text-red-400 mt-0.5">This order has been cancelled.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Progress Line */}
                          <div className="absolute top-[18px] left-[10%] right-[10%] h-[3px] bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out"
                              style={{ width: `${(Math.max(0, currentStep - 1) / (statusSteps.length - 1)) * 100}%` }}
                            />
                          </div>

                          <div className="flex justify-between relative z-10">
                            {statusSteps.map((step, idx) => {
                              const isCompleted = currentStep > idx + 1;
                              const isCurrent = currentStep === idx + 1;
                              const stepIcon = step.icon;
                              
                              let iconColor = "text-slate-300";
                              let bgColor = "bg-slate-100 border-white";
                              let textColor = "text-slate-400";
                              
                              if (isCompleted || isCurrent) {
                                iconColor = isCurrent ? "text-indigo-600" : "text-white";
                                bgColor = isCurrent ? "bg-indigo-50 border-indigo-200" : "bg-gradient-to-r from-indigo-500 to-cyan-500 border-white";
                                textColor = isCurrent ? "text-indigo-700 font-semibold" : "text-slate-600";
                              }

                              return (
                                <div key={step.key} className="flex flex-col items-center w-16">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${bgColor} ${iconColor} transition-colors duration-500 z-10 shadow-sm`}>
                                    {isCompleted ? <FaCheckCircle className="text-sm" /> : React.createElement(stepIcon, { className: "text-sm" })}
                                  </div>
                                  <span className={`text-[10px] mt-2 ${textColor} transition-colors duration-300 text-center uppercase tracking-wider`}>
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
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
                        {(order.status === "pending" || order.status === "confirmed") ? (
                          <button
                            onClick={() => handleCancelClick(order._id)}
                            className="text-xs text-red-500 font-medium hover:text-red-700 underline text-left"
                          >
                            Cancel Order
                          </button>
                        ) : <div/>}
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                          {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} Item{order.items.reduce((acc, curr) => acc + curr.quantity, 0) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Warning Modal */}
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
                {cancelling ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Yes, cancel it"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrdersSidebar;
