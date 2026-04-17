import React from "react";
import { FaTimesCircle } from "react-icons/fa";

function CancelOrderModal({ isOpen, onClose, onConfirm, cancelling }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => !cancelling && onClose()}
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
            onClick={onClose}
            disabled={cancelling}
            className="flex-1 rounded-xl bg-slate-100 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
          >
            No, keep it
          </button>
          <button
            onClick={onConfirm}
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
  );
}

export default CancelOrderModal;
