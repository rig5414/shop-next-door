"use client";
import Link from "next/link";

interface SettingsCardProps {
  title: string;
  description: string;
  link: string;
}

const SettingsCard = ({ title, description, link }: SettingsCardProps) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <p className="text-gray-400">{description}</p>
      <Link href={link} className="text-blue-400 hover:underline mt-2 inline-block">
        View More →
      </Link>
    </div>
  );
};

export default SettingsCard;
