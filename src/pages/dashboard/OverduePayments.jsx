// src/pages/dashboard/OverduePayments.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiAlertCircle, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const OverduePayments = () => {
  const [overduePayments, setOverduePayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalOverdue, setTotalOverdue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');

  useEffect(() => {
    const fetchOverduePayments = async () => {
      try {
        setLoading(true);

        // Fetch overdue payments for both STL and LRA customers
        const [stlResponse, lraResponse] = await Promise.allSettled([
          api.get('/customers-stl/overdue/list'),
          api.get('/customers-lra/overdue')
        ]);

        let allPayments = [];
        let total = 0;

        // Process STL response
        if (stlResponse.status === 'fulfilled' && stlResponse.value.data.success) {
          const stlPayments = stlResponse.value.data.payments.map(payment => ({
            ...payment,
            customerType: 'STL',
            customerId: payment.customerId,
            // Add missing fields with defaults
            amount: payment.overdueAmount || 0,
            dueDate: payment.lastPaymentDate || new Date(),
            // Calculate days overdue if not provided
            daysOverdue: payment.daysOverdue || calculateDaysOverdue(payment.lastPaymentDate)
          }));
          allPayments = [...allPayments, ...stlPayments];
          total += stlResponse.value.data.total || 0;
        } else {
          console.error('STL overdue payments error:', stlResponse.reason);
        }

        // Process LRA response
        if (lraResponse.status === 'fulfilled' && lraResponse.value.data.success) {
          const lraPayments = lraResponse.value.data.payments.map(payment => ({
            ...payment,
            customerType: 'LRA',
            customerId: payment.customerId,
            // Add missing fields with defaults
            amount: payment.overdueAmount || 0,
            dueDate: payment.lastPaymentDate || new Date(),
            // Calculate days overdue if not provided
            daysOverdue: payment.daysOverdue || calculateDaysOverdue(payment.lastPaymentDate)
          }));
          allPayments = [...allPayments, ...lraPayments];
          total += lraResponse.value.data.total || 0;
        } else {
          console.error('LRA overdue payments error:', lraResponse.reason);
        }

        setOverduePayments(allPayments);
        setTotalOverdue(total);
      } catch (error) {
        console.error('Error fetching overdue payments:', error);
        toast.error('Failed to fetch overdue payments');
      } finally {
        setLoading(false);
      }
    };

    fetchOverduePayments();
  }, []);

  // Calculate days overdue safely
  const calculateDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;

    try {
      const today = new Date();
      const due = new Date(dueDate);
      if (isNaN(due.getTime())) return 0;

      const diffTime = Math.max(0, today - due);
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error calculating days overdue:', error);
      return 0;
    }
  };

  // Safe date formatter function
  const formatDate = (date) => {
    if (!date) return 'N/A';

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';

      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Filter payments based on search term and customer type
  const filteredPayments = overduePayments.filter(payment =>
    (payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerPhone?.includes(searchTerm)) &&
    (customerTypeFilter === 'all' || payment.customerType === customerTypeFilter)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination with ellipsis
  const renderPageNumbers = () => {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-left');
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-right');
      }
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === 'ellipsis-left' || page === 'ellipsis-right') {
        return (
          <span key={index} className="px-2 py-1 text-gray-500">
            ...
          </span>
        );
      }

      return (
        <button
          key={index}
          onClick={() => paginate(page)}
          className={`px-3 py-1 mx-1 rounded-md text-sm ${currentPage === page
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 lg:mb-0">Overdue Payments</h1>
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md flex items-center">
            <FiAlertCircle className="mr-2" />
            <span className="font-semibold">Total Overdue: ₹{totalOverdue.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers by name, ID or phone"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="relative w-full sm:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                value={customerTypeFilter}
                onChange={(e) => {
                  setCustomerTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="STL">STL Customers</option>
                <option value="LRA">LRA Customers</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overdue Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">Loading overdue payments...</td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                      {searchTerm || customerTypeFilter !== 'all'
                        ? 'No overdue payments match your search criteria'
                        : 'No overdue payments found'
                      }
                    </td>
                  </tr>
                ) : (
                  currentPayments.map((payment) => {
                    const interest = payment.interest || (payment.amount * 0.03 * payment.daysOverdue);
                    const totalAmount = payment.amount + interest;

                    return (
                      <tr key={`${payment.customerType}-${payment.customerId}`} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${payment.customerType === 'STL'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                            }`}>
                            {payment.customerType}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 text-xs sm:text-sm">{payment.customerName?.charAt(0) || 'C'}</span>
                            </div>
                            <div className="ml-2 sm:ml-4">
                              <div className="text-sm font-medium text-gray-900">{payment.customerName || 'Unknown Customer'}</div>
                              <div className="text-xs sm:text-sm text-gray-500">ID: {payment.customerId || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {payment.customerPhone || 'N/A'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col text-xs sm:text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium">₹{(payment.amount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">Due Date:</span>
                              <span>{formatDate(payment.dueDate)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600 font-medium">Total:</span>
                              <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                            </div>
                            {payment.overdueEmis && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Overdue EMIs:</span>
                                <span className="text-red-500 font-medium">{payment.overdueEmis}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination and items per page selector */}
          {filteredPayments.length > 0 && (
            <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 space-y-3 sm:space-y-0">
              <div className="text-sm text-gray-700">
                Showing {filteredPayments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} records
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>

                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  </button>

                  {renderPageNumbers()}

                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverduePayments;