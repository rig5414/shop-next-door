"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileDetails from "../../../components/profile/ProfileDetails";
import ChangePassword from "../../../components/profile/ChangePassword";
import DashboardLayout from "../../../components/layout/DashboardLayout";

// Define the profile type to match component expectations
type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
};

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<"customer" | "vendor" | "admin">("customer"); // Default role
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (!session || !session.user) {
      setError("Unauthorized. Please log in.");
      setLoading(false);
      return;
    }

    // Fetch user profile using session user ID
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          profilePic: data.profilePic || "/default-profile.png", // Default if missing
        });

        setRole(data.role); // Set role from API response
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  // Function to update profile state correctly
  const handleProfileUpdate = (updatedData: Partial<ProfileData>) => {
    setProfileData((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profileData) return null; // Handle case where profileData is empty

  return (
    <DashboardLayout role={role}>
      <div className="p-6">
        <ProfileHeader />
        <ProfileDetails profileData={profileData} onProfileUpdate={handleProfileUpdate} />
        <ChangePassword />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
