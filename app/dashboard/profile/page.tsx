"use client";
import { useEffect, useState } from "react";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import ProfileDetails from "../../../components/profile/ProfileDetails";
import ChangePassword from "../../../components/profile/ChangePassword";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const ProfilePage = () => {
  const [role, setRole] = useState<"customer" | "vendor" | "admin">("admin"); // Default role
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
  });

  useEffect(() => {
    // Retrieve last role from localStorage to determine correct sidebar
    const storedRole = localStorage.getItem("lastRole") as "customer" | "vendor" | "admin";
    if (storedRole) setRole(storedRole);
  }, []);

  const handleProfileUpdate = (updatedData: Partial<{ firstName: string; lastName: string; email: string }>) => {
    setProfileData((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <DashboardLayout role={role}>
      <div className="p-6">
        <ProfileHeader onProfileUpdate={handleProfileUpdate} />
        <ProfileDetails profileData={profileData} onProfileUpdate={handleProfileUpdate} />
        <ChangePassword />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
