"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "./ProfileContext";
import { useRouter } from "next/navigation";

interface ProfileData {
  name: string; // Single name field from DB
  email: string;
  profilePic?: string;
}

interface ProfileDetailsProps {
  profileData: ProfileData;
  onProfileUpdate: (data: Partial<ProfileData>) => Promise<void>;
  isUpdating: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profileData, onProfileUpdate, isUpdating }) => {
  const { data: session } = useSession();
  const { updateProfile } = useProfile();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: profileData.email,
  });

  // Split name into first and last name when profile data changes
  useEffect(() => {
    if (profileData.name) {
      const [firstName = '', lastName = ''] = profileData.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email: profileData.email,
      }));
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    try {
      await onProfileUpdate({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      });
      setIsEditing(false);  // Disable editing after successful update
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 bg-[#0f0c29] p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your first name"
            aria-label="First Name"
            className={`w-full p-2 rounded ${!isEditing ? 'bg-gray-800' : 'bg-gray-700'} text-white border ${
              isEditing ? 'border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
              : 'border-transparent'
            }`}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your last name"
            aria-label="Last Name"
            className={`w-full p-2 rounded ${!isEditing ? 'bg-gray-800' : 'bg-gray-700'} text-white border ${
              isEditing ? 'border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
              : 'border-transparent'
            }`}
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Enter your email address"
          aria-label="Email Address"
          className={`w-full p-2 rounded ${!isEditing ? 'bg-gray-800' : 'bg-gray-700'} text-white border ${
            isEditing ? 'border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500' 
            : 'border-transparent'
          }`}
        />
      </div>
      <div className="flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-300 hover:text-white"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Edit Profile
          </button>
        )}
      </div>
    </form>
  );
};

export default ProfileDetails;
