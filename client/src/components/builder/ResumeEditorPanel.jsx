import { useState } from 'react'
import { useResumeStore } from '../../stores'
import { resumeAPI } from '../../lib/api'
import toast from 'react-hot-toast'
import {
  User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Languages,
  ChevronDown, ChevronUp, Plus, Trash2, Wand2, Palette, MoveVertical,
  Grip, Globe, Phone, Mail, MapPin, Camera
} from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

const sections = [
  { key: 'personalInfo', label: 'Personal Info', icon: User },
  { key: 'summary', label: 'Summary', icon: Briefcase },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'skills', label: 'Skills', icon: Code2 },
  { key: 'projects', label: 'Projects', icon: FolderGit2 },
  { key: 'certifications', label: 'Certifications', icon: Award },
  { key: 'languages', label: 'Languages', icon: Languages },
  { key: 'theme', label: 'Design & Theme', icon: Palette }
]

export default function ResumeEditorPanel({ activeSection, setActiveSection }) {
  const { currentResume, updateSection, updatePersonalInfo, updateTheme } = useResumeStore()
  const [aiLoading, setAiLoading] = useState(null)

  const generateAI = async (type, context) => {
    setAiLoading(type)
    try {
      const res = await resumeAPI.generateAIContent({ type, context })
      return res.data.content
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed')
      return null
    } finally {
      setAiLoading(null)
    }
  }

  if (!currentResume) return null

  const renderSection = () => {
    switch (activeSection) {
      case 'personalInfo': return <PersonalInfoSection resume={currentResume} updatePersonalInfo={updatePersonalInfo} />
      case 'summary': return <SummarySection resume={currentResume} updateSection={updateSection} generateAI={generateAI} aiLoading={aiLoading} />
      case 'experience': return <ExperienceSection resume={currentResume} updateSection={updateSection} generateAI={generateAI} aiLoading={aiLoading} />
      case 'education': return <EducationSection resume={currentResume} updateSection={updateSection} />
      case 'skills': return <SkillsSection resume={currentResume} updateSection={updateSection} />
      case 'projects': return <ProjectsSection resume={currentResume} updateSection={updateSection} />
      case 'certifications': return <CertificationsSection resume={currentResume} updateSection={updateSection} />
      case 'languages': return <LanguagesSection resume={currentResume} updateSection={updateSection} />
      case 'theme': return <ThemeSection resume={currentResume} updateTheme={updateTheme} />
      default: return null
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Section Navigation */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        {sections.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 16px',
              background: activeSection === key ? 'rgba(124,58,237,0.1)' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              color: activeSection === key ? 'var(--primary-light)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: activeSection === key ? 600 : 400,
              transition: 'all 0.15s', borderLeft: activeSection === key ? '3px solid var(--primary)' : '3px solid transparent'
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Active section content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        {renderSection()}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Personal Info Section
// ──────────────────────────────────────────────────────────
function PersonalInfoSection({ resume, updatePersonalInfo }) {
  const info = resume.personalInfo || {}
  const templateId = resume.templateId || 'professional-1'
  
  // Only show photo upload for templates that render a photo
  const supportsPhoto = templateId.startsWith('modern') || templateId.startsWith('professional') || templateId.startsWith('creative')

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be smaller than 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        updatePersonalInfo('photo', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const fields = [
    { key: 'firstName', label: 'First Name', placeholder: 'John', icon: User },
    { key: 'lastName', label: 'Last Name', placeholder: 'Doe', icon: User },
    { key: 'jobTitle', label: 'Job Title', placeholder: 'Software Engineer', icon: Briefcase },
    { key: 'email', label: 'Email', placeholder: 'john@example.com', icon: Mail },
    { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', icon: Phone },
    { key: 'location', label: 'Location', placeholder: 'San Francisco, CA', icon: MapPin },
    { key: 'website', label: 'Website', placeholder: 'https://your-site.com', icon: Globe },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username', icon: Globe },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/username', icon: Code2 }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader title="Personal Information" />

      {/* Photo Upload area */}
      {supportsPhoto && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div style={{ width: 60, height: 60, flexShrink: 0, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px dashed var(--border-heavy)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            {info.photo ? (
              <img src={info.photo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={20} style={{ color: 'var(--text-muted)' }} />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0, padding: '6px 12px', fontSize: 12 }}>
                <Camera size={14} /> Upload Photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </label>
              {info.photo && (
                <button onClick={() => updatePersonalInfo('photo', '')} className="btn btn-sm" style={{ color: 'var(--error)', background: 'transparent', padding: '6px 10px', fontSize: 12, border: 'none', cursor: 'pointer' }}>
                  Remove
                </button>
              )}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>JPG or PNG, max 2MB.</p>
          </div>
        </div>
      )}

      {fields.map(({ key, label, placeholder, icon: Icon }) => (
        <div key={key} className="form-group">
          <label className="form-label">{label}</label>
          <div style={{ position: 'relative' }}>
            <Icon size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={info[key] || ''}
              onChange={e => updatePersonalInfo(key, e.target.value)}
              placeholder={placeholder}
              className="form-input"
              style={{ paddingLeft: 32, fontSize: 13 }}
              id={`personal-${key}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Summary Section
// ──────────────────────────────────────────────────────────
function SummarySection({ resume, updateSection, generateAI, aiLoading }) {
  const handleAI = async () => {
    const content = await generateAI('summary', {
      jobTitle: resume.personalInfo?.jobTitle || 'professional',
      skills: resume.skills?.flatMap(s => s.items) || [],
      yearsExp: resume.experience?.length > 0 ? '3+' : '1+'
    })
    if (content) {
      updateSection('summary', content)
      toast.success('AI summary generated!')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader title="Professional Summary" action={
        <button
          onClick={handleAI}
          disabled={aiLoading === 'summary'}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: 12 }}
          id="ai-summary-btn"
        >
          <Wand2 size={12} style={{ color: 'var(--primary-light)' }} />
          {aiLoading === 'summary' ? 'Generating...' : 'AI Generate'}
        </button>
      } />
      <textarea
        value={resume.summary || ''}
        onChange={e => updateSection('summary', e.target.value)}
        placeholder="Write a compelling 3-4 sentence professional summary that highlights your key skills, experience, and what makes you unique..."
        className="form-input"
        style={{ minHeight: 120, fontSize: 13, resize: 'vertical' }}
        id="summary-textarea"
      />
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        💡 Tip: Keep it to 3-4 sentences. Focus on your top achievements and career goals.
      </p>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Experience Section
// ──────────────────────────────────────────────────────────
function ExperienceSection({ resume, updateSection }) {
  const experience = resume.experience || []

  const addItem = () => {
    updateSection('experience', [...experience, {
      id: uuidv4(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: ''
    }])
  }

  const updateItem = (id, field, value) => {
    updateSection('experience', experience.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const removeItem = (id) => {
    updateSection('experience', experience.filter(e => e.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Work Experience" action={
        <button onClick={addItem} className="btn btn-primary btn-sm" style={{ fontSize: 12 }} id="add-experience-btn">
          <Plus size={12} /> Add
        </button>
      } />

      {experience.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Briefcase size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 8px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Add your work experience</p>
        </div>
      )}

      {experience.map((exp, idx) => (
        <CollapsibleItem key={exp.id} title={exp.position || exp.company || `Experience ${idx + 1}`} onDelete={() => removeItem(exp.id)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { field: 'position', label: 'Job Title', placeholder: 'Senior Software Engineer' },
              { field: 'company', label: 'Company', placeholder: 'Google, Inc.' },
              { field: 'location', label: 'Location', placeholder: 'San Francisco, CA' }
            ].map(({ field, label, placeholder }) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" style={{ fontSize: 13 }} placeholder={placeholder} value={exp[field] || ''}
                  onChange={e => updateItem(exp.id, field, e.target.value)} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{ field: 'startDate', label: 'Start' }, { field: 'endDate', label: 'End' }].map(({ field, label }) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <input className="form-input" style={{ fontSize: 13 }} placeholder="Jan 2022" value={exp[field] || ''}
                    onChange={e => updateItem(exp.id, field, e.target.value)} disabled={field === 'endDate' && exp.current} />
                </div>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={exp.current || false} onChange={e => updateItem(exp.id, 'current', e.target.checked)} />
              Currently working here
            </label>
            <div className="form-group">
              <label className="form-label">Description & Achievements</label>
              <textarea className="form-input" style={{ fontSize: 13, minHeight: 80 }}
                placeholder="• Led development of... &#10;• Increased performance by...&#10;• Managed team of..."
                value={exp.description || ''} onChange={e => updateItem(exp.id, 'description', e.target.value)} />
            </div>
          </div>
        </CollapsibleItem>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Education Section
// ──────────────────────────────────────────────────────────
function EducationSection({ resume, updateSection }) {
  const education = resume.education || []

  const addItem = () => {
    updateSection('education', [...education, { id: uuidv4(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }])
  }

  const updateItem = (id, field, value) => {
    updateSection('education', education.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Education" action={
        <button onClick={addItem} className="btn btn-primary btn-sm" style={{ fontSize: 12 }} id="add-education-btn">
          <Plus size={12} /> Add
        </button>
      } />

      {education.map((edu, idx) => (
        <CollapsibleItem key={edu.id} title={edu.institution || edu.degree || `Education ${idx + 1}`} onDelete={() => updateSection('education', education.filter(e => e.id !== edu.id))}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { field: 'institution', label: 'Institution', placeholder: 'MIT / IIT / University Name' },
              { field: 'degree', label: 'Degree', placeholder: 'Bachelor of Technology' },
              { field: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
              { field: 'gpa', label: 'GPA / Percentage', placeholder: '9.2 / 10 or 92%' }
            ].map(({ field, label, placeholder }) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" style={{ fontSize: 13 }} placeholder={placeholder} value={edu[field] || ''}
                  onChange={e => updateItem(edu.id, field, e.target.value)} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[{ field: 'startDate', label: 'Start' }, { field: 'endDate', label: 'End / Expected' }].map(({ field, label }) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <input className="form-input" style={{ fontSize: 13 }} placeholder="2020" value={edu[field] || ''}
                    onChange={e => updateItem(edu.id, field, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </CollapsibleItem>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Skills Section
// ──────────────────────────────────────────────────────────
function SkillsSection({ resume, updateSection }) {
  const skills = resume.skills || []

  const addCategory = () => {
    updateSection('skills', [...skills, { id: uuidv4(), category: 'Technical Skills', items: [] }])
  }

  const updateCategory = (id, field, value) => {
    updateSection('skills', skills.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const addSkill = (id, skillText) => {
    if (!skillText.trim()) return
    updateSection('skills', skills.map(s =>
      s.id === id ? { ...s, items: [...(s.items || []), skillText.trim()] } : s
    ))
  }

  const removeSkill = (catId, skillIdx) => {
    updateSection('skills', skills.map(s =>
      s.id === catId ? { ...s, items: s.items.filter((_, i) => i !== skillIdx) } : s
    ))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Skills" action={
        <button onClick={addCategory} className="btn btn-primary btn-sm" style={{ fontSize: 12 }} id="add-skill-category-btn">
          <Plus size={12} /> Add Category
        </button>
      } />

      {skills.map((cat) => (
        <div key={cat.id} className="card card-elevated" style={{ padding: '14px', gap: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input className="form-input" style={{ fontSize: 13, flex: 1 }} placeholder="Category (e.g. Languages, Frameworks)"
              value={cat.category || ''} onChange={e => updateCategory(cat.id, 'category', e.target.value)} />
            <button onClick={() => updateSection('skills', skills.filter(s => s.id !== cat.id))}
              style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <Trash2 size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(cat.items || []).map((skill, i) => (
              <span key={i} className="tag-chip" style={{ cursor: 'pointer' }} onClick={() => removeSkill(cat.id, i)}>
                {skill} <span style={{ color: 'var(--error)', marginLeft: 2 }}>×</span>
              </span>
            ))}
          </div>
          <SkillInput onAdd={(val) => addSkill(cat.id, val)} />
        </div>
      ))}
    </div>
  )
}

function SkillInput({ onAdd }) {
  const [val, setVal] = useState('')
  const submit = () => { onAdd(val); setVal('') }
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <input className="form-input" style={{ fontSize: 13, flex: 1 }} placeholder="Type a skill and press Enter..."
        value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit() } }} />
      <button onClick={submit} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
        <Plus size={12} />
      </button>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Projects Section
// ──────────────────────────────────────────────────────────
function ProjectsSection({ resume, updateSection }) {
  const projects = resume.projects || []

  const addItem = () => {
    updateSection('projects', [...projects, { id: uuidv4(), name: '', description: '', technologies: [], link: '', github: '' }])
  }

  const updateItem = (id, field, value) => {
    updateSection('projects', projects.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Projects" action={
        <button onClick={addItem} className="btn btn-primary btn-sm" style={{ fontSize: 12 }} id="add-project-btn">
          <Plus size={12} /> Add
        </button>
      } />

      {projects.map((proj, idx) => (
        <CollapsibleItem key={proj.id} title={proj.name || `Project ${idx + 1}`} onDelete={() => updateSection('projects', projects.filter(p => p.id !== proj.id))}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { field: 'name', label: 'Project Name', placeholder: 'E-Commerce Platform' },
              { field: 'link', label: 'Live URL', placeholder: 'https://myproject.com' },
              { field: 'github', label: 'GitHub URL', placeholder: 'github.com/user/repo' }
            ].map(({ field, label, placeholder }) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" style={{ fontSize: 13 }} placeholder={placeholder} value={proj[field] || ''}
                  onChange={e => updateItem(proj.id, field, e.target.value)} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Technologies (comma separated)</label>
              <input className="form-input" style={{ fontSize: 13 }} placeholder="React, Node.js, MongoDB"
                value={(proj.technologies || []).join(', ')}
                onChange={e => updateItem(proj.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" style={{ fontSize: 13, minHeight: 80 }} placeholder="Describe your project..."
                value={proj.description || ''} onChange={e => updateItem(proj.id, 'description', e.target.value)} />
            </div>
          </div>
        </CollapsibleItem>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Certifications Section
// ──────────────────────────────────────────────────────────
function CertificationsSection({ resume, updateSection }) {
  const certs = resume.certifications || []

  const addItem = () => {
    updateSection('certifications', [...certs, { id: uuidv4(), name: '', issuer: '', date: '', credentialId: '', link: '' }])
  }

  const updateItem = (id, field, value) => {
    updateSection('certifications', certs.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeader title="Certifications" action={
        <button onClick={addItem} className="btn btn-primary btn-sm" style={{ fontSize: 12 }} id="add-cert-btn">
          <Plus size={12} /> Add
        </button>
      } />

      {certs.map((cert, idx) => (
        <CollapsibleItem key={cert.id} title={cert.name || `Certification ${idx + 1}`} onDelete={() => updateSection('certifications', certs.filter(c => c.id !== cert.id))}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { field: 'name', label: 'Certificate Name', placeholder: 'AWS Cloud Practitioner' },
              { field: 'issuer', label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
              { field: 'date', label: 'Issue Date', placeholder: 'Mar 2024' },
              { field: 'credentialId', label: 'Credential ID', placeholder: 'AWS-12345' },
              { field: 'link', label: 'Credential URL', placeholder: 'https://aws.amazon.com/verify' }
            ].map(({ field, label, placeholder }) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" style={{ fontSize: 13 }} placeholder={placeholder} value={cert[field] || ''}
                  onChange={e => updateItem(cert.id, field, e.target.value)} />
              </div>
            ))}
          </div>
        </CollapsibleItem>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Languages Section
// ──────────────────────────────────────────────────────────
function LanguagesSection({ resume, updateSection }) {
  const languages = resume.languages || []

  const addItem = () => {
    updateSection('languages', [...languages, { id: uuidv4(), name: '', proficiency: 'professional' }])
  }

  const updateItem = (id, field, value) => {
    updateSection('languages', languages.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader title="Languages" action={
        <button onClick={addItem} className="btn btn-primary btn-sm" style={{ fontSize: 12 }} id="add-lang-btn">
          <Plus size={12} /> Add
        </button>
      } />

      {languages.map((lang) => (
        <div key={lang.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="form-input" style={{ fontSize: 13, flex: 1 }} placeholder="English" value={lang.name || ''}
            onChange={e => updateItem(lang.id, 'name', e.target.value)} />
          <select className="form-input" style={{ fontSize: 13, flex: 1 }} value={lang.proficiency || 'professional'}
            onChange={e => updateItem(lang.id, 'proficiency', e.target.value)}>
            {['native', 'fluent', 'professional', 'conversational', 'basic'].map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
          <button onClick={() => updateSection('languages', languages.filter(l => l.id !== lang.id))}
            style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Theme Section
// ──────────────────────────────────────────────────────────
function ThemeSection({ resume, updateTheme }) {
  const theme = resume.theme || {}

  const colorPresets = [
    '#2563eb', '#7c3aed', '#059669', '#dc2626', '#0891b2',
    '#9333ea', '#0f172a', '#92400e', '#065f46', '#1e3a5f'
  ]

  const fonts = ['Inter', 'Outfit', 'Roboto', 'Georgia', 'Merriweather', 'Open Sans', 'Nunito', 'JetBrains Mono']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHeader title="Design & Theme" />

      <div className="form-group">
        <label className="form-label">Primary Color</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
          {colorPresets.map(color => (
            <div key={color}
              onClick={() => updateTheme({ primaryColor: color })}
              style={{
                width: 28, height: 28, borderRadius: '50%', background: color,
                cursor: 'pointer', transition: 'transform 0.15s',
                border: theme.primaryColor === color ? '3px solid white' : '2px solid transparent',
                boxShadow: theme.primaryColor === color ? `0 0 0 2px ${color}` : 'none',
                outline: theme.primaryColor === color ? `2px solid ${color}` : '2px solid transparent',
                outlineOffset: 2
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ))}
          <input type="color" value={theme.primaryColor || '#2563eb'}
            onChange={e => updateTheme({ primaryColor: e.target.value })}
            style={{ width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', border: 'none', padding: 0, background: 'none' }}
            title="Custom color"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Font Family</label>
        <select className="form-input" style={{ fontSize: 13 }} value={theme.fontFamily || 'Inter'}
          onChange={e => updateTheme({ fontFamily: e.target.value })}>
          {fonts.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Font Size</label>
        <select className="form-input" style={{ fontSize: 13 }} value={theme.fontSize || 'medium'}
          onChange={e => updateTheme({ fontSize: e.target.value })}>
          <option value="small">Small (Compact)</option>
          <option value="medium">Medium (Recommended)</option>
          <option value="large">Large (Spacious)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Spacing</label>
        <select className="form-input" style={{ fontSize: 13 }} value={theme.spacing || 'normal'}
          onChange={e => updateTheme({ spacing: e.target.value })}>
          <option value="compact">Compact</option>
          <option value="normal">Normal</option>
          <option value="relaxed">Relaxed</option>
        </select>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Shared UI Components
// ──────────────────────────────────────────────────────────
function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>{title}</h4>
      {action}
    </div>
  )
}

function CollapsibleItem({ title, onDelete, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="card card-elevated" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: open ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Grip size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontWeight: 600, fontSize: 13, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); onDelete() }}
            style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 4 }}>
            <Trash2 size={13} />
          </button>
          {open ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </div>
      {open && <div style={{ padding: '14px' }}>{children}</div>}
    </div>
  )
}


