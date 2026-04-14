import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../stores'
import { authAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { auth, googleProvider } from '../../lib/firebase'
import { signInWithPopup } from 'firebase/auth'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.login(data)
      setAuth(res.data.user, res.data.token, res.data.refreshToken)
      toast.success(`Welcome back, ${res.data.user.name}! 👋`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      
      const res = await authAPI.googleLogin({
        firebaseData: {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          picture: result.user.photoURL
        }
      })
      
      setAuth(res.data.user, res.data.token, res.data.refreshToken)
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || err.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: -200, right: -200,
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: -200, left: -200,
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Left side - branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.04) 100%)',
        borderRight: '1px solid var(--border)'
      }} className="desktop-only">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, textDecoration: 'none' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24 }}>Resume AI</span>
        </Link>

        <h2 style={{ fontSize: 40, fontFamily: 'var(--font-display)', lineHeight: 1.2, marginBottom: 20 }}>
          Your career journey<br /><span className="gradient-text">starts here</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 380, marginBottom: 40 }}>
          Join thousands of professionals who've built interview-winning resumes powered by AI.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            '✅ ATS score analyzer with real-time feedback',
            '✅ 10+ professional resume templates',
            '✅ AI-powered content suggestions',
            '✅ Job fit analysis & keyword matching'
          ].map(item => (
            <div key={item} style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right side - form */}
      <div style={{
        width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '40px', position: 'relative'
      }}>
        <div className="animate-slide-up">
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>
            ← Back to home
          </Link>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign up free</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none'
                }} />
                <input
                  {...register('email')}
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  style={{ paddingLeft: 40 }}
                  id="login-email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--primary-light)' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none'
                }} />
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  id="login-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer'
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}
              id="login-submit"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="animate-spin">◌</span> Signing in...
                </span>
              ) : (
                <><ArrowRight size={18} /> Sign In</>
              )}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', gap: 10 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            id="google-login-btn"
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
