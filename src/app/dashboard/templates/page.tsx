'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Eye, Download, Star } from 'lucide-react'
import ResumePreviewModal from '@/components/ResumePreviewModal'

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const templates = useMemo(() => [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional with a modern two-column layout',
      color: '#3B82F6'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional black and white design for conservative industries',
      color: '#000000'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and colorful design for creative professionals',
      color: '#8B5CF6'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean typography with lots of whitespace',
      color: '#10B981'
    }
  ], [])

  const handleTemplateSelect = (templateId: string, color: string) => {
    setSelectedTemplate(templateId)
    setSelectedColor(color)
    localStorage.setItem('selectedTemplate', templateId)
    localStorage.setItem('selectedColor', color)
  }

  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPreviewTemplate(null)
  }

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Template
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional templates designed for every industry and career level
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ overflowY: 'auto' }}>
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                {/* Template Preview */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
                  <div 
                    className="absolute inset-0 p-4"
                    style={{ backgroundColor: template.color }}
                  >
                    <div className="text-white text-center">
                      <div className="text-3xl font-bold mb-2">
                        {template.name}
                      </div>
                      <div className="text-sm opacity-80">
                        {template.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mini Resume Preview */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/95 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-3 shadow-lg">
                      <div className="text-xs text-gray-500 mb-2">John Doe</div>
                      <div className="text-sm font-semibold text-gray-800 mb-1">Software Engineer</div>
                      <div className="text-xs text-gray-600 mb-2">San Francisco, CA</div>
                      
                      {/* Mini Resume Content */}
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 rounded w-16 mb-1"></div>
                        <div className="h-1 bg-gray-300 rounded w-12 mb-1"></div>
                        <div className="h-1 bg-gray-300 rounded w-20 mb-1"></div>
                        <div className="h-1 bg-gray-300 rounded w-8 mb-1"></div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              localStorage.setItem('selectedTemplate', template.id)
                              localStorage.setItem('selectedColor', template.color)
                              window.location.href = '/dashboard/onboarding'
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Use This Template
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              localStorage.setItem('selectedTemplate', template.id)
                              localStorage.setItem('selectedTemplateColor', template.color)
                              window.location.href = '/dashboard/editor'
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                          >
                            ✏️ Edit
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePreviewTemplate(template)
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/dashboard/editor?template=${template.id}`}
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  if (selectedTemplate) {
                    localStorage.setItem('selectedTemplate', selectedTemplate)
                    localStorage.setItem('selectedColor', selectedColor)
                    window.location.href = '/dashboard/onboarding'
                  }
                }}
                disabled={!selectedTemplate}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use This Template
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-all duration-300"
              >
                Back to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {isModalOpen && previewTemplate && (
        <ResumePreviewModal
          template={previewTemplate}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUseTemplate={() => handleTemplateSelect(previewTemplate.id, previewTemplate.color)}
        />
      )}
    </div>
  )
}
