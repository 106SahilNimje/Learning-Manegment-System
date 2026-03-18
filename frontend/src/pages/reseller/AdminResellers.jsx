import { useState, useEffect } from 'react';
import { resellerApi } from '../../utils/resellerApi';
import { Building2, Users, BookOpen, DollarSign, Plus, ToggleLeft, ToggleRight, Eye, ChevronDown, ChevronUp, PieChart, TrendingUp, AlertCircle, Search } from 'lucide-react';

const AdminResellers = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedOrg, setExpandedOrg] = useState(null);
  const [commissionReport, setCommissionReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', ownerName: '', ownerEmail: '', ownerPassword: '',
    commissionRate: 20, contactEmail: '', contactPhone: '', gstNumber: '', description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgsRes, reportRes] = await Promise.all([
        resellerApi.getOrganizations(),
        resellerApi.getCommissionReport(),
      ]);
      setOrganizations(orgsRes.data || []);
      setCommissionReport(reportRes.data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await resellerApi.createOrganization(formData);
      setShowForm(false);
      setFormData({ name: '', ownerName: '', ownerEmail: '', ownerPassword: '', commissionRate: 20, contactEmail: '', contactPhone: '', gstNumber: '', description: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      await resellerApi.toggleOrganization(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Reseller Management
            </h1>
            <p className="text-gray-500 mt-1">Manage all reseller organizations on the platform</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200"
          >
            <Plus className="w-5 h-5" /> Create Reseller
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">×</button>
          </div>
        )}

        {/* Platform Stats */}
        {commissionReport && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Revenue', value: `₹${commissionReport.platformTotals?.totalGross?.toLocaleString() || 0}`, icon: TrendingUp, color: 'emerald', bg: 'from-emerald-500 to-teal-500' },
              { label: 'Platform Earnings', value: `₹${commissionReport.platformTotals?.totalPlatformEarnings?.toLocaleString() || 0}`, icon: DollarSign, color: 'indigo', bg: 'from-indigo-500 to-purple-500' },
              { label: 'Reseller Payouts', value: `₹${commissionReport.platformTotals?.totalResellerPayouts?.toLocaleString() || 0}`, icon: PieChart, color: 'amber', bg: 'from-amber-500 to-orange-500' },
              { label: 'Total Resellers', value: organizations.length, icon: Building2, color: 'blue', bg: 'from-blue-500 to-cyan-500' },
            ].map((stat, i) => (
              <div key={i} className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.bg} opacity-10 rounded-bl-full`}></div>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.bg} mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 animate-in slide-in-from-top">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Reseller Organization</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { name: 'name', label: 'Organization Name', required: true },
                { name: 'ownerName', label: 'Owner Full Name', required: true },
                { name: 'ownerEmail', label: 'Owner Email', type: 'email', required: true },
                { name: 'ownerPassword', label: 'Owner Password', type: 'password', required: true },
                { name: 'commissionRate', label: 'Commission Rate (%)', type: 'number' },
                { name: 'contactPhone', label: 'Contact Phone' },
                { name: 'gstNumber', label: 'GST Number' },
                { name: 'contactEmail', label: 'Contact Email', type: 'email' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    value={formData[field.name]}
                    onChange={e => setFormData({ ...formData, [field.name]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                    required={field.required}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" rows="3" />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition">Cancel</button>
                <button type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">Create Organization</button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search resellers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white" />
          </div>
        </div>

        {/* Organizations List */}
        <div className="space-y-4">
          {filteredOrgs.map(org => (
            <div key={org.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: org.brandColor || '#6366f1' }}>
                  {org.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{org.name}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${org.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {org.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{org.owner?.email} · Commission: {org.commissionRate}%</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {org._count?.catalogMappings || 0}</div>
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {org._count?.students || 0}</div>
                  <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {org._count?.orders || 0}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(org.id)}
                    className={`p-2 rounded-lg transition ${org.isActive ? 'hover:bg-red-50 text-red-500' : 'hover:bg-emerald-50 text-emerald-500'}`}>
                    {org.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                  <button onClick={() => setExpandedOrg(expandedOrg === org.id ? null : org.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
                    {expandedOrg === org.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {expandedOrg === org.id && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-gray-500">Slug:</span> <span className="font-medium text-gray-700">{org.slug}</span></div>
                    <div><span className="text-gray-500">GST:</span> <span className="font-medium text-gray-700">{org.gstNumber || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-700">{org.contactPhone || 'N/A'}</span></div>
                    <div><span className="text-gray-500">Owner:</span> <span className="font-medium text-gray-700">{org.owner?.name}</span></div>
                  </div>
                  {org.description && <p className="mt-3 text-sm text-gray-600">{org.description}</p>}
                </div>
              )}
            </div>
          ))}
          {filteredOrgs.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No resellers found. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminResellers;
