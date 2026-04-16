import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaUserCircle } from "react-icons/fa";

/* ─── Star display helper ──────────────────────────────────────────── */
const StarDisplay = ({ rating, size = "text-sm" }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className={`flex items-center gap-0.5 ${size}`}>
      {Array.from({ length: full  }).map((_, i) => <FaStar        key={`f${i}`} className="text-amber-400" />)}
      {half &&                                       <FaStarHalfAlt               className="text-amber-400" />}
      {Array.from({ length: empty }).map((_, i) => <FaRegStar     key={`e${i}`} className="text-slate-300" />)}
    </span>
  );
};

/* ─── Rating bar ───────────────────────────────────────────────────── */
const RatingBar = ({ count, total, stars }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-5 text-right text-slate-500">{stars}★</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-slate-400">{count}</span>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const ProductReviews = ({ productId }) => {
  const [reviews, setReviews]   = useState([]);
  const [average, setAverage]   = useState(0);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setAverage(data.average || 0);
        setTotal(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  // Distribution counts
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  if (loading) {
    return (
      <div className="mt-6 w-full rounded-3xl border border-slate-100 bg-white px-6 py-8 shadow-xl shadow-slate-100 flex items-center justify-center h-32">
        <div className="w-7 h-7 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-6 w-full rounded-3xl border border-slate-100 bg-white px-6 py-8 shadow-xl shadow-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-400" />
        <h3 className="text-lg font-bold text-slate-800">
          Customer Reviews{total > 0 ? `(${total})` : ""}
        </h3>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <FaStar className="text-amber-300 text-2xl" />
          </div>
          <p className="text-slate-600 font-medium">No reviews yet</p>
          <p className="text-slate-400 text-sm mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          {/* Summary row */}
          <div className="laptop:flex-row flex flex-col gap-6 mb-8">
            {/* Average score */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 min-w-[140px] border border-amber-100">
              <span className="text-5xl font-bold text-slate-800">{average.toFixed(1)}</span>
              <StarDisplay rating={average} size="text-base" />
            </div>

            {/* Bar breakdown */}
            <div className="flex-1 flex flex-col justify-center gap-2">
              {dist.map(({ stars, count }) => (
                <RatingBar key={stars} stars={stars} count={count} total={total} />
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-slate-50 rounded-2xl border border-slate-100 px-5 py-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {review.userName?.charAt(0)?.toUpperCase() || <FaUserCircle />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{review.userName}</p>
                      <StarDisplay rating={review.rating} size="text-xs" />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 mt-0.5">
                    {new Date(review.createdAt).toLocaleDateString("en-PH", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-600 leading-relaxed mt-2 pl-11">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReviews;
