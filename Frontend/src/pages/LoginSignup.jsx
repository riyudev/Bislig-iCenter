import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/bislig-iCenter-Logo.png";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";

function LoginSignup() {
  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleSignState = () => {
    setSignState((currentState) => {
      const newState = currentState === "Sign In" ? "Sign Up" : "Sign In";
      setName("");
      setEmail("");
      setPassword("");
      return newState;
    });
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const url =
      signState === "Sign Up"
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

    const payload =
      signState === "Sign Up"
        ? {
            name: name.trim(),
            username: name.trim(),
            email: email.trim(),
            password,
          }
        : { email: email.trim(), password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        toast.error(data?.message || `Request failed (${res.status})`);
        setIsLoading(false);
        return;
      }

      console.log("Authenticated user:", data.user);

      if (signState === "Sign Up") {
        toast.success("Account created successfully 🎉");
        clearForm();
        login(data.user);
        navigate("/");
      } else {
        toast.success("Login successful 🎉");
        login(data.user);
        navigate("/");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8faff] px-4 pt-20 pb-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
      <div className="absolute right-[-5%] bottom-[-5%] h-[400px] w-[400px] rounded-full bg-indigo-400/20 blur-[100px]" />

      <div className="relative w-full max-w-[440px] rounded-[24px] border border-white/60 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-10">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mb-6 inline-flex items-center justify-center gap-1 no-underline"
          >
            <div
              className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] p-1 shadow-[0_2px_12px_rgba(59,130,246,0.15)] transition-transform duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #f0f4ff, #dbeafe)",
              }}
            >
              <img
                src={Logo}
                alt="Bislig iCenter Logo"
                className="w-9 object-contain"
              />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-productSansBold text-[20px] tracking-[0.06em] text-[#1a1a2e]">
                BiSLIG
              </span>
              <span className="font-productSansBold text-[12px] tracking-[0.18em] text-blue-500">
                iCENTER
              </span>
            </div>
          </Link>

          <h2 className="font-productSansBold text-[28px] tracking-tight text-[#1a1a2e]">
            {signState === "Sign In" ? "Welcome" : "Create Account"}
          </h2>
          <p className="font-productSansLight mt-2 text-[14px] text-gray-500">
            {signState === "Sign In"
              ? "Enter your credentials to access your account."
              : "Sign up to start shopping premium devices."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Inputs Section */}
          <div className="font-productSansReg flex flex-col gap-4">
            {signState === "Sign Up" && (
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-blue-500">
                  <FiUser className="text-[18px]" />
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white/80 py-3.5 pr-4 pl-11 text-[14.5px] text-[#1a1a2e] transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                />
              </div>
            )}

            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-blue-500">
                <FiMail className="text-[18px]" />
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                required
                className="w-full rounded-xl border border-gray-200 bg-white/80 py-3.5 pr-4 pl-11 text-[14.5px] text-[#1a1a2e] transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
              />
            </div>

            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-blue-500">
                <FiLock className="text-[18px]" />
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
                className="w-full rounded-xl border border-gray-200 bg-white/80 py-3.5 pr-4 pl-11 text-[14.5px] text-[#1a1a2e] transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
              />
            </div>

            {signState === "Sign In" && (
              <div className="mt-[-4px] flex justify-end">
                <a
                  href="#"
                  className="text-[13px] font-medium text-blue-600 transition-all hover:text-blue-700 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a1a2e] via-[#2a2a4a] to-[#1a1a2e] py-[14px] text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(26,26,46,0.25)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(26,26,46,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Processing..." : signState}
            {!isLoading && (
              <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </button>

          <div className="font-productSansReg mt-4 text-center text-[14px] text-gray-500">
            {signState === "Sign In" ? (
              <p>
                New to Bislig iCenter?{" "}
                <span
                  onClick={toggleSignState}
                  className="cursor-pointer font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                >
                  Create an account
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  onClick={toggleSignState}
                  className="cursor-pointer font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                >
                  Sign In
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginSignup;
