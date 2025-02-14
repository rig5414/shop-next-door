"use client";
import { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasNumber && hasSpecial;
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (!validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        new: "Password must be at least 8 characters and include a number & symbol.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, new: "" }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== newPassword) {
      setErrors((prev) => ({
        ...prev,
        confirm: "Passwords do not match.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirm: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      setErrors((prev) => ({ ...prev, current: "Current password is required." }));
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        new: "Password must be at least 8 characters and include a number & symbol.",
      }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirm: "Passwords do not match." }));
      return;
    }

    console.log("Password updated!");
    // Call API to update password here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
          placeholder="Enter Current Password"
          aria-label="Current password"
        />
        {errors.current && <p className="text-red-500 text-sm">{errors.current}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => handleNewPasswordChange(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
          placeholder="Enter New Password"
          aria-label="New password"
        />
        {errors.new && <p className="text-red-500 text-sm">{errors.new}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
          placeholder="Confirm New Password"
          aria-label="Confirm password"
        />
        {errors.confirm && <p className="text-red-500 text-sm">{errors.confirm}</p>}
      </div>

      <button
        type="submit"
        disabled={!currentPassword || !newPassword || !confirmPassword || !!errors.new || !!errors.confirm}
        className="w-full bg-blue-500 text-white py-2 rounded-md disabled:opacity-50"
      >
        Update Password
      </button>
    </form>
  );
};

export default ChangePassword;
