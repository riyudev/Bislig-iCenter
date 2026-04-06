import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/bislig-iCenter-Logo.png";
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function LoginSignup() {
  const [signState, setSignState] = useState("Sign In");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotStage, setForgotStage] = useState(0); // 0=none, 1=email, 2=otp+password
  const navigate = useNavigate();
  const { login } = useAuth();

  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  React.useEffect(() => {
    let timer;
    if ((showOtp || forgotStage === 2) && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  const toggleSignState = () => {
    setSignState((currentState) => {
      const newState = currentState === "Sign In" ? "Sign Up" : "Sign In";
      setUsername("");
      if (!rememberMe) setEmail(""); // Don't clear email if remember me is ticked on sign in
      setPassword("");
      setShowOtp(false);
      setOtp("");
      setTimeLeft(180);
      setForgotStage(0);
      return newState;
    });
  };

  const clearForm = () => {
    setUsername("");
    if (!rememberMe) setEmail("");
    setPassword("");
    setTimeLeft(180);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (forgotStage === 1) {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          toast.error(data?.message || "Failed to send OTP");
        } else {
          toast.success("OTP sent to your email!");
          setForgotStage(2);
          setTimeLeft(180);
        }
      } catch (err) {
        toast.error("Server error");
      }
    } else if (forgotStage === 2) {
      if (password.length < 8) {
        toast.error("New password must be at least 8 characters");
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), otp: otp.trim(), newPassword: password }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          toast.error(data?.message || "Failed to reset password");
        } else {
          toast.success("Password reset successfully! Please login.");
          setForgotStage(0);
          setSignState("Sign In");
          setPassword("");
          setOtp("");
        }
      } catch(err) {
        toast.error("Server error");
      }
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        forgotStage > 0 ? (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/auth/forgot-password" : (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/auth/send-otp", 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forgotStage > 0 ? { email: email.trim() } : { email: email.trim(), username: username.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.message || "Failed to resend OTP");
      } else {
        toast.success("A new OTP has been sent!");
        setTimeLeft(180);
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signState === "Sign Up" && password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    if (signState === "Sign Up" && !showOtp) {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            username: username.trim(),
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          toast.error(data?.message || `Failed to send OTP (${res.status})`);
          setIsLoading(false);
          return;
        }
        toast.success("OTP sent to your email! Please check your inbox.");
        setShowOtp(true);
        setTimeLeft(180);
      } catch (err) {
        toast.error("Server error. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const url =
      signState === "Sign Up"
        ? (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/auth/register"
        : (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api/auth/login";

    const payload =
      signState === "Sign Up"
        ? {
            name: username.trim(),
            username: username.trim(),
            email: email.trim(),
            password,
            otp: otp.trim(),
          }
        : { email: email.trim(), password, rememberMe };

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
      } else if (signState === "Sign In") {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email.trim());
        } else {
          localStorage.removeItem("rememberedEmail");
        }
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
            {forgotStage > 0 ? "Reset Password" : signState === "Sign In" ? "Welcome" : "Create Account"}
          </h2>
          <p className="font-productSansLight mt-2 text-[14px] text-gray-500">
            {forgotStage > 0
              ? "We'll send an OTP to your email to reset it."
              : signState === "Sign In"
              ? "Enter your credentials to access your account."
              : "Sign up to start shopping premium devices."}
          </p>
        </div>

        <form onSubmit={forgotStage > 0 ? handleForgotSubmit : handleSubmit} className="flex flex-col gap-5">
          {/* Inputs Section */}
          <div className="font-productSansReg flex flex-col gap-4">
            {(showOtp && forgotStage === 0) || forgotStage === 2 ? (
              <div className="flex flex-col">
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-blue-500">
                    <FiLock className="text-[18px]" />
                  </div>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white/80 py-3.5 pr-4 pl-11 text-[14.5px] text-[#1a1a2e] transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-x-2.5 px-1">
                  <span
                    className={`text-[12px] font-semibold ${timeLeft > 0 ? "text-slate-500" : "text-red-500"}`}
                  >
                    {timeLeft > 0 ? (
                      `Expires in: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`
                    ) : (
                      <span className="flex items-center gap-1">
                        Expired.{" "}
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="cursor-pointer border-none bg-transparent font-bold text-blue-600 hover:underline"
                        >
                          Resend OTP
                        </button>
                      </span>
                    )}
                  </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (forgotStage === 2) {
                          setForgotStage(1);
                        } else {
                          setShowOtp(false);
                        }
                        setOtp("");
                      }}
                      className="cursor-pointer border-none bg-transparent text-[12.5px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Change Email
                    </button>
                  </div>
                {forgotStage === 2 && (
                  <div className="group relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-blue-500">
                      <FiLock className="text-[18px]" />
                    </div>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white/80 py-3.5 pr-11 pl-11 text-[14.5px] text-[#1a1a2e] transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center border-none bg-transparent pr-3.5 text-gray-400 transition-colors hover:text-blue-500"
                    >
                      {showPassword ? (
                        <FiEye className="text-[18px]" />
                      ) : (
                        <FiEyeOff className="text-[18px]" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {signState === "Sign Up" && forgotStage === 0 && (
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-blue-500">
                      <FiUser className="text-[18px]" />
                    </div>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder="Username"
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

                {forgotStage === 0 && (
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-blue-500">
                      <FiLock className="text-[18px]" />
                    </div>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white/80 py-3.5 pr-11 pl-11 text-[14.5px] text-[#1a1a2e] transition-all duration-200 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center border-none bg-transparent pr-3.5 text-gray-400 transition-colors hover:text-blue-500"
                    >
                      {showPassword ? (
                        <FiEye className="text-[18px]" />
                      ) : (
                        <FiEyeOff className="text-[18px]" />
                      )}
                    </button>
                  </div>
                )}

                {signState === "Sign In" && forgotStage === 0 && (
                  <div className="mt-[-4px] flex items-center justify-between">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-700">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="cursor-pointer accent-blue-600 w-3.5 h-3.5"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotStage(1)}
                      className="text-[13px] font-medium text-blue-600 transition-all hover:text-blue-700 hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isLoading || (signState === "Sign Up" && showOtp && timeLeft <= 0) || (forgotStage === 2 && timeLeft <= 0)
            }
            className="group relative mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-gradient-to-r from-[#1a1a2e] via-[#2a2a4a] to-[#1a1a2e] py-[14px] text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(26,26,46,0.25)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(26,26,46,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading
              ? "Processing..."
              : forgotStage === 1
                ? "Send Reset OTP"
                : forgotStage === 2
                  ? "Reset Password"
              : signState === "Sign Up" && !showOtp
                ? "Continue"
                : signState === "Sign Up" && showOtp
                  ? "Verify & Register"
                  : signState}
            {!isLoading && (
              <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </button>


          <div className="font-productSansReg mt-4 text-center text-[14px] text-gray-500">
            {forgotStage > 0 ? (
               <p>
                 <span
                   onClick={() => setForgotStage(0)}
                   className="cursor-pointer font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                 >
                   Back to Login
                 </span>
               </p>
            ) : signState === "Sign In" ? (
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
