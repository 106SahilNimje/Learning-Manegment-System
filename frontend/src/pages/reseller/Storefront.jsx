import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resellerApi } from '../../utils/resellerApi';
import { BookOpen, ShoppingCart, Star, Tag, AlertCircle, CheckCircle } from 'lucide-react';

const Storefront = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(null);
  const [buyForm, setBuyForm] = useState({ studentName: '', studentEmail: '', studentPassword: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => { loadStore(); }, [slug]);

  const loadStore = async () => {
    try { const res = await resellerApi.getStorefront(slug); setData(res.data); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      const orderRes = await resellerApi.createStorefrontOrder(slug, {
        catalogId: purchasing.catalogId,
        ...buyForm,
      });
      const od = orderRes.data;
      // Razorpay checkout
      const options = {
        key: od.razorpayKeyId,
        amount: od.amount,
        currency: od.currency,
        name: data.organization.name,
        description: od.courseName,
        order_id: od.razorpayOrderId,
        handler: async function (response) {
          try {
            await resellerApi.verifyStorefrontPayment(response);
            setSuccess('Payment successful! You are now enrolled. Check your email for login details.');
            setPurchasing(null);
          } catch (err) { setError(err.message); }
        },
        prefill: { name: buyForm.studentName, email: buyForm.studentEmail },
        theme: { color: data.organization.brandColor || '#6366f1' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
  if (error && !data) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" /><p className="text-red-500 text-lg">{error}</p></div></div>;

  const org = data?.organization;
  const courses = data?.courses || [];

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${org?.brandColor || '#6366f1'}08, white, ${org?.brandColor || '#6366f1'}05)` }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-16" style={{ background: `linear-gradient(135deg, ${org?.brandColor || '#6366f1'}, ${org?.brandColor || '#6366f1'}dd)` }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRoLTEydjJoMTJ2LTJ6bTAtNGgtMTJ2MmgxMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          {org?.logoUrl && <img src={org.logoUrl} alt="" className="w-16 h-16 mx-auto mb-4 rounded-xl" />}
          <h1 className="text-4xl font-bold mb-3">{org?.name}</h1>
          {org?.description && <p className="text-lg opacity-80 max-w-2xl mx-auto">{org.description}</p>}
          <p className="mt-4 opacity-60">{courses.length} courses available</p>
        </div>
      </div>

      {success && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> {success}
          </div>
        </div>
      )}

      {/* Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course.catalogId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full"><BookOpen className="w-16 h-16 text-gray-300" /></div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {course.category || 'General'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: org?.brandColor || '#6366f1' }}>₹{course.price?.toLocaleString()}</span>
                  <button onClick={() => setPurchasing(course)}
                    className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm"
                    style={{ background: `linear-gradient(135deg, ${org?.brandColor || '#6366f1'}, ${org?.brandColor || '#6366f1'}cc)` }}>
                    <ShoppingCart className="w-4 h-4" /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase modal */}
      {purchasing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setPurchasing(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">Purchase Course</h2>
            <p className="text-gray-500 mb-6">{purchasing.title} — ₹{purchasing.price}</p>
            <form onSubmit={handlePurchase} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" required value={buyForm.studentName} onChange={e => setBuyForm({...buyForm, studentName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" required value={buyForm.studentEmail} onChange={e => setBuyForm({...buyForm, studentEmail: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Password (for LMS login)</label><input type="password" required value={buyForm.studentPassword} onChange={e => setBuyForm({...buyForm, studentPassword: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
              <button type="submit" className="w-full py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                style={{ background: `linear-gradient(135deg, ${org?.brandColor || '#6366f1'}, ${org?.brandColor || '#6366f1'}cc)` }}>
                Proceed to Pay ₹{purchasing.price}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storefront;
