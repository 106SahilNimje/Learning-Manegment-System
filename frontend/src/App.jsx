import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import CoursePlayer from './pages/CoursePlayer';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Certificates from './pages/Certificates';
import SettingsPage from './pages/Settings';
import Help from './pages/Help';

// Reseller Pages
import ResellerLogin from './pages/reseller/ResellerLogin';
import AdminResellers from './pages/reseller/AdminResellers';
import ResellerDashboard from './pages/reseller/ResellerDashboard';
import ResellerCatalog from './pages/reseller/ResellerCatalog';
import ResellerOrders from './pages/reseller/ResellerOrders';
import ResellerWallet from './pages/reseller/ResellerWallet';
import ResellerStudents from './pages/reseller/ResellerStudents';
import Storefront from './pages/reseller/Storefront';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn/:courseId" element={<CoursePlayer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<Help />} />

            {/* Admin — Reseller Management */}
            <Route path="/admin/resellers" element={<AdminResellers />} />

            {/* Reseller Routes */}
            <Route path="/reseller/login" element={<ResellerLogin />} />
            <Route path="/reseller/dashboard" element={<ResellerDashboard />} />
            <Route path="/reseller/catalog" element={<ResellerCatalog />} />
            <Route path="/reseller/orders" element={<ResellerOrders />} />
            <Route path="/reseller/wallet" element={<ResellerWallet />} />
            <Route path="/reseller/students" element={<ResellerStudents />} />

            {/* Public Storefront */}
            <Route path="/store/:slug" element={<Storefront />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


