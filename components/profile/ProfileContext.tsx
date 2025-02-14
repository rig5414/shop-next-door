"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Profile {
  firstName: string;
  lastName: string;
  profilePic: string;
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (newProfile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile>({
    firstName: "John",
    lastName: "Doe",
    profilePic: "/default-avatar.png",
  });

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
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
