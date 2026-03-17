'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Eye, Check } from 'lucide-react'
import { downloadResume, isPDFExportAvailable } from '@/utils/exportResume'

interface ResumePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  template: {
    id: string
    name: string
    color: string
  }
  onUseTemplate: (template: any) => void
}

export default function ResumePreviewModal({ 
  isOpen, 
  onClose, 
  template, 
  onUseTemplate 
}: ResumePreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPDFAvailable, setIsPDFAvailable] = useState(false)

  useEffect(() => {
    // Check if PDF export is available
    setIsPDFAvailable(isPDFExportAvailable())
  }, [])

  const handleDownloadPDF = async () => {
    if (!isPDFAvailable) {
      alert('PDF export is loading. Please try again in a moment.')
      return
    }

    setIsDownloading(true)
    try {
      await downloadResume('resume-preview', {
        filename: `${template.name.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`
      })
    } catch (error) {
      console.error('PDF download failed:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleUseTemplate = () => {
    // Save to localStorage
    localStorage.setItem('selectedTemplate', template.id)
    localStorage.setItem('selectedColor', template.color)
    
    // Call parent handler
    onUseTemplate(template)
    
    // Close modal
    onClose()
  }

  const getResumeContent = () => {
    switch (template.id) {
      case 'modern':
        return getModernResume()
      case 'classic':
        return getClassicResume()
      case 'creative':
        return getCreativeResume()
      case 'minimal':
        return getMinimalResume()
      default:
        return getModernResume()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: template.color }}
                >
                  {template.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {template.name} Template
                  </h2>
                  <p className="text-sm text-gray-600">
                    Professional resume preview
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto relative">
              <div className="p-6 bg-gray-50">
                {/* Resume Preview */}
                <div 
                  id="resume-preview"
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                  style={{ minHeight: '600px' }}
                >
                  {getResumeContent()}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('selectedTemplate', template.id)
                    localStorage.setItem('selectedTemplateColor', template.color)
                    onUseTemplate(template)
                    onClose()
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Use This Template
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('selectedTemplate', template.id)
                    localStorage.setItem('selectedTemplateColor', template.color)
                    window.location.href = '/dashboard/editor'
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  ✏️ Edit This Template →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Template Preview Components
function getModernResume() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">John Doe</h1>
        <p className="text-lg text-gray-600 mb-4">Senior Software Engineer</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>📧 john.doe@email.com</span>
          <span>📱 (555) 123-4567</span>
          <span>📍 San Francisco, CA</span>
          <span>🔗 linkedin.com/in/johndoe</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-blue-500 pb-1">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Experienced software engineer with 5+ years of expertise in full-stack development, 
          specializing in React, Node.js, and cloud technologies. Proven track record of 
          delivering scalable solutions and improving system performance by 40%.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-blue-500 pb-1">
          Experience
        </h2>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Senior Software Engineer</h3>
          <p className="text-gray-600">Tech Corp • San Francisco, CA</p>
          <p className="text-sm text-gray-500 mb-2">June 2020 - Present</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Led team of 4 engineers to launch new product features</li>
            <li>Improved application performance by 40% through optimization</li>
            <li>Implemented CI/CD pipelines reducing deployment time by 60%</li>
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-blue-500 pb-1">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'].map(skill => (
            <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-blue-500 pb-1">
          Education
        </h2>
        <div>
          <h3 className="font-semibold text-gray-900">Bachelor of Science in Computer Science</h3>
          <p className="text-gray-600">University of California, Berkeley</p>
          <p className="text-sm text-gray-500">Graduated: May 2017</p>
        </div>
      </div>
    </div>
  )
}

function getClassicResume() {
  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JOHN DOE</h1>
        <p className="text-lg text-gray-600 mb-4">Senior Software Engineer</p>
        <div className="text-sm text-gray-600 space-y-1">
          <p>123 Main Street, San Francisco, CA 94102</p>
          <p>(555) 123-4567 • john.doe@email.com</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 uppercase mb-3">Professional Summary</h2>
        <p className="text-gray-700 leading-relaxed text-justify">
          Results-driven software engineer with extensive experience in full-stack development 
          and cloud architecture. Demonstrated success in leading technical teams and delivering 
          high-impact solutions that drive business growth and operational efficiency.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 uppercase mb-3">Professional Experience</h2>
        <div className="mb-4">
          <h3 className="font-bold text-gray-900">Senior Software Engineer</h3>
          <p className="text-gray-600 italic">Tech Corp, San Francisco, CA</p>
          <p className="text-sm text-gray-500 mb-2">June 2020 – Present</p>
          <p className="text-gray-700">
            • Directed cross-functional teams in the development and deployment of enterprise-scale applications<br/>
            • Optimized system architecture resulting in 40% performance improvement<br/>
            • Established CI/CD workflows that reduced deployment time by 60%
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 uppercase mb-3">Technical Skills</h2>
        <p className="text-gray-700">
          JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL, Git, REST APIs, Microservices
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 uppercase mb-3">Education</h2>
        <div>
          <h3 className="font-bold text-gray-900">Bachelor of Science in Computer Science</h3>
          <p className="text-gray-600">University of California, Berkeley, CA</p>
          <p className="text-sm text-gray-500">May 2017</p>
        </div>
      </div>
    </div>
  )
}

function getCreativeResume() {
  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">John Doe</h1>
            <p className="text-xl text-purple-600 font-semibold">Senior Software Engineer</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">📧 john.doe@email.com</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">📱 (555) 123-4567</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">🌐 linkedin.com/in/johndoe</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Passionate software engineer with a creative approach to problem-solving. 
              I love building elegant solutions that make a real difference in users' lives.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Experience Journey
            </h2>
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-purple-200">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Senior Software Engineer</h3>
                <p className="text-purple-600">Tech Corp • 2020 - Present</p>
                <p className="text-gray-700 text-sm">Leading innovative projects and mentoring teams</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Skills
            </h2>
            <div className="space-y-2">
              {['JavaScript', 'React', 'Node.js', 'Python', 'AWS'].map(skill => (
                <div key={skill} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Education
            </h2>
            <div className="text-gray-700">
              <p className="font-semibold">UC Berkeley</p>
              <p className="text-sm">B.S. Computer Science • 2017</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getMinimalResume() {
  return (
    <div className="p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-2">John Doe</h1>
          <p className="text-lg text-gray-600 mb-4">Senior Software Engineer</p>
          <div className="text-gray-500 text-sm space-y-1">
            <p>john.doe@email.com • (555) 123-4567</p>
            <p>San Francisco, CA • linkedin.com/in/johndoe</p>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <p className="text-gray-700 leading-relaxed max-w-2xl">
              Software engineer with 5+ years of experience building scalable web applications. 
              Passionate about clean code, user experience, and continuous learning.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Experience</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-gray-900">Senior Software Engineer</h4>
                <p className="text-gray-600">Tech Corp • 2020 – Present</p>
                <p className="text-gray-700 mt-2">
                  Led development of microservices architecture, improved system performance by 40%, 
                  and mentored junior developers.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Skills</h3>
            <p className="text-gray-700">
              JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Education</h3>
            <p className="text-gray-700">
              Bachelor of Science in Computer Science<br/>
              University of California, Berkeley • 2017
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
