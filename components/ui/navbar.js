"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <nav className="flex justify-between p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">Shop Next Door</h1>
      <div>
        {user ? (
          <>
            <span className="mr-4">{user.name}</span>
            <a href="/api/auth/logout" className="bg-red-500 px-4 py-2 rounded">
              Logout
            </a>
          </>
        ) : (
          <a href="/api/auth/login" className="bg-blue-500 px-4 py-2 rounded">
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
