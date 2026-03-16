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
} from "react-icons/fa";

function AccountSidebar({ isOpen, onClose }) {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
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
      const updateData = {
        name: formData.name,
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
        if (!formData.currentPassword) {
          setMessage("Current password is required to change password");
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
      setFormData({
        name: user.name || "",
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
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 h-screen bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-screen w-[420px] max-w-full bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="from-myblack sticky top-0 flex items-center justify-between bg-gradient-to-r to-[#3a3937] px-6 py-4 text-white">
            <h2 className="font-robotoBold text-xl">My Account</h2>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-white/20"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
            {message && (
              <div
                className={`rounded-md p-3 text-sm ${
                  message.includes("success")
                    ? "border border-green-300 bg-green-100 text-green-700"
                    : "border border-red-300 bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {!isEditing ? (
              <>
                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="flex w-6 justify-center">
                      <FaUser className="text-myblack text-lg" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-productSansReg text-myblack">
                        {user?.name || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="flex w-6 justify-center">
                      <FaEnvelope className="text-myblack text-lg" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-productSansReg text-myblack">
                        {user?.email || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="flex w-6 justify-center">
                      <FaPhone className="text-myblack text-lg" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Mobile</p>
                      <p className="font-productSansReg text-myblack">
                        {user?.mobileNumber || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 rounded-lg bg-gray-50 p-4">
                    <div className="flex w-6 justify-center">
                      <FaHome className="text-myblack mt-1 text-lg" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-productSansReg text-myblack">
                        {user?.address || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-black flex w-full items-center justify-center gap-2 py-3"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Username
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Mobile
                  </label>

                  <input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Address
                  </label>

                  <textarea
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                {/* Password Section */}
                <div className="space-y-3 border-t pt-4">
                  <p className="text-sm font-medium text-gray-600">
                    Change Password (optional)
                  </p>

                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Current password"
                    className="w-full rounded-lg border px-4 py-2"
                  />

                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="New password"
                    className="w-full rounded-lg border px-4 py-2"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className="w-full rounded-lg border px-4 py-2"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="btn-black flex flex-1 items-center justify-center gap-2 py-3"
                  >
                    <FaSave />
                    {isLoading ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={handleCancel}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-200 py-3 hover:bg-gray-300"
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
