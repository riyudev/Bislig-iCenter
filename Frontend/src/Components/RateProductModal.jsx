import React, { useState } from "react";
import { FaTimes, FaCheckCircle, FaStar, FaRegStar } from "react-icons/fa";

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

function RateProductModal({
  isOpen,
  onClose,
  submittingReview,
  reviewSuccess,
  rateProductName,
  starValue,
  setStarValue,
  rateComment,
  setRateComment,
  onSubmitReview,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => !submittingReview && onClose()}
      />
      <div className="relative z-10 mx-4 w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            Rate Your Purchase
          </h3>
          <button
            onClick={onClose}
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
              onClick={onSubmitReview}
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
  );
}

export default RateProductModal;
