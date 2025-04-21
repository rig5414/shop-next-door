import { useProfile } from "../profile/ProfileContext";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const { data: session } = useSession();
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("/images/avatar1.jpg");

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || "");
      setUserImage(session.user.image || "/images/avatar1.jpg");
    }

    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updatedProfile = customEvent.detail;
      console.log("Profile update event received:", updatedProfile);

      if (updatedProfile.name) {
        setUserName(updatedProfile.name);
        console.log("Updated name to:", updatedProfile.name);
      }
      if (updatedProfile.image) {
        setUserImage(updatedProfile.image);
        console.log("Updated image to:", updatedProfile.image);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [session]);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {title.includes('Welcome') ? `Welcome, ${userName}!` : title}
        </h1>
        {subtitle && <p className="text-gray-300">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Image 
          src={userImage} 
          alt="User Avatar" 
          width={40} 
          height={40} 
          className="w-10 h-10 rounded-full border-2 border-purple-500" 
        />
        <p className="text-white font-semibold">{userName}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
