import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiArrowLeft, FiUser, FiDollarSign, FiCreditCard, FiBriefcase, FiShield } from 'react-icons/fi';
import api from '../../utils/api';

const EditCustomer = () => {
    const { id } = useParams();
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addressRef = useRef(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/customers-stl/${id}/edit`);

                // Extract only the fields we want to allow editing
                const {
                    name, fatherName, phone, address, aadhar,
                    employmentType, monthlyIncome, guarantorName,
                    guarantorPhone, guarantorAddress, loanPurpose
                } = data.customer;

                setCustomer({
                    name,
                    fatherName,
                    phone,
                    address,
                    aadhar,
                    employmentType,
                    monthlyIncome,
                    guarantorName,
                    guarantorPhone,
                    guarantorAddress,
                    loanPurpose
                });
            } catch (error) {
                console.error('Error fetching customer:', error);
                toast.error('Failed to fetch customer data');
                navigate('/dashboard/customers-stl');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id, navigate]);

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

        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const requiredFields = [
            'name', 'fatherName', 'phone', 'address',
            'employmentType', 'monthlyIncome',
            'guarantorName', 'guarantorPhone', 'guarantorAddress',
            'loanPurpose'
        ];

        const missingFields = requiredFields.filter(field => !customer[field]);
        if (missingFields.length > 0) {
            toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
            setIsSubmitting(false);
            return;
        }

        if (customer.aadhar && customer.aadhar.length !== 12) {
            toast.error('Aadhar number must be exactly 12 digits');
            setIsSubmitting(false);
            return;
        }

        try {
            // Send the customer data directly as JSON
            const { data } = await api.put(`/customers-stl/${id}`, customer);

            toast.success('Customer updated successfully!');
            navigate('/dashboard/customers-stl');
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error(error.response?.data?.message || 'Failed to update customer');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
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
                <h1 className="text-2xl font-bold text-gray-800">Edit STL Customer</h1>
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
                                <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
                                <input
                                    type="number"
                                    value={10000}
                                    readOnly
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">Customer will receive ₹8,000 (80%)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loan Validity (Days)</label>
                                <input
                                    type="number"
                                    value={100}
                                    readOnly
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">EMI Amount (₹)</label>
                                <input
                                    type="number"
                                    value={100}
                                    readOnly
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
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

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer"
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
                            'Update STL Customer'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCustomer;