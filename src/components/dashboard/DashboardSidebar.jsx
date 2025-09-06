// src/components/dashboard/DashboardSidebar.jsx
import { Link, NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUserPlus,
  FiUsers,
  FiFilePlus,
  FiFileText,
  FiDollarSign,
  FiDatabase,
  FiX
} from 'react-icons/fi';
import { FaBalanceScale } from 'react-icons/fa';

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen, user }) => {
  const navItems = [
    { path: "/dashboard", icon: <FiHome size={20} />, text: "Dashboard" },
    { path: "/dashboard/add-customer-stl", icon: <FiUserPlus size={20} />, text: "Add STL Customer" },
    { path: "/dashboard/customers-stl", icon: <FiUsers size={20} />, text: "STL Customer List" },
    { path: "/dashboard/collect-payment-stl", icon: <FiDollarSign size={20} />, text: "Collect STL Payment" },
    { path: "/dashboard/add-employee", icon: <FiFilePlus size={20} />, text: "Add Employee" },
    { path: "/dashboard/employees", icon: <FiFileText size={20} />, text: "Employee List" },
    { path: "/dashboard/expense-tracker", icon: <FaBalanceScale size={20} />, text: "Expense Tracker" },
    { path: "/dashboard/add-customer-lra", icon: <FiUserPlus size={20} />, text: "Add LRA Customer" },
    { path: "/dashboard/customers-lra", icon: <FiUsers size={20} />, text: "LRA Customer List" },
    { path: "/dashboard/collect-payment-lra", icon: <FiDollarSign size={20} />, text: "Collect LRA Payment" },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30 w-64 bg-emerald-800 
        text-white flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-emerald-700">
          <h1 className="text-xl font-bold"><Link to={"/"}>LoanEase Pro</Link></h1>
          <button
            className="md:hidden text-white hover:text-gray-200 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4 flex items-center space-x-3 border-b border-emerald-700">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-emerald-800"></span>
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-emerald-200">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-emerald-700 transition-colors ${isActive ? 'bg-emerald-700 font-medium' : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;