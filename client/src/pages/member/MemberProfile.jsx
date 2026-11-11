import React, { useState } from 'react';
import { User, Lock, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function MemberProfile() {
  const { user, changePassword, updateProfile } = useAuth();

  const [phone, setPhone] = useState(user?.phone || '');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContact?.phone || '');

  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('emergencyContact[name]', emergencyName);
      formData.append('emergencyContact[phone]', emergencyPhone);

      await updateProfile(formData);
      setProfileMsg('Contact information updated.');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    setPwdError('');

    if (newPassword !== confirmPassword) {
      return setPwdError('New passwords do not match.');
    }
    if (newPassword.length < 6) {
      return setPwdError('New password must be at least 6 characters long.');
    }

    setPwdLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwdMsg('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Password update failed.');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="pb-4 border-b border-gym-border">
        <h1 className="text-2xl font-bold text-gym-text">Athlete Profile & Security</h1>
        <p className="text-xs text-gym-muted mt-0.5">
          Manage your personal membership contact numbers and update your login password
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <Card title="Contact Information" subtitle="Your gym contact record">
          {profileMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-3 py-2 bg-gym-surfaceLight border border-gym-border rounded-lg text-xs text-gym-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-gym-surfaceLight border border-gym-border rounded-lg text-xs text-gym-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>

            <div className="pt-2 border-t border-gym-border space-y-3">
              <span className="text-[11px] uppercase font-semibold text-gym-muted block">Emergency Contact</span>
              <div>
                <label className="block text-[10px] text-gym-muted mb-0.5">Guardian / Relative Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gym-muted mb-0.5">Emergency Phone</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" loading={profileLoading} className="w-full">
              Save Contact Details
            </Button>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card title="Update Password" subtitle="Keep your athlete account secure">
          {pwdMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              {pwdMsg}
            </div>
          )}
          {pwdError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {pwdError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Current Password *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>

            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">New Password (min 6 chars) *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>

            <div>
              <label className="block uppercase text-gym-muted font-semibold mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gym-bg border border-gym-border rounded-lg text-xs text-gym-text"
              />
            </div>

            <Button type="submit" variant="primary" loading={pwdLoading} className="w-full">
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

