import { useState, useEffect } from 'react';
import { resellerApi } from '../../utils/resellerApi';
import { LayoutDashboard, BookOpen, Users, Wallet, ShoppingCart, TrendingUp, ArrowUpRight, Building2, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResellerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await resellerApi.getMyDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-red-500 text-lg">{error}</p>
        <p className="text-gray-400 mt-2">Make sure you are logged in as a Reseller Admin.</p>
      </div>
    </div>
  );

  const org = data?.organization;
  const stats = data?.stats;

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, gradient: 'from-blue-500 to-cyan-500', link: '/reseller/students' },
    { label: 'Active Courses', value: stats?.totalCourses || 0, icon: BookOpen, gradient: 'from-purple-500 to-pink-500', link: '/reseller/catalog' },
    { label: 'Completed Sales', value: stats?.totalOrders || 0, icon: ShoppingCart, gradient: 'from-emerald-500 to-teal-500', link: '/reseller/orders' },
    { label: 'Net Earnings', value: `₹${(stats?.totalEarnings || 0).toLocaleString()}`, icon: Wallet, gradient: 'from-amber-500 to-orange-500', link: '/reseller/wallet' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: org?.brandColor || '#ffffff30' }}>
                {org?.name?.charAt(0)?.toUpperCase() || 'R'}
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                {org?.subscriptionStatus || 'Active'}
              </span>
            </div>
            <h1 className="text-3xl font-bold mt-3">Welcome back, {org?.name}</h1>
            <p className="text-indigo-200 mt-1">Your storefront slug: <span className="font-mono bg-white/10 px-2 py-0.5 rounded">{org?.slug}</span></p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((stat, i) => (
            <Link key={i} to={stat.link}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full group-hover:opacity-20 transition`}></div>
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-500" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Manage Catalog', to: '/reseller/catalog', icon: BookOpen, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
              { label: 'View Orders', to: '/reseller/orders', icon: ShoppingCart, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
              { label: 'My Students', to: '/reseller/students', icon: Users, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
              { label: 'Wallet', to: '/reseller/wallet', icon: Wallet, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
            ].map((action, i) => (
              <Link key={i} to={action.to} className={`flex flex-col items-center gap-2 p-4 rounded-xl font-medium text-sm transition ${action.color}`}>
                <action.icon className="w-6 h-6" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-gray-500 font-medium">Total Revenue</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Gross from all course sales</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-gray-500 font-medium">Your Earnings</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">₹{(stats?.totalEarnings || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">After platform commission deduction</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-500 font-medium">Platform Fee Paid</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{(stats?.totalPlatformFee || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Commission paid to platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ResellerDashboard;
