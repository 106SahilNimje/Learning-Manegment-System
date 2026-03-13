import { CreditCard, Download, Search, Filter, IndianRupee, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useState } from 'react';

const Payments = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock payment data
  const payments = [
    {
      id: 'TXN-20260301-001',
      courseName: 'Complete Web Development Bootcamp',
      amount: 4999,
      date: '2026-03-01',
      method: 'UPI - Google Pay',
      status: 'success',
      razorpayId: 'pay_NxT7y8K1mPq2Gh'
    },
    {
      id: 'TXN-20260215-002',
      courseName: 'Advanced React Patterns',
      amount: 3499,
      date: '2026-02-15',
      method: 'Debit Card - ****4523',
      status: 'success',
      razorpayId: 'pay_MaR5t6J9nLo1Fk'
    },
    {
      id: 'TXN-20260210-003',
      courseName: 'Node.js Masterclass',
      amount: 2999,
      date: '2026-02-10',
      method: 'UPI - PhonePe',
      status: 'failed',
      razorpayId: 'pay_KpQ3r4H7iJm0Ds'
    },
    {
      id: 'TXN-20260128-004',
      courseName: 'Python for Data Science',
      amount: 5999,
      date: '2026-01-28',
      method: 'Net Banking - SBI',
      status: 'pending',
      razorpayId: 'pay_HjN1p2F5gHk8Bt'
    },
  ];

  const filteredPayments = filterStatus === 'all'
    ? payments
    : payments.filter(p => p.status === filterStatus);

  const totalSpent = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);

  const statusBadge = (status) => {
    const styles = {
      success: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
      failed: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <XCircle className="h-3.5 w-3.5" /> },
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <Clock className="h-3.5 w-3.5" /> },
    };
    const s = styles[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
        {s.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-500 mt-2">Track all your course payments and transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg"><IndianRupee className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg"><CreditCard className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === 'success').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2">
              {['all', 'success', 'pending', 'failed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    filterStatus === s
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-left">
                  <th className="px-5 py-3 font-semibold">Transaction ID</th>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-mono text-xs text-gray-600">{payment.id}</td>
                    <td className="px-5 py-4 font-medium text-gray-900 max-w-[200px] truncate">{payment.courseName}</td>
                    <td className="px-5 py-4 font-bold text-gray-900">₹{payment.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-500">{new Date(payment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{payment.method}</td>
                    <td className="px-5 py-4">{statusBadge(payment.status)}</td>
                    <td className="px-5 py-4">
                      {payment.status === 'success' && (
                        <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-xs">
                          <Download className="h-3.5 w-3.5" /> PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPayments.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
