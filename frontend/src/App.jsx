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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

