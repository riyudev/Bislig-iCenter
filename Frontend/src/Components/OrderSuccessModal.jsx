import React from "react";
import { FaTimes, FaCheckCircle, FaStar } from "react-icons/fa";

function OrderSuccessModal({ isOpen, onClose, successOrderData, onRateProduct }) {
  if (!isOpen || !successOrderData) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 mx-4 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        {/* X skip */}
        <button
          onClick={onClose}
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
              onRateProduct(
                successOrderData.orderId,
                firstItem.productId,
                firstItem.name
              );
            }
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 py-3.5 font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <FaStar /> Rate Our Product
        </button>
        <button
          onClick={onClose}
          className="mt-3 w-full cursor-pointer py-2.5 text-sm text-slate-400 transition-colors hover:text-slate-600"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default OrderSuccessModal;
