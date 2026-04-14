export default function LoadingSpinner({ fullscreen, size = 'md', text }) {
  const sizes = { sm: 20, md: 36, lg: 52 }
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <svg
        width={sizes[size]}
        height={sizes[size]}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
        style={{ color: 'var(--primary)' }}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
      </svg>
      {text && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{text}</p>}
    </div>
  )

  if (fullscreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', zIndex: 1000
      }}>
        {spinner}
      </div>
    )
  }

  return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>{spinner}</div>
}
