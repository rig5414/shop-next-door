"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";
import UserForm from "../../../../../components/forms/UserForm";

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
}

const UserDetails = () => {
  const { id } = useParams() as { id: string };
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Error loading user data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Failed to update user");

      alert("User updated successfully!");
    } catch (err) {
      alert("Error updating user.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-6">Loading user details...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">Edit User Details</h2>
        {user && <UserForm user={user} setUser={setUser} onSave={handleSave} />}
        {saving && <div className="text-gray-400 mt-2">Saving...</div>}
      </div>
    </DashboardLayout>
  );
};

export default UserDetails;
