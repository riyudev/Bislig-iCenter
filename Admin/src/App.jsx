import React from "react";
import "./App.css";

function App() {
  return (
    <div className="bg-ghostWhite min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1>Admin</h1>
        <p className="text-myblack/70">
          If this page shows the correct fonts, colors, and spacing, Tailwind is
          working in the <code>Admin</code> app.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="btn-black px-6 py-3">Primary Action</button>
          <button className="rounded-full border border-myblack/20 bg-white px-6 py-3 hover:border-blue-500">
            Secondary
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
