import { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiDollarSign, FiPlus, FiMinus, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

const Wallet = () => {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showDepositForm, setShowDepositForm] = useState(false);
    const [showWithdrawForm, setShowWithdrawForm] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [description, setDescription] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                setLoading(true);
                const [{ data: walletData }, { data: transactionsData }] = await Promise.all([
                    api.get('/wallet'),
                    api.get('/wallet/transactions')
                ]);

                setBalance(walletData.wallet.balance);
                // Sort transactions by date (newest first)
                const sortedTransactions = transactionsData.transactions.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setTransactions(sortedTransactions);
            } catch (error) {
                toast.error('Failed to fetch wallet data');
            } finally {
                setLoading(false);
            }
        };

        fetchWalletData();
    }, []);

    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(t => t.type === filter);

    // Get current transactions for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Wallet Transactions Report', 105, 11, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });

        autoTable(doc, {
            head: [['S.No', 'Date', 'Type', 'Amount', 'Description']],
            body: filteredTransactions.map((t, index) => [
                index + 1,
                new Date(t.date).toLocaleDateString(),
                t.type.charAt(0).toUpperCase() + t.type.slice(1),
                `Rs. ${t.amount.toFixed(2)}`,
                t.description || '-'
            ]),
            startY: 25,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [16, 185, 129] }
        });
        doc.save('wallet-transactions.pdf');
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            const { data } = await api.post('/wallet/deposit', {
                amount: parseFloat(depositAmount),
                description: description || 'Manual deposit'
            });

            setBalance(data.wallet.balance);
            // Sort transactions by date (newest first)
            const sortedTransactions = [...data.wallet.transactions].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            setTransactions(sortedTransactions);
            setDepositAmount('');
            setDescription('');
            setShowDepositForm(false);
            setCurrentPage(1); // Reset to first page after new transaction
            toast.success('Amount deposited successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to deposit amount');
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (parseFloat(withdrawAmount) > balance) {
            toast.error('Insufficient balance');
            return;
        }

        try {
            const { data } = await api.post('/wallet/withdraw', {
                amount: parseFloat(withdrawAmount),
                description: description || 'Manual withdrawal'
            });

            setBalance(data.wallet.balance);
            // Sort transactions by date (newest first)
            const sortedTransactions = [...data.wallet.transactions].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            setTransactions(sortedTransactions);
            setWithdrawAmount('');
            setDescription('');
            setShowWithdrawForm(false);
            setCurrentPage(1); // Reset to first page after new transaction
            toast.success('Amount withdrawn successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to withdraw amount');
        }
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
                {mobileMenuOpen ? <FiX size={24} /> : <FiDollarSign size={24} />}
            </button>
            
            {mobileMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 space-y-2">
                    <button
                        onClick={() => {
                            setShowDepositForm(true);
                            setMobileMenuOpen(false);
                        }}
                        className="w-12 h-12 bg-emerald-600 text-white rounded-full shadow flex items-center justify-center"
                        title="Deposit"
                    >
                        <FiPlus size={20} />
                    </button>
                    <button
                        onClick={() => {
                            setShowWithdrawForm(true);
                            setMobileMenuOpen(false);
                        }}
                        className="w-12 h-12 bg-red-600 text-white rounded-full shadow flex items-center justify-center"
                        title="Withdraw"
                    >
                        <FiMinus size={20} />
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
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 lg:mb-0">Wallet Management</h1>
                    
                    {/* Desktop action buttons */}
                    <div className="hidden lg:flex items-center space-x-3">
                        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-md flex items-center">
                            <FiDollarSign className="mr-2" />
                            <span className="font-semibold">Balance: ₹{balance.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={() => setShowDepositForm(true)}
                            className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm cursor-pointer"
                        >
                            <FiPlus className="mr-2" size={16} />
                            Deposit
                        </button>
                        <button
                            onClick={() => setShowWithdrawForm(true)}
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm cursor-pointer"
                        >
                            <FiMinus className="mr-2" size={16} />
                            Withdraw
                        </button>
                        <button
                            onClick={downloadPDF}
                            className="flex items-center px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm cursor-pointer"
                        >
                            <FiDownload className="mr-2" size={16} />
                            Export PDF
                        </button>
                    </div>

                    {/* Mobile balance display */}
                    <div className="lg:hidden bg-emerald-100 text-emerald-800 px-4 py-2 rounded-md flex items-center justify-center mb-4">
                        <FiDollarSign className="mr-2" />
                        <span className="font-semibold">Balance: ₹{balance.toLocaleString()}</span>
                    </div>
                </div>

                {/* Deposit Modal */}
                {showDepositForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Deposit to Wallet</h2>
                                <button onClick={() => setShowDepositForm(false)} className="text-gray-500 hover:text-gray-700">
                                    <FiX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleDeposit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Description"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowDepositForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
                                    >
                                        Deposit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Withdraw Modal */}
                {showWithdrawForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Withdraw from Wallet</h2>
                                <button onClick={() => setShowWithdrawForm(false)} className="text-gray-500 hover:text-gray-700">
                                    <FiX size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleWithdraw}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Enter amount"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Available balance: ₹{balance.toLocaleString()}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Description"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowWithdrawForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Withdraw
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-auto">
                                <select
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.target.value);
                                        setCurrentPage(1); // Reset to first page when filtering
                                    }}
                                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer w-full"
                                >
                                    <option value="all">All Transactions</option>
                                    <option value="credit">Credits</option>
                                    <option value="debit">Debits</option>
                                </select>
                                <FiFilter className="absolute right-3 top-2.5 text-gray-400" size={16} />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                            <div className="text-sm text-gray-600">
                                Showing {filteredTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Description</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">Loading transactions...</td>
                                    </tr>
                                ) : currentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No transactions found</td>
                                    </tr>
                                ) : (
                                    currentTransactions.map((transaction, index) => (
                                        <tr key={transaction._id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'credit'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₹{transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                                                {transaction.description || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredTransactions.length > 0 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:flex-1 sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
                                        </span>{' '}
                                        of <span className="font-medium">{filteredTransactions.length}</span> results
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

export default Wallet;