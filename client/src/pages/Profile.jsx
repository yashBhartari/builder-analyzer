import { useState } from 'react'
import { useAuthStore } from '../stores'
import { userAPI } from '../lib/api'
import toast from 'react-hot-toast'
import { User, Mail, Lock, Camera, Trash2, Save, Shield } from 'lucide-react'

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await userAPI.updateProfile({ name })
      updateUser(res.data.data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPass !== confirmPass) return toast.error("Passwords don't match")
    if (newPass.length < 6) return toast.error('Password too short')
    try {
      await userAPI.changePassword({ currentPassword: currentPass, newPassword: newPass })
      toast.success('Password changed!')
      setCurrentPass(''); setNewPass(''); setConfirmPass('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed')
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      const res = await userAPI.uploadAvatar(formData)
      updateUser({ avatar: res.data.avatar })
      toast.success('Avatar updated!')
    } catch {
      toast.error('Avatar upload failed')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This will permanently delete your account and all associated data.')) return
    try {
      await userAPI.deleteAccount()
      logout()
      toast.success('Account deleted')
    } catch {
      toast.error('Could not delete account')
    }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 700, margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 32 }}>
        My <span className="gradient-text">Profile</span>
      </h1>

      {/* Avatar + Name */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20 }}>Account Info</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: 'white', fontSize: 24, fontWeight: 800 }}>{user?.name?.charAt(0)}</span>
              }
            </div>
            <label style={{
              position: 'absolute', bottom: 0, right: 0, width: 24, height: 24,
              background: 'var(--primary)', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Camera size={12} color="white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} id="avatar-upload" />
            </label>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <span className={`badge badge-${user?.role === 'admin' ? 'error' : 'primary'}`} style={{ fontSize: 11 }}>
                <Shield size={11} /> {user?.role}
              </span>
              <span className="badge" style={{ fontSize: 11, background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                {user?.subscription?.plan || 'free'} plan
              </span>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input className="form-input" style={{ paddingLeft: 36 }} value={name} onChange={e => setName(e.target.value)} id="profile-name" />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input className="form-input" style={{ paddingLeft: 36, opacity: 0.6 }} value={user?.email} disabled />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSaveProfile} className="btn btn-primary" disabled={saving} id="save-profile-btn">
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Change password (only for non-Google users) */}
      {!user?.googleId && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={16} /> Change Password
          </h3>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { id: 'curr-pass', label: 'Current Password', val: currentPass, set: setCurrentPass },
              { id: 'new-pass', label: 'New Password', val: newPass, set: setNewPass },
              { id: 'conf-pass', label: 'Confirm New Password', val: confirmPass, set: setConfirmPass }
            ].map(({ id, label, val, set }) => (
              <div key={id} className="form-group">
                <label className="form-label">{label}</label>
                <input id={id} type="password" className="form-input" value={val} onChange={e => set(e.target.value)} required />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }} id="change-password-btn">
              <Lock size={14} /> Update Password
            </button>
          </form>
        </div>
      )}

      {/* Usage */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>Usage This Month</h3>
        <div className="grid-3">
          {[
            { label: 'Resumes', value: user?.usage?.resumesCreated || 0, limit: user?.role === 'user' ? 5 : '∞', color: '#7c3aed' },
            { label: 'Analyses', value: user?.usage?.analysesRun || 0, limit: user?.role === 'user' ? 10 : '∞', color: '#06b6d4' },
            { label: 'AI Calls', value: user?.usage?.aiCallsThisMonth || 0, limit: user?.role === 'user' ? 10 : '∞', color: '#f59e0b' }
          ].map(({ label, value, limit, color }) => (
            <div key={label} className="card card-elevated" style={{ padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color }}>
                {value}<span style={{ fontSize: 14, fontWeight: 400 }}>/{limit}</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--error)', marginBottom: 12 }}>Danger Zone</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
          Permanently delete your account and all associated data (resumes, analyses). This cannot be undone.
        </p>
        <button onClick={handleDeleteAccount} className="btn btn-danger btn-sm" id="delete-account-btn">
          <Trash2 size={14} /> Delete My Account
        </button>
      </div>
    </div>
  )
}
