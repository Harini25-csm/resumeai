'use client'

import { useState } from 'react'
import { useResumeGenerator } from '@/hooks/useResumeGenerator'
import { Loader2, Sparkles } from 'lucide-react'

export default function AIResumeGenerator() {
  const [formData, setFormData] = useState({
    role: '',
    skills: '',
    experience: '',
    education: ''
  })
  
  const { generateResume, isLoading, error, data } = useResumeGenerator()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await generateResume({
      role: formData.role,
      skills: formData.skills,
      experience: formData.experience,
      education: formData.education
    })
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        AI Resume Generator
      </h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Target Role
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g., Software Engineer, Product Manager"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Skills
          </label>
          <textarea
            value={formData.skills}
            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
            placeholder="e.g., JavaScript, React, Node.js, Python, AWS"
            required
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Experience
          </label>
          <textarea
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            placeholder="Describe your relevant work experience..."
            required
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Education (Optional)
          </label>
          <textarea
            value={formData.education}
            onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
            placeholder="e.g., Bachelor of Science in Computer Science, University Name, 2020"
            rows={2}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          {isLoading ? (
            <>
              <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles style={{ width: '20px', height: '20px' }} />
              Generate Resume
            </>
          )}
        </button>
      </form>
      
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <p style={{ color: '#dc2626', margin: 0 }}>Error: {error}</p>
        </div>
      )}
      
      {data && (
        <div style={{
          padding: '2rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Generated Resume Content
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
              Professional Summary
            </h4>
            <p style={{ lineHeight: '1.6', color: '#64748b' }}>{data.summary}</p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
              Key Skills
            </h4>
            <p style={{ lineHeight: '1.6', color: '#64748b' }}>{data.skills}</p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
              Professional Achievements
            </h4>
            <p style={{ lineHeight: '1.6', color: '#64748b' }}>{data.achievements}</p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
              Experience Bullet Points
            </h4>
            <p style={{ lineHeight: '1.6', color: '#64748b' }}>{data.bulletPoints}</p>
          </div>
        </div>
      )}
    </div>
  )
}
