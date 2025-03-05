import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 text-white rounded-lg shadow-xl p-6 w-80 text-center"
      >
        <FiLogOut className="text-red-500 mx-auto mb-3" size={40} />
        <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
        <p className="text-gray-300 mb-4">Are you sure you want to sign out?</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutModal;
