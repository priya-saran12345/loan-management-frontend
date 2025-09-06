import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaInfoCircle, FaEnvelope, FaMoneyBillWave, FaCalculator, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/user/is-auth');

        if (data.success) {
          setIsLoggedIn(true);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.get('/user/logout');

      if (response.data.success) {
        setIsLoggedIn(false);
        setUser(null);
        setShowUserDropdown(false);
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        throw new Error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navLinks = [
    { path: "/", icon: <FaHome />, text: "Home" },
    { path: "/about", icon: <FaInfoCircle />, text: "About" },
    { path: "/calculator", icon: <FaCalculator />, text: "Calculator" },
    { path: "/contact", icon: <FaEnvelope />, text: "Contact" }
  ];

  return (
    <nav className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none" onClick={closeMenu}>
            <FaMoneyBillWave className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">LoanEase</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md transition-colors duration-200 cursor-pointer"
              >
                {link.icon}
                <span className="ml-2">{link.text}</span>
              </Link>
            ))}

            {isLoggedIn ? (
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  className="flex items-center text-gray-700 hover:text-emerald-600 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  aria-label="User menu"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <FaUser className="h-5 w-5" />
                </button>

                {showUserDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    onMouseLeave={() => setShowUserDropdown(false)}
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => {
                        closeMenu();
                        setShowUserDropdown(false);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 p-2 rounded-md cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 cursor-pointer">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className="px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md flex items-center focus:outline-none focus:bg-emerald-50 cursor-pointer"
              >
                {link.icon}
                <span className="ml-2">{link.text}</span>
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md flex items-center focus:outline-none focus:bg-emerald-50"
                >
                  <FaUser className="mr-2" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-left text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md flex items-center focus:outline-none focus:bg-emerald-50"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-center mt-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;