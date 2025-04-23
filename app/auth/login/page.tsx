"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Check for password_updated message in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('message') === 'password_updated') {
      setSuccessMessage('Password updated successfully. Please log in with your new password.');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Use router.refresh() to ensure the session is updated
      router.refresh();

      // Get the return URL from the query parameters or use a default route
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');

      // Redirect based on role
      if (result?.ok) {
        if (returnUrl) {
          router.push(returnUrl);
        } else {
          router.push('/dashboard'); // Let the middleware handle role-based routing
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white relative">
      {/* Neon Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-2xl"></div>

      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Login Information Section */}
        <div className="relative z-10 max-w-md md:w-2/5 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 neon-text">Welcome Back! 🏪</h1>
            <p className="text-gray-300 text-lg mb-8">Log in to access your Shop Next Door account</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xl">🛍️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Access Your Dashboard</h3>
                <p className="text-gray-300">Manage your orders, track deliveries, and view purchase history.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-xl">🏪</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">For Vendors</h3>
                <p className="text-gray-300">Manage your shop, update inventory, and process orders efficiently.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                <p className="text-gray-300">Your transactions are protected with industry-standard security.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="relative bg-gray-900 p-8 rounded-lg shadow-lg w-96 border border-gray-700 neon-glow">
          <h1 className="text-2xl font-bold mb-4 text-center text-white">Login</h1>

          {successMessage && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-500 px-4 py-2 rounded-md text-sm text-center mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm text-center mb-4">
              {error}
            </div>
          )}

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
              disabled={isLoading}
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 cursor-pointer transition-all flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
              ) : (
                'Login'
              )}
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
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 10px rgba(0, 174, 255, 0.8);
        }
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
