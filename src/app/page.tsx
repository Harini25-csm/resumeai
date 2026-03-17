'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Target, FileText, Github, Star } from 'lucide-react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #e0e7ff, #f3e7ff)' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center', padding: '4rem 0' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                  AI Resume Builder
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
                  Create professional resumes in minutes with AI
                </p>
              </div>
              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                Get Started
                <ArrowRight style={{ width: '20px', height: '20px', marginLeft: '0.5rem' }} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: '3rem' }}>
            Why Choose Our AI Resume Builder?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '1rem', 
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <Zap style={{ width: '48px', height: '48px', color: '#3b82f6', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                  AI-Powered Content
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                  Our AI analyzes your experience and generates professional, tailored content that highlights your strengths and achievements.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '1rem', 
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <Target style={{ width: '48px', height: '48px', color: '#10b981', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                  ATS Optimization
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                  Built-in ATS scoring and keyword optimization to help your resume pass automated screening systems.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '1rem', 
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <Sparkles style={{ width: '48px', height: '48px', color: '#8b5cf6', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                  Beautiful Templates
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                  Choose from modern, professional templates designed to impress recruiters.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '1rem', 
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <Shield style={{ width: '48px', height: '48px', color: '#059669', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                  Cover Letters
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                  Generate personalized cover letters tailored to specific job applications.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: '#f9fafb', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: '3rem' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                Answer Questions
              </h3>
              <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                Our AI asks you 7 simple questions about your experience and skills.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                AI Generates Resume
              </h3>
              <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                AI processes your answers and creates a structured, professional resume.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                Download & Share
              </h3>
              <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                Download your resume as PDF or share it with recruiters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>
              Ready to Build Your Professional Resume?
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
              Join thousands of professionals who have already created their resumes with AI.
            </p>
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              Start Building Now
              <ArrowRight style={{ width: '20px', height: '20px', marginLeft: '0.5rem' }} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
