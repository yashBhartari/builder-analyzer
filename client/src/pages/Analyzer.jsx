import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { analyzerAPI } from '../lib/api'
import toast from 'react-hot-toast'
import { Upload, FileText, Zap, BarChart2, Clipboard, X, CheckCircle, Info } from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Analyzer() {
  const [file, setFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('upload') // 'upload' or 'paste'
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) {
        toast.error('File rejected. Please upload PDF or DOCX under 5MB.')
        return
      }
      if (accepted.length > 0) {
        setFile(accepted[0])
        toast.success(`${accepted[0].name} ready for analysis!`)
      }
    }
  })

  const handleAnalyze = async () => {
    if (tab === 'upload' && !file) {
      return toast.error('Please upload a resume file first')
    }
    if (tab === 'paste' && resumeText.trim().length < 50) {
      return toast.error('Please paste your resume text (minimum 50 characters)')
    }

    setLoading(true)
    try {
      const formData = new FormData()
      if (tab === 'upload' && file) formData.append('resume', file)
      if (tab === 'paste') formData.append('resumeText', resumeText)
      if (jobDescription) formData.append('jobDescription', jobDescription)
      if (jobTitle) formData.append('jobTitle', jobTitle)

      toast.loading('🤖 AI is analyzing your resume...', { id: 'analyze' })
      const res = await analyzerAPI.analyze(formData)
      toast.success('Analysis complete!', { id: 'analyze' })
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      navigate(`/analyzer/${res.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.', { id: 'analyze' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>
          AI Resume <span className="gradient-text">Analyzer</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Get an instant ATS score, keyword analysis, and actionable improvement suggestions powered by AI.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Upload/Paste */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} style={{ color: 'var(--primary-light)' }} /> Your Resume
            </h3>

            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 10, padding: 4, marginBottom: 16 }}>
              {[{ id: 'upload', label: 'Upload File' }, { id: 'paste', label: 'Paste Text' }].map(({ id, label }) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{
                    flex: 1, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: tab === id ? 'var(--bg-card)' : 'transparent',
                    color: tab === id ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: tab === id ? 600 : 400, fontSize: 13,
                    boxShadow: tab === id ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >{label}</button>
              ))}
            </div>

            {tab === 'upload' ? (
              <div>
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  style={{
                    border: `2px dashed ${isDragActive ? 'var(--primary)' : file ? 'var(--success)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)', padding: '32px 20px', textAlign: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: isDragActive ? 'rgba(124,58,237,0.05)' : file ? 'rgba(16,185,129,0.04)' : 'var(--bg-elevated)'
                  }}
                >
                  <input {...getInputProps()} id="resume-upload-input" />
                  {file ? (
                    <div>
                      <CheckCircle size={32} style={{ color: 'var(--success)', margin: '0 auto 10px' }} />
                      <p style={{ fontWeight: 600, color: 'var(--success)' }}>{file.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                        {(file.size / 1024).toFixed(0)} KB • {file.type.includes('pdf') ? 'PDF' : 'Word Document'}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null) }}
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 12 }}
                      >
                        <X size={12} /> Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={28} style={{ color: isDragActive ? 'var(--primary)' : 'var(--text-muted)', margin: '0 auto 12px' }} />
                      <p style={{ fontWeight: 600, color: isDragActive ? 'var(--primary-light)' : 'var(--text-secondary)' }}>
                        {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                        or click to browse • PDF, DOCX • Max 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="form-input"
                style={{ minHeight: 200, fontSize: 12, resize: 'vertical' }}
                placeholder="Paste your full resume text here...&#10;&#10;Include all sections: contact info, summary, work experience, education, skills, etc."
                id="resume-text-input"
              />
            )}
          </div>
        </div>

        {/* Right: Job Description */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clipboard size={16} style={{ color: '#06b6d4' }} /> Job Description
              <span className="badge badge-info" style={{ fontSize: 10 }}>Optional</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 16 }}>
              Add the JD for a personalized match score and keyword gap analysis
            </p>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Job Title</label>
              <input
                className="form-input"
                placeholder="e.g. Senior Software Engineer"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                style={{ fontSize: 13 }}
                id="job-title-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Description Text</label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                className="form-input"
                style={{ minHeight: 160, fontSize: 12, resize: 'vertical' }}
                placeholder="Paste the full job description here...&#10;&#10;Include requirements, responsibilities, and skills needed."
                id="job-desc-input"
              />
            </div>
          </div>

          {/* Info box */}
          <div style={{
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 20,
            display: 'flex', gap: 10
          }}>
            <Info size={16} style={{ color: 'var(--info)', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>How it works:</strong> Our AI analyzes your resume for ATS compatibility,
              keyword density, section completeness, readability, and job fit. Results appear in ~10 seconds.
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }}
            id="analyze-btn"
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="animate-spin">◌</span> Analyzing...
              </span>
            ) : (
              <><Zap size={18} /> Analyze My Resume</>
            )}
          </button>
        </div>
      </div>

      {/* All analyses */}
      <RecentAnalyses />
    </div>
  )
}

function RecentAnalyses() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: () => analyzerAPI.getAll({ limit: 6 }).then(r => r.data.data)
  })

  if (isLoading || !data?.length) return null

  return (
    <div style={{ marginTop: 40 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>Recent Analyses</h3>
      <div className="grid-3">
        {data.map((analysis) => {
          const score = analysis.scores?.overall || 0
          const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--info)' : score >= 40 ? 'var(--warning)' : 'var(--error)'
          return (
            <div key={analysis._id} className="card" style={{ cursor: 'pointer', padding: '16px' }}
              onClick={() => navigate(`/analyzer/${analysis._id}`)}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, flex: 1, paddingRight: 8 }}>
                  {analysis.resumeFileName || analysis.jobTitle || 'Resume Analysis'}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color }}>{score}</div>
              </div>
              <div className="progress-bar" style={{ marginBottom: 8 }}>
                <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date(analysis.createdAt).toLocaleDateString()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
