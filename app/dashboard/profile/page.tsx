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
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
);

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const [role, setRole] = useState<"customer" | "vendor" | "admin" | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
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
  const handleProfileUpdate = async (updatedData: Partial<ProfileData>) => {
    setUpdating(true);
    try {
      if (!session?.user?.id) return;

      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      
      // Update local state with the new data
      setProfileData(prev => prev ? {
        ...prev,
        firstName: updatedProfile.firstName || prev.firstName,
        lastName: updatedProfile.lastName || prev.lastName,
        email: updatedProfile.email || prev.email,
        profilePic: updatedProfile.profilePic || prev.profilePic,
      } : prev);

      // Update the session using the update method from useSession
      await update({
        ...session,
        user: {
          ...session?.user,
          name: `${updatedProfile.firstName} ${updatedProfile.lastName}`,
          email: updatedProfile.email,
          image: updatedProfile.profilePic,
        }
      });

      // Force a router refresh to update the UI
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !role) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
      <div className="flex items-center gap-2 text-gray-400">
        Loading profile...
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
      </div>
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
        <ProfileDetails 
          profileData={profileData} 
          onProfileUpdate={handleProfileUpdate} 
          isUpdating={updating}
        />
        <ChangePassword />
      </div>

      {/* Add these styles */}
      <style jsx global>{`
        /* Chrome, Safari, Opera */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgb(31, 41, 55) inset !important;
          -webkit-text-fill-color: white !important;
          caret-color: white !important;
        }

        /* Firefox */
        input:autofill {
          background: rgb(31, 41, 55) !important;
          color: white !important;
          box-shadow: 0 0 0 30px rgb(31, 41, 55) inset !important;
        }

        /* General input styles */
        input {
          background: rgb(31, 41, 55) !important;
          color: white !important;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ProfilePage;
