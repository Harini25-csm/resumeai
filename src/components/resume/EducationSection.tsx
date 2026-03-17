'use client'

import { useState } from 'react'
import { Edit2, Plus, Trash2, Check, X, GraduationCap } from 'lucide-react'
import EditableText from './EditableText'

interface Education {
  id: string
  degree: string
  university: string
  year: string
}

interface EducationSectionProps {
  education: Education[]
  onChange: (education: Education[]) => void
  className?: string
}

export default function EducationSection({ education, onChange, className = '' }: EducationSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)

  const handleAdd = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      university: '',
      year: ''
    }
    setAddingNew(true)
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string, field: keyof Education, value: string) => {
    const updatedEducation = education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    )
    onChange(updatedEducation)
  }

  const handleDelete = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id)
    onChange(updatedEducation)
  }

  const handleSaveNew = (newEducation: Education) => {
    if (newEducation.degree && newEducation.university) {
      onChange([...education, newEducation])
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
          Education
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="group relative">
            <div className="space-y-2">
              <EditableText
                value={edu.degree}
                onChange={(value) => handleSave(edu.id, 'degree', value)}
                className="font-semibold text-gray-900"
                placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
              />
              
              <EditableText
                value={edu.university}
                onChange={(value) => handleSave(edu.id, 'university', value)}
                className="text-gray-600"
                placeholder="University (e.g., University of California, Berkeley)"
              />
              
              <EditableText
                value={edu.year}
                onChange={(value) => handleSave(edu.id, 'year', value)}
                className="text-sm text-gray-500"
                placeholder="Year (e.g., May 2017)"
              />
            </div>

            <button
              onClick={() => handleDelete(edu.id)}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
              title="Delete education"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {addingNew && (
          <div className="space-y-3 p-4 border border-blue-400 rounded-lg bg-blue-50">
            <h3 className="font-medium text-gray-900 mb-3">Add New Education</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-degree"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  placeholder="e.g., University of California, Berkeley"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-university"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="text"
                  placeholder="e.g., May 2017"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="new-year"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const degree = (document.getElementById('new-degree') as HTMLInputElement)?.value || ''
                  const university = (document.getElementById('new-university') as HTMLInputElement)?.value || ''
                  const year = (document.getElementById('new-year') as HTMLInputElement)?.value || ''
                  
                  handleSaveNew({
                    id: Date.now().toString(),
                    degree,
                    university,
                    year
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

        {education.length === 0 && !addingNew && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No education added yet</p>
            <button
              onClick={handleAdd}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your education
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
