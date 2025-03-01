"use client";
import Navbar from "../components/layout/Navbar"; 
import Footer from "../components/layout/Footer"; 
import Image from "next/image";
import Link from "next/link";
import { PhoneIcon, MessageCircleIcon, MailIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-start justify-between text-left py-32 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 blur-[150px]"></div>
      {/* Left Side - Text Content */}
      <div className="relative z-10 max-w-lg md:w-1/2">
      <h1 className="text-5xl font-extrabold mb-4 neon-text">
        Welcome to Shop Next Door 🏪
      </h1>
      <p className="text-lg mb-6 opacity-90">
        Discover and shop from local vendors with ease. Support small businesses around you!
      </p>
      <Link href="/auth/register">
        <button className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all glow-effect">
          Get Started
        </button>
      </Link>
      <div className="relative hidden md:block md:w-1/1">
      <div className="grid grid-cols-2 gap-4">
        {[
          "/images/shop11.jpg",
          "/images/shop7.jpg"
        ].map((imageUrl, index) => (
          <div key={index}
          className="relative w-50 h-60 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
            <Image
               src={imageUrl}
               alt={'Shop ${index + 1}'}
               fill
               className="object-cover rounded-xl"
               />
            </div>
        ))}
        </div>
      </div>
    </div>

     {/* Right Side - Image Grid Layout */}
     <div className="relative hidden md:block md:w-1/2">
      <div className="grid grid-cols-2 gap-3">
        {[
           "/images/shop6.jpg",
           "/images/shop10.jpg",
           "/images/shop3.jpg",
           "/images/shop5.jpg",
           "/images/shop9.jpg",
           "/images/shop12.jpg"
         ].map((imageUrl, index) => (
        <div 
          key={index} 
          className="relative w-50 h-40 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
        >
        <Image 
          src={imageUrl} 
          alt={`Shop ${index + 1}`} 
          fill 
          className="object-cover rounded-xl"
        />
      </div>
    ))}
     </div>
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
      {/* About Section */}
<section className="py-16 px-6 bg-gray-100 dark:bg-gray-900" id="about">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      About Shop Next Door
    </h2>
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
      Shop Next Door is a platform designed to connect customers with local vendors, making it easier to discover and shop from small businesses in their community.
    </p>
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
      Our mission is to empower vendors by providing them with an easy-to-use online store while giving customers a seamless shopping experience with trusted local sellers.
    </p>
    <p className="text-lg text-gray-700 dark:text-gray-300">
      Whether you&#39;re a vendor managing your shop, a customer looking for everyday essentials, Shop Next Door is built to serve your needs.
    </p>
  </div>
</section>


      {/* Marketplace Section */}
        <section className="py-16 px-6" id="marketplace">
          <h2 className="text-3xl font-bold text-center mb-10">Marketplace</h2>
            <p className="text-lg text-center">Explore our wide range of products and vendors.</p>
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

      {/* Contact Section */}
<section className="py-16 px-6 bg-white dark:bg-gray-950" id="contact">
  <div className="max-w-3xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact Us</h2>
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
      Get in touch with us for inquiries, support, or collaborations.
    </p>
    
    <div className="flex flex-col items-center space-y-6">
      {/* Phone & WhatsApp */}
      <div className="flex items-center space-x-4 text-lg text-gray-700 dark:text-gray-300">
        <PhoneIcon className="w-6 h-6 text-blue-500" />
        <MessageCircleIcon className="w-6 h-6 text-green-500" />
        <span>+254 711 580 663</span>
        <span>+254 732 082 389</span>
      </div>
      <div className="flex items-center space-x-4 text-lg text-gray-700 dark:text-gray-300">
        <MessageCircleIcon className="w-6 h-6 text-green-500" />
        <span>WhatsApp: +254 711 580 663</span>
        <span>+254 732 082 389</span>
      </div>

      {/* Email */}
      <div className="flex items-center space-x-4 text-lg text-gray-700 dark:text-gray-300">
        <MailIcon className="w-6 h-6 text-red-500" />
        <a href="mailto:manassehtelle90@gmail.com" className="hover:underline">
          manassehtelle90@gmail.com
        </a>
      </div>

      {/* Instagram */}
<div className="flex items-center space-x-4 text-lg text-gray-700 dark:text-gray-300">
  <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5ZM12 7.375A4.625 4.625 0 1 1 7.375 12 4.631 4.631 0 0 1 12 7.375Zm0 1.5A3.125 3.125 0 1 0 15.125 12 3.13 3.13 0 0 0 12 8.875ZM16.75 6a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z" />
  </svg>
  <a href="https://www.instagram.com/mana_sseh7" target="_blank" className="hover:underline">
    @mana_sseh7
  </a>
</div>

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
