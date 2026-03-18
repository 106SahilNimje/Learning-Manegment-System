import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const ResellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
      if (response.data.success) {
        const { user, token } = response.data.data;
        
        // Verify this user is an admin or reseller
        if (user.role !== 'RESELLER_ADMIN' && user.role !== 'PLATFORM_OWNER' && user.role !== 'ADMIN') {
          alert('Access denied. This portal is for Resellers and Admins only.');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on role
        if (user.role === 'PLATFORM_OWNER' || user.role === 'ADMIN') {
            window.location.href = '/admin/resellers';
        } else {
            window.location.href = '/reseller/dashboard';
        }
      }
    } catch (error) {
      alert(error.response?.data?.error?.message || error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors"
        >
          &larr; Back to Student Login
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Partner Portal</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Secure access for Resellers & Admins</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="partner@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 border focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                {loading ? 'Authenticating...' : <><ShieldCheck className="w-5 h-5 mr-2" /> Secure Sign In</>}
              </button>
            </div>
            <div className="text-center pt-4 border-t border-gray-100">
               <p className="text-sm text-gray-500 bg-emerald-50 text-emerald-700 p-2 rounded-lg">
                  <strong>Demo Accounts:</strong><br/>
                  Admin: <code className="font-bold">admin@lms.com</code> (pass: password123)<br/>
                  Reseller: <code className="font-bold">reseller@lms.com</code> (pass: password123)
               </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResellerLogin;
