import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Login failed");
        return;
      }

      // Store token if backend is configured to send it via body in the future.
      // Current backend uses httpOnly cookie; we still keep a slot for bearer usage.
      if (data?.token) {
        localStorage.setItem("admin_token", data.token);
      }

      navigate("/");
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ghostWhite min-h-screen grid place-items-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <h3>Admin Login</h3>
        <p className="text-myblack/60">Sign in to manage products and orders.</p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <label className="text-sm text-myblack/70">Username</label>
            <input
              className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              required
            />
          </div>
          <div>
            <label className="text-sm text-myblack/70">Password</label>
            <input
              className="mt-1 w-full rounded-xl border border-myblack/10 bg-white px-4 py-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          {error && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

          <button className="btn-black w-full px-6 py-3" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
