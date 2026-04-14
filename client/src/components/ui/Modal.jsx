import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 440, md: 600, lg: 800, xl: 1000 }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: '100%', maxWidth: sizes[size],
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border)'
        }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', cursor: 'pointer', transition: 'var(--transition)'
            }}
            onMouseEnter={e => e.target.style.background = 'var(--bg-primary)'}
            onMouseLeave={e => e.target.style.background = 'var(--bg-elevated)'}
          >
            <X size={16} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
