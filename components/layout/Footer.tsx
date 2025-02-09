"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center mt-auto">
      <p className="text-sm">&copy; {new Date().getFullYear()} Shop Next Door. All rights reserved.</p>
    </footer>
  );
}
