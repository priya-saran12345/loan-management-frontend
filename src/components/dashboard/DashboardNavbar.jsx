// src/components/dashboard/DashboardNavbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const DashboardNavbar = ({ setSidebarOpen, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await api.get('/user/logout');
      if (data.success) {
        toast.success('Logged out successfully');
        setIsDropdownOpen(false);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-600 mr-4 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">Signed in as</div>
                  <div className="truncate">{user?.email}</div>
                </div>
                <Link
                  to="/dashboard/profile"
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <FiUser className="mr-2" size={14} />
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <FiLogOut className="mr-2" size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
      )}
    </header>
  );
};

export default DashboardNavbar;