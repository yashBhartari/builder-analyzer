import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { templateAPI, resumeAPI } from '../lib/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'
import { Crown, Layers, Zap, Star, Eye, X } from 'lucide-react'

const categoryColors = {
  professional: '#2563eb', creative: '#7c3aed', 'ats-friendly': '#059669',
  academic: '#92400e', minimal: '#9ca3af', modern: '#0ea5e9'
}

const categoryIcons = {
  professional: '👔', creative: '🎨', 'ats-friendly': '🤖',
  academic: '📚', minimal: '✨', modern: '⚡'
}

import ResumePreviewPanel from '../components/builder/ResumePreviewPanel'

const dummyResume = {
  personalInfo: {
    firstName: 'Christopher',
    lastName: 'Carter',
    jobTitle: 'Accountant',
    email: 'chris.carter@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Boston, MA',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  summary: 'Experienced and detail-oriented accountant with a strong background in financial reporting, auditing, and tax preparation. Proven ability to streamline processes, improve accuracy, and reduce costs. Adept at managing large volumes of financial data and ensuring compliance with all regulatory requirements.',
  experience: [
    {
      company: 'Global Finance Inc.',
      position: 'Senior Accountant',
      startDate: 'Jan 2018',
      endDate: 'Present',
      description: '• Managed end-to-end financial reporting processes.\n• Reduced quarterly closing time by 20% through workflow optimization.\n• Overseen a team of 4 junior accountants and analysts.',
    },
    {
      company: 'Tech Solutions LLC',
      position: 'Accountant',
      startDate: 'Feb 2015',
      endDate: 'Dec 2017',
      description: '• Handled daily bookkeeping and bank reconciliations.\n• Prepared monthly, quarterly, and annual financial statements.',
    }
  ],
  education: [
    {
      institution: 'University of Massachusetts',
      degree: 'Master of Science',
      field: 'Accounting',
      startDate: '2013',
      endDate: '2015',
    },
    {
      institution: 'Boston College',
      degree: 'Bachelor of Science',
      field: 'Finance',
      startDate: '2009',
      endDate: '2013',
    }
  ],
  skills: [
    { category: 'Core Skills', items: ['Financial Analysis', 'Auditing', 'Tax Preparation', 'Reconciliation', 'Reporting'] }
  ],
  languages: [
    { name: 'English', proficiency: 'native' },
    { name: 'Spanish', proficiency: 'conversational' }
  ],
  certifications: [
    { name: 'Certified Public Accountant (CPA)', issuer: 'AICPA', date: '2016' }
  ]
}

export default function Templates() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewingTemplate, setViewingTemplate] = useState(null)
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templateAPI.getAll().then(r => r.data.data)
  })

  const handleUseTemplate = async (template) => {
    try {
      const res = await resumeAPI.create({
        title: `${template.name} Resume`,
        templateId: template.category + '-1'
      })
      navigate(`/builder/${res.data.data._id}`)
      toast.success(`Using ${template.name} template!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create resume')
    }
  }

  if (isLoading) return <LoadingSpinner text="Loading templates..." />

  const categories = [...new Set((templates || []).map(t => t.category))]

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>
          Resume <span className="gradient-text">Templates</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Choose from {templates?.length || 10}+ professionally designed templates for every industry and career level.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {['all', ...categories].map(cat => (
          <button key={cat} className="badge"
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px', fontSize: 13, cursor: 'pointer', border: 'none',
              background: cat === activeCategory ? 'var(--primary)' : 'var(--bg-elevated)',
              color: cat === activeCategory ? 'white' : 'var(--text-secondary)'
            }}
          >
            {cat === 'all' ? '🌟 All' : `${categoryIcons[cat] || '📄'} ${cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}`}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {(templates || []).filter(t => activeCategory === 'all' || t.category === activeCategory).map((template) => {
          const color = categoryColors[template.category] || '#7c3aed'
          return (
            <div key={template._id || template.name} className="card"
              style={{ padding: 0, overflow: 'hidden', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = `${color}40` }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '' }}
            >
              <div style={{ height: 320, background: `linear-gradient(135deg, ${color}15, ${color}05)`, borderBottom: '1px solid var(--border)', position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 20, overflow: 'hidden' }}>
                <div style={{
                  width: '210mm', height: '297mm',
                  transform: 'scale(0.24)', transformOrigin: 'top center',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  pointerEvents: 'none',
                  borderRadius: 12,
                  background: 'white'
                }}>
                  <ResumePreviewPanel resume={{ ...dummyResume, templateId: template.category + '-1', theme: template.defaultTheme }} />
                </div>
              </div>

              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>{template.name}</h3>
                  <span className="badge" style={{ fontSize: 10, background: `${color}15`, color, flexShrink: 0, marginLeft: 8 }}>
                    {categoryIcons[template.category]} {template.category}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>{template.description}</p>

                {template.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                    {template.tags.map(tag => (
                      <span key={tag} className="tag-chip" style={{ fontSize: 11 }}>#{tag}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setViewingTemplate(template)}
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="btn btn-primary"
                    style={{ flex: 1.5, justifyContent: 'center' }}
                  >
                    <Layers size={14} /> Use Template
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {viewingTemplate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-start',
          backdropFilter: 'blur(8px)',
          overflowY: 'auto',
          padding: '40px 0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '210mm', marginBottom: 24 }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: 24, fontFamily: 'var(--font-display)' }}>Preview: {viewingTemplate.name}</h2>
            <button 
              onClick={() => setViewingTemplate(null)}
              style={{ background: 'white', color: 'black', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
          
          <div style={{ 
            width: '210mm',
            minHeight: '297mm',
            background: 'white',
            boxShadow: '0 30px 100px rgba(0,0,0,1)',
            borderRadius: 8,
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <ResumePreviewPanel resume={{ ...dummyResume, templateId: viewingTemplate.category + '-1', theme: viewingTemplate.defaultTheme }} />
          </div>
          
          <div style={{ marginTop: 32, marginBottom: 40, flexShrink: 0 }}>
            <button
              onClick={() => {
                handleUseTemplate(viewingTemplate)
                setViewingTemplate(null)
              }}
              className="btn btn-primary"
              style={{ padding: '14px 40px', fontSize: 16, borderRadius: 100, boxShadow: '0 10px 30px rgba(124,58,237,0.4)' }}
            >
              <Layers size={18} /> Start Building with {viewingTemplate.name}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
