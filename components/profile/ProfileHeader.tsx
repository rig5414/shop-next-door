"use client";
import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useProfile } from "../profile/ProfileContext";

interface ProfileHeaderProps {
  onProfileUpdate: (profile: { firstName: string; lastName: string; profilePic: string }) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onProfileUpdate }) => {
  const { profile, updateProfile } = useProfile(); // Use context inside the component
  const [firstName, setFirstName] = useState(profile?.firstName || "John");
  const [lastName, setLastName] = useState(profile?.lastName || "Doe");
  const [avatar, setAvatar] = useState<string>(profile?.profilePic || "/default-avatar.png");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setAvatar(imageUrl);
      updateProfile({ firstName, lastName, profilePic: imageUrl }); // Update context
      onProfileUpdate({ firstName, lastName, profilePic: imageUrl }); // Sync with dashboard
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-[#0f0c29] rounded-2xl shadow-lg neon-glow">
      <div className="relative">
        <Image
          src={avatar}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full border-4 border-purple-500 shadow-md"
        />
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0">
          <button 
            className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition"
            title="Upload profile picture"
            aria-label="Upload profile picture"
          >
            <Upload size={16} color="white" />
          </button>
        </label>
        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>
      <h2 className="text-xl font-semibold text-white">{`${firstName} ${lastName}`}</h2>
      <p className="text-sm text-gray-300">Vendor</p>
    </div>
  );
};

export default ProfileHeader;
