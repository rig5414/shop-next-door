"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const { data: session } = useSession();
  const router = useRouter();
  console.log("Session Data:", session);
  const userId = session?.user?.id;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password Validation
  const validatePassword = (password: string) => {
    return password.length >= 8 && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setErrors((prev) => ({
      ...prev,
      new: validatePassword(value) ? "" : "Password must be at least 8 characters and include a number & symbol.",
    }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirm: value === newPassword ? "" : "Passwords do not match.",
    }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle Password Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ current: "", new: "", confirm: "" });

    if (!userId) {
      console.log("Session data:", session);
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    if (!currentPassword) {
      setErrors((prev) => ({ ...prev, current: "Current password is required." }));
      setLoading(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        new: "Password must be at least 8 characters and include a number & symbol.",
      }));
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match." }));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      alert("Password updated successfully! Please log in with your new password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to login page
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error updating password:", error);
      setErrors((prev) => ({ ...prev, current: error.message || "Error updating password" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-white">Current Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword.current ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="block w-full border rounded-md p-2 bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Current Password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("current")}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
          >
            {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.current && <p className="text-red-500 text-sm">{errors.current}</p>}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-white">New Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword.new ? "text" : "password"}
            value={newPassword}
            onChange={(e) => handleNewPasswordChange(e.target.value)}
            className="block w-full border rounded-md p-2 bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter New Password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("new")}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
          >
            {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.new && <p className="text-red-500 text-sm">{errors.new}</p>}
      </div>

      {/* Confirm New Password */}
      <div>
        <label className="block text-sm font-medium text-white">Confirm New Password</label>
        <div className="relative mt-1">
          <input
            type={showPassword.confirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            className="block w-full border rounded-md p-2 bg-gray-800 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm New Password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirm")}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
          >
            {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm}</p>}
      </div>

      {/* Update Password Button */}
      <div className="flex items-end">
        <button
          type="submit"
          disabled={loading || !currentPassword || !newPassword || !confirmPassword || !!errors.new || !!errors.confirm}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
