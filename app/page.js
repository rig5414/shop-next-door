"use client";
import Navbar from "../components/layout/Navbar"; 
import Footer from "../components/layout/Footer"; 
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-6">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-[150px]"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-4 neon-text">
            Welcome to Shop Next Door 🏪
          </h1>
          <p className="text-lg mb-6 max-w-2xl opacity-90">
            Discover and shop from local vendors with ease. Support small businesses around you!
          </p>
          <Link href="/auth/register">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all glow-effect">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded-lg bg-gray-900 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold mb-2">🛍️ Wide Variety</h3>
            <p className="text-gray-400">Explore a range of products from different vendors.</p>
          </div>
          <div className="p-6 border rounded-lg bg-gray-900 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold mb-2">🚀 Fast Delivery</h3>
            <p className="text-gray-400">Get your orders delivered quickly to your doorstep.</p>
          </div>
          <div className="p-6 border rounded-lg bg-gray-900 hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold mb-2">💳 Secure Payments</h3>
            <p className="text-gray-400">Pay securely through multiple trusted payment options.</p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 px-6 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {/* Testimonial 1 */}
          <div className="max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <Image 
              src="/images/customer3.jpg" 
              alt="Satisfied customer" 
              width={80} 
              height={80} 
              layout="intrinsic"
              objectFit="cover"
              className="rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400 italic">
              This platform makes shopping locally so easy! Fast deliveries and great customer service.
            </p>
            <h4 className="font-semibold mt-4">- Jane Doe</h4>
          </div>

          {/* Testimonial 2 */}
          <div className="max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <Image 
              src="/images/customer4.jpg" 
              alt="Happy customer" 
              width={80} 
              height={80} 
              layout="intrinsic"
              objectFit="cover"
              className="rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400 italic">
              I love supporting small businesses, and this app connects me with amazing vendors!
            </p>
            <h4 className="font-semibold mt-4">- John Smith</h4>
          </div>
        </div>
      </section>

      <Footer />

      {/* Custom Styles */}
      <style jsx>{`
        /* Neon Text Effect */
        .neon-text {
          text-shadow: 0 0 10px rgba(0, 174, 255, 0.8);
        }

        /* Button Glow Effect */
        .glow-effect {
          box-shadow: 0 0 15px rgba(0, 174, 255, 0.7);
          transition: box-shadow 0.3s ease-in-out, transform 0.2s;
        }
        .glow-effect:hover {
          box-shadow: 0 0 20px rgba(0, 174, 255, 1);
        }
      `}</style>
    </div>
  );
}
