'use client'
import { useState, useEffect } from 'react'
import ModernTemplate from '@/components/templates/ModernTemplate'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import CreativeTemplate from '@/components/templates/CreativeTemplate'
import MinimalTemplate from '@/components/templates/MinimalTemplate'
import ResumeBuilder from '@/components/ResumeBuilder'

const templateMap: any = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
  executive: ModernTemplate,
  'fresh-graduate': MinimalTemplate
}

export default function EditorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [templateColor, setTemplateColor] = useState('#3B82F6')

  useEffect(() => {
    const template = localStorage.getItem('selectedTemplate') || 'modern'
    const color = localStorage.getItem('selectedTemplateColor') || '#3B82F6'
    setSelectedTemplate(template)
    setTemplateColor(color)
  }, [])

  const TemplateComponent = templateMap[selectedTemplate]

  return <ResumeBuilder template={selectedTemplate} color={templateColor} />
}
