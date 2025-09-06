import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiUser, FiDollarSign, FiCreditCard, FiBriefcase, FiShield, FiPercent, FiCalendar } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";
import api from "../../utils/api";

const EditLRACustomer = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [customer, setCustomer] = useState({
        name: "",
        fatherName: "",
        phone: "",
        address: "",
        aadhar: "",
        employmentType: "salaried",
        monthlyIncome: "",
        guarantorName: "",
        guarantorPhone: "",
        guarantorAddress: "",
        loanPurpose: "",
        disbursementAmount: "",
        interestRate: "",
        loanTenure: "",
    });

    const [loanDetails, setLoanDetails] = useState({
        fileCharges: 0,
        totalLoanAmount: 0,
        totalPayable: 0,
        monthlyEmi: 0,
        emiDates: [],
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addressRef = useRef(null);

    // fetch existing customer
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setFetching(true);
                const res = await api.get(`/customers-lra/${id}/edit`);

                if (res.data.success && res.data.customer) {
                    const data = res.data.customer;
                    setCustomer({
                        name: data.name || "",
                        fatherName: data.fatherName || "",
                        phone: data.phone || "",
                        address: data.address || "",
                        aadhar: data.aadhar || "",
                        employmentType: data.employmentType || "salaried",
                        monthlyIncome: data.monthlyIncome || "",
                        guarantorName: data.guarantorName || "",
                        guarantorPhone: data.guarantorPhone || "",
                        guarantorAddress: data.guarantorAddress || "",
                        loanPurpose: data.loanPurpose || "",
                        disbursementAmount: data.disbursementAmount || "",
                        interestRate: data.interestRate || "",
                        loanTenure: data.loanTenure || "",
                    });
                } else {
                    toast.error("Failed to load customer details");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                toast.error("Failed to load customer details");
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchCustomer();
        }
    }, [id]);

    // loan calculation
    useEffect(() => {
        calculateLoanDetails();
    }, [customer.disbursementAmount, customer.interestRate, customer.loanTenure]);

    const calculateLoanDetails = () => {
        const disbursementAmount = parseFloat(customer.disbursementAmount) || 0;
        const interestRate = parseFloat(customer.interestRate) || 0;
        const tenure = parseInt(customer.loanTenure) || 0;

        if (disbursementAmount > 0 && tenure > 0 && interestRate > 0) {
            const fileCharges = Math.round(disbursementAmount * 0.05);
            const totalLoanAmount = disbursementAmount + fileCharges;

            // Fixed interest calculation - it should be per month, not per year
            const monthlyInterestRate = interestRate / 100 / 12;
            const totalPayable = totalLoanAmount * (1 + monthlyInterestRate * tenure);
            const monthlyEmi = Math.round(totalPayable / tenure);

            const today = new Date();
            const emiDates = [];
            for (let i = 1; i <= tenure; i++) {
                const dueDate = new Date(today);
                dueDate.setMonth(today.getMonth() + i);
                dueDate.setDate(1);
                emiDates.push(dueDate.toISOString().split("T")[0]);
            }

            setLoanDetails({ fileCharges, totalLoanAmount, totalPayable, monthlyEmi, emiDates });
        } else {
            setLoanDetails({ fileCharges: 0, totalLoanAmount: 0, totalPayable: 0, monthlyEmi: 0, emiDates: [] });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await api.put(`/customers-lra/${id}`, customer);

            if (res.data.success) {
                toast.success("L.R.A. Customer updated successfully!");
                navigate("/dashboard/customers-lra");
            } else {
                toast.error(res.data.message || "Failed to update customer");
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to update customer");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (fetching) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-100 p-6 rounded-lg h-64"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-emerald-600 hover:text-emerald-800 mr-4 cursor-pointer"
                >
                    <FiArrowLeft className="mr-2" />
                    Back
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Edit L.R.A. Customer</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                        <div className="flex items-center mb-4">
                            <FiUser className="text-emerald-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
                        </div>
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                    ref={addressRef}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Loan Information */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                        <div className="flex items-center mb-4">
                            <FiDollarSign className="text-emerald-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-800">Loan Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Disbursement Amount (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="disbursementAmount"
                                    value={customer.disbursementAmount}
                                    onChange={handleChange}
                                    min="1000"
                                    step="1000"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Loan Calculation Results */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                        <div className="flex items-center mb-4">
                            <FaCalculator className="text-emerald-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-800">Loan Calculation</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm font-medium text-gray-600">File Charges (5%)</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.fileCharges.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm font-medium text-gray-600">Total Loan Amount</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.totalLoanAmount.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm font-medium text-gray-600">Monthly EMI</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.monthlyEmi.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm font-medium text-gray-600">Total Payable</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">₹{loanDetails.totalPayable.toLocaleString()}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">EMI Schedule</p>
                                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                                    {loanDetails.emiDates.length > 0 ? (
                                        <ul className="divide-y divide-gray-200">
                                            {loanDetails.emiDates.map((date, index) => (
                                                <li key={index} className="py-2 flex justify-between text-sm">
                                                    <span className="flex items-center">
                                                        <FiCalendar className="mr-2 text-gray-400" />
                                                        EMI {index + 1}
                                                    </span>
                                                    <span>{new Date(date).toLocaleDateString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">Enter loan details to see EMI schedule</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aadhar Information */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                        <div className="flex items-center mb-4">
                            <FiCreditCard className="text-emerald-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-800">Aadhar Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                                <input
                                    type="text"
                                    name="aadhar"
                                    value={customer.aadhar}
                                    onChange={handleChange}
                                    maxLength={12}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="12 digit number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Employment and Guarantor Information */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                        <div className="flex items-center mb-4">
                            <FiBriefcase className="text-emerald-600 mr-2" />
                            <h2 className="text-lg font-semibold text-gray-800">Employment Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Employment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="employmentType"
                                    value={customer.employmentType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center mb-4">
                                <FiShield className="text-emerald-600 mr-2" />
                                <h2 className="text-lg font-semibold text-gray-800">Guarantor Information</h2>
                            </div>
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
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update LRA Customer'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditLRACustomer;