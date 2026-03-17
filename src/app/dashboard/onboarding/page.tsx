'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { Send, Loader2, Sparkles } from 'lucide-react'
import { useResumeGenerator } from '@/hooks/useResumeGenerator'

function OnboardingChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const template = searchParams.get('template') || 'modern'
  const color = searchParams.get('color') || '#3B82F6'
  
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  
  const { generateResume, isLoading: isAILoading, error: aiError, data: aiData } = useResumeGenerator()
  
  // Auto-show AI results when data is available
  useEffect(() => {
    if (aiData) {
      setShowAIGenerator(true)
    }
  }, [aiData])

  // The 7 questions in order
  const questions = [
    'What is your full name and current job title?',
    'What is your email and phone number?',
    'Write a 2-3 sentence professional summary about yourself',
    'Tell me about your most recent job — company name, your role, start and end dates, and 3 key achievements with numbers',
    'List your top 5 technical skills and 3 soft skills',
    'What is your highest education — university, degree, graduation year?',
    'Describe your best project — name, what it does, technologies used, and its impact'
  ]

  const handleUserResponse = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    
    // Save the answer
    const newAnswers = { ...answers, [questions[currentSectionIndex]]: input }
    setAnswers(newAnswers)
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: input
    }])

    // Update progress
    const newProgress = ((currentSectionIndex + 1) / questions.length) * 100
    setProgress(newProgress)

    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false)
      
      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Great! Let me move to the next question.'
      }])

      // Move to next question
      if (currentSectionIndex < questions.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1)
      }
    }, 1000)

    // Clear input
    setInput('')
  }

  const handleGenerateResume = async () => {
    setIsLoading(true)
    
    try {
      // Extract information from answers for AI generation
      const role = answers[questions[0]] || 'Software Engineer'
      const skills = answers[questions[4]] || 'JavaScript, React, Node.js'
      const experience = answers[questions[3]] || 'Software development experience'
      const education = answers[questions[5]] || 'Bachelor\'s degree'
      
      // Generate AI resume
      await generateResume({
        role,
        skills,
        experience,
        education
      })
      
      // Send all answers to chat API for additional processing
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          template: template,
          color: color,
          aiData: aiData // Include AI generated data
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Save generated resume to Supabase
        // This would be implemented with the actual API integration
        
        // Redirect to editor
        router.push('/dashboard/editor')
      } else {
        throw new Error('Failed to generate resume')
      }
    } catch (error) {
      console.error('Error generating resume:', error)
      setIsLoading(false)
    }
  }

  const handleAIGeneration = async () => {
    const role = answers[questions[0]] || 'Software Engineer'
    const skills = answers[questions[4]] || 'JavaScript, React, Node.js'
    const experience = answers[questions[3]] || 'Software development experience'
    const education = answers[questions[5]] || 'Bachelor\'s degree'
    
    await generateResume({
      role,
      skills,
      experience,
      education
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            AI Resume Builder
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem' }}>
            Let me help you create a professional resume in minutes
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Progress: {Math.round(progress)}%
            </span>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {currentSectionIndex + 1} of {questions.length} questions answered
            </span>
          </div>
          <div style={{ 
            height: '8px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '4px', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              style={{ 
                height: '100%', 
                backgroundColor: color,
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Chat Interface */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ height: '500px', overflowY: 'auto', padding: '1.5rem' }}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: message.role === 'user' ? color : '#f3f4f6',
                    color: message.role === 'user' ? 'white' : '#111827'
                  }}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: '#f3f4f6',
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    <span>Processing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleUserResponse() }} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: isLoading || !input.trim() ? '#9ca3af' : color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isLoading ? (
                  <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  'Send'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* AI Quick Generation - Show after first 3 questions */}
        {currentSectionIndex >= 2 && currentSectionIndex < questions.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #0ea5e9' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles style={{ width: '20px', height: '20px', color: '#0ea5e9' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0c4a6e', margin: 0 }}>
                Want to speed things up?
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#0c4a6e', marginBottom: '1rem', lineHeight: '1.5' }}>
              Let AI generate your professional summary, skills, and achievements based on what you've told us so far.
            </p>
            <button
              onClick={handleAIGeneration}
              disabled={isAILoading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isAILoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0 auto'
              }}
            >
              {isAILoading ? (
                <>
                  <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles style={{ width: '16px', height: '16px' }} />
                  Generate with AI
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* AI Results Display */}
        {showAIGenerator && aiData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>AI-Generated Content</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Professional Summary</h5>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5' }}>{aiData.summary}</p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Key Skills</h5>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5' }}>{aiData.skills}</p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Achievements</h5>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5' }}>{aiData.achievements}</p>
            </div>
            
            <div>
              <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Experience Bullet Points</h5>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5' }}>{aiData.bulletPoints}</p>
            </div>
            
            {aiError && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>Error: {aiError}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Generate Resume Button - Only show after all 7 questions answered */}
        {currentSectionIndex >= questions.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginTop: '2rem' }}
          >
            <button
              onClick={handleGenerateResume}
              disabled={isLoading}
              style={{
                padding: '1rem 2rem',
                backgroundColor: color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Generate My Resume →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function OnboardingChat() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingChatContent />
    </Suspense>
  )
}
