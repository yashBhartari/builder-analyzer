import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { resumeAPI } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ResumePreviewPanel from '../components/builder/ResumePreviewPanel'
import { Sparkles, Eye, Download } from 'lucide-react'

export default function SharedResume() {
  const { token } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['shared-resume', token],
    queryFn: () => resumeAPI.getShared(token).then(r => r.data.data)
  })

  if (isLoading) return <LoadingSpinner fullscreen text="Loading resume..." />
  if (isError) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', textAlign: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 380, padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-display)' }}>Resume Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>This resume is private or the link has expired.</p>
      </div>
    </div>
  )

  const name = `${data.personalInfo?.firstName || ''} ${data.personalInfo?.lastName || ''}`.trim() || 'Resume'

  return (
    <div style={{ minHeight: '100vh', background: '#374151' }}>
      {/* Top bar */}
      <div style={{
        background: 'rgba(15,14,26,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={14} color="white" />
          </div>
          <div>
            <span style={{ fontWeight: 700 }}>{name}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 8 }}>• Resume AI</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Eye size={14} /> {data.views} views
          </span>
        </div>
      </div>

      {/* Resume preview */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 24px' }}>
        <ResumePreviewPanel resume={data} />
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13 }}>
        Created with <a href="/" style={{ color: 'var(--primary-light)' }}>Resume AI</a> — Build Your Professional Resume for Free
      </div>
    </div>
  )
}
