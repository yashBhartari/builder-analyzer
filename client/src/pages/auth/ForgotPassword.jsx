import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, Send } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
      toast.success('Reset email sent! Check your inbox.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="animate-slide-up">
        <div className="card" style={{ padding: '40px' }}>
          {!sent ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Mail size={24} style={{ color: 'var(--primary-light)' }} />
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>Reset Password</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required id="forgot-email" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading} id="forgot-submit">
                  {loading ? 'Sending...' : <><Send size={16} /> Send Reset Link</>}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Check Your Email</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
                We've sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.
              </p>
              <button onClick={() => setSent(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Resend Email
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
