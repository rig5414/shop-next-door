"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    // Fetch session to check user role after login
    const res = await fetch("/api/auth/session");
    const session = await res.json();

    if (session?.user?.role === "customer") {
      router.push("/dashboard/customer");
    } else if (session?.user?.role === "vendor") {
      router.push("/dashboard/vendor");
    } else if (session?.user?.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      setError("Role not assigned");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative">
      {/* Neon Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-2xl"></div>

      <div className="relative bg-gray-900 p-8 rounded-lg shadow-lg w-96 border border-gray-700 neon-glow">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Login</h1>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input with Eye Icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-3 border rounded bg-gray-800 text-white w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 cursor-pointer transition-all"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-sm text-gray-400 text-center">
          Don&#39;t have an account?
          <Link
            href="/auth/register"
            className="text-blue-400 hover:text-blue-500 hover:underline cursor-pointer ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Neon Glow Effect */}
      <style jsx>{`
        .neon-glow {
          box-shadow: 0 0 10px rgba(0, 174, 255, 0.5);
          transition: box-shadow 0.3s ease-in-out, background 0.3s;
        }
        .neon-glow:hover {
          box-shadow: 0 0 20px rgba(0, 174, 255, 0.9);
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          background-color: rgba(31, 41, 55, 1) !important;
          color: white !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}
