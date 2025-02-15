"use client";
import { useState } from "react";
import Image from "next/image";

const SettingsUi = () => {
  const [theme, setTheme] = useState("dark");
  const [primaryColor, setPrimaryColor] = useState("#007bff");
  const [logo, setLogo] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md max-w-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Customization Settings</h2>

      {/* Theme Selection */}
      <div className="mb-4">
        <label htmlFor="theme-select" className="text-gray-300 block mb-2">
          Select Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Primary Color Picker */}
      <div className="mb-4">
        <label htmlFor="color-picker" className="text-gray-300 block mb-2">
          Select Primary Color
        </label>
        <input
          type="color"
          id="color-picker"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="w-full h-10 border-none rounded cursor-pointer"
        />
      </div>

      {/* Logo Upload */}
      <div className="mb-4">
        <label htmlFor="logo-upload" className="text-gray-300 block mb-2">
          Upload Logo
        </label>
        <input
          type="file"
          id="logo-upload"
          accept="image/*"
          onChange={handleLogoUpload}
          className="block w-full text-white bg-gray-700 p-2 rounded"
        />
        {logo && <Image src={logo} alt="Uploaded Logo" className="mt-4 max-w-full h-20 object-contain bg-white p-2 rounded" />}
      </div>

      {/* Save Button */}
      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
        Save Changes
      </button>
    </div>
  );
};

export default SettingsUi;
