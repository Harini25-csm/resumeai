'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, FileText, Briefcase, GraduationCap, Code, Rocket, Award, Globe,
  ChevronDown, ChevronUp, Plus, X, Sparkles, Download, Eye, ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react'
import { ResumeData } from '@/types/resume-builder'
import ResumePDFPreview from './ResumePDFPreview'
import ModernTemplate from '@/components/templates/ModernTemplate'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import CreativeTemplate from '@/components/templates/CreativeTemplate'
import MinimalTemplate from '@/components/templates/MinimalTemplate'
import jsPDF from 'jspdf'

export type { ResumeData }

interface ResumeBuilderProps {
  template: string
  color: string
}

const templateMap: any = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
  executive: ModernTemplate,
  'fresh-graduate': MinimalTemplate
}

const initialData: ResumeData = {
  personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  skills: { technical: [], soft: [] },
  projects: [],
  certifications: [],
  languages: []
}

// Memoized template preview component
const TemplatePreview = memo(({ data, template }: any) => {
  const TemplateComponent = templateMap[template]
  return <TemplateComponent data={data} />
})

// SectionHeader component moved outside with proper props
interface SectionHeaderProps {
  id: string
  title: string
  icon: React.ReactNode
  children?: React.ReactNode
  expandedSections: Set<string>
  toggleSection: (id: string) => void
  onAIAssist?: (id: string) => void
}

function SectionHeader({ id, title, icon, children, expandedSections, toggleSection, onAIAssist }: SectionHeaderProps) {
  const isExpanded = expandedSections.has(id)
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      marginBottom: '1rem',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div
        role='button'
        tabIndex={0}
        onClick={() => toggleSection(id)}
        onKeyDown={(e) => e.key === 'Enter' && toggleSection(id)}
        style={{
          width: '100%',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isExpanded ? '#F9FAFB' : 'white',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '0.75rem', color: '#3B82F6' }}>
            {icon}
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
            {title}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAIAssist?.(id)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#F3F4F6',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#6B7280',
              cursor: 'pointer'
            }}
          >
            <Sparkles style={{ width: '12px', height: '12px' }} />
            AI Assist
          </button>
          {isExpanded ? 
            <ChevronUp style={{ width: '20px', height: '20px', color: '#6B7280' }} /> :
            <ChevronDown style={{ width: '20px', height: '20px', color: '#6B7280' }} />
          }
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ResumeBuilder({ template, color }: ResumeBuilderProps) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personalInfo', 'experience']))
  const [zoomLevel, setZoomLevel] = useState(1)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setResumeData({
          ...initialData,
          ...parsed,
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
          languages: Array.isArray(parsed.languages) ? parsed.languages : [],
          skills: {
            technical: Array.isArray(parsed.skills?.technical) ? parsed.skills.technical : [],
            soft: Array.isArray(parsed.skills?.soft) ? parsed.skills.soft : []
          }
        })
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData))
  }, [resumeData])

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }, [])

  const handleAIAssist = useCallback((sectionId: string) => {
    console.log(`AI Assist for ${sectionId}`)
  }, [])

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }, [])

  const updateSummary = useCallback((value: string) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }))
  }, [])

  const addExperience = useCallback(() => {
    const newExp = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: ['', '', '']
    }
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }))
    toggleSection(`exp-${newExp.id}`)
  }, [toggleSection])

  const updateExperience = useCallback((id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }, [])

  const deleteExperience = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }, [])

  const addEducation = useCallback(() => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      year: '',
      grade: '',
      achievements: ''
    }
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }))
    toggleSection(`edu-${newEdu.id}`)
  }, [toggleSection])

  const updateEducation = useCallback((id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }, [])

  const deleteEducation = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }, [])

  const updateSkills = useCallback((type: 'technical' | 'soft', value: string[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: value
      }
    }))
  }, [])

  const downloadPDF = () => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const data = resumeData
    let y = 0
    doc.setFillColor(37, 99, 235)
    doc.rect(0, 0, 210, 45, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text(data.personalInfo?.fullName || 'Your Name', 20, 18)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'normal')
    doc.text(data.personalInfo?.jobTitle || '', 20, 28)
    doc.setFontSize(9)
    const contactParts = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean)
    doc.text(contactParts.join(' | '), 20, 38)
    y = 55
    doc.setTextColor(0, 0, 0)
    if (data.summary) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('PROFESSIONAL SUMMARY', 20, y)
      doc.line(20, y + 2, 190, y + 2)
      y += 8
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81)
      doc.setFontSize(10)
      const summaryLines = doc.splitTextToSize(data.summary, 170)
      doc.text(summaryLines, 20, y)
      y += summaryLines.length * 5 + 8
    }
    if ((data.experience || []).length > 0) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('EXPERIENCE', 20, y)
      doc.line(20, y + 2, 190, y + 2)
      y += 8
      ;(data.experience || []).forEach((exp: any) => {
        if (y > 270) { doc.addPage(); y = 20 }
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(17, 24, 39)
        doc.text(exp.jobTitle || '', 20, y)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(107, 114, 128)
        doc.text(`${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}`, 190, y, { align: 'right' })
        y += 5
        doc.setFontSize(10)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(37, 99, 235)
        doc.text(exp.company || '', 20, y)
        y += 5
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(55, 65, 81)
        ;(exp.bullets || []).filter((b: string) => b).forEach((bullet: string) => {
          if (y > 270) { doc.addPage(); y = 20 }
          const lines = doc.splitTextToSize('• ' + bullet, 165)
          doc.text(lines, 23, y)
          y += lines.length * 4.5
        })
        y += 4
      })
    }
    if ((data.skills?.technical || []).length > 0) {
      if (y > 250) { doc.addPage(); y = 20 }
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('SKILLS', 20, y)
      doc.line(20, y + 2, 190, y + 2)
      y += 8
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81)
      doc.setFontSize(10)
      const skillsText = [...(data.skills?.technical || []), ...(data.skills?.soft || [])].join(' • ')
      const skillLines = doc.splitTextToSize(skillsText, 170)
      doc.text(skillLines, 20, y)
      y += skillLines.length * 5 + 8
    }
    if ((data.education || []).length > 0) {
      if (y > 250) { doc.addPage(); y = 20 }
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text('EDUCATION', 20, y)
      doc.line(20, y + 2, 190, y + 2)
      y += 8
      ;(data.education || []).forEach((edu: any) => {
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(17, 24, 39)
        doc.text(`${edu.degree || ''}${edu.achievements ? ' - ' + edu.achievements : ''}`, 20, y)
        y += 5
        doc.setFontSize(10)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(107, 114, 128)
        doc.text(edu.institution || '', 20, y)
        y += 5
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(edu.year || '', 20, y)
        y += 8
      })
    }
    const name = (data.personalInfo?.fullName || 'resume').replace(/\s+/g, '_')
    doc.save(`${name}_resume.pdf`)
  } catch (err) {
    console.error('PDF error:', err)
    alert('PDF failed: ' + err)
  }
}

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left Side - Form Fields (40%) */}
        <div style={{ 
          width: '40%', 
          backgroundColor: 'white',
          borderRight: '1px solid #E5E7EB',
          overflow: 'auto',
          padding: '2rem'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              Resume Editor
            </h1>
            <p style={{ color: '#6B7280', margin: 0 }}>
              Edit your resume details on the left, see live preview on the right
            </p>
          </div>

          {/* Personal Info Section */}
          <SectionHeader 
  id="personalInfo" 
  title="Personal Information" 
  icon={<User />}
  expandedSections={expandedSections}
  toggleSection={toggleSection}
  onAIAssist={handleAIAssist}
>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input
                id="fullName-input"
                type="text"
                placeholder="Full Name"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                id="jobTitle-input"
                type="text"
                placeholder="Job Title"
                value={resumeData.personalInfo.jobTitle}
                onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                id="email-input"
                type="email"
                placeholder="Email"
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                id="phone-input"
                type="tel"
                placeholder="Phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                id="location-input"
                type="text"
                placeholder="Location"
                value={resumeData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
              <input
                id="linkedin-input"
                type="url"
                placeholder="LinkedIn URL"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </SectionHeader>

          {/* Summary Section */}
          <SectionHeader 
  id="summary" 
  title="Professional Summary" 
  icon={<FileText />}
  expandedSections={expandedSections}
  toggleSection={toggleSection}
  onAIAssist={handleAIAssist}
>
            <textarea
              id="summary-textarea"
              placeholder="Write a brief professional summary..."
              value={resumeData.summary}
              onChange={(e) => updateSummary(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '0.875rem',
                resize: 'vertical'
              }}
            />
          </SectionHeader>

          {/* Experience Section */}
          <SectionHeader 
  id="experience" 
  title="Work Experience" 
  icon={<Briefcase />}
  expandedSections={expandedSections}
  toggleSection={toggleSection}
  onAIAssist={handleAIAssist}
>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} style={{ padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>Experience Entry</h4>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                    >
                      <X style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <input
                      id={`jobTitle-${exp.id}`}
                      type="text"
                      placeholder="Job Title"
                      value={exp.jobTitle}
                      onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      id={`company-${exp.id}`}
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        id={`startDate-${exp.id}`}
                        type="text"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                      <input
                        id={`endDate-${exp.id}`}
                        type="text"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addExperience}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  border: '2px dashed #E5E7EB',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Add Experience
              </button>
            </div>
          </SectionHeader>

          {/* Skills Section */}
          <SectionHeader 
  id="skills" 
  title="Skills" 
  icon={<Code />}
  expandedSections={expandedSections}
  toggleSection={toggleSection}
  onAIAssist={handleAIAssist}
>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Technical Skills
                </label>
                <input
                  id="technical-skills-input"
                  type="text"
                  placeholder="Enter technical skills separated by commas"
                  value={resumeData.skills.technical.join(', ')}
                  onChange={(e) => updateSkills('technical', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Soft Skills
                </label>
                <input
                  id="soft-skills-input"
                  type="text"
                  placeholder="Enter soft skills separated by commas"
                  value={resumeData.skills.soft.join(', ')}
                  onChange={(e) => updateSkills('soft', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
          </SectionHeader>

          {/* Education Section */}
          <SectionHeader 
  id="education" 
  title="Education" 
  icon={<GraduationCap />}
  expandedSections={expandedSections}
  toggleSection={toggleSection}
  onAIAssist={handleAIAssist}
>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resumeData.education.map((edu) => (
                <div key={edu.id} style={{ padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>Education Entry</h4>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: '0.25rem'
                      }}
                    >
                      <X style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <input
                      id={`degree-${edu.id}`}
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      id={`achievements-${edu.id}`}
                      type="text"
                      placeholder="Achievements"
                      value={edu.achievements}
                      onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      id={`institution-${edu.id}`}
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        id={`edu-year-${edu.id}`}
                        type="text"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                      <input
                        id={`edu-grade-${edu.id}`}
                        type="text"
                        placeholder="Grade"
                        value={edu.grade}
                        onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addEducation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  border: '2px dashed #E5E7EB',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Add Education
              </button>
            </div>
          </SectionHeader>
        </div>

        {/* Right Side - Live Preview (60%) */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#F3F4F6',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Preview Controls */}
          <div style={{
            backgroundColor: 'white',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6B7280' }}>
                Live Preview - {template.charAt(0).toUpperCase() + template.slice(1)} Template
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => window.location.href = '/dashboard/templates'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw style={{ width: '16px', height: '16px' }} />
                Change Template
              </button>
              <button
                onClick={downloadPDF}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <Download style={{ width: '16px', height: '16px' }} />
                Download PDF
              </button>
            </div>
          </div>

          {/* Template Preview Area */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '2rem',
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: 'white',
              width: '210mm',
              minHeight: '297mm',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <TemplatePreview data={resumeData} template={template} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
