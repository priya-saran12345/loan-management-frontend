import React, { useState } from 'react';
import { FaStar, FaClock, FaCheckCircle, FaMoneyBillWave, FaShieldAlt, FaCalendarAlt, FaHeadset, FaHandshake, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 transform skew-y-6"></div>
        </div>
        <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            <span className="block">Smart Financial</span>
            <span className="block text-emerald-200">Solutions for You</span>
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Get ₹10,000 to ₹20,00,000 with our flexible loan options at competitive rates.
          </p>
          <div className="mt-10">
            <Link to="/calculator" className="px-10 py-4 border-2 border-transparent text-lg font-medium rounded-full text-emerald-900 bg-emerald-300 hover:bg-emerald-200 shadow-lg transform transition hover:scale-105">
              Check Your Rate
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center bg-emerald-800 bg-opacity-50 px-4 py-2 rounded-full">
              <FaStar className="h-6 w-6 text-emerald-300" />
              <span className="ml-2 text-sm font-medium">4.9/5 (2,500+ Reviews)</span>
            </div>
            <div className="flex items-center bg-emerald-800 bg-opacity-50 px-4 py-2 rounded-full">
              <FaClock className="h-6 w-6 text-emerald-300" />
              <span className="ml-2 text-sm font-medium">Same Day Disbursal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">Why Choose Our Services?</h2>
            <p className="text-xl text-emerald-600 max-w-3xl mx-auto">Trusted financial solutions for all your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaHandshake className="w-12 h-12 text-emerald-600" />,
                title: "Instant Approval",
                description: "Get approval within minutes with our streamlined digital process."
              },
              {
                icon: <FaMoneyBillWave className="w-12 h-12 text-emerald-600" />,
                title: "Competitive Rates",
                description: "Enjoy our exclusive rates starting at 10.5% with no hidden fees."
              },
              {
                icon: <FaShieldAlt className="w-12 h-12 text-emerald-600" />,
                title: "Secure Transactions",
                description: "Bank-level security for all your financial transactions and data."
              },
              {
                icon: <FaCalendarAlt className="w-12 h-12 text-emerald-600" />,
                title: "Flexible Repayment",
                description: "Choose repayment terms from 6 to 60 months to suit your needs."
              },
              {
                icon: <FaCheckCircle className="w-12 h-12 text-emerald-600" />,
                title: "Quick Disbursal",
                description: "Receive funds in your account within 24 hours of approval."
              },
              {
                icon: <FaHeadset className="w-12 h-12 text-emerald-600" />,
                title: "24/7 Support",
                description: "Our dedicated team is always available to assist you."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-emerald-100">
                <div className="mb-6 flex justify-center">
                  <div className="bg-emerald-50 p-3 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-3 text-center">{feature.title}</h3>
                <p className="text-emerald-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Simple Process</h2>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">Get your funds in just three easy steps</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-emerald-500 bg-opacity-30 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Apply Online",
                  description: "Fill our simple application form in just 5 minutes with basic details.",
                  icon: <FaHandshake className="w-10 h-10" />
                },
                {
                  step: "2",
                  title: "Get Approved",
                  description: "Receive instant approval decision with your personalized loan offer.",
                  icon: <FaCheckCircle className="w-10 h-10" />
                },
                {
                  step: "3",
                  title: "Receive Funds",
                  description: "Money transferred directly to your account within 24 hours.",
                  icon: <FaMoneyBillWave className="w-10 h-10" />
                }
              ].map((step, index) => (
                <div key={index} className="relative z-10">
                  <div className="bg-emerald-600 rounded-xl p-8 h-full hover:transform hover:scale-105 transition duration-300 shadow-xl border border-emerald-400 border-opacity-30">
                    <div className="flex items-center justify-center w-16 h-16 bg-emerald-700 rounded-full mb-6 mx-auto">
                      {step.icon}
                    </div>
                    <div className="text-center">
                      <span className="inline-block bg-emerald-300 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">STEP {step.step}</span>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-emerald-100">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">Meet Our Founder</h2>
            <p className="text-xl text-emerald-600 max-w-3xl mx-auto">The vision behind our financial solutions</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-emerald-200 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Founder" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="max-w-2xl">
              <h3 className="text-3xl font-bold text-emerald-800 mb-4">Rahul Verma</h3>
              <p className="text-lg text-emerald-600 mb-6">
                With over 15 years of experience in the financial sector, Rahul founded this company with a vision to make loan processes simpler, faster, and more transparent for everyone. His expertise in fintech and customer-centric approach has helped thousands achieve their financial goals.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="text-emerald-600 hover:text-emerald-800 transition">
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-emerald-600 hover:text-emerald-800 transition">
                  <FaTwitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-emerald-600 hover:text-emerald-800 transition">
                  <FaFacebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-emerald-600 max-w-3xl mx-auto">Trusted by thousands of satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                role: "Business Owner",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                review: "The entire process was seamless. I got the funds I needed within hours of applying. Highly recommended!",
                rating: 5
              },
              {
                name: "Priya Sharma",
                role: "Software Engineer",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                review: "Competitive rates and excellent customer service. Made my debt consolidation so much easier.",
                rating: 5
              },
              {
                name: "Amit Patel",
                role: "Doctor",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                review: "Transparent terms and quick disbursal. This is how financial services should work in the digital age.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-emerald-100">
                <div className="flex items-center mb-6">
                  <img className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200" src={testimonial.avatar} alt={testimonial.name} />
                  <div className="ml-4">
                    <h4 className="font-bold text-emerald-800">{testimonial.name}</h4>
                    <p className="text-emerald-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`w-5 h-5 inline ${i < testimonial.rating ? 'text-emerald-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-emerald-600 italic">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-emerald-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-emerald-600 max-w-3xl mx-auto">Get answers to common questions about our loan services</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                question: "What are the eligibility criteria for a loan?",
                answer: "To be eligible, you must be between 21-65 years old, have a minimum monthly income of ₹25,000, and have a credit score of 650 or above. Salaried and self-employed individuals can apply."
              },
              {
                question: "How long does the approval process take?",
                answer: "Most applications receive instant approval. In some cases where additional verification is needed, it may take up to 2 business days."
              },
              {
                question: "What documents do I need to apply?",
                answer: "You'll need identity proof (Aadhaar/PAN/Passport), address proof, income proof (salary slips/bank statements), and 2 passport-size photographs."
              },
              {
                question: "Can I prepay my loan?",
                answer: "Yes, you can prepay your loan after 6 months of disbursement. A nominal prepayment charge of 2% will apply for prepayment within 12 months."
              },
              {
                question: "What happens if I miss an EMI payment?",
                answer: "We provide a 15-day grace period with a late fee of 2% per month on the overdue amount. Repeated defaults may affect your credit score."
              },
              {
                question: "Is there any processing fee?",
                answer: "We charge a processing fee of 1.5% of the loan amount or ₹2,500, whichever is lower. This is deducted from the disbursed amount."
              }
            ].map((faq, index) => (
              <div key={index} className="mb-6 border border-emerald-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div 
                  className="bg-emerald-50 p-5 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-semibold text-emerald-800">
                    {faq.question}
                  </h3>
                  <svg 
                    className={`w-5 h-5 text-emerald-600 transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                {activeFaq === index && (
                  <div className="p-5 bg-white">
                    <p className="text-emerald-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-emerald-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Financial Future?</h2>
            <p className="text-xl text-emerald-200 mb-10 max-w-3xl mx-auto">Join thousands of satisfied customers who've achieved their goals with our premium loan services.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="px-10 py-4 border-2 border-transparent text-lg font-medium rounded-full text-emerald-800 bg-emerald-300 hover:bg-emerald-200 shadow-lg transform transition hover:scale-105">
                Contact Our Advisors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;