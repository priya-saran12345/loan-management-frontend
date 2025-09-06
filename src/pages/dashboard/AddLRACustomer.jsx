import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';
import api from '../../utils/api';

const AddLRACustomer = () => {
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
        disbursementAmount: '',
        interestRate: '',
        loanTenure: '',
    });

    const [loanDetails, setLoanDetails] = useState({
        fileCharges: 0,
        totalLoanAmount: 0,
        totalPayable: 0,
        monthlyEmi: 0,
        principalPerMonth: 0,
        interestPerMonth: 0,
        emiDates: []
    });

    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');
    const addressRef = useRef(null);

    // 🔹 Loan auto calculation
    useEffect(() => {
        calculateLoanDetails();
    }, [customer.disbursementAmount, customer.interestRate, customer.loanTenure]);

    const calculateLoanDetails = () => {
        const disbursementAmount = parseFloat(customer.disbursementAmount) || 0;
        const interestRate = parseFloat(customer.interestRate) || 0;
        const tenure = parseInt(customer.loanTenure) || 0;

        if (disbursementAmount > 0 && tenure > 0 && interestRate > 0) {
            // Calculate file charges as 5% of disbursement amount
            const fileCharges = Math.round(disbursementAmount * 0.05);

            // Calculate interest only on disbursement amount
            const totalInterest = (disbursementAmount * interestRate / 100) * (tenure / 12);

            // Total payable includes disbursement + interest only
            const totalPayable = disbursementAmount + totalInterest;

            // Calculate monthly EMI
            const monthlyEmi = Math.round(totalPayable / tenure);

            // Calculate principal and interest per month
            const principalPerMonth = disbursementAmount / tenure;
            const interestPerMonth = totalInterest / tenure;

            // Generate EMI dates
            const today = new Date();
            const emiDates = [];
            for (let i = 1; i <= tenure; i++) {
                const dueDate = new Date(today);
                dueDate.setMonth(today.getMonth() + i);
                emiDates.push(dueDate.toISOString().split('T')[0]);
            }

            setLoanDetails({
                fileCharges,
                totalLoanAmount: disbursementAmount,
                totalPayable,
                monthlyEmi,
                principalPerMonth,
                interestPerMonth,
                emiDates
            });
        } else {
            setLoanDetails({
                fileCharges: 0,
                totalLoanAmount: 0,
                totalPayable: 0,
                monthlyEmi: 0,
                principalPerMonth: 0,
                interestPerMonth: 0,
                emiDates: []
            });
        }
    };

    // 🔹 Input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    // 🔹 Submit with backend integration
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/customers-lra", customer);

            toast.success("L.R.A. Customer added successfully!");
            navigate("/dashboard/customers-lra");
        } catch (error) {
            console.error("Error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to add customer");
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
                    onClick={() => setActiveSection('calculation')}
                    className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeSection === 'calculation' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Calculation
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
                    <h1 className="text-xl font-bold text-gray-800">Add L.R.A. Customer</h1>
                </div>

                {/* Desktop header */}
                <h1 className="hidden lg:block text-2xl font-bold mb-6 text-gray-800">Add New L.R.A. Customer</h1>
                
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
                                    <label className="block text-sm font-medium text-gray-700">
                                        Loan Amount (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="disbursementAmount"
                                        value={customer.disbursementAmount}
                                        onChange={handleChange}
                                        min="1000"
                                        step="1000"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Amount to be disbursed to customer</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Interest Rate (% per annum) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="interestRate"
                                        value={customer.interestRate}
                                        onChange={handleChange}
                                        min="0.1"
                                        max="50"
                                        step="0.1"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Loan Tenure (Months) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="loanTenure"
                                        value={customer.loanTenure}
                                        onChange={handleChange}
                                        min="1"
                                        max="60"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        required
                                    />
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
                                <button
                                    type="button"
                                    onClick={calculateLoanDetails}
                                    className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer text-sm sm:text-base"
                                >
                                    <FaCalculator className="mr-2" />
                                    Calculate Loan Details
                                </button>
                            </div>
                        </div>

                        {/* Loan Calculation Results - Always visible on desktop, conditionally on mobile */}
                        <div 
                            className={`bg-white p-4 sm:p-6 rounded-lg shadow ${activeSection !== 'calculation' ? 'hidden lg:block' : ''}`}
                        >
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Loan Calculation</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">File Charges (5%)</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.fileCharges.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Loan Amount</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.totalLoanAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Monthly EMI</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.monthlyEmi.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Payable</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.totalPayable.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Principal per Month</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.principalPerMonth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Interest per Month</p>
                                        <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.interestPerMonth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">EMI Schedule</p>
                                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                                        {loanDetails.emiDates.length > 0 ? (
                                            <ul className="divide-y divide-gray-200">
                                                {loanDetails.emiDates.map((date, index) => (
                                                    <li key={index} className="py-1 flex justify-between text-sm">
                                                        <span>EMI {index + 1}</span>
                                                        <span>{new Date(date).toLocaleDateString()}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center">Enter loan details to see EMI schedule</p>
                                        )}
                                    </div>
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

                    {/* Bottom buttons */}
                    <div className="flex justify-end space-x-3 sticky bottom-0 bg-white p-3 rounded-lg shadow-md lg:static lg:bg-transparent lg:p-0 lg:shadow-none">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Adding...' : 'Add L.R.A. Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLRACustomer;