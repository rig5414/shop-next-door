"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImpersonationBanner() {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the impersonating cookie exists
    const cookies = document.cookie.split(';');
    const impersonatingCookie = cookies.find(cookie => cookie.trim().startsWith('impersonating='));
    setIsImpersonating(!!impersonatingCookie);
  }, []);

  const endImpersonation = async () => {
    try {
      const response = await fetch('/api/users/impersonation/end', {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Close this tab and return to admin
        window.close();
      }
    } catch (error) {
      console.error("Failed to end impersonation:", error);
    }
  };

  if (!isImpersonating) return null;

  return (
    <div className="bg-yellow-600 text-white px-4 py-2 flex justify-between items-center">
      <p>You are currently viewing as another user</p>
      <button 
        onClick={endImpersonation}
        className="bg-white text-yellow-600 px-3 py-1 rounded-md text-sm font-medium"
      >
        End Session
      </button>
    </div>
  );
}