"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  role: "customer" | "vendor" | "admin";
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, update } = useSession();

  const [profile, setProfile] = useState<Profile>({
    id: session?.user?.id || "",
    firstName: session?.user?.name?.split(" ")[0] || "User",
    lastName: session?.user?.name?.split(" ")[1] || "",
    profilePic: session?.user?.image || "/images/avatar1.jpg",
    role: (session?.user?.role as "customer" | "vendor" | "admin") || "customer",
  });

  useEffect(() => {
    if (session?.user) {
      setProfile((prev) => ({
        ...prev,
        id: session.user.id || prev.id, // Ensure ID is set correctly
        firstName: session.user.name?.split(" ")[0] || prev.firstName,
        lastName: session.user.name?.split(" ")[1] || prev.lastName,
        profilePic: session.user.image || prev.profilePic,
        role: (session.user.role as "customer" | "vendor" | "admin") || prev.role,
      }));
    }
  }, [session]);

  const updateProfile = async (newProfile: Profile) => {
    try {
      const res = await fetch(`/api/users/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${newProfile.firstName} ${newProfile.lastName}`,
          image: newProfile.profilePic,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setProfile(newProfile);

      // Update session globally
      await update({
        ...session,
        user: {
          ...session?.user,
          name: `${newProfile.firstName} ${newProfile.lastName}`,
          image: newProfile.profilePic,
          role: newProfile.role,
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

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};
