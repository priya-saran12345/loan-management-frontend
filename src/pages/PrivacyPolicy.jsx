import React from 'react';
import { FaShieldAlt, FaUserLock, FaDatabase, FaCookie, FaEnvelope } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4 flex items-center justify-center">
          <FaShieldAlt className="mr-3" /> Privacy Policy
        </h1>
        <p className="text-lg text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4 flex items-center">
            <FaUserLock className="mr-2" /> Introduction
          </h2>
          <p className="text-gray-700 mb-4">
            At LoanEasePro, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our loan management services.
          </p>
          <p className="text-gray-700">
            By accessing our website or using our services, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Information We Collect</h2>
          <div className="bg-emerald-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-medium text-emerald-800 mb-3 flex items-center">
              <FaDatabase className="mr-2" /> Personal Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Full name, date of birth, and government-issued identification numbers</li>
              <li>Contact information including address, email, and phone number</li>
              <li>Financial information such as income, credit score, and banking details</li>
              <li>Employment history and current employment status</li>
              <li>Loan application details and repayment history</li>
            </ul>
          </div>
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-emerald-800 mb-3 flex items-center">
              <FaCookie className="mr-2" /> Automatic Data Collection
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>IP address, browser type, and device information</li>
              <li>Usage data including pages visited and time spent on our platform</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">How We Use Your Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Loan Processing",
                content: "To evaluate, process, and manage your loan applications and accounts."
              },
              {
                title: "Credit Assessment",
                content: "To verify your identity and assess your creditworthiness."
              },
              {
                title: "Service Improvement",
                content: "To enhance our services and develop new products."
              },
              {
                title: "Regulatory Compliance",
                content: "To meet legal and regulatory requirements in the financial sector."
              },
              {
                title: "Communication",
                content: "To send important notices and respond to your inquiries."
              },
              {
                title: "Fraud Prevention",
                content: "To detect and prevent fraudulent activities and security risks."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-emerald-800 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Data Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">
            We may share your information with third parties only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>With credit bureaus and financial institutions for credit assessment</li>
            <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
            <li>When required by law or to protect our legal rights</li>
            <li>During business transfers such as mergers or acquisitions</li>
          </ul>
          <p className="text-gray-700">
            We never sell your personal information to third-party marketers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement robust security measures including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>256-bit SSL encryption for all data transmissions</li>
            <li>Multi-factor authentication for employee access</li>
            <li>Regular security audits and penetration testing</li>
            <li>Secure data storage with access controls</li>
          </ul>
          <p className="text-gray-700">
            While we strive to protect your information, no electronic transmission or storage is 100% secure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Access and receive a copy of your personal data</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data under certain circumstances</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-medium text-emerald-800 mb-3 flex items-center">
              <FaEnvelope className="mr-2" /> Contact Us
            </h3>
            <p className="text-gray-700">
              To exercise these rights or for any privacy-related inquiries, please contact our Data Protection Officer at:
              <br />
              <span className="font-medium">privacy@loaneasepro.com</span> or through our mailing address.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Policy Updates</h2>
          <p className="text-gray-700">
            We may update this policy periodically. We will notify you of significant changes through our website or email. Your continued use of our services after such changes constitutes acceptance of the new policy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;