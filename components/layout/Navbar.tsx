"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change navbar style after scrolling 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full px-6 py-4 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <span className="text-2xl font-bold text-white cursor-pointer">Shop Next Door</span>
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex gap-6 text-white">
          <li>
            <Link href="/about" className="hover:text-blue-400 transition">
              About
            </Link>
          </li>
          <li>
            <Link href="/marketplace" className="hover:text-blue-400 transition">
              Marketplace
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-blue-400 transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4">
          <Link href="/auth/login">
            <button className="px-4 py-2 border border-white text-white rounded hover:bg-blue-600 transition">
              Login
            </button>
          </Link>
          <Link href="/auth/register">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
