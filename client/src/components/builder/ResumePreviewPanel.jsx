import { Mail, Phone, MapPin, Globe, Link as LinkIcon, Code2 } from 'lucide-react'

// Template renderer for real-time preview
export default function ResumePreviewPanel({ resume }) {
  if (!resume) return null
  const templateId = resume.templateId || 'professional-1'

  let TemplateComponent = ProfessionalTemplate
  if (templateId.startsWith('modern')) TemplateComponent = ModernTemplate
  else if (templateId.startsWith('creative')) TemplateComponent = CreativeTemplate
  else if (templateId.startsWith('minimal')) TemplateComponent = MinimalTemplate
  else if (templateId.startsWith('ats-friendly')) TemplateComponent = AtsFriendlyTemplate
  else if (templateId.startsWith('academic')) TemplateComponent = AcademicTemplate

  return (
    <div
      id="resume-preview-content"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: 'white',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        borderRadius: 4,
        overflow: 'hidden'
      }}
    >
      <TemplateComponent resume={resume} />
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────────────────

const getThemeStyles = (theme) => {
  const primary = theme?.primaryColor || '#2563eb'
  const font = theme?.fontFamily || 'Inter'
  const spacing = theme?.spacing === 'compact' ? 10 : theme?.spacing === 'relaxed' ? 18 : 14
  const fontSize = theme?.fontSize === 'small' ? 11 : theme?.fontSize === 'large' ? 13 : 12
  return { primary, font, spacing, fontSize }
}

const ContactItem = ({ icon, text, style }) => {
  if (!text) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9, ...style }}>
      <span style={{ fontSize: '1.1em' }}>{icon}</span>
      <span style={{ wordBreak: 'break-word', lineHeight: 1.3 }}>{text}</span>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  1. Modern Template (Left Sidebar - Madrid Style)
// ──────────────────────────────────────────────────────────
function ModernTemplate({ resume }) {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [], languages = [], theme = {} } = resume
  const { primary, font, spacing, fontSize } = getThemeStyles(theme)

  const sideWidth = '33%'
  
  return (
    <div style={{ display: 'flex', fontFamily: `'${font}', Inter, sans-serif`, fontSize, minHeight: '297mm', background: 'white', color: '#333' }}>
      {/* Left Sidebar */}
      <div style={{ width: sideWidth, background: primary, color: '#fff', padding: `${spacing * 2.5}px ${spacing * 1.5}px` }}>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 24px', display: 'block', border: '4px solid rgba(255,255,255,0.2)' }} />
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing * 0.8, marginBottom: spacing * 2.5, fontSize: fontSize - 1 }}>
          <ContactItem icon="✉" text={personalInfo.email} />
          <ContactItem icon="☎" text={personalInfo.phone} />
          <ContactItem icon="⊙" text={personalInfo.location} />
          <ContactItem icon="⊞" text={personalInfo.linkedin} />
          <ContactItem icon="⊟" text={personalInfo.github} />
        </div>

        {skills.length > 0 && (
          <div style={{ marginBottom: spacing * 2 }}>
            <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 6, marginBottom: 12 }}>Skills</h3>
            {skills.flatMap(s => s.items || []).map((skill, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: fontSize - 1, marginBottom: 4 }}>{skill}</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.9)', borderRadius: 2, width: `${70 + (i % 3) * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {languages.length > 0 && (
          <div style={{ marginBottom: spacing * 2 }}>
            <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 6, marginBottom: 12 }}>Languages</h3>
            {languages.map((lang, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: fontSize - 1 }}>
                <span>{lang.name}</span>
                <span style={{ opacity: 0.7 }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div style={{ flex: 1, padding: `${spacing * 3}px ${spacing * 2.5}px` }}>
        <div style={{ marginBottom: spacing * 2 }}>
          <h1 style={{ fontSize: fontSize * 2.8, fontWeight: 800, margin: '0 0 4px', color: '#111', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.jobTitle && (
            <h2 style={{ fontSize: fontSize + 4, fontWeight: 500, color: primary, margin: 0, letterSpacing: '0.02em' }}>
              {personalInfo.jobTitle}
            </h2>
          )}
        </div>

        {summary && (
          <div style={{ marginBottom: spacing * 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, background: `${primary}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary }}>👤</div>
              <h3 style={{ fontSize: fontSize + 3, fontWeight: 700, color: '#111', margin: 0 }}>Profile</h3>
            </div>
            <p style={{ margin: 0, color: '#444', lineHeight: 1.6, fontSize }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: spacing * 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 24, background: `${primary}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary }}>💼</div>
              <h3 style={{ fontSize: fontSize + 3, fontWeight: 700, color: '#111', margin: 0 }}>Experience</h3>
            </div>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: spacing * 1.5, position: 'relative', paddingLeft: 16, borderLeft: `2px solid ${primary}40` }}>
                <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: primary }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: fontSize + 1, color: '#111' }}>{exp.position}</div>
                  <div style={{ fontSize: fontSize - 2, color: primary, fontWeight: 600, background: `${primary}15`, padding: '2px 8px', borderRadius: 12 }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </div>
                </div>
                <div style={{ color: '#555', fontWeight: 500, fontSize: fontSize, margin: '2px 0 6px' }}>{exp.company} {exp.location && `• ${exp.location}`}</div>
                {exp.description && <div style={{ color: '#444', lineHeight: 1.5, whiteSpace: 'pre-line', fontSize: fontSize - 0.5 }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: spacing * 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 24, background: `${primary}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary }}>🎓</div>
              <h3 style={{ fontSize: fontSize + 3, fontWeight: 700, color: '#111', margin: 0 }}>Education</h3>
            </div>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: spacing * 1.5, position: 'relative', paddingLeft: 16, borderLeft: `2px solid ${primary}40` }}>
                <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: primary }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700, fontSize: fontSize + 1, color: '#111' }}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                  <div style={{ fontSize: fontSize - 2, color: '#666', fontWeight: 500 }}>{edu.startDate} - {edu.endDate}</div>
                </div>
                <div style={{ color: '#555', fontWeight: 500, fontSize: fontSize, margin: '2px 0' }}>{edu.institution}</div>
                {edu.gpa && <div style={{ color: '#666', fontSize: fontSize - 1, marginTop: 2 }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  2. Professional Template (Two Column, Classic Stockholm)
// ──────────────────────────────────────────────────────────
function ProfessionalTemplate({ resume }) {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [], languages = [], theme = {} } = resume
  const { primary, font, spacing, fontSize } = getThemeStyles(theme)

  return (
    <div style={{ fontFamily: `'${font}', Inter, sans-serif`, fontSize, minHeight: '297mm', background: 'white', color: '#333' }}>
      
      {/* Header */}
      <div style={{ padding: `${spacing * 2.5}px ${spacing * 3}px ${spacing * 1.5}px`, borderBottom: `2px solid ${primary}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing }}>
          <div>
            <h1 style={{ fontSize: fontSize * 3, fontWeight: 800, margin: '0 0 4px', color: '#111', lineHeight: 1 }}>
              {personalInfo.firstName} <span style={{ color: primary }}>{personalInfo.lastName}</span>
            </h1>
            {personalInfo.jobTitle && (
              <h2 style={{ fontSize: fontSize + 4, fontWeight: 500, color: '#555', margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>
                {personalInfo.jobTitle}
              </h2>
            )}
          </div>
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile"
              style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
          )}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${spacing * 0.8}px ${spacing * 2}px`, fontSize: fontSize - 1, color: '#555' }}>
          <ContactItem icon="✉" text={personalInfo.email} />
          <ContactItem icon="☎" text={personalInfo.phone} />
          <ContactItem icon="⊙" text={personalInfo.location} />
          <ContactItem icon="⊞" text={personalInfo.linkedin} />
          <ContactItem icon="⊟" text={personalInfo.github} />
        </div>
      </div>

      {/* Body Grid */}
      <div style={{ display: 'flex', padding: `${spacing * 2}px ${spacing * 3}px` }}>
        {/* Main Column */}
        <div style={{ flex: 2, paddingRight: spacing * 2.5 }}>
          {summary && (
            <div style={{ marginBottom: spacing * 2 }}>
              <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, color: primary, textTransform: 'uppercase', margin: `0 0 ${spacing}px`, display: 'flex', alignItems: 'center', gap: 8 }}>
                Profile
              </h3>
              <p style={{ margin: 0, color: '#444', lineHeight: 1.6 }}>{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div style={{ marginBottom: spacing * 2 }}>
              <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, color: primary, textTransform: 'uppercase', margin: `0 0 ${spacing}px` }}>
                Experience
              </h3>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: spacing * 1.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                    <div style={{ fontWeight: 700, fontSize: fontSize + 1, color: '#111' }}>{exp.position}</div>
                    <div style={{ fontSize: fontSize - 1, color: '#666', fontWeight: 500 }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div style={{ color: '#444', fontWeight: 600, fontSize: fontSize, margin: '0 0 6px' }}>{exp.company}{exp.location && `, ${exp.location}`}</div>
                  {exp.description && <div style={{ color: '#444', lineHeight: 1.5, whiteSpace: 'pre-line', fontSize: fontSize - 0.5 }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ marginBottom: spacing * 2 }}>
              <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, color: primary, textTransform: 'uppercase', margin: `0 0 ${spacing}px` }}>
                Projects
              </h3>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: spacing * 1.2 }}>
                  <div style={{ fontWeight: 700, fontSize: fontSize + 1, color: '#111' }}>{proj.name} {proj.link && <span style={{fontSize: 10, color: primary}}>🔗</span>}</div>
                  {proj.technologies?.length > 0 && <div style={{ fontSize: fontSize - 1, color: primary, margin: '2px 0 4px', fontWeight: 500 }}>{proj.technologies.join(' · ')}</div>}
                  {proj.description && <div style={{ color: '#444', lineHeight: 1.5, whiteSpace: 'pre-line', fontSize: fontSize - 0.5 }}>{proj.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Column */}
        <div style={{ flex: 1 }}>
          {education.length > 0 && (
            <div style={{ marginBottom: spacing * 2 }}>
              <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, color: primary, textTransform: 'uppercase', margin: `0 0 ${spacing}px` }}>
                Education
              </h3>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: spacing }}>
                  <div style={{ fontWeight: 700, color: '#111' }}>{edu.degree}</div>
                  <div style={{ color: '#444', fontWeight: 500, margin: '2px 0 4px' }}>{edu.institution}</div>
                  <div style={{ fontSize: fontSize - 1, color: '#666' }}>{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div style={{ marginBottom: spacing * 2 }}>
              <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, color: primary, textTransform: 'uppercase', margin: `0 0 ${spacing}px` }}>
                Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skills.flatMap(s => s.items || []).map((skill, i) => (
                  <span key={i} style={{ background: '#f3f4f6', color: '#333', padding: '4px 10px', borderRadius: 4, fontSize: fontSize - 1, fontWeight: 500 }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div style={{ marginBottom: spacing * 2 }}>
              <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, color: primary, textTransform: 'uppercase', margin: `0 0 ${spacing}px` }}>
                Languages
              </h3>
              {languages.map((lang, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: fontSize }}>
                  <strong style={{ color: '#333' }}>{lang.name}</strong>
                  <span style={{ color: '#666' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div style={{ marginBottom: spacing * 2 }}>
              <h3 style={{ fontSize: fontSize + 2, fontWeight: 700, color: primary, textTransform: 'uppercase', margin: `0 0 ${spacing}px` }}>
                Certifications
              </h3>
              {certifications.map((cert, i) => (
                <div key={i} style={{ margin: '6px 0', fontSize: fontSize }}>
                  <strong style={{ color: '#333', display: 'block' }}>{cert.name}</strong>
                  <span style={{ color: '#666', fontSize: fontSize - 1 }}>{cert.issuer}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  3. Creative Template (Bold Header, Box Styles)
// ──────────────────────────────────────────────────────────
function CreativeTemplate({ resume }) {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [], languages = [], theme = {} } = resume
  const { primary, font, spacing, fontSize } = getThemeStyles(theme)

  return (
    <div style={{ fontFamily: `'${font}', Inter, sans-serif`, fontSize, minHeight: '297mm', background: '#fafafa', color: '#222' }}>
      
      {/* Banner Header */}
      <div style={{ background: primary, color: 'white', padding: `${spacing * 3}px`, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 150, height: 150, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile"
            style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: '4px solid white', position: 'relative', zIndex: 2 }} />
        )}
        <h1 style={{ fontSize: fontSize * 3.5, fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.02em', position: 'relative', zIndex: 2 }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.jobTitle && (
          <h2 style={{ fontSize: fontSize + 4, fontWeight: 400, opacity: 0.9, margin: '0 0 24px', letterSpacing: '0.1em', textTransform: 'uppercase', position: 'relative', zIndex: 2 }}>
            {personalInfo.jobTitle}
          </h2>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `${spacing}px ${spacing * 2}px`, fontSize: fontSize - 1, position: 'relative', zIndex: 2, background: 'rgba(0,0,0,0.15)', padding: '12px 24px', borderRadius: 100, display: 'inline-flex' }}>
          <ContactItem icon="✉" text={personalInfo.email} />
          <ContactItem icon="☎" text={personalInfo.phone} />
          <ContactItem icon="⊙" text={personalInfo.location} />
          <ContactItem icon="⊞" text={personalInfo.linkedin} />
        </div>
      </div>

      <div style={{ padding: `${spacing * 3}px`}}>
        {summary && (
          <div style={{ background: 'white', padding: spacing * 1.5, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: spacing * 2 }}>
            <p style={{ margin: 0, color: '#444', lineHeight: 1.7, fontSize, textAlign: 'center', fontStyle: 'italic' }}>
              &ldquo;{summary}&rdquo;
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: spacing * 2 }}>
          {/* Main Column */}
          <div style={{ flex: 2 }}>
            <CreativeSection title="Experience" primary={primary} icon="💼" fontSize={fontSize} spacing={spacing}>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: spacing * 1.5, background: 'white', padding: spacing * 1.5, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', borderLeft: `4px solid ${primary}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontWeight: 800, fontSize: fontSize + 2, color: '#111' }}>{exp.position}</div>
                    <div style={{ background: `${primary}15`, color: primary, padding: '4px 10px', borderRadius: 20, fontSize: fontSize - 2, fontWeight: 700 }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <div style={{ color: '#555', fontWeight: 600, fontSize: fontSize, margin: '0 0 10px' }}>{exp.company} {exp.location && `• ${exp.location}`}</div>
                  {exp.description && <div style={{ color: '#444', lineHeight: 1.6, whiteSpace: 'pre-line', fontSize: fontSize - 0.5 }}>{exp.description}</div>}
                </div>
              ))}
            </CreativeSection>

            <CreativeSection title="Education" primary={primary} icon="🎓" fontSize={fontSize} spacing={spacing}>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: spacing, background: 'white', padding: spacing * 1.2, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontWeight: 800, fontSize: fontSize + 1, color: '#111' }}>{edu.degree}</div>
                  <div style={{ color: '#555', fontWeight: 600, margin: '4px 0 8px' }}>{edu.institution}</div>
                  <div style={{ fontSize: fontSize - 1, color: '#888', fontWeight: 500 }}>{edu.startDate} - {edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                </div>
              ))}
            </CreativeSection>
          </div>

          {/* Sidebar */}
          <div style={{ flex: 1 }}>
            {skills.length > 0 && (
              <CreativeSection title="Skills" primary={primary} icon="⚡" fontSize={fontSize} spacing={spacing}>
                <div style={{ background: 'white', padding: spacing * 1.5, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  {skills.map((cat, i) => (
                    <div key={i} style={{ marginBottom: i < skills.length - 1 ? spacing : 0 }}>
                      <div style={{ fontWeight: 700, fontSize: fontSize, color: '#111', marginBottom: 8 }}>{cat.category}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(cat.items || []).map((skill, j) => (
                          <span key={j} style={{ background: `${primary}10`, color: primary, padding: '6px 12px', borderRadius: 8, fontSize: fontSize - 1, border: `1px solid ${primary}30` }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CreativeSection>
            )}

            {languages.length > 0 && (
               <CreativeSection title="Languages" primary={primary} icon="🌍" fontSize={fontSize} spacing={spacing}>
                 <div style={{ background: 'white', padding: spacing * 1.5, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                   {languages.map((lang, i) => (
                     <div key={i} style={{ marginBottom: 8 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: fontSize, color: '#333' }}>
                         <span>{lang.name}</span>
                         <span style={{ color: primary, fontSize: fontSize - 1 }}>{lang.proficiency}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </CreativeSection>
            )}
            
            {certifications.length > 0 && (
               <CreativeSection title="Awards & Certs" primary={primary} icon="🏆" fontSize={fontSize} spacing={spacing}>
                 <div style={{ background: 'white', padding: spacing * 1.5, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                   {certifications.map((cert, i) => (
                     <div key={i} style={{ marginBottom: 8 }}>
                       <div style={{ fontWeight: 700, fontSize: fontSize, color: '#111' }}>{cert.name}</div>
                       <div style={{ color: '#666', fontSize: fontSize - 1, marginTop: 2 }}>{cert.issuer}</div>
                     </div>
                   ))}
                 </div>
               </CreativeSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CreativeSection({ title, primary, icon, fontSize, spacing, children }) {
  return (
    <div style={{ marginBottom: spacing * 2 }}>
      <h3 style={{ fontSize: fontSize + 4, fontWeight: 900, color: '#111', textTransform: 'uppercase', margin: `0 0 ${spacing}px`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: primary, borderRadius: 10, color: 'white', fontSize: 18 }}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  4. Minimal Template (Single Column, Centered Header)
// ──────────────────────────────────────────────────────────
function MinimalTemplate({ resume }) {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [], languages = [], theme = {} } = resume
  const { primary, font, spacing, fontSize } = getThemeStyles(theme)

  return (
    <div style={{ fontFamily: `'${font}', Inter, sans-serif`, fontSize, minHeight: '297mm', background: 'white', color: '#1a1a1a', padding: `${spacing * 3.5}px ${spacing * 4}px` }}>
      
      {/* Centered Header */}
      <div style={{ textAlign: 'center', marginBottom: spacing * 2.5 }}>
        <h1 style={{ fontSize: fontSize * 3.2, fontWeight: 300, margin: '0 0 6px', color: '#000', letterSpacing: '0.04em' }}>
          {personalInfo.firstName} <span style={{ fontWeight: 700 }}>{personalInfo.lastName}</span>
        </h1>
        {personalInfo.jobTitle && (
          <h2 style={{ fontSize: fontSize + 2, fontWeight: 400, color: primary, margin: '0 0 16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {personalInfo.jobTitle}
          </h2>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `${spacing * 0.5}px ${spacing * 1.5}px`, fontSize: fontSize - 1, color: '#555' }}>
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && (personalInfo.phone || personalInfo.email) && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>•</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.linkedin && <span>•</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: spacing * 2.5 }}>
          <MinimalSectionTitle title="Summary" primary={primary} spacing={spacing} />
          <p style={{ margin: 0, color: '#333', lineHeight: 1.8, fontSize: fontSize }}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: spacing * 2.5 }}>
          <MinimalSectionTitle title="Experience" primary={primary} spacing={spacing} />
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: spacing * 1.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: fontSize + 1, color: '#000' }}>{exp.position} — <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#444' }}>{exp.company}</span></div>
                <div style={{ fontSize: fontSize - 1, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
              </div>
              {exp.description && <div style={{ color: '#333', lineHeight: 1.6, whiteSpace: 'pre-line', fontSize: fontSize }}>{exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: spacing * 2.5 }}>
          <MinimalSectionTitle title="Education" primary={primary} spacing={spacing} />
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: spacing }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                <div style={{ fontWeight: 700, fontSize: fontSize + 1, color: '#000' }}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                <div style={{ fontSize: fontSize - 1, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>{edu.startDate} - {edu.endDate}</div>
              </div>
              <div style={{ color: '#444', fontSize: fontSize }}>{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills & Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing * 3 }}>
        {skills.length > 0 && (
          <div>
            <MinimalSectionTitle title="Skills" primary={primary} spacing={spacing} />
            {skills.map((cat, i) => (
              <div key={i} style={{ marginBottom: spacing }}>
                <strong style={{ display: 'block', marginBottom: 4, color: '#000' }}>{cat.category}</strong>
                <div style={{ color: '#444', lineHeight: 1.5 }}>{(cat.items || []).join(', ')}</div>
              </div>
            ))}
          </div>
        )}
        
        {projects.length > 0 && (
          <div>
            <MinimalSectionTitle title="Projects" primary={primary} spacing={spacing} />
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: spacing }}>
                <strong style={{ display: 'block', color: '#000' }}>{proj.name}</strong>
                <div style={{ color: '#444', lineHeight: 1.5, fontSize: fontSize - 0.5 }}>{proj.description || (proj.technologies || []).join(', ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MinimalSectionTitle({ title, primary, spacing }) {
  return (
    <h3 style={{ 
      fontSize: 14, 
      fontWeight: 700, 
      color: primary, 
      textTransform: 'uppercase', 
      letterSpacing: 2, 
      margin: `0 0 ${spacing * 1.5}px`, 
      borderBottom: '1px solid #eaeaea', 
      paddingBottom: 8 
    }}>
      {title}
    </h3>
  )
}

// ──────────────────────────────────────────────────────────
//  5. ATS Friendly Template (Left Labels, Right Content)
// ──────────────────────────────────────────────────────────
function AtsFriendlyTemplate({ resume }) {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [], languages = [], theme = {} } = resume
  const { primary, font, spacing, fontSize } = getThemeStyles(theme)

  const LabelColumn = ({ title }) => (
    <div style={{ width: '25%', flexShrink: 0, paddingRight: spacing }}>
      <h3 style={{ fontSize: fontSize, fontWeight: 700, color: primary, textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>
        {title}
      </h3>
    </div>
  )

  return (
    <div style={{ fontFamily: `'${font}', Inter, sans-serif`, fontSize, minHeight: '297mm', background: 'white', color: '#111', padding: `${spacing * 4}px ${spacing * 4}px` }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: spacing * 3 }}>
        <h1 style={{ fontSize: fontSize * 2.8, fontWeight: 700, margin: '0 0 8px', color: '#000' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.jobTitle && (
          <h2 style={{ fontSize: fontSize + 2, fontWeight: 600, color: '#444', margin: '0 0 16px' }}>
            {personalInfo.jobTitle}
          </h2>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `${spacing * 0.5}px ${spacing * 1.5}px`, fontSize: fontSize - 1, color: '#555' }}>
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
        <div style={{ height: 1.5, background: '#e5e7eb', marginTop: spacing * 2 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing * 2.5 }}>
        
        {/* Profile */}
        {summary && (
          <div style={{ display: 'flex' }}>
            <LabelColumn title="Profile" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#333', lineHeight: 1.6 }}>{summary}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ display: 'flex' }}>
            <LabelColumn title="Experience" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing * 1.5 }}>
              {experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                    <div style={{ fontWeight: 700, fontSize: fontSize + 1 }}>{exp.position}</div>
                    <div style={{ fontSize: fontSize - 1, color: '#666', fontWeight: 500 }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div style={{ color: '#444', fontWeight: 600, fontSize: fontSize, margin: '0 0 6px' }}>{exp.company} {exp.location && `• ${exp.location}`}</div>
                  {exp.description && <div style={{ color: '#333', lineHeight: 1.6, whiteSpace: 'pre-line', fontSize: fontSize }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ display: 'flex' }}>
            <LabelColumn title="Education" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing * 1.5 }}>
              {education.map((edu, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                    <div style={{ fontWeight: 700, fontSize: fontSize + 1 }}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                    <div style={{ fontSize: fontSize - 1, color: '#666', fontWeight: 500 }}>{edu.startDate} - {edu.endDate}</div>
                  </div>
                  <div style={{ color: '#444', fontWeight: 600, fontSize: fontSize }}>{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ display: 'flex' }}>
            <LabelColumn title="Skills" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing * 0.8 }}>
              {skills.map((cat, i) => (
                <div key={i} style={{ display: 'flex', gap: spacing }}>
                  <strong style={{ width: 120, flexShrink: 0, color: '#333' }}>{cat.category}:</strong>
                  <span style={{ color: '#444', lineHeight: 1.5 }}>{(cat.items || []).join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div style={{ display: 'flex' }}>
            <LabelColumn title="Languages" />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing }}>
              {languages.map((lang, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingRight: spacing * 2 }}>
                  <strong style={{ color: '#333' }}>{lang.name}</strong>
                  <span style={{ color: '#666' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
//  6. Academic Template (Centered Headers, Band Lines)
// ──────────────────────────────────────────────────────────
function AcademicTemplate({ resume }) {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [], languages = [], theme = {} } = resume
  const { primary, font, spacing, fontSize } = getThemeStyles(theme)

  const BandTitle = ({ title }) => (
    <div style={{ marginBottom: spacing * 1.5, textAlign: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#ccc', zIndex: 1 }} />
      <h3 style={{ display: 'inline-block', position: 'relative', zIndex: 2, background: 'white', padding: '0 16px', fontSize: fontSize + 2, fontWeight: 700, color: '#111', textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>
        {title}
      </h3>
    </div>
  )

  return (
    <div style={{ fontFamily: `'${font}', Georgia, serif`, fontSize, minHeight: '297mm', background: 'white', color: '#222', padding: `${spacing * 3.5}px ${spacing * 4}px` }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: spacing * 3 }}>
        <h1 style={{ fontSize: fontSize * 3.2, fontWeight: 800, margin: '0 0 10px', color: '#000' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.jobTitle && (
          <h2 style={{ fontSize: fontSize + 2, fontWeight: 500, color: '#555', margin: '0 0 16px', fontStyle: 'italic' }}>
            {personalInfo.jobTitle}
          </h2>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', padding: '8px 0', fontSize: fontSize - 1, color: '#444', fontWeight: 600 }}>
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing * 2.5 }}>
        
        {/* Profile */}
        {summary && (
          <div>
            <BandTitle title="Profile" />
            <p style={{ margin: 0, color: '#222', lineHeight: 1.7, textAlign: 'justify' }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <BandTitle title="Experience" />
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: spacing * 1.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                  <div style={{ fontWeight: 800, fontSize: fontSize + 1, color: '#111' }}>❖ {exp.position} - <span style={{ fontWeight: 500 }}>{exp.company}</span></div>
                  <div style={{ fontSize: fontSize - 1, color: '#555', fontWeight: 500 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                </div>
                {exp.location && <div style={{ color: '#666', fontSize: fontSize - 1, margin: '0 0 6px 18px', fontStyle: 'italic' }}>{exp.location}</div>}
                {exp.description && <div style={{ color: '#222', lineHeight: 1.6, whiteSpace: 'pre-line', fontSize: fontSize, margin: '4px 0 0 18px' }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <BandTitle title="Education" />
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: spacing }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                  <div style={{ fontWeight: 800, fontSize: fontSize + 1, color: '#111' }}>❖ {edu.degree} {edu.field && `in ${edu.field}`}</div>
                  <div style={{ fontSize: fontSize - 1, color: '#555', fontWeight: 500 }}>{edu.startDate} – {edu.endDate}</div>
                </div>
                <div style={{ color: '#444', fontWeight: 500, margin: '0 0 0 18px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{edu.institution}</span>
                  {edu.gpa && <span style={{ fontStyle: 'italic' }}>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <BandTitle title="Skills" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing }}>
              {skills.map((cat, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ color: '#111', borderBottom: '1px solid #eee', paddingBottom: 4, marginBottom: 4 }}>{cat.category}</strong>
                  <span style={{ color: '#333', lineHeight: 1.5 }}>❖ {(cat.items || []).join('\n❖ ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
