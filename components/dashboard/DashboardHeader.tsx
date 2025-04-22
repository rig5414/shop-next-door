"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  userName: string;
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, title, subtitle }) => {
  // Move localStorage access to useEffect to avoid SSR issues
  const [userImage, setUserImage] = useState("/images/avatar1.jpg");

  useEffect(() => {
    // Safely access localStorage after component mounts
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setUserImage(savedAvatar);
    }

    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updatedProfile = customEvent.detail;
      
      if (updatedProfile.image) {
        setUserImage(updatedProfile.image);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title.includes('${customerName}') 
            ? title.replace('${customerName}', userName)
            : title}
        </h1>
        {subtitle && <p className="text-gray-300">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image 
            src={userImage} 
            alt="User Avatar" 
            width={40} 
            height={40} 
            className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover" 
          />
        </div>
        <p className="text-white font-semibold">{userName}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
