import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalculator, FaFileAlt, FaHome, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="bg-emerald-500 text-white px-2 py-1 rounded mr-2">Loan</span>
              <span>EasePro</span>
            </h2>
            <p className="text-gray-300">
              Your trusted partner for smart financial solutions and loan management.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-700 hover:bg-blue-800 p-2 rounded-full transition-all duration-300 text-gray-200 hover:text-white">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-blue-500 p-2 rounded-full transition-all duration-300 text-gray-200 hover:text-white">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-blue-900/70 p-2 rounded-full transition-all duration-300 text-gray-200 hover:text-white">
                <FaLinkedin size={18} />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-red-500/80 p-2 rounded-full transition-all duration-300 text-gray-200 hover:text-white">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links with Icons */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b border-gray-600 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <FaHome className="mr-3 text-emerald-400" />
                <Link to={"/"} className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <FaCalculator className="mr-3 text-emerald-400" />
                <Link to={"/calculator"} className="hover:text-emerald-400 transition-colors">Loan Calculator</Link>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <FaInfoCircle className="mr-3 text-emerald-400" />
                <Link to={"/about"} className="hover:text-emerald-400 transition-colors">About</Link>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <FaEnvelope className="mr-3 text-emerald-400" />
                <Link to={"/contact"} className="hover:text-emerald-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b border-gray-600 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start hover:translate-x-1 transition-transform duration-200">
                <FaPhone className="mt-1 mr-3 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-300 hover:text-emerald-400 transition-colors"><a href="tel:+91 9999999999">+91 9999999999</a></p>
                </div>
              </li>
              <li className="flex items-start hover:translate-x-1 transition-transform duration-200">
                <FaEnvelope className="mt-1 mr-3 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-300 hover:text-emerald-400 transition-colors"><a href="mailto:support@loanease.com">support@loanease.com</a></p>
                </div>
              </li>
              <li className="flex items-start hover:translate-x-1 transition-transform duration-200">
                <FaMapMarkerAlt className="mt-1 mr-3 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-300">123, Sector 34, Noida, UP</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b border-gray-600 pb-2">Newsletter</h3>
            <p className="text-gray-300">
              Subscribe to get updates on loan rates and financial tips.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l outline outline-emerald-400  focus:ring-2 focus:ring-emerald-400 text-white"
              />
              <button className="bg-emerald-500 hover:bg-emerald-700 px-4 py-2 rounded-r transition-colors duration-200 font-medium text-white cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} LoanEasePro. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to={"/privacy"} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200">Privacy Policy</Link>
            <Link to={"/term"} className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;