import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaLock,
  FaEdit,
  FaSave,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function AccountSidebar({ isOpen, onClose }) {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Split user.name into firstName / lastName
  const splitName = (fullName = "") => {
    const parts = fullName.trim().split(" ");
    const first = parts[0] || "";
    const last = parts.slice(1).join(" ") || "";
    return { first, last };
  };

  useEffect(() => {
    if (user) {
      const { first, last } = splitName(user.name);
      setFormData({
        username: user.username || "",
        firstName: first,
        lastName: last,
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        address: user.address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const fullName =
        `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      if (!formData.firstName.trim()) {
        setMessage("Name is required");
        setIsLoading(false);
        return;
      }
      const updateData = {
        username: formData.username.trim(),
        name: fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
      };

      // Only include password fields if they're provided
      if (formData.currentPassword || formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage("New passwords do not match");
          return;
        }
        if (formData.newPassword.length < 8) {
          setMessage("New password must be at least 8 characters");
          setIsLoading(false);
          return;
        }
        if (!formData.currentPassword) {
          setMessage("Current password is required to change password");
          setIsLoading(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        setMessage("Profile updated successfully!");
        setIsEditing(false);
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      const { first, last } = splitName(user.name);
      setFormData({
        username: user.username || "",
        firstName: first,
        lastName: last,
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        address: user.address || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-screen w-full laptop:w-[420px] bg-slate-50 shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-700 px-6 py-5 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <FaUser className="text-lg" />
              </div>
              <h2 className="font-robotoBold text-xl tracking-wide">
                My Account
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/20 hover:text-white"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-6 py-8">
            {message && (
              <div
                className={`animate-fade-in-down rounded-xl p-4 text-sm font-medium shadow-sm transition-all duration-300 ${
                  message.toLowerCase().includes("success")
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {!isEditing ? (
              <div className="animate-fade-in space-y-6">
                <div className="space-y-4">
                  {/* Username */}
                  <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
                      <FaUser className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                        Username
                      </p>
                      <p className="font-productSansReg mt-0.5 text-base text-slate-800">
                        {user?.username || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
                      <FaUser className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                        Full Name
                      </p>
                      <p className="font-productSansReg mt-0.5 text-base text-slate-800">
                        {user?.name || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                        Email
                      </p>
                      <p className="font-productSansReg mt-0.5 truncate pr-2 text-base text-slate-800">
                        {user?.email || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-cyan-100 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors group-hover:bg-cyan-100 group-hover:text-cyan-700">
                      <FaPhone className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                        Mobile
                      </p>
                      <p className="font-productSansReg mt-0.5 text-base text-slate-800">
                        {user?.mobileNumber || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-indigo-100 hover:shadow-md">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
                      <FaHome className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                        Address
                      </p>
                      <p className="font-productSansReg mt-0.5 text-base leading-relaxed text-slate-800">
                        {user?.address || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-4 font-medium text-white shadow-lg shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300/50 active:translate-y-0"
                  >
                    <FaEdit className="transition-transform duration-300 group-hover:scale-110" />
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                {/* Username */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Username
                  </label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g. john_doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-600">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Mobile
                  </label>
                  <input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600">
                    Address
                  </label>
                  <textarea
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Password Section */}
                <div className="space-y-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FaLock className="text-sm text-indigo-500" />
                    <h4 className="font-semibold tracking-wide">Security</h4>
                    <span className="ml-1 text-xs text-slate-400">
                      (Optional password change)
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={showCurrentPw ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Current password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-11 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition-colors hover:text-indigo-500"
                      >
                        {showCurrentPw ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showNewPw ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="New password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-11 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition-colors hover:text-blue-500"
                      >
                        {showNewPw ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showConfirmPw ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-11 text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw((v) => !v)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition-colors hover:text-cyan-500"
                      >
                        {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 pb-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3.5 font-medium text-white shadow-lg shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300/50 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                  >
                    <FaSave className="transition-transform duration-300 group-hover:scale-110" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    onClick={handleCancel}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 py-3.5 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-200 active:bg-slate-300"
                  >
                    <FaTimesCircle />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSidebar;
