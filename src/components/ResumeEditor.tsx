'use client'

import { useState, useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Download, FileText, Eye, User, Loader2, Upload } from 'lucide-react'
import ResumePreview from './ResumePreview'
import { createClientInstance } from '@/lib/supabase'
import { ResumeData } from '@/types/resume'

const defaultData: ResumeData = {
  summary: '',
  experience: [{ title: '', company: '', dates: '', bullets: [''] }],
  skills: [''],
  education: [{ degree: '', school: '', dates: '' }]
}

export default function ResumeEditor({ initialData, userId }: { initialData: any, userId: string }) {
  const [data, setData] = useState<ResumeData>(defaultData)
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern')
  const [persona, setPersona] = useState<'Software Engineer' | 'Product Manager' | 'Data Scientist' | 'Designer' | 'Marketing'>('Software Engineer')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSwitchingPersona, setIsSwitchingPersona] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClientInstance()

  // Auto-save to Supabase on data changes
  useEffect(() => {
    const saveData = async () => {
      if (!userId) return
      
      setIsSaving(true)
      try {
        const { error } = await supabase
          .from('resumes')
          .upsert({
            user_id: userId,
            title: 'My Resume',
            content: data,
            template_id: template,
            ats_score: 0
          })

        if (!error) {
          setLastSaved(new Date())
        }
      } catch (error) {
        console.error('Error saving resume:', error)
      } finally {
        setIsSaving(false)
      }
    }

    const timeoutId = setTimeout(saveData, 1000) // Debounce save
    return () => clearTimeout(timeoutId)
  }, [data, template, userId])

  const updateData = (section: keyof ResumeData, value: any) => {
    setData(prev => ({ ...prev, [section]: value }))
  }

  const addExperience = () => {
    updateData('experience', [...data.experience, { title: '', company: '', dates: '', bullets: [''] }])
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...data.experience]
    updated[index] = { ...updated[index], [field]: value }
    updateData('experience', updated)
  }

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...data.experience]
    updated[expIndex].bullets[bulletIndex] = value
    updateData('experience', updated)
  }

  const addBullet = (expIndex: number) => {
    const updated = [...data.experience]
    updated[expIndex].bullets.push('')
    updateData('experience', updated)
  }

  const removeExperience = (index: number) => {
    const updated = data.experience.filter((_, i) => i !== index)
    updateData('experience', updated)
  }

  const addEducation = () => {
    updateData('education', [...data.education, { degree: '', school: '', dates: '' }])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...data.education]
    updated[index] = { ...updated[index], [field]: value }
    updateData('education', updated)
  }

  const removeEducation = (index: number) => {
    const updated = data.education.filter((_, i) => i !== index)
    updateData('education', updated)
  }

  const downloadPDF = async () => {
    const blob = await pdf(<ResumePreview data={data} template={template} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      if (file.type === 'application/pdf') {
        // Handle PDF upload with better parsing
        const arrayBuffer = await file.arrayBuffer()
        const pdfText = await extractPDFText(arrayBuffer)
        const parsedData = parseResumeFromText(pdfText)
        setData(parsedData)
      } else if (file.type.startsWith('image/')) {
        // Handle image upload for resume photos
        const base64 = await fileToBase64(file)
        
        // Add image to resume data (e.g., profile photo)
        setData(prevData => ({
          ...prevData,
          profilePhoto: {
            name: file.name,
            type: file.type,
            data: base64
          }
        }))
        
        // Show success message for photo upload
        alert('Profile photo uploaded successfully!')
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.type === 'application/msword') {
        // Handle Word documents
        const text = await extractDocText(file)
        const parsedData = parseResumeFromText(text)
        setData(parsedData)
      } else {
        // Handle other text-based files
        const text = await file.text()
        const parsedData = parseResumeFromText(text)
        setData(parsedData)
      }
      
      // Show success message
      alert(`File "${file.name}" uploaded successfully!`)
      
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Failed to upload "${file.name}". Please try again.`)
    } finally {
      setIsUploading(false)
      // Clear the file input
      event.target.value = ''
    }
  }

  const extractPDFText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    // In a real implementation, you'd use a PDF library like pdf-parse
    // For now, return a placeholder
    return "PDF resume content - parsing would extract full text here"
  }

  const extractDocText = async (file: File): Promise<string> => {
    // In a real implementation, you'd use a library like mammoth
    // For now, return a placeholder
    return "Word document content - parsing would extract full text here"
  }

  const parseResumeFromText = (text: string): ResumeData => {
    // Simple text parsing - in production, you'd use a proper resume parser
    const lines = text.split('\n').filter(line => line.trim())
    const experience: any[] = []
    const skills = []
    const education: any[] = []

    let currentSection = ''
    
    for (const line of lines) {
      if (line.toLowerCase().includes('experience')) {
        currentSection = 'experience'
      } else if (line.toLowerCase().includes('skills')) {
        currentSection = 'skills'
      } else if (line.toLowerCase().includes('education')) {
        currentSection = 'education'
      } else if (line.trim() && currentSection === 'skills') {
        skills.push(line.trim())
      }
    }

    return {
      summary: lines[0] || '',
      experience: experience.length > 0 ? experience : [{ title: '', company: '', dates: '', bullets: [''] }],
      skills: skills.length > 0 ? skills : [''],
      education: education.length > 0 ? education : [{ degree: '', school: '', dates: '' }]
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleOptimizedResume = (optimizedData: ResumeData) => {
    setData(optimizedData)
  }

  const switchPersona = async (newPersona: typeof persona) => {
    if (newPersona === persona) return
    
    setIsSwitchingPersona(true)
    
    try {
      const response = await fetch('/api/switch-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ persona: newPersona })
      })

      if (!response.ok) throw new Error('Failed to switch persona')

      const result = await response.json()
      
      if (result.success) {
        setData(result.resume)
        setPersona(newPersona)
        
        // Show success message
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2'
        toast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Resume reframed for ${newPersona}</span>
        `
        document.body.appendChild(toast)
        
        setTimeout(() => {
          toast.remove()
        }, 3000)
      }
    } catch (error) {
      console.error('Error switching persona:', error)
      alert('Failed to switch persona. Please try again.')
    } finally {
      setIsSwitchingPersona(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Resume Editor</h1>
          
          {/* Template Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Template:</span>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as any)}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          {/* Persona Switcher */}
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-600" />
            <select
              value={persona}
              onChange={(e) => switchPersona(e.target.value as any)}
              disabled={isSwitchingPersona}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Designer">Designer</option>
              <option value="Marketing">Marketing</option>
            </select>
            {isSwitchingPersona && (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isSaving && <span className="text-sm text-gray-500">Saving...</span>}
          {lastSaved && !isSaving && (
            <span className="text-sm text-green-600">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          {/* Upload Button */}
          <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Resume/Photo</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Editor (40%) */}
        <div className="w-2/5 bg-gray-50 overflow-y-auto border-r">
          <div className="p-6 space-y-8">
            {/* Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Professional Summary</h3>
              <textarea
                value={data.summary}
                onChange={(e) => updateData('summary', e.target.value)}
                placeholder="Write a compelling summary of your professional background..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Experience</h3>
                <button
                  onClick={addExperience}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Experience
                </button>
              </div>
              
              {data.experience.map((exp, expIndex) => (
                <div key={expIndex} className="bg-white p-4 rounded-lg border mb-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      value={exp.title}
                      onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      value={exp.company}
                      onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                      placeholder="Company"
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <input
                    value={exp.dates}
                    onChange={(e) => updateExperience(expIndex, 'dates', e.target.value)}
                    placeholder="Dates (e.g., Jan 2020 - Present)"
                    className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="space-y-2">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex space-x-2">
                        <input
                          value={bullet}
                          onChange={(e) => updateExperienceBullet(expIndex, bulletIndex, e.target.value)}
                          placeholder="• Achievement or responsibility..."
                          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => addBullet(expIndex)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      + Add Bullet Point
                    </button>
                  </div>
                  
                  {data.experience.length > 1 && (
                    <button
                      onClick={() => removeExperience(expIndex)}
                      className="text-red-600 hover:text-red-700 text-sm mt-2"
                    >
                      Remove Experience
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Skills</h3>
              {data.skills.map((skill, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    value={skill}
                    onChange={(e) => {
                      const updated = [...data.skills]
                      updated[index] = e.target.value
                      updateData('skills', updated)
                    }}
                    placeholder="Skill or technology"
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button
                onClick={() => updateData('skills', [...data.skills, ''])}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add Skill
              </button>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Education</h3>
                <button
                  onClick={addEducation}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Add Education
                </button>
              </div>
              
              {data.education.map((edu, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border mb-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Degree"
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      placeholder="School"
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <input
                    value={edu.dates}
                    onChange={(e) => updateEducation(index, 'dates', e.target.value)}
                    placeholder="Graduation Date"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  {data.education.length > 1 && (
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700 text-sm mt-2"
                    >
                      Remove Education
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Preview (60%) */}
        <div className="flex-1 bg-white overflow-hidden">
          <div className="h-full overflow-y-auto">
            <ResumePreview data={data} template={template} />
          </div>
        </div>
      </div>
    </div>
  )
}
