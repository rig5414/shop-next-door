"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { useProfile } from "./ProfileContext";
import { useSession } from "next-auth/react";

const DEFAULT_AVATARS = [
  "/images/avatar1.jpg",
  "/images/avatar2.jpg",
  "/images/avatar3.jpg",
  "/images/avatar4.jpg",
  "/images/avatar5.jpg",
];

const ProfileHeader = () => {
  const router = useRouter();
  const { profile } = useProfile();
  const { data: session, update } = useSession();
  const [selectedAvatar, setSelectedAvatar] = useState(session?.user?.image || "/images/avatar1.jpg");
  const [userName, setUserName] = useState(session?.user?.name || '');
  const [isAvatarSelectionOpen, setIsAvatarSelectionOpen] = useState(false);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  useEffect(() => {
    const updateLocalState = () => {
      if (session?.user) {
        setUserName(session.user.name || '');
        setSelectedAvatar(session.user.image || "/images/avatar1.jpg");
      }
    };

    updateLocalState();

    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updatedProfile = customEvent.detail;
      console.log("Profile update event received:", updatedProfile);

      if (updatedProfile.name) {
        setUserName(updatedProfile.name);
        console.log("Updated name to:", updatedProfile.name);
      }
      if (updatedProfile.image) {
        setSelectedAvatar(updatedProfile.image);
        console.log("Updated image to:", updatedProfile.image);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [session]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setSelectedAvatar(imageUrl);
      setIsAvatarChanged(true);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      const currrentName = userName || session?.user?.name || '';
      // Update session with new avatar
      await update({
        ...session,
        user: {
          ...session?.user,
          name: currrentName,
          image: selectedAvatar,
        }
      });

      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: {
          name: currrentName,
          image: selectedAvatar,
          timestamp: Date.now(),
        }
      }));

      setIsAvatarChanged(false);
    } catch (error) {
      console.error('Failed to update avatar:', error);
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
        {userName || 'Loading...'}
      </h2>
      <p className="text-sm text-gray-300 capitalize">{profile.role}</p>

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
              onClick={() => {
                setSelectedAvatar(avatar);
                setIsAvatarChanged(true);
                setIsAvatarSelectionOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
