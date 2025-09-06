// ExpenseTracker.jsx
import { useState, useEffect } from 'react';
import { FiDollarSign, FiPlusCircle, FiMinusCircle, FiPieChart, FiCalendar, FiFilter, FiTrash2, FiChevronDown } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import api from '../../utils/api';

Chart.register(...registerables);

const ExpenseTracker = () => {
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [filter, setFilter] = useState('all');
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
    });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mobileView, setMobileView] = useState('list'); // 'list' or 'charts'

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const [incomeRes, expenseRes] = await Promise.all([
                api.get('/income'),
                api.get('/expense')
            ]);

            const incomes = incomeRes?.data?.incomes || [];
            const expenses = expenseRes?.data?.expenses || [];

            const incomesWithType = incomes.map(t => ({ ...t, type: 'income' }));
            const expensesWithType = expenses.map(t => ({ ...t, type: 'expense' }));

            const combined = [...incomesWithType, ...expensesWithType].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setTransactions(combined);
            calculateSummary(combined);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching transactions");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const { type, amount, date, description } = formData;

        if (!amount || !date) {
            toast.error("Amount and Date are required");
            setIsSubmitting(false);
            return;
        }

        const data = {
            amount: parseFloat(amount),
            date,
            description
        };

        try {
            const endpoint = type === 'income' ? '/income' : '/expense';
            const res = await api.post(endpoint, data);

            if (res.data.success) {
                toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
                fetchTransactions();
                setFormData(prev => ({
                    ...prev,
                    amount: '',
                    description: ''
                }));
            } else {
                toast.error(res.data.message || 'Failed to add transaction');
            }
        } catch (error) {
            console.error(error);
            toast.error("Server Error: Could not add transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            const res = await api.delete(`/${type}/${id}`);
            if (res.data.success) {
                toast.success(`${type} deleted`);
                fetchTransactions();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        }
    };

    const calculateSummary = (all) => {
        const totalIncome = all.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = all.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpense;
        setSummary({ totalIncome, totalExpense, balance });
    };

    const filteredTransactions = transactions.filter(t => filter === 'all' || t.type === filter);

    const incomeExpenseData = {
        labels: ['Income', 'Expense', 'Balance'],
        datasets: [{
            label: 'Amount (₹)',
            data: [summary.totalIncome, summary.totalExpense, summary.balance],
            backgroundColor: ['#10B981', '#EF4444', '#3B82F6'],
            borderColor: ['#10B981', '#EF4444', '#3B82F6'],
            borderWidth: 1
        }]
    };

    const pieChartData = {
        labels: ['Income', 'Expense'],
        datasets: [
            {
                label: 'Amount (₹)',
                data: [summary.totalIncome, summary.totalExpense],
                backgroundColor: ['#10B981', '#EF4444'],
                borderWidth: 1
            }
        ]
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-7xl">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-100 p-6 rounded-lg h-24"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-100 p-6 rounded-lg h-64"></div>
                        <div className="bg-gray-100 p-6 rounded-lg h-64"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
                    <FaIndianRupeeSign className="mr-2" /> Expense Tracker
                </h1>
                
                {/* Mobile View Toggle */}
                <div className="flex bg-gray-100 rounded-md p-1">
                    <button
                        onClick={() => setMobileView('list')}
                        className={`px-3 py-1 text-sm rounded-md ${mobileView === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setMobileView('charts')}
                        className={`px-3 py-1 text-sm rounded-md ${mobileView === 'charts' ? 'bg-white shadow' : 'text-gray-600'}`}
                    >
                        Charts
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card title="Income" value={summary.totalIncome} color="green" />
                <Card title="Expense" value={summary.totalExpense} color="red" />
                <Card title="Balance" value={summary.balance} color={summary.balance >= 0 ? "blue" : "red"} />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <FormColumn 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    handleSubmit={handleSubmit} 
                    setFormData={setFormData}
                    isSubmitting={isSubmitting}
                />
                
                <div className="lg:w-2/3 space-y-6">
                    {/* Charts Section - Hidden on mobile when in list view */}
                    <div className={`${mobileView === 'list' ? 'hidden lg:block' : ''}`}>
                        <ChartOverview 
                            barData={incomeExpenseData} 
                            pieData={pieChartData}
                            filter={filter} 
                            setFilter={setFilter} 
                        />
                    </div>
                    
                    {/* Transactions Section - Hidden on mobile when in charts view */}
                    <div className={`${mobileView === 'charts' ? 'hidden lg:block' : ''}`}>
                        <TransactionsList 
                            transactions={filteredTransactions} 
                            handleDelete={handleDelete} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value, color }) => {
    const colorClasses = {
        green: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-100'
        },
        red: {
            bg: 'bg-red-50',
            text: 'text-red-600',
            border: 'border-red-100'
        },
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-100'
        }
    };

    return (
        <div className={`${colorClasses[color].bg} ${colorClasses[color].border} p-4 rounded-lg shadow border`}>
            <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
            <p className={`text-xl sm:text-2xl font-bold ${colorClasses[color].text}`}>₹{value.toFixed(2)}</p>
        </div>
    );
};

const FormColumn = ({ formData, handleInputChange, handleSubmit, setFormData, isSubmitting }) => (
    <div className="lg:w-1/3">
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-md sticky top-4 space-y-4 border border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold flex items-center">
                {formData.type === 'income' ? (
                    <FiPlusCircle className="mr-2 text-green-500" />
                ) : (
                    <FiMinusCircle className="mr-2 text-red-500" />
                )}
                Add {formData.type}
            </h2>
            
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`flex-1 py-2 px-3 md:px-4 rounded-md transition-colors cursor-pointer ${formData.type === 'income'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Income
                </button>
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`flex-1 py-2 px-3 md:px-4 rounded-md transition-colors cursor-pointer ${formData.type === 'expense'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Expense
                </button>
            </div>
            
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Amount (₹)</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="1"
                    step="1"
                    required
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
            </div>
            
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition cursor-pointer"
                />
            </div>
            
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">Description (Optional)</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description..."
                    rows={2}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
            </div>
            
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                    </div>
                ) : (
                    `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`
                )}
            </button>
        </form>
    </div>
);

const ChartOverview = ({ barData, pieData, filter, setFilter }) => {
    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center">
                    <FiPieChart className="mr-2 text-emerald-600" />
                    Financial Overview
                </h2>
                
                <div className="flex items-center">
                    <FiFilter className="text-gray-400 mr-2" />
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-sm cursor-pointer"
                    >
                        <option value="all">All Transactions</option>
                        <option value="income">Income Only</option>
                        <option value="expense">Expense Only</option>
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="h-64">
                    <Bar
                        data={barData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        boxWidth: 12,
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Income vs Expense Overview',
                                    font: {
                                        size: 14
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function(value) {
                                            return '₹' + value;
                                        }
                                    }
                                }
                            }
                        }}
                    />
                </div>
                <div className="h-64">
                    <Pie
                        data={pieData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        boxWidth: 12,
                                        font: {
                                            size: 12
                                        }
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Income vs Expense Distribution',
                                    font: {
                                        size: 14
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const TransactionsList = ({ transactions, handleDelete }) => {
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    const sortedTransactions = [...transactions].sort((a, b) => {
        if (sortBy === 'date') {
            return sortOrder === 'asc' 
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'amount') {
            return sortOrder === 'asc' 
                ? a.amount - b.amount
                : b.amount - a.amount;
        }
        return 0;
    });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center">
                    <FiCalendar className="mr-2 text-emerald-600" />
                    Recent Transactions
                </h2>
                
                <div className="flex items-center text-sm">
                    <span className="text-gray-600 mr-2">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => handleSort(e.target.value)}
                        className="border border-gray-300 p-1 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                    >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="ml-2 p-1 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                </div>
            </div>
            
            {sortedTransactions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No transactions found</p>
            ) : (
                <div className="overflow-x-auto">
                    {/* Desktop Table */}
                    <table className="hidden md:table min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('amount')}>
                                    Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedTransactions.map(t => (
                                <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(t.date).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                                        {t.description || '-'}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleDelete(t._id, t.type)}
                                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer flex items-center"
                                            title="Delete transaction"
                                        >
                                            <FiTrash2 className="mr-1" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {sortedTransactions.map(t => (
                            <div key={t._id} className={`border-l-4 ${t.type === 'income' ? 'border-green-500' : 'border-red-500'} bg-white p-4 rounded-lg shadow-sm`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{t.description || 'No description'}</p>
                                        <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('en-IN')}</p>
                                    </div>
                                    <span className={`text-sm font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleDelete(t._id, t.type)}
                                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer flex items-center text-xs"
                                    >
                                        <FiTrash2 className="mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseTracker;