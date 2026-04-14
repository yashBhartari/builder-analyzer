import { Link } from 'react-router-dom'
import { useThemeStore, useAuthStore } from '../../stores'
import { Sun, Moon, Sparkles, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore()
  const { isAuthenticated } = useAuthStore()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15,14,26,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>
            Resume<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={toggleTheme}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bg-elevated)', border: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-2)', cursor: 'pointer', transition: 'var(--transition)',
              flexShrink: 0
            }}
            title="Toggle theme"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm" style={{ borderRadius: 999 }}>
              Dashboard <ArrowRight size={13} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ borderRadius: 999 }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ borderRadius: 999 }}>
                Get Started <ArrowRight size={13} />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
