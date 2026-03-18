import { useState, useEffect } from 'react';
import { resellerApi } from '../../utils/resellerApi';
import { BookOpen, Plus, Trash2, Edit3, Check, X, DollarSign, Eye, EyeOff, Search, Package } from 'lucide-react';

const ResellerCatalog = () => {
  const [catalog, setCatalog] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvailable, setShowAvailable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ customTitle: '', customPrice: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const res = await resellerApi.getMyCatalog();
      setCatalog(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailable = async () => {
    try {
      const res = await resellerApi.getAvailableCourses();
      // Filter out already-mapped courses
      const mappedIds = catalog.map(c => c.courseId);
      setAvailableCourses((res.data || []).filter(c => !mappedIds.includes(c.id)));
      setShowAvailable(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (courseId) => {
    try {
      await resellerApi.addToCatalog({ courseId });
      setShowAvailable(false);
      loadCatalog();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (mappingId) => {
    if (!confirm('Remove this course from your catalog?')) return;
    try {
      await resellerApi.removeCatalogItem(mappingId);
      loadCatalog();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (mappingId) => {
    try {
      await resellerApi.updateCatalogItem(mappingId, {
        customTitle: editData.customTitle || undefined,
        customPrice: editData.customPrice ? parseFloat(editData.customPrice) : undefined,
      });
      setEditingId(null);
      loadCatalog();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (mappingId, currentState) => {
    try {
      await resellerApi.updateCatalogItem(mappingId, { isActive: !currentState });
      loadCatalog();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredCatalog = catalog.filter(item =>
    (item.customTitle || item.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Course Catalog
            </h1>
            <p className="text-gray-500 mt-1">{catalog.length} courses in your catalog</p>
          </div>
          <button onClick={loadAvailable}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" /> Add Courses
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search catalog..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white" />
        </div>

        {/* Available courses modal */}
        {showAvailable && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAvailable(false)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[70vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Available LMS Courses</h2>
                <button onClick={() => setShowAvailable(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              </div>
              {availableCourses.length === 0 ? (
                <p className="text-center text-gray-500 py-8">All courses already in your catalog!</p>
              ) : (
                <div className="space-y-3">
                  {availableCourses.map(course => (
                    <div key={course.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} className="w-16 h-12 object-cover rounded-lg" alt="" />
                      ) : (
                        <div className="w-16 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{course.title}</h3>
                        <p className="text-sm text-gray-500">₹{course.price} · {course.category || 'General'}</p>
                      </div>
                      <button onClick={() => handleAdd(course.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-purple-100 to-pink-100">
                {item.course?.thumbnail ? (
                  <img src={item.course.thumbnail} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="w-12 h-12 text-purple-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${item.isActive ? 'bg-emerald-100/90 text-emerald-700' : 'bg-red-100/90 text-red-700'}`}>
                    {item.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {editingId === item.id ? (
                  <div className="space-y-3">
                    <input type="text" value={editData.customTitle} onChange={e => setEditData({ ...editData, customTitle: e.target.value })}
                      placeholder="Custom title" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    <input type="number" value={editData.customPrice} onChange={e => setEditData({ ...editData, customPrice: e.target.value })}
                      placeholder="Custom price" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(item.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-1">
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-900 mb-1 truncate">{item.customTitle || item.course?.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{item.course?.category || 'General'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        <span className="text-lg font-bold text-gray-900">₹{item.customPrice ?? item.course?.price}</span>
                        {item.customPrice && item.customPrice !== item.course?.price && (
                          <span className="text-xs text-gray-400 line-through ml-1">₹{item.course?.price}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => { setEditingId(item.id); setEditData({ customTitle: item.customTitle || '', customPrice: item.customPrice || '' }); }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => handleToggleActive(item.id, item.isActive)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600">
                        {item.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleRemove(item.id)}
                        className="flex items-center justify-center px-3 py-2 text-sm border border-red-200 rounded-lg hover:bg-red-50 transition text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {filteredCatalog.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No courses in your catalog yet</p>
            <p className="text-gray-400 mt-1">Click "Add Courses" to start building your storefront</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResellerCatalog;
