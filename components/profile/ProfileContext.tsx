"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  profilePic: string;
  role: "customer" | "vendor" | "admin";
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (newProfile: Partial<Profile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<Profile>({
    id: session?.user?.id || "",
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ").slice(1).join(" ") || "",
    email: session?.user?.email || "",
    profilePic: session?.user?.image || "/images/avatar1.jpg",
    role: (session?.user?.role as "customer" | "vendor" | "admin") || "customer",
  });

  const updateProfile = async (newProfile: Partial<Profile>) => {
    try {
      setProfile(prev => ({
        ...prev,
        ...newProfile
      }));

      // Only update session if there are changes
      if (session?.user) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: newProfile.firstName || newProfile.lastName ? 
              `${newProfile.firstName || profile.firstName} ${newProfile.lastName || profile.lastName}` : 
              session.user.name,
            email: newProfile.email || session.user.email,
            image: newProfile.profilePic || session.user.image,
          }
        });
      }

      // Only make API call if we're updating db-relevant fields
      if (newProfile.firstName || newProfile.lastName || newProfile.email) {
        const res = await fetch(`/api/users/${profile.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${newProfile.firstName || profile.firstName} ${newProfile.lastName || profile.lastName}`,
            email: newProfile.email,
          }),
        });

        if (!res.ok) throw new Error("Failed to update profile");
      }

    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
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
