import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShopContext } from "../context/ShopContext";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaArrowLeft,
  FaPaypal,
  FaMoneyBillWave,
  FaShieldAlt,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

function Checkout() {
  const { user, login } = useAuth();
  const {
    getCartProducts,
    checkedItems,
    getTotalCartAmount,
    clearCheckedCartItems,
  } = useContext(ShopContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSavingShipping, setIsSavingShipping] = useState(false);

  const cartProducts = getCartProducts();
  const checkoutProducts = cartProducts.filter(
    (p) => checkedItems[p.cartItemId],
  );
  const totalAmount = getTotalCartAmount();

  const parsePrice = (val) => {
    if (val === null || val === undefined) return null;
    const num =
      typeof val === "number"
        ? val
        : Number(String(val).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(num) ? num : null;
  };

  const formatPrice = (value) => {
    const num = parsePrice(value);
    return Number.isFinite(num)
      ? new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          maximumFractionDigits: 0,
        }).format(num)
      : value;
  };

  const hasCompleteProfile = !!(
    user?.name &&
    user?.email &&
    user?.mobileNumber &&
    user?.address
  );

  const [shippingInfo, setShippingInfo] = useState({
    firstName: (user?.name || "").split(" ")[0] || "",
    lastName: (user?.name || "").split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (checkoutProducts.length === 0 && !showSuccessModal) {
      navigate("/cart");
    }
  }, [checkoutProducts.length, navigate, showSuccessModal]);

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSaveShipping = async () => {
    const fullName =
      `${shippingInfo.firstName.trim()} ${shippingInfo.lastName.trim()}`.trim();
    if (
      !fullName ||
      !shippingInfo.email ||
      !shippingInfo.mobileNumber ||
      !shippingInfo.address
    ) {
      toast.error("Please fill in all fields before saving.");
      return;
    }
    setIsSavingShipping(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: fullName,
          email: shippingInfo.email,
          mobileNumber: shippingInfo.mobileNumber,
          address: shippingInfo.address,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        toast.success("Shipping info saved to your profile!");
      } else {
        toast.error(data.message || "Failed to save shipping info.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSavingShipping(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!hasCompleteProfile) {
      const fullName =
        `${shippingInfo.firstName.trim()} ${shippingInfo.lastName.trim()}`.trim();
      if (
        !fullName ||
        !shippingInfo.email ||
        !shippingInfo.mobileNumber ||
        !shippingInfo.address
      ) {
        toast.error("Please fill in all shipping information.");
        return;
      }
    }

    const shippingFullName = hasCompleteProfile
      ? user.name
      : `${shippingInfo.firstName.trim()} ${shippingInfo.lastName.trim()}`.trim();

    const orderItems = checkoutProducts.map((p) => {
      const price = parsePrice(p.newPrice);
      return {
        productId: p._id || p.productId,
        name: p.name,
        variant: p.storage || "64GB",
        color: p.color || "Default",
        quantity: p.quantity,
        unitPrice: price,
        totalPrice: price * p.quantity,
      };
    });

    const orderData = {
      orderItems,
      customer: {
        name: shippingFullName,
        email: hasCompleteProfile ? user.email : shippingInfo.email,
        phone: hasCompleteProfile
          ? user.mobileNumber
          : shippingInfo.mobileNumber,
        address: hasCompleteProfile ? user.address : shippingInfo.address,
      },
      subtotal: totalAmount,
      shippingFee: 0,
      total: totalAmount,
      paymentMethod: paymentMethod.toLowerCase(),
    };

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      clearCheckedCartItems();
      setShowSuccessModal(true);
    } catch (err) {
      toast.error(err.message || "Failed to complete your order. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute top-40 -left-20 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[100px]" />
      </div>

      <div className="laptop:pt-20 laptop:pb-12 relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="font-productSansReg laptop:mb-8 mb-5">
          <Link
            to="/cart"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
          >
            <FaArrowLeft /> Back to Cart
          </Link>
          <h1 className="laptop:text-4xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Secure Checkout
          </h1>
        </div>

        <div className="font-productSansReg laptop:flex-row laptop:gap-8 flex flex-col items-stretch gap-6 lg:gap-12">
          {/* Left Column: Shipping Information */}
          <div className="flex flex-[3] flex-col">
            <div className="laptop:p-6 flex-1 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <div className="laptop:mb-6 mb-4 flex items-center justify-between">
                <h2 className="laptop:text-2xl text-xl font-bold text-slate-900">
                  Shipping Information
                </h2>
                {hasCompleteProfile && (
                  <span className="laptop:px-3 laptop:text-sm flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
                    <FaCheckCircle /> Verified
                  </span>
                )}
              </div>

              {hasCompleteProfile ? (
                <div className="laptop:space-y-5 laptop:p-6 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="laptop:gap-4 flex items-start gap-3">
                    <div className="laptop:h-10 laptop:w-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FaUser className="laptop:text-base text-[12px]" />
                    </div>
                    <div>
                      <p className="laptop:text-sm text-xs font-semibold text-slate-500">
                        Full Name
                      </p>
                      <p className="laptop:text-lg text-sm font-bold text-slate-900">
                        {user.name}
                      </p>
                    </div>
                  </div>
                  <div className="laptop:gap-4 flex items-start gap-3">
                    <div className="laptop:h-10 laptop:w-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FaEnvelope className="laptop:text-base text-[12px]" />
                    </div>
                    <div>
                      <p className="laptop:text-sm text-xs font-semibold text-slate-500">
                        Email Address
                      </p>
                      <p className="laptop:text-lg text-sm font-bold text-slate-900">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="laptop:gap-4 flex items-start gap-3">
                    <div className="laptop:h-10 laptop:w-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FaPhone className="laptop:text-base text-[12px]" />
                    </div>
                    <div>
                      <p className="laptop:text-sm text-xs font-semibold text-slate-500">
                        Mobile Number
                      </p>
                      <p className="laptop:text-lg text-sm font-bold text-slate-900">
                        {user.mobileNumber}
                      </p>
                    </div>
                  </div>
                  <div className="laptop:gap-4 flex items-start gap-3">
                    <div className="laptop:h-10 laptop:w-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FaMapMarkerAlt className="laptop:text-base text-[12px]" />
                    </div>
                    <div>
                      <p className="laptop:text-sm text-xs font-semibold text-slate-500">
                        Delivery Address
                      </p>
                      <p className="laptop:text-lg text-sm leading-relaxed font-bold text-slate-900">
                        {user.address}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="laptop:space-y-5 space-y-4">
                  <p className="laptop:mb-4 laptop:text-sm mb-2 text-xs text-slate-500">
                    Please enter your shipping details for this order.
                  </p>
                  {/* Name & Last Name */}
                  <div className="laptop:gap-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="laptop:text-sm mb-1.5 block text-xs font-semibold text-slate-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className="laptop:text-sm mb-1.5 block text-xs font-semibold text-slate-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                        className="laptop:text-sm laptop:px-4 laptop:py-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="laptop:gap-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="laptop:text-sm mb-1.5 block text-xs font-semibold text-slate-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="laptop:text-sm laptop:px-4 laptop:py-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="laptop:text-sm mb-1.5 block text-xs font-semibold text-slate-700">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={shippingInfo.mobileNumber}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Delivery Address
                    </label>
                    <textarea
                      name="address"
                      rows="3"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      placeholder="Complete Address (Street, Barangay, City, Province)"
                    />
                  </div>

                  {/* Save to Profile button */}
                  <button
                    type="button"
                    onClick={handleSaveShipping}
                    disabled={isSavingShipping}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-600 px-4 py-3 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 active:scale-95 disabled:opacity-60"
                  >
                    <FaSave />
                    {isSavingShipping ? "Saving..." : "Save to Profile"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Payment & Summary */}
          <div className="flex flex-[2] flex-col gap-8">
            {/* Payment Method */}
            <div className="laptop:p-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-8">
              <h2 className="laptop:mb-6 laptop:text-2xl mb-4 text-lg font-bold text-slate-900">
                Payment Method
              </h2>
              <div className="laptop:gap-4 grid grid-cols-1 gap-3 text-left">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`laptop:gap-4 laptop:p-4 flex items-center gap-3 rounded-2xl border-2 p-3 transition-all ${
                    paymentMethod === "COD"
                      ? "border-blue-600 bg-blue-50/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div
                    className={`laptop:h-12 laptop:w-12 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${paymentMethod === "COD" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    <FaMoneyBillWave className="laptop:text-xl text-lg" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="laptop:text-base block text-sm font-bold text-slate-900">
                      Cash on Delivery
                    </span>
                    <span className="laptop:text-xs block text-[10px] font-medium text-slate-500">
                      Pay when you receive
                    </span>
                  </div>
                  <div
                    className={`laptop:h-5 laptop:w-5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${paymentMethod === "COD" ? "border-blue-600" : "border-slate-300"}`}
                  >
                    {paymentMethod === "COD" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("PAYPAL")}
                  className={`laptop:gap-4 laptop:p-4 flex items-center gap-3 rounded-2xl border-2 p-3 transition-all ${
                    paymentMethod === "PAYPAL"
                      ? "border-blue-600 bg-blue-50/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div
                    className={`laptop:h-12 laptop:w-12 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${paymentMethod === "PAYPAL" ? "bg-[#003087] text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    <FaPaypal className="laptop:text-xl text-lg" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="laptop:text-base block text-sm font-bold text-slate-900">
                      PayPal
                    </span>
                    <span className="laptop:text-xs block text-[10px] font-medium text-slate-500">
                      Not integrated yet
                    </span>
                  </div>
                  <div
                    className={`laptop:h-5 laptop:w-5 flex h-4 w-4 items-center justify-center rounded-full border-2 ${paymentMethod === "PAYPAL" ? "border-blue-600" : "border-slate-300"}`}
                  >
                    {paymentMethod === "PAYPAL" && (
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="laptop:p-6 flex flex-col overflow-hidden rounded-3xl bg-white p-4 shadow-md ring-1 ring-slate-200 sm:p-8">
              <h2 className="laptop:mb-6 laptop:text-2xl mb-4 text-lg font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="custom-scrollbar laptop:max-h-[300px] mb-6 max-h-[250px] flex-1 space-y-3 overflow-x-hidden overflow-y-auto pr-2">
                {checkoutProducts.map((product) => (
                  <div
                    key={product.cartItemId}
                    className="laptop:gap-4 flex gap-2"
                  >
                    <div className="laptop:h-16 laptop:w-16 laptop:p-2 h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-slate-50 p-1">
                      <img
                        src={
                          product.image?.startsWith("http")
                            ? product.image
                            : `${import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`}${product.image || ""}`
                        }
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <h4 className="laptop:text-sm truncate text-[11px] font-bold text-slate-900">
                        {product.name}
                      </h4>
                      <p className="laptop:text-xs text-[10px] font-medium text-slate-500">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <div className="laptop:text-base flex shrink-0 items-center pl-2 text-xs font-bold text-slate-900">
                      {formatPrice(
                        parsePrice(product.newPrice) * product.quantity,
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-5">
                <div className="laptop:text-sm mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="laptop:text-sm mb-4 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="mb-5 flex items-center justify-between">
                  <span className="laptop:text-xl text-base font-bold text-slate-900">
                    Total
                  </span>
                  <span className="laptop:text-3xl text-xl font-extrabold tracking-tight text-blue-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="laptop:px-8 laptop:py-4 laptop:text-lg flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-[13px] font-bold tracking-wide text-white shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1 hover:bg-blue-600 hover:shadow-blue-500/30 active:scale-95"
                >
                  <FaShieldAlt className="text-[14px]" /> Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white p-8 text-center shadow-2xl"
            style={{ animation: "modalSlideUp 0.3s ease-out forwards" }}
          >
            {/* Confetti / Glow bg */}
            <div className="pointer-events-none absolute top-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-green-400/20 blur-[80px]" />

            <div className="font-productSansReg relative z-10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-inner ring-8 ring-green-50">
                <FaCheckCircle className="text-5xl text-green-500" />
              </div>

              <h3 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">
                Order Successful!
              </h3>

              <p className="mb-8 leading-relaxed font-medium text-slate-500">
                Thank you for your purchase. Your order has been placed
                successfully. We will send you an email confirmation shortly.
              </p>

              <button
                onClick={() => navigate("/")}
                className="w-full rounded-full bg-blue-600 px-8 py-4 text-base font-bold tracking-wide text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:bg-blue-700 active:scale-95"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `,
        }}
      />
    </div>
  );
}

export default Checkout;
