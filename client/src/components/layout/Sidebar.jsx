import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import { authAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, FileText, BarChart2, Layers, User, LogOut,
  Sparkles, Crown, Settings, Shield, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/builder', icon: FileText, label: 'Resume Builder' },
  { to: '/analyzer', icon: BarChart2, label: 'AI Analyzer' },
  { to: '/templates', icon: Layers, label: 'Templates' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch {}
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <Link to="/" className="sidebar-logo">
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Sparkles size={18} color="white" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>Resume AI</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -2 }}>Builder & Analyzer</div>
        </div>
      </Link>

      {/* User Card */}
      <div className="sidebar-user-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              {user?.role === 'admin' ? (
                <span className="badge badge-error" style={{ fontSize: 10, padding: '2px 6px' }}>
                  <Shield size={9} /> Admin
                </span>
              ) : (
                <span className="badge" style={{ fontSize: 10, padding: '2px 6px', background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Pro Member</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, padding: '0 8px', marginBottom: 4 }}>
          Navigation
        </div>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="nav-item"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 8,
              fontSize: 14, fontWeight: isActive ? 600 : 500,
              transition: 'var(--transition)',
              background: isActive ? 'var(--bg-elevated)' : 'transparent',
              color: isActive ? 'var(--text-1)' : 'var(--text-2)',
              border: isActive ? '1px solid var(--line)' : '1px solid transparent',
              textDecoration: 'none'
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
              </>
            )}
          </NavLink>
        ))}

        {isAdmin() && (
          <>
            <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, padding: '0 8px', marginBottom: 4 }}>
              Admin
            </div>
            <NavLink
              to="/admin"
              className="nav-item"
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 'var(--radius)',
                fontSize: 14, fontWeight: 500,
                background: isActive ? 'rgba(239,68,68,0.1)' : 'transparent',
                color: isActive ? 'var(--error)' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(239,68,68,0.2)' : '1px solid transparent',
                textDecoration: 'none', transition: 'var(--transition)'
              })}
            >
              <Shield size={16} />
              <span>Admin Panel</span>
            </NavLink>
          </>
        )}
      </nav>



      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '9px 10px', borderRadius: 8,
          fontSize: 14, fontWeight: 500, color: 'var(--text-2)',
          transition: 'var(--transition)', width: '100%',
          background: 'transparent', border: '1px solid transparent', cursor: 'pointer'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(248,113,113,0.08)'
          e.currentTarget.style.color = 'var(--red)'
          e.currentTarget.style.borderColor = 'rgba(248,113,113,0.15)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-2)'
          e.currentTarget.style.borderColor = 'transparent'
        }}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </aside>
  )
}
