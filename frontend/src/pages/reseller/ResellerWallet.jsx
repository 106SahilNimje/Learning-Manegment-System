import { useState, useEffect } from 'react';
import { resellerApi } from '../../utils/resellerApi';
import { Wallet, TrendingUp, ArrowDownLeft, Receipt } from 'lucide-react';

const ResellerWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadWallet(); }, []);

  const loadWallet = async () => {
    try {
      const res = await resellerApi.getMyWallet();
      setWallet(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;

  const s = wallet?.summary || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">Wallet & Earnings</h1>
        <p className="text-gray-500 mb-8">Your commission and revenue breakdown</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {[
            { l:'Gross Revenue', v:`₹${(s.totalGross||0).toLocaleString()}`, icon: TrendingUp, g:'from-emerald-500 to-teal-500' },
            { l:'Net Earnings', v:`₹${(s.totalNet||0).toLocaleString()}`, icon: Wallet, g:'from-amber-500 to-orange-500' },
            { l:'Platform Fee', v:`₹${(s.totalPlatformFee||0).toLocaleString()}`, icon: ArrowDownLeft, g:'from-red-400 to-pink-500' },
            { l:'GST Collected', v:`₹${(s.totalGst||0).toLocaleString()}`, icon: Receipt, g:'from-blue-500 to-indigo-500' },
          ].map((c,i) => (
            <div key={i} className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${c.g} opacity-10 rounded-bl-full`}></div>
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${c.g} mb-3`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-gray-500">{c.l}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{c.v}</p>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-500">{s.totalTransactions || 0} total entries</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>
                {['Description','Gross','Platform Fee','GST','Net Earnings','Date'].map(h =>
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                )}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {(wallet?.recentTransactions || []).map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm text-gray-700">{tx.description || '—'}</td>
                    <td className="px-6 py-4 text-sm font-medium">₹{tx.grossAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-red-500">-₹{tx.platformFee?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">₹{tx.gstAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{tx.netResellerEarnings?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!wallet?.recentTransactions?.length) && (
            <div className="text-center py-12"><Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3"/><p className="text-gray-500">No transactions yet</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResellerWallet;
