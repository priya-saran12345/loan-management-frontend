import React, { useState } from 'react';
import { FaCalculator, FaMoneyBillWave, FaCalendarAlt, FaPercent } from 'react-icons/fa';

const LoanCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(100);
    const [loanTerm, setLoanTerm] = useState(1);
    const interestRate = 3; // 3% fixed interest rate

    // Calculate total payment and EMI
    const calculateLoan = () => {
        const monthlyInterestRate = interestRate / 100; 
        const totalInterest = loanAmount * monthlyInterestRate * loanTerm;
        const totalPayment = loanAmount + totalInterest;
        const emi = totalPayment / loanTerm;

        return {
            totalPayment: totalPayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            emi: emi.toFixed(2)
        };
    };

    const { totalPayment, totalInterest, emi } = calculateLoan();

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center mb-4">
                        <FaCalculator className="text-emerald-600 text-4xl mr-3" />
                        <h1 className="text-3xl font-bold text-gray-800">Loan EMI Calculator</h1>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Calculate your monthly payments and total interest for our 3% interest rate loans.
                        Adjust the sliders to see how different amounts and terms affect your repayment.
                    </p>
                </div>

                {/* Calculator Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        {/* Loan Amount Input */}
                        <div className="mb-8">
                            <label className="flex items-center text-gray-700 mb-3">
                                <FaMoneyBillWave className="text-emerald-500 mr-2" />
                                <span className="font-medium">Loan Amount</span>
                            </label>
                            <div className="flex items-center">
                                <span className="text-gray-500 mr-2">₹</span>
                                <input
                                    type="range"
                                    min="100"
                                    max="500000"
                                    step="100"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-sm text-gray-500">₹100</span>
                                <span className="text-sm font-medium text-emerald-600">₹{loanAmount}</span>
                                <span className="text-sm text-gray-500">₹5,000,00</span>
                            </div>
                        </div>

                        {/* Loan Term Input */}
                        <div className="mb-8">
                            <label className="flex items-center text-gray-700 mb-3">
                                <FaCalendarAlt className="text-emerald-500 mr-2" />
                                <span className="font-medium">Loan Term (Months)</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="60"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2">
                                <span className="text-sm text-gray-500">1 month</span>
                                <span className="text-sm font-medium text-emerald-600">{loanTerm} {loanTerm === 1 ? 'month' : 'months'}</span>
                                <span className="text-sm text-gray-500">60 months</span>
                            </div>
                        </div>

                        {/* Interest Rate Display */}
                        <div className="mb-8 p-4 bg-emerald-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaPercent className="text-emerald-500 mr-2" />
                                    <span className="font-medium text-gray-700">Interest Rate</span>
                                </div>
                                <span className="text-xl font-bold text-emerald-600">{interestRate}%</span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-emerald-100 p-4 rounded-lg">
                                <p className="text-sm text-emerald-800">Monthly Payment (EMI)</p>
                                <p className="text-2xl font-bold text-emerald-700">₹{emi}</p>
                            </div>
                            <div className="bg-emerald-100 p-4 rounded-lg">
                                <p className="text-sm text-emerald-800">Total Interest</p>
                                <p className="text-2xl font-bold text-emerald-700">₹{totalInterest}</p>
                            </div>
                            <div className="bg-emerald-100 p-4 rounded-lg">
                                <p className="text-sm text-emerald-800">Total Payment</p>
                                <p className="text-2xl font-bold text-emerald-700">₹{totalPayment}</p>
                            </div>
                        </div>

                        {/* Amortization Explanation */}
                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">How Your Loan is Calculated</h3>
                            <p className="text-gray-600 mb-4">
                                Our simple interest loan calculator uses a fixed 3% interest rate applied to your principal amount.
                                The interest is calculated monthly based on your loan term.
                            </p>
                            <div className="bg-emerald-50 p-4 rounded-lg">
                                <p className="font-medium text-emerald-800 mb-2">Calculation Formula:</p>
                                <p className="text-sm text-gray-700">
                                    Total Interest = Loan Amount × (Interest Rate / 100) × Loan Term (in months)
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                    Total Payment = Loan Amount + Total Interest
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                    EMI (Monthly Payment) = Total Payment / Loan Term
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">About Our Loan Products</h3>
                        <div className="space-y-4 text-gray-600">
                            <p>
                                Our 3% interest rate loans are designed to be simple and transparent. Unlike compound interest loans,
                                you'll always know exactly how much interest you'll pay over the life of your loan.
                            </p>
                            <p>
                                <span className="font-medium text-emerald-700">Example:</span> For a ₹1,000 loan over 6 months at 3% interest,
                                you would pay ₹30 per month in interest, totaling ₹180 in interest over the loan term.
                            </p>
                            <p>
                                This calculator helps you understand your repayment obligations before you commit to a loan.
                                Remember that shorter terms mean higher monthly payments but less total interest paid.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanCalculator;