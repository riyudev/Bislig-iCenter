import React from "react";

function NewsletterSignup() {
  return (
    <section className="to-ghostWhite laptop:py-20 laptop:px-24 bg-gradient-to-b from-sky-100 via-sky-50 px-6 py-16 text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        <h2 className="text-myblack">Stay Updated with Bislig iCenter</h2>
        <p className="text-myblack/80 laptop:text-lg">
          Get exclusive updates on the latest iPhones, laptops, and limited-time
          offers. Subscribe to our newsletter — we promise, no spam.
        </p>

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="laptop:flex-row mt-6 flex flex-col items-center justify-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            className="laptop:w-[70%] text-myblack font-productSansLight w-full rounded-full border border-gray-300 bg-white px-5 py-3 shadow-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="btn-black laptop:w-fit w-full cursor-pointer px-8 py-3"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default NewsletterSignup;
