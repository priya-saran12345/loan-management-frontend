import React from 'react';
import { FaGavel, FaFileContract, FaMoneyBillWave, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-800 mb-4 flex items-center justify-center">
          <FaGavel className="mr-3" /> Terms of Service
        </h1>
        <p className="text-lg text-gray-600">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing or using the LoanEasePro loan management system ("Service"), you agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you ("User") and LoanEasePro ("Company").
          </p>
          <p className="text-gray-700">
            If you do not agree to these Terms, you must not use our Service. We reserve the right to modify these Terms at any time, with changes effective upon posting.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">2. Service Description</h2>
          <p className="text-gray-700 mb-4">
            LoanEasePro provides an online platform for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Loan application processing and management</li>
            <li>Credit assessment and decisioning</li>
            <li>Loan account servicing and payment processing</li>
            <li>Financial education resources</li>
          </ul>
          <p className="text-gray-700">
            We are not a direct lender but facilitate connections between borrowers and our network of licensed lending partners.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4 flex items-center">
            <FaFileContract className="mr-2" /> 3. User Eligibility
          </h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <h3 className="font-medium text-red-800 flex items-center">
              <FaExclamationTriangle className="mr-2" /> Important Requirements
            </h3>
            <ul className="list-disc pl-6 space-y-1 mt-2 text-red-700">
              <li>You must be at least 18 years old (or age of majority in your jurisdiction)</li>
              <li>You must be a legal resident of the country where we operate</li>
              <li>You must have a valid bank account in your name</li>
              <li>You must provide accurate and complete information</li>
            </ul>
          </div>
          <p className="text-gray-700">
            We reserve the right to refuse service to anyone at our sole discretion. By using our Service, you represent and warrant that you meet all eligibility requirements.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">4. Loan Application Process</h2>
          <ol className="list-decimal pl-6 space-y-4 text-gray-700">
            <li>
              <span className="font-medium">Application Submission:</span> Complete our online application form with accurate personal, financial, and employment information.
            </li>
            <li>
              <span className="font-medium">Documentation:</span> Provide required documents (e.g., ID proof, income verification) through our secure portal.
            </li>
            <li>
              <span className="font-medium">Credit Check:</span> We perform credit checks with your consent through authorized credit bureaus.
            </li>
            <li>
              <span className="font-medium">Decision:</span> Loan approval decisions are typically provided within 2 business days.
            </li>
            <li>
              <span className="font-medium">Funding:</span> Approved loans are typically disbursed within 3-5 business days after acceptance of terms.
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4 flex items-center">
            <FaMoneyBillWave className="mr-2" /> 5. Loan Terms & Repayment
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {[
              {
                title: "Interest Rates",
                content: "Rates vary from 5.99% to 29.99% APR based on creditworthiness, loan amount, and term."
              },
              {
                title: "Loan Amounts",
                content: "Minimum ₹10,000 to maximum ₹20,00,000, subject to approval."
              },
              {
                title: "Repayment Terms",
                content: "12 to 60 months, with fixed monthly payments via automatic bank debit."
              },
              {
                title: "Fees",
                content: "Origination fees (1-5% of loan amount), late payment fees (5% of payment or ₹500, whichever is less), and returned payment fees (₹300)."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white border border-emerald-100 rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-emerald-800 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.content}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-700">
            Specific loan terms will be provided in your loan agreement. It is your responsibility to review and understand all terms before accepting any loan offer.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">6. User Responsibilities</h2>
          <p className="text-gray-700 mb-4">
            As a User, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update any changes to your personal or financial information</li>
            <li>Make timely payments as agreed in your loan contract</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Not use the Service for any illegal or fraudulent purpose</li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="font-medium text-yellow-800">Non-Payment Consequences</h3>
            <p className="text-gray-700 mt-2">
              Late or missed payments may result in additional fees, credit bureau reporting, and potential legal action. Continued default may lead to debt collection proceedings.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">7. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All content, features, and functionality on our platform, including software, text, graphics, and logos, are the exclusive property of LoanEasePro and are protected by intellectual property laws.
          </p>
          <p className="text-gray-700">
            You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes only.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            To the maximum extent permitted by law, LoanEasePro shall not be liable for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Any indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Damages resulting from unauthorized access to your account</li>
            <li>Third-party actions or service interruptions</li>
          </ul>
          <p className="text-gray-700">
            Our total liability for any claim related to the Service shall not exceed the fees you paid to us in the past six months.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">9. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may suspend or terminate your access to the Service at any time, without notice, for conduct that we believe:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
            <li>Violates these Terms or applicable laws</li>
            <li>Poses a risk to our systems or other users</li>
            <li>Involves fraudulent or abusive behavior</li>
          </ul>
          <p className="text-gray-700">
            Termination does not relieve you of obligations under any active loan agreements.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">10. Governing Law</h2>
          <p className="text-gray-700 mb-4">
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
          <p className="text-gray-700">
            Any disputes shall be resolved through binding arbitration in [City], [Country], in accordance with the rules of [Arbitration Organization]. Judgment on the award may be entered in any court of competent jurisdiction.
          </p>
        </section>

        <section>
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4 flex items-center">
              <FaQuestionCircle className="mr-2" /> Contact Information
            </h2>
            <p className="text-gray-700">
              For questions about these Terms, please contact us at:
              <br />
              <span className="font-medium">legal@loaneasepro.com</span>
              <br />
              LoanEasePro Legal Department
              <br />
              123 Financial District, Mumbai, Maharashtra 400001
              <br />
              Phone: +91 22 1234 5678
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;