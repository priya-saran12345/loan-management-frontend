// src/pages/dashboard/DashboardHome.jsx
import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiUser,
  FiCreditCard,
  FiAlertCircle,
  FiTrendingUp,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

// Custom responsive hooks
const useDeviceType = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isLaptop = useMediaQuery({ minWidth: 1024, maxWidth: 1279 });
  const isDesktop = useMediaQuery({ minWidth: 1280 });

  return { isMobile, isTablet, isLaptop, isDesktop };
};

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalEmployees: 0,
    mainWallet: 0,
    extraIncome: 0,
    overdue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isMobile, isTablet, isLaptop, isDesktop } = useDeviceType();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [
          { data: customersStlData },
          { data: customersLraData },
          { data: employeesData },
          { data: walletData },
          { data: incomeData },
          { data: overdueData }
        ] = await Promise.all([
          api.get('/customers-stl'),
          api.get('/customers-lra'),
          api.get('/employees'),
          api.get('/wallet'),
          api.get('/extra-income'),
          api.get('/customers-stl/overdue/list')
        ]);

        setStats({
          totalCustomers: customersStlData.customers.length + customersLraData.customers.length,
          totalEmployees: employeesData.employees.length,
          mainWallet: walletData.wallet?.balance || 0,
          extraIncome: incomeData.total || 0,
          overdue: overdueData.total || 0
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load some dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Responsive grid configuration
  const getGridConfig = () => {
    if (isMobile) return "grid-cols-1 gap-3";
    if (isTablet) return "grid-cols-2 gap-4";
    if (isLaptop) return "grid-cols-3 gap-4";
    return "grid-cols-4 gap-5"; // Desktop
  };

  // Responsive font sizes
  const getTitleSize = () => {
    if (isMobile) return "text-xl";
    if (isTablet) return "text-xl";
    return "text-2xl"; // Laptop and desktop
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex">
        <main className="flex-1 p-4 md:p-6">

          <h1 className={`font-bold text-gray-800 ${getTitleSize()} mb-6`}>
            Dashboard Overview
          </h1>

          <div className={`grid ${getGridConfig()}`}>
            <StatCard
              icon={<FiCreditCard className="text-green-600" />}
              title="Main Wallet"
              value={`₹${stats.mainWallet.toLocaleString()}`}
              onClick={() => handleCardClick('/dashboard/wallet')}
              isMobile={isMobile}
            />
            <StatCard
              icon={<FiTrendingUp className="text-yellow-600" />}
              title="Extra Income"
              value={`₹${stats.extraIncome.toLocaleString()}`}
              onClick={() => handleCardClick('/dashboard/extra-income')}
              isMobile={isMobile}
            />
            <StatCard
              icon={<FiAlertCircle className="text-red-600" />}
              title="Overdue"
              value={`₹${stats.overdue.toLocaleString()}`}
              onClick={() => handleCardClick('/dashboard/overdue')}
              isMobile={isMobile}
            />
            <StatCard
              icon={<FiUsers className="text-blue-600" />}
              title="Total Customers"
              value={stats.totalCustomers}
              isMobile={isMobile}
            />
            <StatCard
              icon={<FiUser className="text-lime-600" />}
              title="Total Employees"
              value={stats.totalEmployees}
              onClick={() => handleCardClick('/dashboard/employees')}
              isMobile={isMobile}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, onClick, isMobile }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''
        } ${isMobile ? 'p-3' : 'p-4'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={`rounded-full bg-gray-50 ${isMobile ? 'p-1' : 'p-2'}`}>
          {React.cloneElement(icon, { size: isMobile ? 18 : 24 })}
        </div>
        {!isMobile && (
          <div className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded">
            View Details
          </div>
        )}
      </div>
      <div className={isMobile ? 'mt-2' : 'mt-4'}>
        <h3 className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
          {title}
        </h3>
        <p className={`font-semibold mt-1 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          {value}
        </p>
      </div>
    </div>
  );
};


export default DashboardHome;