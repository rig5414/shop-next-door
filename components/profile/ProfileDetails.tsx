"use client";
import { useState } from "react";

interface ProfileDetailsProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onProfileUpdate: (updatedData: Partial<{ firstName: string; lastName: string; email: string }>) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profileData, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    onProfileUpdate(formData);
  };

  return (
    <div className="p-6 bg-[#0f0c29] rounded-2xl shadow-lg neon-glow">
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
            <p className="text-white">{profileData.firstName}</p>
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
            <p className="text-white">{profileData.lastName}</p>
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
            <p className="text-white">{profileData.email}</p>
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
