import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import EmpressNavbar from '../components/EmpressNavbar';
import Footer from '../components/Footer';

export default function FAQSection() {
  const faqs = [
    {
      question: "What products does Empress PC offer?",
      answer:
        "We specialize in a wide range of IT hardware and solutions, including laptops, desktops, servers, workstations, storage devices, networking equipment, and accessories for both individual and corporate needs. Our comprehensive catalog ensures we can meet all your technology requirements.",
    },
    {
      question: "Do you provide corporate IT solutions?",
      answer:
        "Yes. We cater to businesses with bulk IT hardware supply, server solutions, networking setups, and complete IT infrastructure solutions customized for corporate environments. Our team works closely with companies to design and implement scalable IT solutions.",
    },
    {
      question: "Can I buy products in bulk for my business?",
      answer:
        "Absolutely. We support bulk and B2B purchases with competitive pricing and flexible delivery options for companies, institutions, and resellers. Contact us for special corporate rates and customized bulk order solutions.",
    },
    {
      question: "What brands do you deal with?",
      answer:
        "We work with leading IT brands like HP, Dell, Lenovo, Acer, Asus, Intel, AMD, Microsoft, Cisco, and many more, ensuring genuine products with reliable performance. All our products are sourced directly from authorized distributors.",
    },
    {
      question: "Do you provide warranties and after-sales support?",
      answer:
        "Yes. All products come with manufacturer warranty. Additionally, we assist with after-sales support, warranty claim guidance, and offer AMC (Annual Maintenance Contracts) for IT hardware and networks to keep your systems running smoothly.",
    },
    {
      question: "Do you provide nationwide delivery across India?",
      answer:
        "Yes. We deliver across India with secure shipping and doorstep delivery for both individual and bulk orders. Delivery time varies based on location, typically 3-7 business days for standard orders.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept bank transfers, UPI, credit/debit cards, and company purchase orders for corporate clients. We offer flexible payment terms for bulk orders and corporate customers.",
    },
    {
      question: "How can I get a quotation for my business requirements?",
      answer:
        "Simply reach out to us via our Contact page or Request a Quote form, and our team will provide a customized quotation based on your specific requirements. We offer competitive pricing for all business needs.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    question: ''
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
    setFormData({ name: '', email: '', company: '', question: '' });
    alert('Thank you for your question! We\'ll get back to you soon.');
  };

  return (
    <>
      <EmpressNavbar />
      <section className="bg-[#FAFAFA] py-12 md:py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#212121] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl text-[#757575] max-w-2xl mx-auto leading-relaxed">
              Find answers to the most common questions about our IT hardware solutions and corporate services
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const { ref, inView } = useInView({
                    triggerOnce: true,
                    threshold: 0.15,
                  });

                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={index}
                      ref={ref}
                      className={`rounded-xl transition-all duration-300 border-2 shadow-sm hover:shadow-md ${
                        isOpen
                          ? 'border-[#E65100] bg-white shadow-lg'
                          : 'border-[#E0E0E0] bg-white hover:border-[#BDBDBD]'
                      } ${
                        inView ? 'animate-fadeUp' : 'opacity-0 translate-y-10'
                      }`}
                      style={{
                        animationDelay: inView ? `${index * 0.1}s` : '0s',
                        animationFillMode: 'both'
                      }}
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className={`w-full text-left flex justify-between items-start gap-4 px-6 py-5 font-semibold transition-colors ${
                          isOpen ? 'text-[#E65100]' : 'text-[#212121] hover:text-[#E65100]'
                        }`}
                      >
                        <span className="text-base md:text-lg leading-relaxed">
                          {faq.question}
                        </span>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isOpen 
                            ? 'border-[#E65100] bg-[#E65100] rotate-180' 
                            : 'border-[#BDBDBD] hover:border-[#E65100]'
                        }`}>
                          <svg
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isOpen ? 'text-white' : 'text-[#757575]'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 text-[#616161] text-base leading-relaxed animate-fadeIn">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ask a Question Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-[#E0E0E0] p-6 md:p-8 sticky top-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#E65100] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#212121] mb-2">
                    Need More Information?
                  </h3>
                  <p className="text-[#757575]">
                    Can't find what you're looking for? Get in touch with our expert team!
                  </p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name*"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border-2 border-[#E0E0E0] rounded-lg px-4 py-3 text-[#212121] placeholder-[#BDBDBD] focus:outline-none focus:border-[#E65100] focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email*"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border-2 border-[#E0E0E0] rounded-lg px-4 py-3 text-[#212121] placeholder-[#BDBDBD] focus:outline-none focus:border-[#E65100] focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Business/Company (Optional)"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full border-2 border-[#E0E0E0] rounded-lg px-4 py-3 text-[#212121] placeholder-[#BDBDBD] focus:outline-none focus:border-[#E65100] focus:ring-0 transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      rows="4"
                      placeholder="Your Question or Requirements..."
                      value={formData.question}
                      onChange={(e) => handleInputChange('question', e.target.value)}
                      className="w-full border-2 border-[#E0E0E0] rounded-lg px-4 py-3 text-[#212121] placeholder-[#BDBDBD] resize-none focus:outline-none focus:border-[#E65100] focus:ring-0 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#E65100] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#D84315] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Send Your Inquiry
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-[#E0E0E0]">
                  <div className="space-y-3">
                    <p className="text-sm text-[#757575] text-center">
                      📞 Call us: <span className="font-semibold text-[#E65100]">+91-88811-23433</span>
                    </p>
                    <p className="text-sm text-[#757575] text-center">
                      ✉️ Email: <span className="font-semibold text-[#E65100]">sales@empresspc.in</span>
                    </p>
                    <p className="text-sm text-[#757575] text-center">
                      ⏱️ Response time: <span className="font-semibold text-[#2E7D32]">2-4 hours</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}