import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../stores'
import { authAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string()
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

const passwordRequirements = [
  { test: (p) => p.length >= 6, label: 'At least 6 characters' },
  { test: (p) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p) => /[0-9]/.test(p), label: 'One number' }
]

export default function Register() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.register({ name: data.name, email: data.email, password: data.password })
      setAuth(res.data.user, res.data.token, res.data.refreshToken)
      toast.success(`Welcome, ${res.data.user.name}! 🎉 Check your email to verify your account.`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '40px 24px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: -300, left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 600,
        background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 480 }} className="animate-slide-up">
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, textDecoration: 'none', justifyContent: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22 }}>Resume AI</span>
        </Link>

        <div className="card" style={{ padding: '36px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 6, textAlign: 'center' }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 28, fontSize: 14 }}>
            Already have one? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Log in</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input {...register('name')} type="text" className="form-input" placeholder="John Doe" style={{ paddingLeft: 40 }} id="reg-name" />
              </div>
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input {...register('email')} type="email" className="form-input" placeholder="you@example.com" style={{ paddingLeft: 40 }} id="reg-email" />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  {...register('password', { onChange: (e) => setPassword(e.target.value) })}
                  type={showPass ? 'text' : 'password'}
                  className="form-input" placeholder="Min 6 chars with uppercase + number"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  id="reg-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                  {passwordRequirements.map(({ test, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <CheckCircle size={12} style={{ color: test(password) ? 'var(--success)' : 'var(--text-muted)' }} />
                      <span style={{ color: test(password) ? 'var(--success)' : 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input {...register('confirmPassword')} type="password" className="form-input" placeholder="Repeat password" style={{ paddingLeft: 40 }} id="reg-confirm" />
              </div>
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              By creating an account you agree to our{' '}
              <span style={{ color: 'var(--primary-light)' }}>Terms of Service</span> and{' '}
              <span style={{ color: 'var(--primary-light)' }}>Privacy Policy</span>
            </p>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }}
              id="reg-submit"
            >
              {loading ? 'Creating account...' : <><Sparkles size={16} /> Create Account Free</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
