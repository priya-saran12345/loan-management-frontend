import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* This ensures the navbar is at the top */}
      <div className="flex-grow-0">
        {/* Your existing Navbar component will be rendered above this */}
      </div>

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="flex justify-center">
            <FaExclamationTriangle className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
          <p className="mt-2 text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <FaHome className="mr-2" />
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;