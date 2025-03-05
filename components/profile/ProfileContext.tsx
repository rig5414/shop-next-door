"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Profile {
  firstName: string;
  lastName: string;
  profilePic: string;
  role: string;
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, update } = useSession(); // Get logged-in user data & update function

  const [profile, setProfile] = useState<Profile>({
    firstName: session?.user?.name?.split(" ")[0] || "User",
    lastName: session?.user?.name?.split(" ")[1] || "",
    profilePic: session?.user?.image || "/images/avatar1.jpg",
    role: session?.user?.role || "customer",
  });

  useEffect(() => {
    if (session?.user) {
      setProfile((prev) => ({
        ...prev,
        firstName: session.user.name?.split(" ")[0] || prev.firstName,
        lastName: session.user.name?.split(" ")[1] || prev.lastName,
        profilePic: session.user.image || prev.profilePic,
        role: session.user.role || prev.role,
      }));
    }
  }, [session]);

  const updateProfile = async (newProfile: Profile) => {
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, { // ✅ FIXED: Correct API URL
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${newProfile.firstName} ${newProfile.lastName}`,
          email: session?.user?.email, // ✅ Ensures email is retained
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setProfile(newProfile); // ✅ Updates local UI instantly

      // ✅ Also update session to reflect changes globally
      await update({
        ...session,
        user: {
          ...session?.user,
          name: `${newProfile.firstName} ${newProfile.lastName}`,
          image: newProfile.profilePic, // ✅ profilePic is frontend-only, updates UI
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook for easy access
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};
