'use client'

import { useState } from 'react'
import { Edit2, Plus, Trash2, Check, X, Briefcase, Calendar, Building } from 'lucide-react'
import EditableText from './EditableText'
import EditableTextarea from './EditableTextarea'

interface Experience {
  id: string
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

interface ExperienceSectionProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
  className?: string
}

export default function ExperienceSection({ experiences, onChange, className = '' }: ExperienceSectionProps) {
  const [addingNew, setAddingNew] = useState(false)

  const handleAdd = () => {
    setAddingNew(true)
  }

  const handleSave = (id: string, field: keyof Experience, value: string) => {
    const updatedExperiences = experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    )
    onChange(updatedExperiences)
  }

  const handleDelete = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id)
    onChange(updatedExperiences)
  }

  const handleSaveNew = (newExperience: Experience) => {
    if (newExperience.title && newExperience.company) {
      onChange([...experiences, newExperience])
    }
    setAddingNew(false)
  }

  const handleCancelNew = () => {
    setAddingNew(false)
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-1">
          Experience
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="group relative">
            <div className="space-y-2">
              <EditableText
                value={exp.title}
                onChange={(value) => handleSave(exp.id, 'title', value)}
                className="font-semibold text-gray-900"
                placeholder="Job Title (e.g., Senior Software Engineer)"
              />
              
              <EditableText
                value={exp.company}
                onChange={(value) => handleSave(exp.id, 'company', value)}
                className="text-gray-600"
                placeholder="Company (e.g., Tech Corp)"
              />
              
              <EditableText
                value={`${exp.startDate} - ${exp.endDate}`}
                onChange={(value) => {
                  const parts = value.split(' - ')
                  handleSave(exp.id, 'startDate', parts[0] || '')
                  handleSave(exp.id, 'endDate', parts[1] || '')
                }}
                className="text-sm text-gray-500"
                placeholder="June 2020 - Present"
              />
              
              <EditableTextarea
                value={exp.description}
                onChange={(value) => handleSave(exp.id, 'description', value)}
                className="text-gray-700"
                placeholder="Describe your role, achievements, and responsibilities..."
                rows={3}
              />
            </div>

            <button
              onClick={() => handleDelete(exp.id)}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
              title="Delete experience"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {addingNew && (
          <div className="space-y-3 p-4 border border-blue-400 rounded-lg bg-blue-50">
            <h3 className="font-medium text-gray-900 mb-3">Add New Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g., Tech Corp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g., June 2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-start-date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="text"
                  placeholder="e.g., Present or May 2023"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-end-date"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Describe your role, achievements, and responsibilities..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                id="new-description"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const title = (document.getElementById('new-title') as HTMLInputElement)?.value || ''
                  const company = (document.getElementById('new-company') as HTMLInputElement)?.value || ''
                  const startDate = (document.getElementById('new-start-date') as HTMLInputElement)?.value || ''
                  const endDate = (document.getElementById('new-end-date') as HTMLInputElement)?.value || ''
                  const description = (document.getElementById('new-description') as HTMLTextAreaElement)?.value || ''
                  
                  handleSaveNew({
                    id: Date.now().toString(),
                    title,
                    company,
                    startDate,
                    endDate,
                    description
                  })
                }}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4 inline mr-1" />
                Save
              </button>
              <button
                onClick={handleCancelNew}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4 inline mr-1" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {experiences.length === 0 && !addingNew && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No experience added yet</p>
            <button
              onClick={handleAdd}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first experience
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
