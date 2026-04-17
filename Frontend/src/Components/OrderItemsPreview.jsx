import React from "react";
import { FaCheckCircle, FaUndoAlt, FaStar } from "react-icons/fa";

function formatVariant(variantStr) {
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
}

function OrderItemsPreview({
  order,
  isDelivered,
  daysLeft,
  isConfirmingThis,
  canReturn,
  returnDaysLeft,
  onCancelClick,
  onOrderReceived,
  onRateProduct,
}) {
  return (
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
            onClick={() => onCancelClick(order._id)}
            className="text-left text-xs font-medium text-red-500 underline hover:text-red-700"
          >
            Cancel Order
          </button>
        ) : (
          <div />
        )}
        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium tracking-wider text-indigo-600 uppercase">
          {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} Item
          {order.items.reduce((acc, curr) => acc + curr.quantity, 0) > 1
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
              onClick={() => onOrderReceived(order)}
              disabled={isConfirmingThis}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-semibold text-white shadow shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
            >
              {isConfirmingThis ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <FaCheckCircle className="text-sm" /> Order Received
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
                  You have {returnDaysLeft} day
                  {returnDaysLeft !== 1 ? "s" : ""} left to request a refund or return.
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
                if (firstItem) {
                  onRateProduct(
                    order._id,
                    firstItem.productId,
                    firstItem.name
                  );
                }
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 py-2.5 text-xs font-semibold text-white shadow shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <FaStar className="text-sm" /> Rate This Product
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderItemsPreview;
