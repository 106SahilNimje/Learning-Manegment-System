import { useState } from 'react';
import { HelpCircle, MessageSquare, Mail, Phone, ChevronDown, ChevronUp, Search, BookOpen, CreditCard, Award, Settings, ExternalLink } from 'lucide-react';

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      category: 'Courses',
      icon: BookOpen,
      color: 'text-blue-500',
      questions: [
        { q: 'How do I enroll in a course?', a: 'Browse our course catalog, select a course, and click "Enroll Now". After completing the payment, the course will appear in your Dashboard under "My Courses".' },
        { q: 'Can I access course content after completion?', a: 'Yes! Once enrolled, you have lifetime access to the course materials. You can revisit any lesson at any time even after completing the course.' },
        { q: 'How do I track my progress?', a: 'Your progress is automatically tracked as you complete lessons. Visit your Dashboard to see the progress bar for each enrolled course.' },
      ]
    },
    {
      category: 'Payments & Refunds',
      icon: CreditCard,
      color: 'text-green-500',
      questions: [
        { q: 'What payment methods are accepted?', a: 'We accept UPI (Google Pay, PhonePe, Paytm), Debit Cards, Credit Cards, and Net Banking through our secure Razorpay payment gateway.' },
        { q: 'Can I get a refund?', a: 'Yes, we offer a 7-day refund policy. If you are not satisfied with a course, contact our support team within 7 days of purchase for a full refund.' },
        { q: 'Where can I find my payment receipt?', a: 'Go to your profile → Payment History. You can download PDF invoices for all successful transactions.' },
      ]
    },
    {
      category: 'Certificates',
      icon: Award,
      color: 'text-yellow-500',
      questions: [
        { q: 'How do I get my certificate?', a: 'Complete all modules and lessons in a course. Once 100% complete, a "Get Certificate" button will appear in the course sidebar. Click it to generate your certificate.' },
        { q: 'Are the certificates valid?', a: 'Our certificates include a unique credential ID that can be verified online. They are recognized by many employers and can be added to your LinkedIn profile.' },
        { q: 'Can I download my certificate?', a: 'Yes, go to your profile → My Certificates. You can download certificates as PDF files or preview them directly.' },
      ]
    },
    {
      category: 'Account & Settings',
      icon: Settings,
      color: 'text-gray-500',
      questions: [
        { q: 'How do I update my profile?', a: 'Go to your profile → Personal Details. Click "Edit Profile" to update your information like name, phone, address, education details etc.' },
        { q: 'How do I change my password?', a: 'Go to Settings → Security section. Enter your current password and new password to update it.' },
        { q: 'How do I delete my account?', a: 'Contact our support team at support@lmslearn.com to request account deletion. Your data will be removed within 30 days.' },
      ]
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               f.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : faqs;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setContactForm({ subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const toggleFaq = (key) => {
    setOpenFaq(openFaq === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-500 mt-2">Find answers to your questions or contact us</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <a href="mailto:support@lmslearn.com" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition group text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Email Us</h3>
            <p className="text-xs text-gray-500 mt-1">support@lmslearn.com</p>
          </a>
          <a href="tel:+911234567890" className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition group text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Call Us</h3>
            <p className="text-xs text-gray-500 mt-1">+91 12345 67890</p>
          </a>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition group text-center cursor-pointer">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Live Chat</h3>
            <p className="text-xs text-gray-500 mt-1">Mon-Sat, 9AM-6PM</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {filteredFaqs.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center gap-2 mb-3">
                  <cat.icon className={`h-5 w-5 ${cat.color}`} />
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{cat.category}</h3>
                </div>
                <div className="space-y-2">
                  {cat.questions.map((faq, idx) => {
                    const key = `${cat.category}-${idx}`;
                    return (
                      <div key={key} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                        <button
                          onClick={() => toggleFaq(key)}
                          className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition"
                        >
                          <span className="font-medium text-gray-800 text-sm pr-4">{faq.q}</span>
                          {openFaq === key
                            ? <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            : <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          }
                        </button>
                        {openFaq === key && (
                          <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3"
                            style={{ animation: 'fadeInUp 0.2s ease-out' }}
                          >
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No results found for "{searchQuery}"</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Still need help? Send us a message</h2>
            <p className="text-xs text-gray-500 mt-1">We typically respond within 24 hours</p>
          </div>

          {submitted ? (
            <div className="p-8 text-center" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent! ✅</h3>
              <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="payment">Payment Issue</option>
                  <option value="course">Course Content</option>
                  <option value="certificate">Certificate Issue</option>
                  <option value="account">Account Problem</option>
                  <option value="refund">Refund Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required rows={4} placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none placeholder:text-gray-300"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition shadow-sm"
              >
                <Mail className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
