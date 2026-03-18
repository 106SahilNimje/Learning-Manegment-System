import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User, CreditCard, UserCircle, Award, Settings, HelpCircle, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Get user info from localStorage safely
  let user = {};
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
  }
  const userName = user.name || 'Student';
  const userEmail = user.email || 'student@lms.com';
  const userInitial = userName.charAt(0).toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProfileOpen(false);
    navigate('/login');
  };

  // Set up menu items based on exact User Role
  let menuItems = [];
  let dashboardLink = '/dashboard';
  let dashboardLabel = 'My Dashboard';

  if (user.role === 'PLATFORM_OWNER' || user.role === 'ADMIN') {
    dashboardLink = '/admin/resellers';
    dashboardLabel = 'Admin Panel';
    menuItems = [
      { icon: UserCircle, label: 'Manage Resellers', path: '/admin/resellers', color: 'text-purple-500' },
      { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-500' },
      { icon: LogOut, label: 'Logout', path: '#', action: handleLogout, color: 'text-red-500' },
    ];
  } else if (user.role === 'RESELLER_ADMIN') {
    dashboardLink = '/reseller/dashboard';
    dashboardLabel = 'Reseller Dashboard';
    menuItems = [
      { icon: UserCircle, label: 'My Students', path: '/reseller/students', color: 'text-blue-500' },
      { icon: BookOpen, label: 'Manage Catalog', path: '/reseller/catalog', color: 'text-green-500' },
      { icon: CreditCard, label: 'My Sales (Orders)', path: '/reseller/orders', color: 'text-yellow-500' },
      { icon: Award, label: 'Wallet & Earnings', path: '/reseller/wallet', color: 'text-purple-500' },
      { icon: Settings, label: 'Store Settings', path: '/settings', color: 'text-gray-500' },
    ];
  } else {
    // Default Student Items
    menuItems = [
      { icon: UserCircle, label: 'Personal Details', path: '/profile', color: 'text-blue-500' },
      { icon: CreditCard, label: 'Payment History', path: '/payments', color: 'text-green-500' },
      { icon: Award, label: 'My Certificates', path: '/certificates', color: 'text-yellow-500' },
      { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-500' },
      { icon: HelpCircle, label: 'Help & Support', path: '/help', color: 'text-purple-500' },
    ];
  }

  // Hide navbar on reseller login page - moved after all hooks
  if (location.pathname === '/reseller/login') {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-gray-900">LMS Learn</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {(!user.role || user.role === 'STUDENT') && (
              <Link to="/courses" className="text-gray-600 hover:text-primary-600 px-3 py-2 font-medium">
                Browse Courses
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} className="text-gray-600 hover:text-primary-600 px-3 py-2 font-medium">
                  {dashboardLabel}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 font-medium">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border-2 border-gray-200 hover:border-primary-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {userInitial}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100]"
                      style={{ animation: 'fadeInUp 0.2s ease-out' }}
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {userInitial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{userName}</p>
                            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {menuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => {
                              setProfileOpen(false);
                              if (item.action) item.action();
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md font-medium transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
