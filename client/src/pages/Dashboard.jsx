import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { userAPI, resumeAPI } from '../lib/api'
import { useAuthStore } from '../stores'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ScoreRing from '../components/ui/ScoreRing'
import {
  FileText, Plus, BarChart2, TrendingUp, Eye, Download, Clock,
  Sparkles, ArrowRight, Zap, Award, Layers, Crown, ChevronRight, Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleDeleteResume = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this resume?')) return

    try {
      await resumeAPI.delete(id)
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Resume deleted successfully')
    } catch (err) {
      toast.error('Failed to delete resume')
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => userAPI.getDashboard().then(r => r.data.data)
  })

  const handleCreateResume = async () => {
    try {
      const res = await resumeAPI.create({ title: 'Untitled Resume' })
      navigate(`/builder/${res.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create resume')
    }
  }

  if (isLoading) return <LoadingSpinner text="Loading your dashboard..." />

  const { stats = {}, recentResumes = [], recentAnalyses = [] } = data || {}

  const statCards = [
    { icon: FileText, label: 'Resumes', value: stats.resumeCount || 0, color: '#7c3aed', sublabel: 'built', to: '/builder' },
    { icon: BarChart2, label: 'Analyses', value: stats.analysisCount || 0, color: '#06b6d4', sublabel: 'run', to: '/analyzer' },
    { icon: Eye, label: 'Total Views', value: stats.totalViews || 0, color: '#f59e0b', sublabel: 'resume views', to: null },
    { icon: Zap, label: 'AI Calls', value: `${stats.aiCallsThisMonth || 0}/${stats.aiCallsLimit === -1 ? '∞' : stats.aiCallsLimit || 10}`, color: '#10b981', sublabel: 'this month', to: null }
  ]

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--line)' }}>
        <div>
          <p style={{ color: 'var(--text-2)', fontSize: 13, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, marginBottom: 0, letterSpacing: '-0.02em' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={handleCreateResume} className="btn btn-primary" id="new-resume-btn">
            <Plus size={15} /> New Resume
          </button>
          <Link to="/analyzer" className="btn btn-secondary">
            <BarChart2 size={15} /> Analyze
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {statCards.map(({ icon: Icon, label, value, color, sublabel, to }, i) => (
          <div key={label} className="card"
            style={{
              cursor: to ? 'pointer' : 'default',
              padding: '20px',
              animationDelay: `${i * 0.06}s`
            }}
            onClick={() => to && navigate(to)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: `${color}14`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              {to && <ChevronRight size={14} style={{ color: 'var(--text-3)' }} />}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text-1)', marginBottom: 2, letterSpacing: '-0.02em' }}>
              {value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)' }}>
              {label} <span style={{ color: 'var(--text-3)' }}>{sublabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Recent Resumes */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} style={{ color: 'var(--primary-light)' }} /> Recent Resumes
            </h3>
            <Link to="/builder" style={{ fontSize: 13, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentResumes.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <FileText size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No resumes yet</p>
              <button onClick={handleCreateResume} className="btn btn-primary btn-sm" id="create-first-resume">
                <Plus size={14} /> Create Your First Resume
              </button>
            </div>
          ) : (
            <div>
              {recentResumes.map((resume) => (
                <div key={resume._id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px', borderBottom: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => navigate(`/builder/${resume._id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FileText size={16} color="white" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{resume.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={11} />
                        {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                      <Eye size={12} /> {resume.views || 0}
                    </div>
                    <button
                      onClick={(e) => handleDeleteResume(e, resume._id)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        padding: 6, borderRadius: 'var(--radius-full)', color: 'var(--error)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      title="Delete Resume"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)', marginLeft: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Analyses */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart2 size={16} style={{ color: '#06b6d4' }} /> AI Analyses
            </h3>
            <Link to="/analyzer" style={{ fontSize: 13, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Analyze <ArrowRight size={12} />
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <BarChart2 size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>No analyses yet</p>
              <Link to="/analyzer" className="btn btn-primary btn-sm">
                <Zap size={14} /> Analyze Now
              </Link>
            </div>
          ) : (
            <div>
              {recentAnalyses.map((analysis) => {
                const score = analysis.scores?.overall || 0
                const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'
                return (
                  <div key={analysis._id}
                    style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => navigate(`/analyzer/${analysis._id}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{analysis.resumeFileName || analysis.jobTitle || 'Resume Analysis'}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color }}>{score}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1, height: 4 }}>
                        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>Quick Actions</h3>
        <div className="grid-3">
          {[
            { icon: Plus, label: 'New Resume', desc: 'Start from scratch or use a template', action: handleCreateResume, color: '#7c3aed' },
            { icon: BarChart2, label: 'Analyze Resume', desc: 'Upload a PDF and get an ATS score', link: '/analyzer', color: '#06b6d4' },
            { icon: Layers, label: 'Browse Templates', desc: 'Explore 10+ professional templates', link: '/templates', color: '#f59e0b' }
          ].map(({ icon: Icon, label, desc, action, link, color }) => (
            <div key={label}
              className="card"
              style={{ cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'flex-start' }}
              onClick={() => action ? action() : navigate(link)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = '' }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
