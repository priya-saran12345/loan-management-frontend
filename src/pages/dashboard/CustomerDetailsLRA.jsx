// src/pages/dashboard/CustomerDetailsLRA.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit,
  FiDollarSign,
  FiFileText,
  FiUser,
  FiCreditCard,
  FiDownload,
  FiCalendar,
  FiPercent,
  FiClock,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CustomerDetailsLRA = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [emiDetails, setEmiDetails] = useState([]);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Pagination state for EMI schedule
  const [currentEmiPage, setCurrentEmiPage] = useState(0);
  const [emiItemsPerPage, setEmiItemsPerPage] = useState(10);
  const emiPageCount = Math.ceil(emiDetails.length / emiItemsPerPage);
  const emiOffset = currentEmiPage * emiItemsPerPage;
  const currentEmiItems = emiDetails.slice(emiOffset, emiOffset + emiItemsPerPage);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile menu when resizing to larger screens
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Function to correct image URLs
  const correctImageUrl = (url, customerId, fieldName) => {
    if (!url) return null;

    // If URL already contains the correct path, return as is
    if (url.includes('/uploads/')) {
      return url;
    }

    // If we have a customerId, construct the proper URL
    if (customerId) {
      // Try different extensions
      const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
      for (const ext of extensions) {
        const filename = `${customerId}-${fieldName}${ext}`;

        if (fieldName === 'customerPhoto') {
          const fullUrl = `/uploads/customer-photos/${filename}`;
          return fullUrl;
        } else if (fieldName === 'aadharFront' || fieldName === 'aadharBack') {
          const fullUrl = `/uploads/aadhar-photos/${filename}`;
          return fullUrl;
        }
      }
    }

    return url;
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/customers-lra/${id}`);

        // Correct image URLs before setting customer data
        const customerWithCorrectUrls = {
          ...data.customer,
          customerPhoto: correctImageUrl(data.customer.customerPhoto, data.customer.customerId, 'customerPhoto'),
          aadharFront: correctImageUrl(data.customer.aadharFront, data.customer.customerId, 'aadharFront'),
          aadharBack: correctImageUrl(data.customer.aadharBack, data.customer.customerId, 'aadharBack')
        };

        setCustomer(customerWithCorrectUrls);

        if (activeTab === 'payments') {
          await fetchPayments();
        } else if (activeTab === 'loan') {
          await fetchEMIDetails();
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        toast.error('Failed to fetch customer data');
        navigate('/dashboard/customers-lra');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id, activeTab, navigate]);

  const fetchPayments = async () => {
    try {
      // For LRA customers, we might need to adjust the endpoint
      const paymentsRes = await api.get(`/customers-lra/${id}/payments`);
      setPayments(paymentsRes.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payment history');
    }
  };

  const fetchEMIDetails = async () => {
    try {
      // For LRA customers, we might need to adjust the endpoint
      const emiRes = await api.get(`/customers-lra/${id}/emis`);
      setEmiDetails(emiRes.data.emiDetails || emiRes.data.emiHistory || []);
    } catch (error) {
      console.error('Error fetching EMI details:', error);
      toast.error('Failed to fetch EMI details');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
    if (tab === 'payments') {
      fetchPayments();
    } else if (tab === 'loan') {
      fetchEMIDetails();
    }
  };

  // Handle EMI page change
  const handleEmiPageClick = (event) => {
    setCurrentEmiPage(event.selected);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setEmiItemsPerPage(Number(e.target.value));
    setCurrentEmiPage(0); // Reset to first page when changing items per page
  };

  const downloadCustomerPDF = () => {
    if (!customer) return;

    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('LRA Customer Details Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

    // Add customer details table
    autoTable(doc, {
      head: [['Field', 'Value']],
      body: [
        ['Customer ID', customer.customerId || 'N/A'],
        ['Name', customer.name || 'N/A'],
        ['Father\'s Name', customer.fatherName || 'N/A'],
        ['Phone', customer.phone || 'N/A'],
        ['Address', customer.address || 'N/A'],
        ['Aadhar Number', customer.aadhar || 'N/A'],
        ['Employment Type', customer.employmentType || 'N/A'],
        ['Monthly Income', `Rs. ${customer.monthlyIncome || 0}`],
        ['Disbursement Amount', `Rs. ${customer.disbursementAmount || 0}`],
        ['File Charges', `Rs. ${customer.fileCharges || 0}`],
        ['Total Loan Amount', `Rs. ${customer.totalLoanAmount || 0}`],
        ['Interest Rate', `${customer.interestRate || 0}%`],
        ['Loan Tenure', `${customer.loanTenure || 0} months`],
        ['Monthly EMI', `Rs. ${customer.monthlyEmi || 0}`],
        ['Total Payable', `Rs. ${customer.totalPayable || 0}`],
        ['Loan Purpose', customer.loanPurpose || 'N/A'],
        ['Status', customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : 'N/A'],
        ['Total Paid', `Rs. ${customer.totalPaid || 0}`],
        ['Remaining Amount', `Rs. ${customer.remainingAmount || 0}`]
      ],
      startY: 35,
      theme: 'grid',
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 70 },
        1: { cellWidth: 'auto' }
      }
    });

    doc.save(`lra-customer-${customer.customerId}-details.pdf`);
  };

  const downloadPaymentHistoryPDF = () => {
    if (payments.length === 0) {
      toast.error('No payment history available to download');
      return;
    }
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('LRA Payment History Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Customer: ${customer.name} (${customer.customerId})`, 105, 22, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 29, { align: 'center' });

    const tableColumn = ["Date", "Amount", "Type", "Status", "EMI #"];
    const tableRows = [];

    payments.forEach(payment => {
      const paymentData = [
        new Date(payment.paymentDate || payment.date).toLocaleDateString(),
        `Rs. ${payment.amount?.toFixed(2) || 0}`,
        payment.type ? payment.type.charAt(0).toUpperCase() + payment.type.slice(1) : 'N/A',
        payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'N/A',
        payment.emiIndex ? `EMI ${payment.emiIndex + 1}` : 'N/A'
      ];
      tableRows.push(paymentData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`lra-payment-history-${customer.customerId}.pdf`);
  };

  const downloadEMISchedulePDF = () => {
    if (emiDetails.length === 0) {
      toast.error('No EMI schedule available to download');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('LRA EMI Schedule Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Customer: ${customer.name} (${customer.customerId})`, 105, 22, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 29, { align: 'center' });

    const tableColumn = ["EMI #", "Due Date", "Amount", "Status"];
    const tableRows = [];

    emiDetails.forEach((emi, index) => {
      const emiData = [
        index + 1,
        new Date(emi.date).toLocaleDateString(),
        `Rs. ${emi.amount.toFixed(2) || 0}`,
        emi.status ? emi.status.charAt(0).toUpperCase() + emi.status.slice(1) : 'Pending',
      ];
      tableRows.push(emiData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`lra-emi-schedule-${customer.customerId}.pdf`);
  };

  const handleCollectPayment = async (emiIndex, amount) => {
    if (processingPayment !== null) return;

    setProcessingPayment(emiIndex);

    try {
      await api.post('/customers-lra/collect-payment', {
        customerId: id,
        amount: amount,
        paymentType: 'emi',
        emiIndex: emiIndex
      });

      toast.success('Payment collected successfully!');

      // Refresh data
      const { data } = await api.get(`/customers-lra/${id}`);

      // Correct image URLs before setting customer data
      const customerWithCorrectUrls = {
        ...data.customer,
        customerPhoto: correctImageUrl(data.customer.customerPhoto, data.customer.customerId, 'customerPhoto'),
        aadharFront: correctImageUrl(data.customer.aadharFront, data.customer.customerId, 'aadharFront'),
        aadharBack: correctImageUrl(data.customer.aadharBack, data.customer.customerId, 'aadharBack')
      };

      setCustomer(customerWithCorrectUrls);

      const emiRes = await api.get(`/customers-lra/${id}/emis`);
      setEmiDetails(emiRes.data.emiDetails || emiRes.data.emiHistory || []);

      await fetchPayments();
    } catch (error) {
      console.error('Error collecting payment:', error);
      toast.error(error.response?.data?.message || 'Failed to collect payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  if (loading || !customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1 max-w-md">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-600 hover:text-emerald-800 cursor-pointer"
        >
          <FiArrowLeft className="mr-2" />
          <span className="hidden sm:inline">Back to LRA Customers</span>
          <span className="sm:hidden">Back</span>
        </button>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <Link
            to={`/dashboard/edit-customer-lra/${id}`}
            className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm cursor-pointer"
          >
            <FiEdit className="mr-2" />
            <span className="hidden sm:inline">Edit Customer</span>
            <span className="sm:hidden">Edit</span>
          </Link>
          <button
            onClick={downloadCustomerPDF}
            className="flex items-center px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm cursor-pointer"
          >
            <FiFileText className="mr-2" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {/* Tab Navigation - Desktop */}
        <div className="hidden md:block border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleTabChange('details')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center cursor-pointer ${activeTab === 'details' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiUser className="mr-2" />
              Customer Details
            </button>
            <button
              onClick={() => handleTabChange('payments')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center cursor-pointer ${activeTab === 'payments' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiDollarSign className="mr-2" />
              Payment History
            </button>
            <button
              onClick={() => handleTabChange('loan')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center cursor-pointer ${activeTab === 'loan' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FiCreditCard className="mr-2" />
              Loan Details
            </button>
          </nav>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden border-b border-gray-200">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full py-4 px-6 flex items-center justify-between text-left font-medium text-gray-700"
          >
            <div className="flex items-center">
              {activeTab === 'details' && <FiUser className="mr-2" />}
              {activeTab === 'payments' && <FiDollarSign className="mr-2" />}
              {activeTab === 'loan' && <FiCreditCard className="mr-2" />}
              <span>
                {activeTab === 'details' && 'Customer Details'}
                {activeTab === 'payments' && 'Payment History'}
                {activeTab === 'loan' && 'Loan Details'}
              </span>
            </div>
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          
          {isMobileMenuOpen && (
            <div className="px-6 pb-4 bg-gray-50">
              <button
                onClick={() => handleTabChange('details')}
                className={`w-full py-2 px-4 text-left rounded-md mb-2 flex items-center ${activeTab === 'details' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FiUser className="mr-2" />
                Customer Details
              </button>
              <button
                onClick={() => handleTabChange('payments')}
                className={`w-full py-2 px-4 text-left rounded-md mb-2 flex items-center ${activeTab === 'payments' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FiDollarSign className="mr-2" />
                Payment History
              </button>
              <button
                onClick={() => handleTabChange('loan')}
                className={`w-full py-2 px-4 text-left rounded-md flex items-center ${activeTab === 'loan' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FiCreditCard className="mr-2" />
                Loan Details
              </button>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Left Column - Personal Information, Employment, Guarantor */}
              <div className="space-y-4 md:space-y-6">
                {/* Personal Information Card */}
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customer ID</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.customerId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Father's Name</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.fatherName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone Number</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-600">Address</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aadhar Number</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.aadhar || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Employment Information Card */}
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employment Type</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                      <p className="mt-1 text-sm text-gray-900">₹{customer.monthlyIncome?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Guarantor Information Card */}
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Guarantor Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Guarantor Name</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.guarantorName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Guarantor Phone</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.guarantorPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-600">Guarantor Address</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.guarantorAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Documents */}
              <div>
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
                  <div className="space-y-4 md:space-y-6">
                    {customer.customerPhoto && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Customer Photo</p>
                        <img
                          src={customer.customerPhoto}
                          alt="Customer"
                          className="mt-2 w-full max-w-xs mx-auto h-48 object-cover border border-gray-300 rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customer.aadharFront && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Aadhar Front</p>
                          <img
                            src={customer.aadharFront}
                            alt="Aadhar Front"
                            className="mt-2 w-full h-48 object-contain border border-gray-300 rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {customer.aadharBack && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Aadhar Back</p>
                          <img
                            src={customer.aadharBack}
                            alt="Aadhar Back"
                            className="mt-2 w-full h-48 object-contain border border-gray-300 rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
                <button
                  onClick={downloadPaymentHistoryPDF}
                  disabled={payments.length === 0}
                  className={`flex items-center px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 text-sm ${payments.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <FiDownload className="mr-2" />
                  Download Payments
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI #</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No payment history found</td>
                      </tr>
                    ) : (
                      payments.map((payment, index) => (
                        <tr key={payment._id || index}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(payment.paymentDate || payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{payment.amount?.toFixed(2).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.type === 'emi' ? 'EMI' : payment.type || 'Payment'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.emiIndex !== undefined ? `EMI ${payment.emiIndex + 1}` : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'loan' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900">LRA Loan Information</h3>
                <button
                  onClick={downloadEMISchedulePDF}
                  disabled={emiDetails.length === 0}
                  className={`flex items-center px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 text-sm ${emiDetails.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <FiDownload className="mr-2" />
                  Download EMI Schedule
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Loan Details</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Disbursement Amount</p>
                      <p className="mt-1 text-sm text-gray-900">₹{customer.disbursementAmount?.toFixed(2).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">File Charges (5%)</p>
                      <p className="mt-1 text-sm text-gray-900">₹{customer.fileCharges?.toFixed(2).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Loan Amount</p>
                      <p className="mt-1 text-sm text-gray-900">₹{customer.totalLoanAmount?.toFixed(2).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <FiPercent className="mr-1" size={14} />
                        {customer.interestRate}% per annum
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Tenure</p>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <FiClock className="mr-1" size={14} />
                        {customer.loanTenure} months
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Payment Summary</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Monthly EMI</p>
                      <p className="mt-1 text-sm text-gray-900">₹{customer.monthlyEmi?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Payable</p>
                      <p className="mt-1 text-sm text-gray-900">₹{customer.totalPayable?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Paid</p>
                      <p className="mt-1 text-sm text-gray-900">₹{customer.totalPaid?.toFixed(2).toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Remaining Amount</p>
                      <p className="mt-1 text-sm text-gray-900">₹{customer.remainingAmount?.toFixed(2).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Purpose</p>
                      <p className="mt-1 text-sm text-gray-900">{customer.loanPurpose}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h4 className="text-md font-medium text-gray-900">EMI Schedule</h4>
                  
                  {/* Items per page selector */}
                  <div className="flex items-center">
                    <label htmlFor="itemsPerPage" className="text-sm text-gray-600 mr-2">
                      Show:
                    </label>
                    <select
                      id="itemsPerPage"
                      value={emiItemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentEmiItems.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No EMI schedule found</td>
                        </tr>
                      ) : (
                        currentEmiItems.map((emi, index) => (
                          <tr key={index} className={emi.status === 'overdue' ? 'bg-red-50' : emi.status === 'paid' ? 'bg-green-50' : ''}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {emiOffset + index + 1}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(emi.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{emi.amount?.toFixed(2).toLocaleString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emi.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : emi.status === 'overdue'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {emi.status ? emi.status.charAt(0).toUpperCase() + emi.status.slice(1) : 'Pending'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              {emi.status !== 'paid' && (
                                <button
                                  onClick={() => handleCollectPayment(emiOffset + index, emi.amount)}
                                  disabled={processingPayment !== null}
                                  className={`bg-emerald-600 text-white py-1 px-3 rounded-md text-sm hover:bg-emerald-700 flex items-center justify-center ${processingPayment !== null ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                  {processingPayment === (emiOffset + index) ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <FiDollarSign className="mr-1" size={14} />
                                      Collect
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {emiPageCount > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4 mt-4">
                    <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                      Showing <span className="font-medium">{emiOffset + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(emiOffset + emiItemsPerPage, emiDetails.length)}
                      </span>{" "}
                      of <span className="font-medium">{emiDetails.length}</span> EMIs
                    </div>
                    
                    <nav className="flex items-center space-x-2">
                      {/* Previous button */}
                      <button
                        onClick={() => setCurrentEmiPage(currentEmiPage - 1)}
                        disabled={currentEmiPage === 0}
                        className={`p-2 rounded-md border ${currentEmiPage === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        }`}
                      >
                        <FiChevronLeft size={16} />
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, emiPageCount) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (emiPageCount <= 5) {
                          pageNum = i;
                        } else if (currentEmiPage < 3) {
                          pageNum = i;
                        } else if (currentEmiPage > emiPageCount - 4) {
                          pageNum = emiPageCount - 5 + i;
                        } else {
                          pageNum = currentEmiPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentEmiPage(pageNum)}
                            className={`px-3 py-1 rounded-md text-sm ${currentEmiPage === pageNum
                              ? "bg-emerald-600 text-white font-medium"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}

                      {/* Next button */}
                      <button
                        onClick={() => setCurrentEmiPage(currentEmiPage + 1)}
                        disabled={currentEmiPage >= emiPageCount - 1}
                        className={`p-2 rounded-md border ${currentEmiPage >= emiPageCount - 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        }`}
                      >
                        <FiChevronRight size={16} />
                      </button>
                    </nav>
                  </div>
                )}
                
                {processingPayment !== null && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-700 text-center">
                      Processing payment for EMI #{processingPayment + 1}. Please wait...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsLRA;