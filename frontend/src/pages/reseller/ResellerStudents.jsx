import { useState, useEffect } from 'react';
import { resellerApi } from '../../utils/resellerApi';
import { Users, Plus, Mail, User, Search, X } from 'lucide-react';

const ResellerStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ studentName: '', studentEmail: '' });

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try { const res = await resellerApi.getMyStudents(); setStudents(res.data || []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await resellerApi.addStudent(formData);
      setFormData({ studentName: '', studentEmail: '' });
      setShowForm(false);
      loadStudents();
    } catch (err) { alert(err.message); }
  };

  const filtered = students.filter(s =>
    (s.studentName + s.studentEmail).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">My Students</h1>
            <p className="text-gray-500 mt-1">{students.length} enrolled students</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
            <Plus className="w-5 h-5" /> Add Student
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add Student</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required value={formData.studentEmail} onChange={e => setFormData({...formData, studentEmail: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">Add Student</button>
              </form>
            </div>
          </div>
        )}

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {s.studentName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{s.studentName}</p>
                  <p className="text-sm text-gray-500 truncate flex items-center gap-1"><Mail className="w-3 h-3" /> {s.studentEmail}</p>
                  <p className="text-xs text-gray-400 mt-1">Joined {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16"><Users className="w-16 h-16 text-gray-300 mx-auto mb-4"/><p className="text-gray-500 text-lg">No students yet</p></div>
        )}
      </div>
    </div>
  );
};

export default ResellerStudents;
