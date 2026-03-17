'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, FileText, Download, RotateCcw, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CoverLetterGenerator() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    skills: '',
    experience: ''
  })
  
  const [coverLetter, setCoverLetter] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateCoverLetter = async () => {
  if (!formData.company || !formData.role) {
    alert('Please fill in Company Name and Job Title')
    return
  }
  setIsGenerating(true)
  setCoverLetter('')
  try {
    const response = await fetch('/api/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: formData.company,
        jobTitle: formData.role,
        resumeData: JSON.parse(localStorage.getItem('resumeData') || '{}')
      })
    })
    if (!response.ok) {
      throw new Error('Failed to generate cover letter')
    }
    const data = await response.json()
    setCoverLetter(data.letter || '')
  } catch (error) {
    console.error('Error generating cover letter:', error)
    alert('Failed to generate cover letter. Please try again.')
  } finally {
    setIsGenerating(false)
  }
}

  const handleRegenerate = () => {
    generateCoverLetter()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    alert('Cover letter copied to clipboard!')
  }

  const handleDownload = () => {
    window.print()
  }

  const tones = [
    { value: 'formal', label: 'Formal', description: 'Professional and traditional tone' },
    { value: 'friendly', label: 'Friendly', description: 'Approachable and conversational tone' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate tone' }
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
            Cover Letter Generator
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
            Create personalized cover letters that highlight your achievements and match the job requirements
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Column - Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Cover Letter Details
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g., Google Inc."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="e.g., Senior Software Engineer"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Hiring Manager (optional)
                  </label>
                  <input
                    type="text"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                        placeholder="e.g., 5 years of experience"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Tone
                  </label>
                  <select
                    value="professional"
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  >
                    {tones.map((tone) => (
                      <option key={tone.value} value={tone.value}>
                        {tone.label}
                      </option>
                    ))}
                  </select>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {tones.find((t) => t.value === 'professional')?.description}
                  </div>
                </div>
              </div>

              <button
                onClick={generateCoverLetter}
                disabled={isGenerating || !formData.company || !formData.role}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isGenerating || !formData.company || !formData.role ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: isGenerating || !formData.company || !formData.role ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isGenerating ? (
                  <>
                    <Send style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText style={{ width: '16px', height: '16px' }} />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Right Column - Generated Cover Letter */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                minHeight: '500px'
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>
                Generated Cover Letter
              </h2>
              
              {isStreaming && !coverLetter && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#6b7280', 
                  padding: '2rem',
                  fontSize: '0.875rem'
                }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    border: '3px solid #3b82f6', 
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  Generating your personalized cover letter...
                </div>
              )}

              {coverLetter && (
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '1.5rem', 
                  borderRadius: '8px', 
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {coverLetter.split('\n').map((paragraph, index) => (
                    <p key={index} style={{ marginBottom: '1rem' }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {coverLetter && (
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  marginTop: '1.5rem'
                }}>
                  <button
                    onClick={handleRegenerate}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <RotateCcw style={{ width: '16px', height: '16px' }} />
                    Regenerate
                  </button>
                  
                  <button
                    onClick={handleCopy}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Copy style={{ width: '16px', height: '16px' }} />
                    Copy to Clipboard
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Download style={{ width: '16px', height: '16px' }} />
                    Download as PDF
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
