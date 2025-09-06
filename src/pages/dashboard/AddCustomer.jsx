import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import api from '../../utils/api';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: '',
    fatherName: '',
    phone: '',
    address: '',
    aadhar: '',
    employmentType: 'salaried',
    monthlyIncome: '',
    guarantorName: '',
    guarantorPhone: '',
    guarantorAddress: '',
    loanPurpose: '',
  });

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const addressRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'aadhar') {
      if (value.length > 12) {
        toast.error('Aadhar number must be exactly 12 digits');
        return;
      }
      if (value && !/^\d*$/.test(value)) {
        toast.error('Aadhar number must contain only digits');
        return;
      }
    }

    if (name === 'phone' || name === 'guarantorPhone') {
      if (value.length > 10) {
        toast.error('Phone number must be exactly 10 digits');
        return;
      }
      if (value && !/^\d*$/.test(value)) {
        toast.error('Phone number must contain only digits');
        return;
      }
    }

    setCustomer(prev => {
      const updatedCustomer = { ...prev, [name]: value };
      return updatedCustomer;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const requiredFields = [
      'name', 'fatherName', 'phone', 'address',
      'employmentType', 'monthlyIncome',
      'guarantorName', 'guarantorPhone', 'guarantorAddress',
      'loanPurpose'
    ];

    const missingFields = requiredFields.filter(field => !customer[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/customers-stl', customer, {
        timeout: 30000 // 30 second timeout
      });

      toast.success('Customer added successfully!');
      navigate('/dashboard/customers-stl');
    } catch (error) {
      console.error('Error adding customer:', error);

      // Enhanced error handling
      if (error.response) {
        // The server responded with an error status
        if (error.response.status === 500) {
          toast.error('Server error: Please try again or contact support');
        } else if (error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to add customer: Server error');
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('Network error: Please check your connection');
      } else {
        // Something happened in setting up the request
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mobile navigation for form sections
  const SectionNav = () => (
    <div className="lg:hidden bg-white p-3 rounded-lg shadow mb-4 sticky top-0 z-10">
      <div className="flex space-x-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveSection('basic')}
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeSection === 'basic' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Basic Info
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('loan')}
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeSection === 'loan' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Loan Info
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('aadhar')}
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeSection === 'aadhar' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Aadhar
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('employment')}
          className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeSection === 'employment' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Employment
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow mr-2"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Add New Customer</h1>
        </div>

        {/* Desktop header */}
        <h1 className="hidden lg:block text-2xl font-bold mb-6 text-gray-800">Add New Customer</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionNav />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information - Always visible on desktop, conditionally on mobile */}
            <div 
              className={`bg-white p-4 sm:p-6 rounded-lg shadow ${activeSection !== 'basic' ? 'hidden lg:block' : ''}`}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={customer.fatherName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                    maxLength={10}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={customer.address}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                    ref={addressRef}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Loan Information - Always visible on desktop, conditionally on mobile */}
            <div 
              className={`bg-white p-4 sm:p-6 rounded-lg shadow ${activeSection !== 'loan' ? 'hidden lg:block' : ''}`}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Loan Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
                  <input
                    type="number"
                    value={10000}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Customer will receive ₹8,000 (80%)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Validity (Days)</label>
                  <input
                    type="number"
                    value={100}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">EMI Amount (₹)</label>
                  <input
                    type="number"
                    value={100}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Daily payment of ₹100 for 100 days</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loan Purpose <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="loanPurpose"
                    value={customer.loanPurpose}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Aadhar Information - Always visible on desktop, conditionally on mobile */}
            <div 
              className={`bg-white p-4 sm:p-6 rounded-lg shadow ${activeSection !== 'aadhar' ? 'hidden lg:block' : ''}`}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Aadhar Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadhar"
                    value={customer.aadhar}
                    onChange={handleChange}
                    maxLength={12}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="12 digit number"
                  />
                </div>
              </div>
            </div>

            {/* Employment and Guarantor Information - Always visible on desktop, conditionally on mobile */}
            <div 
              className={`bg-white p-4 sm:p-6 rounded-lg shadow ${activeSection !== 'employment' ? 'hidden lg:block' : ''}`}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Employment Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employmentType"
                    value={customer.employmentType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Income (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={customer.monthlyIncome}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Guarantor Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Guarantor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="guarantorName"
                      value={customer.guarantorName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Guarantor Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="guarantorPhone"
                      value={customer.guarantorPhone}
                      onChange={handleChange}
                      maxLength={10}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Guarantor Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="guarantorAddress"
                      value={customer.guarantorAddress}
                      onChange={handleChange}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 sticky bottom-0 bg-white p-3 rounded-lg shadow-md lg:static lg:bg-transparent lg:p-0 lg:shadow-none">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                'Add Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;