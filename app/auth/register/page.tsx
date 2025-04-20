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
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-[150px]"></div>

      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Instructions Section */}
        <div className="relative z-10 max-w-md md:w-2/5 space-y-6 p-6">
          <h1 className="text-4xl font-extrabold mb-6 neon-text">
            Get Started with Shop Next Door 🏪
          </h1>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                <p className="text-gray-300">Join our community of local vendors and customers. Discover and shop from nearby stores.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Explore Features</h3>
                <p className="text-gray-300">Access wide variety of products, fast delivery, and secure payment options.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Start Shopping</h3>
                <p className="text-gray-300">Support small businesses while enjoying a seamless shopping experience.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="neon-card relative p-8 rounded-lg shadow-lg w-full md:w-2/5 max-w-md">
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
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 hover:scale-105 cursor-pointer transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  Signing Up...
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                </>
              ) : (
                "Sign Up"
              )}
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
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 10px rgba(0, 174, 255, 0.8);
        }
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
            background-color: rgb(31, 41, 55) !important;
            color: white !important;
            -webkit-text-fill-color: white !important;
          }
        }

        /* Chrome/Safari/Opera */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgb(31, 41, 55) inset !important;
          -webkit-text-fill-color: white !important;
          caret-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Firefox */
        input:autofill {
          background: rgb(31, 41, 55) !important;
          color: white !important;
          box-shadow: 0 0 0 30px rgb(31, 41, 55) inset !important;
        }

        input {
          background: rgb(31, 41, 55) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}
