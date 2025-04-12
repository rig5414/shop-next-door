"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ProfileData {
  firstName?: string;
  lastName?: string;
  email: string;
}

interface ProfileDetailsProps {
  profileData: ProfileData;
  onProfileUpdate: (updatedData: Partial<ProfileData>) => Promise<void>;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profileData, onProfileUpdate }) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure data is populated from session if missing
  useEffect(() => {
    if (session?.user?.id) {
      const fullName = session.user.name || "";
      const [firstName, lastName] = fullName.split(" ");

      setFormData({
        firstName: profileData.firstName || firstName || "",
        lastName: profileData.lastName || lastName || "",
        email: profileData.email || session.user.email || "",
      });
    }
  }, [session, profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!session?.user?.id) return;
    if (
      formData.firstName === profileData.firstName &&
      formData.lastName === profileData.lastName &&
      formData.email === profileData.email
    ) {
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    const updatedProfile = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
    };

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const res = await fetch(`/api/users/${session.user.id}`,{
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(updatedProfile),
        signal: signal,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || ""

      await onProfileUpdate({ firstName, lastName, email: data.email, });

      await fetch (`/api/users/${session.user.id}`, {cache: "no-store", signal: signal});
    }  catch (err) {
      if (err instanceof Error) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error("Profile update error:", err.message);
        alert("Error updating profile. Please try again.");
      }
    } else {
      console.error("An unknown error occurred.");
    }
    } finally {
        controller.abort();
    }
  };

  return (
    <div className="p-6 bg-[#0f0c29] rounded-2xl mb-2 shadow-lg neon-glow">
      <h2 className="text-xl font-semibold text-white mb-4">Profile Details</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="first-name" className="text-gray-300 block mb-1">First Name</label>
          {isEditing ? (
            <input
              id="first-name"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded-md outline-none border border-gray-600 focus:border-purple-500"
            />
          ) : (
            <p className="text-white">{formData.firstName || "N/A"}</p>
          )}
        </div>

        <div>
          <label htmlFor="last-name" className="text-gray-300 block mb-1">Last Name</label>
          {isEditing ? (
            <input
              id="last-name"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded-md outline-none border border-gray-600 focus:border-purple-500"
            />
          ) : (
            <p className="text-white">{formData.lastName || "N/A"}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-gray-300 block mb-1">Email</label>
          {isEditing ? (
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white p-2 rounded-md outline-none border border-gray-600 focus:border-purple-500"
            />
          ) : (
            <p className="text-white">{formData.email || "N/A"}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-500 transition">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-red-600 px-4 py-2 rounded-md text-white hover:bg-red-500 transition">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-500 transition">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
