import { useState } from 'react';
import { Bell, Lock, Globe, Moon, Eye, EyeOff, Shield, Save, Smartphone } from 'lucide-react';

const SettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    promotionalEmails: false,
    certificateAlerts: true,
    language: 'en',
    theme: 'light',
    twoFactor: false,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPasswords({ current: '', newPass: '', confirmPass: '' });
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary-600' : 'bg-gray-300'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account preferences</p>
        </div>

        {/* Success Toast */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium text-sm"
            style={{ animation: 'fadeInUp 0.3s ease-out' }}
          >
            ✅ Settings saved successfully!
          </div>
        )}

        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><Bell className="h-5 w-5 text-blue-600" /></div>
              <div>
                <h2 className="font-bold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-500">Choose what notifications you receive</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Email Notifications</p>
                  <p className="text-xs text-gray-400">Receive important emails about your account</p>
                </div>
                <ToggleSwitch enabled={settings.emailNotifications} onToggle={() => handleToggle('emailNotifications')} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Course Updates</p>
                  <p className="text-xs text-gray-400">Get notified when enrolled courses are updated</p>
                </div>
                <ToggleSwitch enabled={settings.courseUpdates} onToggle={() => handleToggle('courseUpdates')} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Promotional Emails</p>
                  <p className="text-xs text-gray-400">Receive offers and deals on new courses</p>
                </div>
                <ToggleSwitch enabled={settings.promotionalEmails} onToggle={() => handleToggle('promotionalEmails')} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Certificate Alerts</p>
                  <p className="text-xs text-gray-400">Get notified when a certificate is ready</p>
                </div>
                <ToggleSwitch enabled={settings.certificateAlerts} onToggle={() => handleToggle('certificateAlerts')} />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Moon className="h-5 w-5 text-purple-600" /></div>
              <div>
                <h2 className="font-bold text-gray-900">Appearance & Language</h2>
                <p className="text-xs text-gray-500">Customize your experience</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Theme</p>
                  <p className="text-xs text-gray-400">Choose between light and dark mode</p>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="light">☀️ Light</option>
                  <option value="dark">🌙 Dark</option>
                  <option value="system">💻 System</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Language</p>
                  <p className="text-xs text-gray-400">Select your preferred language</p>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 Hindi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg"><Shield className="h-5 w-5 text-red-600" /></div>
              <div>
                <h2 className="font-bold text-gray-900">Security</h2>
                <p className="text-xs text-gray-500">Manage your password and security settings</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-400">Add extra security to your account</p>
                </div>
                <ToggleSwitch enabled={settings.twoFactor} onToggle={() => handleToggle('twoFactor')} />
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                <h3 className="font-semibold text-gray-800 text-sm">Change Password</h3>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    placeholder="Current Password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                  />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="New Password"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                  />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwords.confirmPass}
                  onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  <Lock className="h-4 w-4" /> Update Password
                </button>
              </form>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-sm transition shadow-sm"
            >
              <Save className="h-4 w-4" /> Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
