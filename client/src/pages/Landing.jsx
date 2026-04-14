import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import {
  Sparkles, BarChart2, FileText, Layers, ArrowRight, CheckCircle,
  Star, Zap, Shield, Globe, ChevronRight, TrendingUp, Award
} from 'lucide-react'

const features = [
  {
    icon: FileText,
    color: '#7c3aed',
    title: 'AI Resume Builder',
    desc: 'Drag-and-drop editor with 10+ professional templates. AI suggests content for each section.'
  },
  {
    icon: BarChart2,
    color: '#06b6d4',
    title: 'ATS Score Analyzer',
    desc: 'Upload your resume and get an instant ATS compatibility score with detailed improvement tips.'
  },
  {
    icon: Zap,
    color: '#f59e0b',
    title: 'Job Fit Analysis',
    desc: 'Paste a job description and see how well your resume matches with keyword gap analysis.'
  },
  {
    icon: Globe,
    color: '#10b981',
    title: 'Share & Export',
    desc: 'Export to PDF/Word or share a live link. Track views and downloads in real time.'
  },
  {
    icon: Shield,
    color: '#ef4444',
    title: 'Real-time Collaboration',
    desc: 'Co-edit your resume with mentors or career coaches using live Socket.IO sessions.'
  },
  {
    icon: Layers,
    color: '#a855f7',
    title: '10+ Templates',
    desc: 'Professional, Creative, ATS-friendly, Academic — choose the perfect look for your field.'
  }
]

const stats = [
  { value: '50K+', label: 'Resumes Built' },
  { value: '94%', label: 'Interview Rate' },
  { value: '10+', label: 'Templates' },
  { value: '4.9★', label: 'User Rating' }
]

const testimonials = [
  { name: 'Priya Sharma', role: 'SDE at Google', text: 'The ATS analyzer helped me understand exactly what was missing. Got 3 calls within a week!', avatar: 'PS' },
  { name: 'Rahul Gupta', role: 'Product Manager at Amazon', text: 'Best resume tool I\'ve used. The AI suggestions are incredibly relevant and professional.', avatar: 'RG' },
  { name: 'Anjali Singh', role: 'Data Scientist at Microsoft', text: 'Went from 0% callbacks to 40% after using Resume AI. The job fit score is a game changer.', avatar: 'AS' }
]

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        padding: '80px 24px 100px',
        maxWidth: 1200, margin: '0 auto',
        textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 600,
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="animate-slide-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: 'var(--radius-pill)', padding: '5px 14px', marginBottom: 24
          }}>
            <Sparkles size={13} style={{ color: 'var(--purple-light)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple-light)', letterSpacing: '0.04em' }}>
              AI-Powered Resume Builder
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontFamily: 'var(--font-display)', fontWeight: 900,
            lineHeight: 1.05, marginBottom: 24
          }}>
            Build Resumes That<br />
            <span className="gradient-text">Land Interviews</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)',
            maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7
          }}>
            AI-powered resume builder with real-time ATS analysis, keyword optimization,
            and beautiful templates. Go from draft to interview-ready in minutes.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: 999 }}>
              <Sparkles size={17} /> Build My Resume Free
            </Link>
            <Link to="/analyzer" className="btn btn-secondary btn-lg" style={{ borderRadius: 999 }}>
              <BarChart2 size={17} /> Analyze My Resume
            </Link>
          </div>


        </div>

        {/* Hero mockup */}
        <div className="animate-float" style={{ marginTop: 60, position: 'relative' }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '20px', maxWidth: 860, margin: '0 auto',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          }}>
            {/* Fake browser bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {['#ef4444','#f59e0b','#10b981'].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
              <div style={{
                flex: 1, height: 28, background: 'var(--bg-elevated)', borderRadius: 8,
                display: 'flex', alignItems: 'center', paddingLeft: 12,
                color: 'var(--text-muted)', fontSize: 12
              }}>
                resumeai.com/builder
              </div>
            </div>

            {/* Fake UI */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
              {/* Left panel */}
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Sections</div>
                {['Personal Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'].map((s, i) => (
                  <div key={s} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                    borderRadius: 8, marginBottom: 4, cursor: 'pointer',
                    background: i === 2 ? 'rgba(124,58,237,0.15)' : 'transparent',
                    border: i === 2 ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                    color: i === 2 ? 'var(--primary-light)' : 'var(--text-secondary)',
                    fontSize: 13
                  }}>
                    <CheckCircle size={13} />
                    {s}
                  </div>
                ))}
              </div>

              {/* Resume preview */}
              <div style={{ background: 'white', borderRadius: 12, padding: 20, color: '#1f2937' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, fontFamily: 'Georgia' }}>Alex Johnson</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Senior Software Engineer</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>alex@email.com • San Francisco, CA</div>
                  </div>
                </div>
                <div style={{ height: 1, background: '#e5e7eb', margin: '12px 0' }} />
                {[{ w: '100%', h: 8 }, { w: '90%', h: 8 }, { w: '75%', h: 8 }].map((r, i) => (
                  <div key={i} style={{ width: r.w, height: r.h, background: '#f3f4f6', borderRadius: 4, marginBottom: 6 }} />
                ))}
                <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1 }}>Experience</div>
                {[{ w: '80%', h: 7 }, { w: '65%', h: 7 }, { w: '90%', h: 7 }, { w: '50%', h: 7 }].map((r, i) => (
                  <div key={i} style={{ width: r.w, height: r.h, background: i === 0 ? '#e5e7eb' : '#f9fafb', borderRadius: 4, marginBottom: 5 }} />
                ))}

                {/* ATS badge */}
                <div style={{
                  position: 'absolute', top: -8, right: -8,
                  background: 'linear-gradient(135deg,#10b981,#059669)',
                  borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 800, color: 'white',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.4)'
                }}>
                  ATS: 94%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, background: 'linear-gradient(135deg,var(--primary),var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {value}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 16 }}>
            Everything You Need to <span className="gradient-text">Get Hired</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
            A complete suite of tools to build, analyze, and optimize your resume for any job.
          </p>
        </div>

        <div className="grid-3">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="card" style={{ transition: 'all 0.3s ease' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = color + '40'
                e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}30`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: color + '18', border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
              }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 8, fontFamily: 'var(--font-display)' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 3vw, 40px)', marginBottom: 48 }}>
            Loved by <span className="gradient-text">Job Seekers</span>
          </h2>
          <div className="grid-3">
            {testimonials.map(({ name, role, text, avatar }) => (
              <div key={name} className="card card-elevated" style={{ padding: '28px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                  "{text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 13
                  }}>{avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: 16 }}>
          Ready to Land Your<br /><span className="gradient-text">Dream Job?</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 32 }}>
          Join 50,000+ professionals who've upgraded their job search with Resume AI
        </p>
        <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: 999 }}>
          <Sparkles size={18} /> Start Building for Free
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px', textAlign: 'center',
        color: 'var(--text-muted)', fontSize: 13
      }}>
        <p>© {new Date().getFullYear()} Resume AI. Built with ❤️ using the MERN Stack</p>
      </footer>
    </div>
  )
}
