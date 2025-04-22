"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

const DEFAULT_AVATARS = [
  "/images/avatar1.jpg",
  "/images/avatar2.jpg",
  "/images/avatar3.jpg",
  "/images/avatar4.jpg",
  "/images/avatar5.jpg",
];

type ProfileHeaderProps = {
  userName: string;
  userRole: string;
  currentAvatar: string;
  onAvatarUpdate: (newAvatarUrl: string) => Promise<void>;
};

const ProfileHeader = ({ userName, userRole, currentAvatar, onAvatarUpdate }: ProfileHeaderProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    // Try to get stored avatar, fallback to current avatar prop
    return localStorage.getItem('userAvatar') || currentAvatar;
  });
  const [isAvatarSelectionOpen, setIsAvatarSelectionOpen] = useState(false);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  // Update selected avatar when currentAvatar prop changes
  useEffect(() => {
    // Only update if there's no stored avatar
    if (!localStorage.getItem('userAvatar')) {
      setSelectedAvatar(currentAvatar);
    }
  }, [currentAvatar]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setSelectedAvatar(imageUrl);
      setIsAvatarChanged(true);
    }
  };

  const handleAvatarChange = (newAvatar: string) => {
    setSelectedAvatar(newAvatar);
    setIsAvatarChanged(true);
    setIsAvatarSelectionOpen(false);
  };

  const handleSaveAvatar = async () => {
    try {
      await onAvatarUpdate(selectedAvatar);
      setIsAvatarChanged(false);
      // Store the selection
      localStorage.setItem('userAvatar', selectedAvatar);
    } catch (error) {
      console.error('Failed to update avatar:', error);
      // Revert to stored avatar on error
      const storedAvatar = localStorage.getItem('userAvatar') || currentAvatar;
      setSelectedAvatar(storedAvatar);
    }
  };

  return (
    <div className="flex flex-col items-center mb-2 gap-4 p-6 bg-[#0f0c29] rounded-2xl shadow-lg neon-glow">
      <div className="relative">
        <Image
          src={selectedAvatar}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full border-4 border-purple-500 shadow-md"
        />
        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0">
          <button
            type="button"
            onClick={() => document.getElementById("avatar-upload")?.click()}
            className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition"
            title="Upload profile picture"
            aria-label="Upload profile picture"
          >
            <Upload size={16} color="white" />
          </button>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <h2 className="text-xl font-semibold text-white">
        {userName}
      </h2>
      <p className="text-sm text-gray-300 capitalize">{userRole}</p>

      {isAvatarChanged && (
        <button
          onClick={handleSaveAvatar}
          className="bg-green-600 px-4 py-2 text-white rounded-md hover:bg-green-500 transition"
        >
          Save Changes
        </button>
      )}

      <button
        onClick={() => setIsAvatarSelectionOpen(!isAvatarSelectionOpen)}
        className="text-sm text-blue-400 hover:text-blue-300 transition"
      >
        Choose Avatar
      </button>

      {isAvatarSelectionOpen && (
        <div className="flex gap-2 mt-2">
          {DEFAULT_AVATARS.map((avatar) => (
            <Image
              key={avatar}
              src={avatar}
              alt="Avatar Option"
              width={50}
              height={50}
              className={`rounded-full cursor-pointer border-2 ${
                selectedAvatar === avatar ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => handleAvatarChange(avatar)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
