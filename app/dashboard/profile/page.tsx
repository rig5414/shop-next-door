"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileDetails from "../../../components/profile/ProfileDetails";
import ChangePassword from "../../../components/profile/ChangePassword";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useRouter } from "next/navigation";

// Define the profile type to match component expectations
type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
};

const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900">
  </div>
);

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [role, setRole] = useState<"customer" | "vendor" | "admin" | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "loading" || !session?.user?.id) return; // Wait for session to load

    if (!session || !session.user) {
      router.push("/auth/login");
      return;
    }

    if (!session.user.id) return;

    const controller = new AbortController();

    // Fetch user profile using session user ID
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/users/${session.user.id}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfileData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          profilePic: data.profilePic || "/default-profile.png", // Default if missing
        });

        setRole(data.role); // Set role from API response
      } catch (err: unknown) {
        if (err instanceof Error) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } else {
        setError("An unknown error occurred");
      }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => controller.abort();
  }, [session, status, router]);

  // Function to update profile state correctly
  const handleProfileUpdate = (updatedData: Partial<ProfileData>) => {
    setProfileData((prev) => (prev ? { ...prev, ...updatedData } : prev));
  };

  if (loading || !role) return (
    <div className="flex flex-col justify-center items-center h-50">
      <p className="text-gray-500 mt-2 mb-2">Loading profile...</p>
      <Spinner />
    </div>
  );  
  if (error) return (
    <div className="text-center text-red-700 bg-red-100 p-3 rounded-md max-w-md mx-auto">
      {error}
    </div>
  );  
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
