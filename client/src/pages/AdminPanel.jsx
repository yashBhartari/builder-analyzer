import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Users, FileText, BarChart2, Shield, Trash2, Crown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminAPI.getStats().then(r => r.data.data)
  })

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.getUsers({ limit: 20 }).then(r => r.data)
  })

  const handleUpdateRole = async (userId, role) => {
    try {
      await adminAPI.updateUser(userId, { role })
      toast.success(`Role updated to ${role}`)
      refetch()
    } catch {
      toast.error('Update failed')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user and all their data?')) return
    try {
      await adminAPI.deleteUser(userId)
      toast.success('User deleted')
      refetch()
    } catch {
      toast.error('Delete failed')
    }
  }

  if (isLoading) return <LoadingSpinner text="Loading admin panel..." />

  const stats = data ? [
    { label: 'Total Users', value: data.totalUsers, icon: Users, color: '#7c3aed' },
    { label: 'Total Resumes', value: data.totalResumes, icon: FileText, color: '#06b6d4' },
    { label: 'Total Analyses', value: data.totalAnalyses, icon: BarChart2, color: '#f59e0b' },
    { label: 'New Users (Month)', value: data.newUsersThisMonth, icon: Crown, color: '#10b981' },
    { label: 'Premium Users', value: data.premiumUsers, icon: Crown, color: '#f59e0b' }
  ] : []

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <Shield size={24} style={{ color: 'var(--error)' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>
          Admin <span style={{ color: 'var(--error)' }}>Panel</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>User Management</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)' }}>
                {['Name', 'Email', 'Role', 'Verified', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(usersData?.data || []).map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14 }}>{user.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>{user.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={user.role}
                      onChange={e => handleUpdateRole(user._id, e.target.value)}
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}
                    >
                      <option value="user">user</option>
                      <option value="premium">premium</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${user.isEmailVerified ? 'success' : 'warning'}`} style={{ fontSize: 11 }}>
                      {user.isEmailVerified ? '✓ Yes' : '✗ No'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 12 }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleDeleteUser(user._id)} className="btn btn-danger btn-sm" style={{ fontSize: 12 }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
