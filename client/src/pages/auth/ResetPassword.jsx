import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return toast.error("Passwords don't match")
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await authAPI.resetPassword({ token, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
        <h2>Invalid Reset Link</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>This reset link is invalid or has expired.</p>
        <Link to="/forgot-password" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>Request New Link</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="card" style={{ padding: '40px' }}>
          {!success ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Lock size={24} style={{ color: 'var(--primary-light)' }} />
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>Create New Password</h1>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 40 }} id="reset-password" />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-input" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required id="reset-confirm" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading} id="reset-submit">
                  {loading ? 'Resetting...' : <><Lock size={16} /> Reset Password</>}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle size={48} style={{ color: 'var(--success)', margin: '0 auto 16px', display: 'block' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Password Reset!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Redirecting you to login in 3 seconds...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
