"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const activeSections = useRef<{ [key: string]: number }>({}); // Use ref instead of state
    const [triggerRender, setTriggerRender] = useState(0); // Force re-render when needed

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const sections = ["about", "marketplace", "contact"];
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: [0.3, 0.6, 0.9], // Observe at 30%, 60%, and 90%
        };

        const observer = new IntersectionObserver((entries) => {
            let hasChanges = false;
            
            entries.forEach((entry) => {
                const ratio = entry.intersectionRatio;
                if (activeSections.current[entry.target.id] !== ratio) {
                    activeSections.current[entry.target.id] = ratio;
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                setTriggerRender((prev) => prev + 1); // Trigger re-render only when visibility changes
            }
        }, observerOptions);

        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const handleNavLinkClick = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    const getTextColor = (id: string) => {
        const visibility = activeSections.current[id] || 0;
        if (visibility >= 0.6) return "text-blue-500"; // Full blue
        if (visibility >= 0.3) return "text-blue-300"; // Light blue
        return "text-white hover:text-blue-400"; // Default color
    };

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
                        <button
                            onClick={() => handleNavLinkClick("about")}
                            className={`transition ${getTextColor("about")}`}
                        >
                            About
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleNavLinkClick("marketplace")}
                            className={`transition ${getTextColor("marketplace")}`}
                        >
                            Marketplace
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleNavLinkClick("contact")}
                            className={`transition ${getTextColor("contact")}`}
                        >
                            Contact
                        </button>
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
