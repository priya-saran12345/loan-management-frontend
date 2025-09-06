import React from 'react';
import { FaHandshake, FaChartLine, FaShieldAlt, FaUserTie, FaLightbulb, FaPiggyBank } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-emerald-700 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 transform skew-y-6"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About LoanEase Pro</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your trusted partner in financial growth and loan management solutions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8 md:p-10">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <FaHandshake className="text-emerald-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Story</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Founded in 2015, LoanEase Pro began with a simple mission: to make loan management transparent, accessible, 
                and stress-free for everyone. Our founders, a team of financial experts and technologists, recognized the 
                challenges individuals and businesses face when navigating the complex world of loans.
              </p>
              <p>
                What started as a small fintech startup in Mumbai has now grown into one of India's most trusted loan 
                management platforms. We've helped over 250,000 customers secure more than ₹2,500 crores in loans with 
                our innovative approach and customer-first philosophy.
              </p>
              <p>
                Unlike traditional lenders, we leverage cutting-edge technology to simplify the loan process while maintaining 
                the highest standards of security and compliance. Our platform is built on the principles of transparency, 
                fairness, and financial empowerment.
              </p>
            </div>
          </div>
        </div>

        {/* Loan Products Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Personal Loans */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <FaUserTie className="text-emerald-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Personal Loans</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>
                  Our personal loans range from ₹10,000 to ₹10 lakhs with flexible repayment terms from 3 to 36 months. 
                  Interest rates start at just 10.5% per annum with no hidden charges.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>No collateral required</li>
                  <li>Quick approval within 24 hours</li>
                  <li>Minimal documentation</li>
                  <li>Prepayment options available</li>
                </ul>
                <p className="pt-2">
                  Ideal for medical emergencies, weddings, travel, or debt consolidation. Our eligibility criteria are 
                  simple: minimum age of 21 years, stable income, and a credit score above 650.
                </p>
              </div>
            </div>
          </div>

          {/* Business Loans */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <FaChartLine className="text-emerald-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Business Loans</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>
                  We offer business loans from ₹1 lakh to ₹50 lakhs with terms from 6 to 60 months. Interest rates 
                  start at 12% per annum for established businesses.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Working capital solutions</li>
                  <li>Equipment financing</li>
                  <li>Invoice discounting</li>
                  <li>Business expansion loans</li>
                </ul>
                <p className="pt-2">
                  Perfect for startups, MSMEs, and growing enterprises. We evaluate your business potential beyond 
                  just financial statements, considering market opportunities and growth prospects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How We're Different */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8 md:p-10">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <FaLightbulb className="text-emerald-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">How We're Different</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-bold text-emerald-700 mb-3">Transparent Pricing</h3>
                <p className="text-gray-700">
                  No hidden fees or surprise charges. We show you exactly what you'll pay upfront with our 
                  simple interest calculation model.
                </p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-bold text-emerald-700 mb-3">Digital-First Approach</h3>
                <p className="text-gray-700">
                  Complete your loan application in minutes through our secure platform. Upload documents, 
                  track progress, and manage payments online.
                </p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-bold text-emerald-700 mb-3">Financial Education</h3>
                <p className="text-gray-700">
                  We provide free resources to help you make informed decisions about borrowing and managing debt.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-8 md:p-10">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <FaShieldAlt className="text-emerald-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Security & Compliance</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                At LoanEase Pro, we prioritize the security of your personal and financial information above all else. 
                Our platform employs bank-grade 256-bit SSL encryption to protect your data during transmission.
              </p>
              <p>
                We are registered with the Reserve Bank of India as a Non-Banking Financial Company (NBFC) and comply 
                with all regulations set forth by the RBI and other governing bodies. Our operations are regularly 
                audited to ensure compliance with:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>RBI's Fair Practices Code for Lenders</li>
                <li>Information Technology Act, 2000</li>
                <li>Digital Lending Guidelines</li>
                <li>Data Protection Standards</li>
              </ul>
              <p>
                Your data is never shared with third parties without your explicit consent, and we maintain strict 
                internal controls to prevent unauthorized access to customer information.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Responsibility */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <FaPiggyBank className="text-emerald-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Commitment to Responsible Lending</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                While we strive to make loans accessible, we're equally committed to ensuring our customers don't 
                overextend themselves financially. Our proprietary affordability assessment tool evaluates:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your income-to-debt ratio</li>
                <li>Existing financial obligations</li>
                <li>Spending patterns</li>
                <li>Future financial stability</li>
              </ul>
              <p>
                We may suggest smaller loan amounts or different terms if our analysis indicates a loan might create 
                financial stress. Our loan counselors are available to discuss alternatives if you don't qualify for 
                your requested amount.
              </p>
              <p className="font-medium">
                Remember: A loan is a financial responsibility. Borrow only what you need and can comfortably repay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;