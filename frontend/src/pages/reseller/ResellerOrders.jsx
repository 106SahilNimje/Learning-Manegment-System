import { useState, useEffect } from 'react';
import { resellerApi } from '../../utils/resellerApi';
import { ShoppingCart, Check, Clock, XCircle, User, Search } from 'lucide-react';

const ResellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await resellerApi.getMyOrders();
      setOrders(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const statusBadge = {
    SUCCESS: { icon: Check, cls: 'bg-emerald-100 text-emerald-700' },
    PENDING: { icon: Clock, cls: 'bg-amber-100 text-amber-700' },
    FAILED:  { icon: XCircle, cls: 'bg-red-100 text-red-700' },
  };

  const filtered = orders.filter(o =>
    (o.student?.name + o.student?.email + o.catalogMapping?.course?.title)
      .toLowerCase().includes(searchTerm.toLowerCase())
  );
  const successOrders = orders.filter(o => o.status === 'SUCCESS');
  const totalRev = successOrders.reduce((s,o) => s + o.amountPaid, 0);
  const totalEarn = successOrders.reduce((s,o) => s + o.resellerEarnings, 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Orders & Sales</h1>
        <p className="text-gray-500 mb-8">{orders.length} total orders</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            { l: 'Total Revenue', v: `₹${totalRev.toLocaleString()}` },
            { l: 'Your Earnings', v: `₹${totalEarn.toLocaleString()}`, cls: 'text-emerald-600' },
            { l: 'Successful Sales', v: successOrders.length },
          ].map((s,i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm text-gray-500">{s.l}</p>
              <p className={`text-2xl font-bold ${s.cls || 'text-gray-900'}`}>{s.v}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search orders..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Student','Course','Amount','Your Share','Status','Date'].map(h =>
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                )}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => {
                  const sb = statusBadge[o.status] || statusBadge.PENDING;
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-gray-400"/></div><div><p className="font-medium text-sm">{o.student?.name}</p><p className="text-xs text-gray-500">{o.student?.email}</p></div></div></td>
                      <td className="px-6 py-4 text-sm">{o.catalogMapping?.course?.title}</td>
                      <td className="px-6 py-4 text-sm font-medium">₹{o.amountPaid?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-600">₹{o.resellerEarnings?.toLocaleString()}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sb.cls}`}><sb.icon className="w-3 h-3"/>{o.status}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-12"><ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3"/><p className="text-gray-500">No orders yet</p></div>}
        </div>
      </div>
    </div>
  );
};

export default ResellerOrders;
