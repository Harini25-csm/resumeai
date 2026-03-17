'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

export default function JobOptimizer() {
  const [jobDescription, setJobDescription] = useState('')
  const [resumeData, setResumeData] = useState<any>({})
  const [optimizationResult, setOptimizationResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeData) return

    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: resumeData,
          jobDescription: jobDescription
        })
      })

      if (response.ok) {
        const data = await response.json()
        setOptimizationResult(data)
      } else {
        throw new Error('Failed to analyze resume')
      }
    } catch (error) {
      console.error('Error analyzing resume:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAutoOptimize = async () => {
    if (!optimizationResult) return

    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: resumeData,
          jobDescription: jobDescription,
          autoOptimize: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResumeData(data.optimized_resume)
        // Show success toast
        alert('Resume optimized successfully!')
      }
    } catch (error) {
      console.error('Error optimizing resume:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Excellent Match'
    if (score >= 50) return 'Good Match'
    return 'Needs Improvement'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
            Job Description Optimizer
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
            Optimize your resume for specific job applications and increase your ATS score
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Column - Input */}
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
                Job Description
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isAnalyzing || !jobDescription.trim() ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: isAnalyzing || !jobDescription.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target style={{ width: '16px', height: '16px' }} />
                    Analyze & Optimize
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Right Column - Results */}
          <div>
            {optimizationResult ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ 
                  backgroundColor: 'white', 
                  padding: '2rem', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                }}
              >
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>
                  Analysis Results
                </h2>

                {/* ATS Score Meter */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                      ATS Score
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: getScoreColor(optimizationResult.score) }}>
                      {optimizationResult.score}/100
                    </span>
                  </div>
                  
                  {/* Circular Progress */}
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e5e7eb', 
                    position: 'relative',
                    overflow: 'hidden',
                    margin: '0 auto'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: `conic-gradient(${getScoreColor(optimizationResult.score)} ${optimizationResult.score * 3.6}deg, #e5e7eb 0deg)`,
                      transition: 'all 0.5s'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: getScoreColor(optimizationResult.score)
                      }}>
                        {optimizationResult.score}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: getScoreColor(optimizationResult.score) 
                    }}>
                      {getScoreLabel(optimizationResult.score)}
                    </span>
                  </div>
                </div>

                {/* Keywords Analysis */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                    Keywords Analysis
                  </h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Missing Keywords ({optimizationResult.missing_keywords?.length || 0})
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {optimizationResult.missing_keywords?.map((keyword: string, index: number) => (
                        <span key={index} style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#fef2f2',
                          color: '#991b1b',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          border: '1px solid #fca5a5'
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
                      Matched Keywords ({optimizationResult.matched_keywords?.length || 0})
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {optimizationResult.matched_keywords?.map((keyword: string, index: number) => (
                        <span key={index} style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#f0fdf4',
                          color: '#166534',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          border: '1px solid #10b981'
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Before/After Comparison */}
                {optimizationResult.bullet_comparison && (
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                      Resume Improvements
                    </h3>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                      {optimizationResult.bullet_comparison.map((comparison: any, index: number) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                          <div style={{ fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Before:
                          </div>
                          <div style={{ color: '#ef4444', marginBottom: '0.5rem' }}>
                            {comparison.before}
                          </div>
                          <div style={{ fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
                            After:
                          </div>
                          <div style={{ color: '#10b981' }}>
                            {comparison.after}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-Optimize Button */}
                <button
                  onClick={handleAutoOptimize}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <RefreshCw style={{ width: '20px', height: '20px' }} />
                  Auto-Optimize Resume
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ 
                  backgroundColor: 'white', 
                  padding: '2rem', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}
              >
                <AlertCircle style={{ width: '48px', height: '48px', color: '#9ca3af', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                  No Analysis Yet
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Paste a job description and click "Analyze & Optimize" to see how well your resume matches
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
