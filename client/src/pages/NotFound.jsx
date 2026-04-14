import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', textAlign: 'center', padding: 24 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 120, fontWeight: 900, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 400 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Sparkles size={18} /> Go Home
        </Link>
      </div>
    </div>
  )
}
