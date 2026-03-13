import { useState } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Calendar, Camera, Save, Edit3 } from 'lucide-react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user.name || 'Test User',
    email: user.email || 'test@example.com',
    phone: user.phone || '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    education: '',
    college: '',
    bio: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // In real app, call API to update profile
    const updatedUser = { ...user, name: form.name, email: form.email, phone: form.phone };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const userInitial = (form.name || 'S').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-lg">
                {userInitial}
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-primary-600 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{form.name}</h1>
              <p className="text-primary-100 mt-1">{form.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-sm rounded-full font-medium">
                <BookOpen className="h-3.5 w-3.5 inline mr-1" /> Student
              </span>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-sm flex items-center gap-2"
            style={{ animation: 'fadeInUp 0.3s ease-out' }}
          >
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                isEditing
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1.5 text-gray-400" />Full Name
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1.5 text-gray-400" />Email Address
                </label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1.5 text-gray-400" />Phone Number
                </label>
                <input
                  type="tel" name="phone" value={form.phone} onChange={handleChange}
                  disabled={!isEditing} placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition placeholder:text-gray-300"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1.5 text-gray-400" />Date of Birth
                </label>
                <input
                  type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="gender" value={form.gender} onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <BookOpen className="h-4 w-4 inline mr-1.5 text-gray-400" />Highest Education
                </label>
                <select
                  name="education" value={form.education} onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition"
                >
                  <option value="">Select Education</option>
                  <option value="10th">10th Pass</option>
                  <option value="12th">12th Pass</option>
                  <option value="graduate">Graduate</option>
                  <option value="post-graduate">Post Graduate</option>
                  <option value="diploma">Diploma</option>
                </select>
              </div>

              {/* College */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">College / University</label>
                <input
                  type="text" name="college" value={form.college} onChange={handleChange}
                  disabled={!isEditing} placeholder="Enter your college or university name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition placeholder:text-gray-300"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1.5 text-gray-400" />Address
                </label>
                <input
                  type="text" name="address" value={form.address} onChange={handleChange}
                  disabled={!isEditing} placeholder="Enter your full address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition placeholder:text-gray-300"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text" name="city" value={form.city} onChange={handleChange}
                  disabled={!isEditing} placeholder="Enter city"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition placeholder:text-gray-300"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text" name="state" value={form.state} onChange={handleChange}
                  disabled={!isEditing} placeholder="Enter state"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition placeholder:text-gray-300"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">PIN Code</label>
                <input
                  type="text" name="pincode" value={form.pincode} onChange={handleChange}
                  disabled={!isEditing} placeholder="6-digit PIN"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition placeholder:text-gray-300"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Me</label>
                <textarea
                  name="bio" value={form.bio} onChange={handleChange}
                  disabled={!isEditing} rows={3} placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition resize-none placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-sm transition shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
