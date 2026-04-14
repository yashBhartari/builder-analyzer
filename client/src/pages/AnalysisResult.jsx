import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { analyzerAPI } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ScoreRing from '../components/ui/ScoreRing'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis
} from 'recharts'
import {
  CheckCircle, XCircle, AlertTriangle, ArrowLeft, Lightbulb, Target,
  Zap, BarChart2, Tag, RefreshCw, Trash2, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#7c3aed', '#06b6d4']

const getScoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#3b82f6' : s >= 40 ? '#f59e0b' : '#ef4444'
const getScoreLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Needs Work' : 'Poor'

export default function AnalysisResult() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => analyzerAPI.getById(id).then(r => r.data.data)
  })

  const handleDelete = async () => {
    if (!confirm('Delete this analysis?')) return
    try {
      await analyzerAPI.delete(id)
      toast.success('Analysis deleted')
      navigate('/analyzer')
    } catch {
      toast.error('Delete failed')
    }
  }

  if (isLoading) return <LoadingSpinner text="Loading analysis..." />
  if (isError) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ color: 'var(--error)' }}>Analysis not found</p>
      <button onClick={() => navigate('/analyzer')} className="btn btn-primary" style={{ marginTop: 16 }}>Go Back</button>
    </div>
  )

  const { scores = {}, strengths = [], weaknesses = [], suggestions = [], keywords = {}, skillsAnalysis = {}, sectionAnalysis = {}, rewrites = [] } = data

  const radarData = [
    { subject: 'ATS', value: scores.ats || 0 },
    { subject: 'Keywords', value: scores.keywordMatch || 0 },
    { subject: 'Readability', value: scores.readability || 0 },
    { subject: 'Formatting', value: scores.formatting || 0 },
    { subject: 'Achievements', value: scores.quantifiableAchievements || 0 },
    { subject: 'Job Fit', value: scores.jobFit || 0 }
  ]

  const barData = [
    { name: 'ATS', score: scores.ats || 0 },
    { name: 'Keywords', score: scores.keywordMatch || 0 },
    { name: 'Readability', score: scores.readability || 0 },
    { name: 'Formatting', score: scores.formatting || 0 },
    { name: 'Achievements', score: scores.quantifiableAchievements || 0 },
    { name: 'Job Fit', score: scores.jobFit || 0 }
  ]

  const keywordPieData = [
    { name: 'Matched', value: (keywords.matched || []).length },
    { name: 'Missing', value: (keywords.missing || []).length }
  ]

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/analyzer')} className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 2 }}>
              {data.resumeFileName || data.jobTitle || 'Resume Analysis'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {new Date(data.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {data.aiModel && ` • Analyzed by ${data.aiModel}`}
              {data.processingTime && ` • ${(data.processingTime / 1000).toFixed(1)}s`}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/analyzer')} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> New Analysis
          </button>
          <button onClick={handleDelete} className="btn btn-danger btn-sm">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Top scores row */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', flex: '0 0 auto' }}>
          <ScoreRing score={scores.overall || 0} size={140} label="Overall Score" />
          <div className="badge" style={{
            marginTop: 12, fontSize: 13,
            background: `${getScoreColor(scores.overall || 0)}20`,
            color: getScoreColor(scores.overall || 0)
          }}>
            {getScoreLabel(scores.overall || 0)}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="grid-2" style={{ height: '100%' }}>
            {[
              { label: 'ATS Score', key: 'ats', desc: 'Applicant Tracking System compatibility' },
              { label: 'Keyword Match', key: 'keywordMatch', desc: 'Job description keyword alignment' },
              { label: 'Readability', key: 'readability', desc: 'Writing clarity and structure' },
              { label: 'Job Fit', key: 'jobFit', desc: 'Overall match to target role' }
            ].map(({ label, key, desc }) => {
              const val = scores[key] || 0
              const color = getScoreColor(val)
              return (
                <div key={key} className="card card-elevated" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color }}>{val}</div>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: 6 }}>
                    <div className="progress-fill" style={{ width: `${val}%`, background: color }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Radar chart */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16 }}>Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Keyword pie */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16 }}>Keyword Coverage</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={keywordPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                  {keywordPieData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                <span style={{ fontSize: 13 }}><strong style={{ color: '#10b981' }}>{(keywords.matched || []).length}</strong> keywords matched</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
                <span style={{ fontSize: 13 }}><strong style={{ color: '#ef4444' }}>{(keywords.missing || []).length}</strong> keywords missing</span>
              </div>
              {(keywords.missing || []).length > 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                  Add missing keywords to improve your ATS score
                </p>
              )}
            </div>
          </div>

          {/* Missing keywords */}
          {(keywords.missing || []).length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>MISSING KEYWORDS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(keywords.missing || []).slice(0, 10).map((kw, i) => (
                  <span key={i} className="tag-chip missing">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} style={{ color: 'var(--success)' }} /> Strengths
          </h3>
          {strengths.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s}</span>
            </div>
          ))}
          {strengths.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No major strengths identified. Add more content to your resume.</p>}
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <XCircle size={16} style={{ color: 'var(--error)' }} /> Areas to Improve
          </h3>
          {weaknesses.map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <AlertTriangle size={14} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{w}</span>
            </div>
          ))}
          {weaknesses.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Great! No major weaknesses found.</p>}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={16} style={{ color: 'var(--accent)' }} /> Actionable Suggestions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {suggestions.map((sug, i) => {
              const pColor = sug.priority === 'high' ? 'var(--error)' : sug.priority === 'medium' ? 'var(--warning)' : 'var(--success)'
              return (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{
                    width: 6, borderRadius: 3, background: pColor, flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span className="badge" style={{ fontSize: 11, background: `${pColor}15`, color: pColor }}>
                        {sug.priority?.toUpperCase()}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{sug.category}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--text-primary)', marginBottom: sug.example ? 8 : 0 }}>{sug.text}</p>
                    {sug.example && (
                      <div style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '8px 12px', borderLeft: '3px solid var(--primary)', fontSize: 12, color: 'var(--text-secondary)' }}>
                        💡 {sug.example}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Skills gap */}
      {(skillsAnalysis.missing || []).length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={16} style={{ color: 'var(--info)' }} /> Skills Gap Analysis
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { title: 'Present', items: skillsAnalysis.present || [], color: 'var(--success)' },
              { title: 'Missing', items: skillsAnalysis.missing || [], color: 'var(--error)' },
              { title: 'Recommended', items: skillsAnalysis.recommended || [], color: 'var(--warning)' }
            ].map(({ title, items, color }) => (
              <div key={title}>
                <div style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {items.slice(0, 8).map((s, i) => (
                    <span key={i} className="tag-chip" style={{
                      background: `${color}10`, borderColor: `${color}30`, color
                    }}>{s}</span>
                  ))}
                  {items.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>None</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section completeness */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart2 size={16} style={{ color: 'var(--primary-light)' }} /> Section Completeness
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Contact Info', key: 'hasContactInfo' },
            { label: 'Summary', key: 'hasSummary' },
            { label: 'Experience', key: 'hasExperience' },
            { label: 'Education', key: 'hasEducation' },
            { label: 'Skills', key: 'hasSkills' },
            { label: 'Projects', key: 'hasProjects' },
            { label: 'Certifications', key: 'hasCertifications' }
          ].map(({ label, key }) => (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 12px', background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius)', border: '1px solid var(--border)'
            }}>
              {sectionAnalysis[key]
                ? <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                : <XCircle size={14} style={{ color: 'var(--error)', flexShrink: 0 }} />
              }
              <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Rewrites */}
      {rewrites?.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} style={{ color: 'var(--accent)' }} /> AI-Suggested Rewrites
          </h3>
          {rewrites.map((r, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-light)', textTransform: 'uppercase', marginBottom: 8 }}>
                {r.section}
              </div>
              {r.original && (
                <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--error)', fontWeight: 600 }}>Before: </span>{r.original}
                </div>
              )}
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Suggested: </span>{r.suggested}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
