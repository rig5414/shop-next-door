import { useProfile } from "../profile/ProfileContext";
import Image from "next/image";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const { profile } = useProfile(); 

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-300">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Image src={profile.profilePic} alt="User Avatar" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-purple-500" />
        <p className="text-white font-semibold">{`${profile.firstName} ${profile.lastName}`}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
