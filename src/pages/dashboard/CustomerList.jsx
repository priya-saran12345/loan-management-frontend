// src/pages/dashboard/CustomerList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiEye, 
  FiEdit, 
  FiDownload, 
  FiFilter, 
  FiPlus, 
  FiChevronLeft, 
  FiChevronRight, 
  FiChevronDown,
  FiMenu,
  FiX,
  FiUser,
  FiDollarSign,
  FiPhone,
  FiMapPin,
  FiCreditCard
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'cards'
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, statusFilter, customers, currentPage, sortConfig]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/customers-stl');
      setCustomers(data.customers);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  // Sort customers
  const sortedCustomers = [...customers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filterCustomers = () => {
    let filtered = sortedCustomers;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.customerId.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        customer.location.toLowerCase().includes(term)
      );
    }

    setFilteredCustomers(filtered);
  };

  // Get current customers for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Customers Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

    const tableColumn = ["S.No", "ID", "Name", "Phone", "Loan Amount", "Paid", "Remaining", "Status"];
    const tableRows = [];

    filteredCustomers.forEach((customer, index) => {
      const customerData = [
        index + 1,
        customer.customerId,
        customer.name,
        customer.phone,
        `Rs. ${customer.loanAmount || 0}`,
        `Rs. ${customer.totalPaid || 0}`,
        `Rs. ${customer.remainingAmount || 0}`,
        customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : 'N/A'
      ];
      tableRows.push(customerData);
    });

    autoTable(doc,{
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 185, 129] },
      margin: { top: 30 }
    });

    doc.save('customers-report.pdf');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Show only limited page numbers with ellipsis
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
          <span key={index} className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }

      return (
        <button
          key={index}
          onClick={() => paginate(page)}
          className={`px-3 py-2 mx-1 rounded-md text-sm ${currentPage === page
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          {page}
        </button>
      );
    });
  };

  // Customer Card Component
  const CustomerCard = ({ customer, index }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <FiUser className="text-emerald-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">{customer.name}</h3>
            <p className="text-xs text-gray-500">{customer.customerId}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
            customer.status
          )}`}
        >
          {customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : 'N/A'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center text-gray-600">
          <FiPhone className="mr-2" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiMapPin className="mr-2" />
          <span>{customer.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiDollarSign className="mr-2" />
          <span>Loan: ₹{customer.loanAmount?.toLocaleString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiCreditCard className="mr-2" />
          <span>Paid: ₹{customer.totalPaid?.toLocaleString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiCreditCard className="mr-2" />
          <span>Remaining: ₹{customer.remainingAmount?.toLocaleString()}</span>
        </div>
        {customer.overdue > 0 && (
          <div className="flex items-center text-red-600">
            <FiCreditCard className="mr-2" />
            <span>Overdue: ₹{customer.overdue?.toLocaleString()}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
        <Link
          to={`/dashboard/customer-details-stl/${customer._id}`}
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          <FiEye className="mr-1" size={14} />
          View
        </Link>
        <Link
          to={`/dashboard/edit-customer-stl/${customer._id}`}
          className="flex items-center px-3 py-1 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
        >
          <FiEdit className="mr-1" size={14} />
          Edit
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'cards' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              Cards
            </button>
          </div>

          <Link
            to="/dashboard/add-customer-stl"
            className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm"
          >
            <FiPlus className="mr-2" />
            <span className="hidden sm:inline">Add Customer</span>
            <span className="sm:hidden">Add</span>
          </Link>
          <button
            onClick={downloadPDF}
            className="flex items-center px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm cursor-pointer"
          >
            <FiDownload className="mr-2" />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden border-b border-gray-200">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full py-4 px-6 flex items-center justify-between text-left font-medium text-gray-700"
          >
            <div className="flex items-center">
              <FiFilter className="mr-2" />
              <span>Filters</span>
            </div>
            {isFilterOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block p-4 border-b border-gray-200`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Status:</span>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <FiFilter className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Show:</span>
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <FiChevronDown className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card View */}
        {viewMode === 'cards' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCustomers.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No customers found</p>
              </div>
            ) : (
              currentCustomers.map((customer, index) => (
                <CustomerCard 
                  key={customer._id} 
                  customer={customer} 
                  index={index} 
                />
              ))
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('customerId')}
                  >
                    ID {sortConfig.key === 'customerId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('name')}
                  >
                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('status')}
                  >
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((customer, index) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.customerId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phone}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.location}
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>Loan: ₹{customer.loanAmount?.toLocaleString()}</span>
                          <span>Paid: ₹{customer.totalPaid?.toLocaleString()}</span>
                          <span>Remaining: ₹{customer.remainingAmount?.toLocaleString()}</span>
                          {customer.overdue > 0 && (
                            <span className="text-red-500">Overdue: ₹{customer.overdue?.toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            customer.status
                          )}`}
                        >
                          {customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/dashboard/customer-details-stl/${customer._id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </Link>
                          <Link
                            to={`/dashboard/edit-customer-stl/${customer._id}`}
                            className="text-emerald-600 hover:text-emerald-900"
                            title="Edit Customer"
                          >
                            <FiEdit size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
              <div className="text-sm text-gray-700">
                <p>
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredCustomers.length}</span> results
                </p>
              </div>
              <div className="flex items-center justify-center sm:justify-end">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md border border-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                      }`}
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="hidden sm:flex items-center space-x-1">
                    {renderPageNumbers()}
                  </div>

                  <div className="sm:hidden text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md border border-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                      }`}
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;