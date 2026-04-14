import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useResumeStore, useAuthStore } from '../stores'
import { resumeAPI } from '../lib/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ResumeEditorPanel from '../components/builder/ResumeEditorPanel'
import ResumePreviewPanel from '../components/builder/ResumePreviewPanel'
import BuilderToolbar from '../components/builder/BuilderToolbar'

export default function ResumeBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentResume, setCurrentResume, isDirty, setIsSaving } = useResumeStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('personalInfo')
  const [previewMode, setPreviewMode] = useState(false)
  const saveTimeoutRef = useRef(null)
  const fetchedIdRef = useRef(null)

  // Load resume
  useEffect(() => {
    const currentId = id || 'NEW'
    if (fetchedIdRef.current === currentId) return
    fetchedIdRef.current = currentId

    const loadResume = async () => {
      if (!id) {
        // Create new resume
        try {
          const res = await resumeAPI.create({ title: 'Untitled Resume' })
          const newResume = res.data.data
          setCurrentResume(newResume)
          navigate(`/builder/${newResume._id}`, { replace: true })
        } catch (err) {
          toast.error(err.response?.data?.message || 'Cannot create resume')
          navigate('/dashboard')
        }
      } else {
        try {
          const res = await resumeAPI.getById(id)
          setCurrentResume(res.data.data)
        } catch {
          toast.error('Resume not found')
          navigate('/dashboard')
        }
      }
      setLoading(false)
    }
    loadResume()
  }, [id])

  // Auto-save
  useEffect(() => {
    if (!isDirty || !currentResume?._id) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        await resumeAPI.update(currentResume._id, currentResume)
        useResumeStore.getState().setIsDirty(false)
      } catch {
        toast.error('Auto-save failed')
      } finally {
        setIsSaving(false)
      }
    }, 2000)
    return () => clearTimeout(saveTimeoutRef.current)
  }, [isDirty, currentResume])

  if (loading) return <LoadingSpinner fullscreen text="Loading resume builder..." />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Toolbar */}
      <BuilderToolbar
        resume={currentResume}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        activeSection={activeSection}
      />

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Editor panel */}
        {!previewMode && (
          <div style={{
            width: 380, borderRight: '1px solid var(--border)',
            background: 'var(--bg-secondary)', overflowY: 'auto',
            flexShrink: 0
          }}>
            <ResumeEditorPanel
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>
        )}

        {/* Preview panel */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#374151', display: 'flex', justifyContent: 'center', padding: '32px 24px' }}>
          <ResumePreviewPanel resume={currentResume} />
        </div>
      </div>
    </div>
  )
}
