"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      router.push("/auth/login"); // Redirect to login page after successful signup
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Failed to register. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-2xl"></div>
      <div className="neon-card relative p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Create an Account</h1>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          {/* First Name & Last Name */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-2 w-1/2 border rounded bg-gray-800 text-white placeholder-gray-400"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-2 w-1/2 border rounded bg-gray-800 text-white placeholder-gray-400"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-2 w-full border rounded bg-gray-800 text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="p-2 w-full border rounded bg-gray-800 text-white placeholder-gray-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 hover:scale-105 cursor-pointer transition-all"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-500 transition-all">
            Login
          </Link>
        </p>
      </div>

      {/* Neon Glow Effect */}
      <style jsx>{`
        .neon-card {
          background: rgba(10, 25, 47, 0.9);
          box-shadow: 0 0 15px rgba(0, 174, 255, 0.5);
          transition: box-shadow 0.4s ease-in-out, background 0.4s;
        }
        .neon-card:hover {
          box-shadow: 0 0 25px rgba(0, 174, 255, 0.9);
          background: rgba(10, 25, 47, 1);
        }
        input:-webkit-autofill {
          background-color: rgba(31, 41, 55, 1) !important;
          color: white !important;
          -webkit-text-fill-color: white !important;
          border: 1px solid rgba(0, 174, 255, 0.7) !important;
        }
        @media (prefers-color-scheme: light) {
          input:-webkit-autofill {
            background-color: rgba(240, 240, 240, 1) !important;
            color: black !important;
            -webkit-text-fill-color: black !important;
            border: 1px solid rgba(0, 174, 255, 0.7) !important;
          }
        }
      `}</style>
    </div>
  );
}
