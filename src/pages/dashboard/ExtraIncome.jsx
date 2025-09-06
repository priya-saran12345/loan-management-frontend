// src/pages/dashboard/ExtraIncome.jsx
import { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

const ExtraIncome = () => {
  const [income, setIncome] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    description: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchExtraIncome = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/extra-income');
        setIncome(data.income);
        setTotalIncome(data.total);
      } catch (error) {
        toast.error('Failed to fetch extra income');
      } finally {
        setLoading(false);
      }
    };

    fetchExtraIncome();
  }, []);

  // Get current income records for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncome = income.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(income.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/extra-income', formData);
      setIncome([data.income, ...income]);
      setTotalIncome(totalIncome + data.income.amount);
      setShowAddForm(false);
      setFormData({ customerId: '', amount: '', description: '' });
      setCurrentPage(1); // Reset to first page after adding new income
      toast.success('Extra income added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add extra income');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Extra Income Report', 105, 11, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

    autoTable(doc, {
      head: [['S.No', 'Date', 'Customer ID', 'Amount', 'Description']],
      body: income.map((item, index) => [
        index + 1,
        new Date(item.date).toLocaleDateString(),
        item.customerId || '-',
        `Rs. ${item.amount.toFixed(2)}`,
        item.description || '-'
      ]),
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [16, 185, 129] }
    });
    doc.save('extra-income-report.pdf');
  };

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

  // Mobile action buttons
  const MobileActionButtons = () => (
    <div className="lg:hidden fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center"
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiPlus size={24} />}
      </button>

      {mobileMenuOpen && (
        <div className="absolute bottom-full right-0 mb-2 space-y-2">
          <button
            onClick={() => {
              setShowAddForm(true);
              setMobileMenuOpen(false);
            }}
            className="w-12 h-12 bg-emerald-600 text-white rounded-full shadow flex items-center justify-center"
            title="Add Income"
          >
            <FiPlus size={20} />
          </button>
          <button
            onClick={() => {
              downloadPDF();
              setMobileMenuOpen(false);
            }}
            className="w-12 h-12 bg-sky-600 text-white rounded-full shadow flex items-center justify-center"
            title="Export PDF"
          >
            <FiDownload size={20} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 lg:mb-0">Extra Income</h1>

          {/* Desktop action buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-md">
              <span className="font-semibold">Total: ₹{totalIncome.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm cursor-pointer"
            >
              <FiPlus className="mr-2" />
              Add Income
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm cursor-pointer"
            >
              <FiDownload className="mr-2" />
              Export PDF
            </button>
          </div>

          {/* Mobile total display */}
          <div className="lg:hidden bg-emerald-100 text-emerald-800 px-4 py-2 rounded-md flex items-center justify-center mb-4">
            <span className="font-semibold">Total: ₹{totalIncome.toLocaleString()}</span>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Extra Income</h2>
                <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID (Optional)</label>
                    <input
                      type="text"
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="CUST-0001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="2000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Loan processing fee"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    Add Income
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Showing {income.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, income.length)} of {income.length} records
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 w-full"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500">Loading income records...</td>
                  </tr>
                ) : currentIncome.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No income records found</td>
                  </tr>
                ) : (
                  currentIncome.map((item, index) => (
                    <tr key={item._id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {item.customerId || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{item.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                        {item.description || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {income.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:flex-1 sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, income.length)}
                    </span>{' '}
                    of <span className="font-medium">{income.length}</span> results
                  </p>
                </div>
                <div>
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
            </div>
          )}
        </div>
      </div>

      {/* Mobile action buttons */}
      <MobileActionButtons />
    </div>
  );
};

export default ExtraIncome;