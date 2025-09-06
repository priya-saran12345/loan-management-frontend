import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCheck, FiX, FiCalendar, FiArrowLeft, FiChevronLeft, FiChevronRight, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const CollectPayment = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [emiDetails, setEmiDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedEmi, setSelectedEmi] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalInterest, setTotalInterest] = useState(0);
  const [customerCurrentPage, setCustomerCurrentPage] = useState(1);
  const [customerItemsPerPage, setCustomerItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/customers-stl', { params: { status: 'active' } });
        setCustomers(data.customers);
      } catch (error) {
        toast.error('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const fetchCustomerEMIs = async (customerId) => {
    try {
      const { data } = await api.get(`/customers-stl/${customerId}/emis`);
      setEmiDetails(data.emiDetails);
      setSelectedCustomer(data.customer);

      // Calculate total interest
      const interestSum = data.emiDetails.reduce((sum, emi) => sum + (emi.interest || 0), 0);
      setTotalInterest(interestSum);
    } catch (error) {
      toast.error('Failed to fetch EMI details');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const filteredEmiDetails = emiDetails.filter(emi => {
    if (activeTab === 'pending') return emi.status === 'pending';
    if (activeTab === 'overdue') return emi.status === 'overdue';
    if (activeTab === 'paid') return emi.status === 'paid';
    return true;
  });

  // Pagination logic for customers table
  const indexOfLastCustomer = customerCurrentPage * customerItemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customerItemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const customerTotalPages = Math.ceil(filteredCustomers.length / customerItemsPerPage);

  // Pagination logic for EMI details
  const indexOfLastEmi = currentPage * itemsPerPage;
  const indexOfFirstEmi = indexOfLastEmi - itemsPerPage;
  const currentEmis = filteredEmiDetails.slice(indexOfFirstEmi, indexOfLastEmi);
  const emiTotalPages = Math.ceil(filteredEmiDetails.length / itemsPerPage);

  // Change page for customers
  const paginateCustomers = (pageNumber) => setCustomerCurrentPage(pageNumber);

  // Change page for EMIs
  const paginateEmis = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination with ellipsis
  const renderPageNumbers = (currentPage, totalPages, paginateFunction) => {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-left');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

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
          onClick={() => paginateFunction(page)}
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

  const handlePayAll = async () => {
    try {
      setProcessingPayment(true);

      await api.post('/customers-stl/collect-payment', {
        customerId: selectedCustomer._id,
        amount: selectedCustomer.remainingAmount,
        paymentType: 'full'
      });

      toast.success('Full payment collected successfully!');

      // Refresh customer list
      const { data } = await api.get('/customers-stl', { params: { status: 'active' } });
      setCustomers(data.customers);

      // Refresh EMI details
      const emiRes = await api.get(`/customers-stl/${selectedCustomer._id}/emis`);
      setEmiDetails(emiRes.data.emiDetails);

      // Recalculate total interest
      const interestSum = emiRes.data.emiDetails.reduce((sum, emi) => sum + (emi.interest || 0), 0);
      setTotalInterest(interestSum);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to collect full payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePayEMI = async (emi) => {
    try {
      setProcessingPayment(true);
      setSelectedEmi(emi.index);

      await api.post('/customers-stl/collect-payment', {
        customerId: selectedCustomer._id,
        amount: emi.totalAmount,
        paymentType: 'emi',
        emiIndex: emi.index
      });

      toast.success('Payment collected successfully!');

      // Refresh EMI details
      const { data } = await api.get(`/customers-stl/${selectedCustomer._id}/emis`);
      setEmiDetails(data.emiDetails);

      // Refresh customer data
      const customerRes = await api.get(`/customers-stl/${selectedCustomer._id}`);
      setSelectedCustomer(customerRes.data.customer);

      // Recalculate total interest
      const interestSum = data.emiDetails.reduce((sum, emi) => sum + (emi.interest || 0), 0);
      setTotalInterest(interestSum);

      // Refresh customer list
      const customersRes = await api.get('/customers-stl', { params: { status: 'active' } });
      setCustomers(customersRes.data.customers);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to collect payment');
    } finally {
      setProcessingPayment(false);
      setSelectedEmi(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-emerald-600 hover:text-emerald-800 cursor-pointer mr-2 sm:mr-4"
          >
            <FiArrowLeft className="mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Collect Payment</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers by name, ID or phone"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCustomerCurrentPage(1);
                }}
              />
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto mt-3 sm:mt-0">
              <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                Showing {filteredCustomers.length > 0 ? indexOfFirstCustomer + 1 : 0} to{' '}
                {Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length}
              </div>
              <div className="relative">
                <select
                  value={customerItemsPerPage}
                  onChange={(e) => {
                    setCustomerItemsPerPage(Number(e.target.value));
                    setCustomerCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-2 pr-7 py-1 text-xs sm:text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Details</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">Loading customers...</td>
                  </tr>
                ) : currentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                      {searchTerm ? 'No customers found matching your search' : 'No active customers found'}
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{customer.customerId}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{customer.name}</div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                        {customer.phone}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex flex-col text-xs sm:text-sm">
                          <span>Loan: ₹{customer.loanAmount?.toLocaleString()}</span>
                          <span>EMI: ₹{customer.emiAmount?.toLocaleString()}/day</span>
                          <span>Remaining: ₹{customer.remainingAmount?.toLocaleString()}</span>
                          {customer.overdue > 0 && (
                            <span className="text-red-500">Overdue: ₹{customer.overdue?.toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <button
                          onClick={() => fetchCustomerEMIs(customer._id)}
                          className="px-2 py-1 sm:px-3 sm:py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-xs sm:text-sm cursor-pointer"
                        >
                          View EMIs
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for customers table */}
          {filteredCustomers.length > 0 && (
            <div className="bg-white px-2 sm:px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:flex-1 sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <p className="text-xs sm:text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstCustomer + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastCustomer, filteredCustomers.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredCustomers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginateCustomers(Math.max(1, customerCurrentPage - 1))}
                      disabled={customerCurrentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${customerCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    </button>

                    {renderPageNumbers(customerCurrentPage, customerTotalPages, paginateCustomers)}

                    <button
                      onClick={() => paginateCustomers(Math.min(customerTotalPages, customerCurrentPage + 1))}
                      disabled={customerCurrentPage === customerTotalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${customerCurrentPage === customerTotalPages ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedCustomer && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold">EMI Details - {selectedCustomer.name}</h2>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setSelectedEmi(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiX className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-3 sm:p-4 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm mb-4">
                <div>
                  <p className="font-medium text-gray-600">Customer ID</p>
                  <p className="truncate">{selectedCustomer.customerId}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Total Paid</p>
                  <p>₹{selectedCustomer.totalPaid?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Remaining</p>
                  <p>₹{selectedCustomer.remainingAmount?.toLocaleString()}</p>
                </div>
                {selectedCustomer.overdue > 0 && (
                  <div>
                    <p className="font-medium text-red-600">Overdue</p>
                    <p className="text-red-600">₹{selectedCustomer.overdue?.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4">
                  <h3 className="text-base sm:text-lg font-medium">EMI Schedule</h3>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="bg-emerald-50 px-2 py-1 sm:px-3 sm:py-2 rounded-md">
                      <p className="text-xs sm:text-sm text-emerald-700">
                        Total Interest: <span className="font-bold">₹{totalInterest.toFixed(2)}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap border-b border-gray-200">
                      <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'pending' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => setActiveTab('overdue')}
                        className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'overdue' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Overdue
                      </button>
                      <button
                        onClick={() => setActiveTab('paid')}
                        className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'paid' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Paid
                      </button>
                      <button
                        onClick={() => setActiveTab('all')}
                        className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'all' ? 'border-b-2 border-gray-500 text-gray-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        All
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-4">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Showing {filteredEmiDetails.length > 0 ? indexOfFirstEmi + 1 : 0} to{' '}
                    {Math.min(indexOfLastEmi, filteredEmiDetails.length)} of {filteredEmiDetails.length} EMIs
                  </div>
                  <div className="relative">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-md pl-2 pr-7 py-1 text-xs sm:text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4">
                  {currentEmis.length === 0 ? (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      No {activeTab} EMIs found
                    </div>
                  ) : (
                    currentEmis.map((emi, index) => (
                      <div key={index} className={`border rounded-lg p-2 sm:p-3 ${emi.status === 'overdue' ? 'border-red-300 bg-red-50' : emi.status === 'paid' ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-xs sm:text-sm">EMI #{emi.index + 1}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <FiCalendar className="inline mr-1" size={10} />
                              {new Date(emi.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${emi.status === 'paid' ? 'bg-green-100 text-green-800' : emi.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {emi.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p>Amount: ₹{emi.amount}</p>
                          {emi.interest > 0 && (
                            <p className="text-red-600">Interest: ₹{emi.interest.toFixed(2)}</p>
                          )}
                          {emi.daysOverdue > 0 && (
                            <p className="text-red-600">Days Overdue: {emi.daysOverdue}</p>
                          )}
                          <p className="font-medium">Total: ₹{emi.totalAmount.toFixed(2)}</p>
                        </div>
                        {emi.status !== 'paid' && (
                          <button
                            onClick={() => handlePayEMI(emi)}
                            disabled={processingPayment && selectedEmi === emi.index}
                            className={`mt-2 w-full bg-emerald-600 text-white py-1 px-2 rounded text-xs hover:bg-emerald-700 flex items-center justify-center ${processingPayment && selectedEmi === emi.index ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {processingPayment && selectedEmi === emi.index ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              <>
                                <FiDollarSign className="mr-1" size={10} />
                                Collect Payment
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination for EMI table */}
                {filteredEmiDetails.length > 0 && (
                  <div className="bg-white px-2 sm:px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:flex-1 sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstEmi + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(indexOfLastEmi, filteredEmiDetails.length)}
                          </span>{' '}
                          of <span className="font-medium">{filteredEmiDetails.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => paginateEmis(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          >
                            <span className="sr-only">Previous</span>
                            <FiChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                          </button>

                          {renderPageNumbers(currentPage, emiTotalPages, paginateEmis)}

                          <button
                            onClick={() => paginateEmis(Math.min(emiTotalPages, currentPage + 1))}
                            disabled={currentPage === emiTotalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === emiTotalPages ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          >
                            <span className="sr-only">Next</span>
                            <FiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 sm:p-4 border-t border-gray-200">
              <button
                onClick={handlePayAll}
                disabled={processingPayment}
                className="flex-1 flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 text-sm cursor-pointer"
              >
                <FiCheck className="mr-1 sm:mr-2" />
                {processingPayment ? 'Processing...' : 'Pay Full Amount (₹' + selectedCustomer.remainingAmount?.toLocaleString() + ')'}
              </button>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setSelectedEmi(null);
                }}
                disabled={processingPayment}
                className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 text-sm cursor-pointer"
              >
                <FiX className="mr-1 sm:mr-2" />
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectPayment;