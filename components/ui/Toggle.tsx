import React from "react";

interface ToggleProps {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, defaultChecked = false, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only peer"
          placeholder="checkbox"
        />
        <div className="w-11 h-6 bg-gray-600 peer-focus:ring-4 peer-focus:ring-blue-300 
          rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
          after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white 
          after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
          peer-checked:bg-blue-600">
        </div>
      </label>
    </div>
  );
};

export default Toggle;
