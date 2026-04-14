import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '../../stores'
import { resumeAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Save, Eye, EyeOff, Download, Share2, Clock, Sparkles,
  History, MoreHorizontal, Wand2, FileDown
} from 'lucide-react'

export default function BuilderToolbar({ resume, previewMode, setPreviewMode }) {
  const { isDirty, isSaving } = useResumeStore()
  const navigate = useNavigate()

  const handleSave = async () => {
    if (!resume?._id) return
    useResumeStore.getState().setIsSaving(true)
    try {
      await resumeAPI.update(resume._id, resume)
      useResumeStore.getState().setIsDirty(false)
      toast.success('Resume saved!')
    } catch {
      toast.error('Save failed')
    } finally {
      useResumeStore.getState().setIsSaving(false)
    }
  }

  const handleShare = async () => {
    if (!resume?._id) return
    try {
      const res = await resumeAPI.share(resume._id)
      await navigator.clipboard.writeText(res.data.shareUrl)
      toast.success('Share link copied to clipboard!')
    } catch {
      toast.error('Could not generate share link')
    }
  }

  const handleExport = () => {
    // Trigger PDF export via browser print
    const previewFrame = document.getElementById('resume-preview-content')
    if (!previewFrame) {
      toast.error('Please enable preview mode to export')
      return
    }

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>${resume?.title || 'Resume'}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
            @page { margin: 0; size: A4; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${previewFrame.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => { printWindow.print(); printWindow.close() }, 800)
    toast.success('Opening print dialog for PDF export...')
  }

  return (
    <div style={{
      height: 56, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
      flexShrink: 0, zIndex: 10
    }}>
      {/* Left: Back + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text-secondary)', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 13, padding: '6px 8px', borderRadius: 8,
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        <div>
          <input
            value={resume?.title || ''}
            onChange={async (e) => {
              useResumeStore.getState().updateSection('title', e.target.value)
            }}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontWeight: 600, fontSize: 14,
              fontFamily: 'var(--font-sans)', maxWidth: 260,
              padding: '4px 8px', borderRadius: 6, transition: 'background 0.2s'
            }}
            onFocus={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
            onBlur={e => e.currentTarget.style.background = 'none'}
            id="resume-title-input"
          />
        </div>

        {/* Save status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12 }}>
          {isSaving
            ? <><span className="animate-spin" style={{ display: 'inline-block' }}>◌</span> Saving...</>
            : isDirty
            ? <><Clock size={12} style={{ color: 'var(--warning)' }} /> Unsaved</>
            : <><Save size={12} style={{ color: 'var(--success)' }} /> Saved</>
          }
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="btn btn-secondary btn-sm"
          id="toggle-preview-btn"
        >
          {previewMode ? <><EyeOff size={14} /> Edit</> : <><Eye size={14} /> Preview</>}
        </button>
        <button onClick={handleSave} className="btn btn-secondary btn-sm" disabled={isSaving} id="save-resume-btn">
          <Save size={14} /> Save
        </button>
        <button onClick={handleShare} className="btn btn-secondary btn-sm" id="share-resume-btn">
          <Share2 size={14} /> Share
        </button>
        <button onClick={handleExport} className="btn btn-primary btn-sm" id="export-resume-btn">
          <FileDown size={14} /> Export PDF
        </button>
      </div>
    </div>
  )
}
