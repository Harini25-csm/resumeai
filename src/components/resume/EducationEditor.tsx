'use client'

import { useState } from 'react'
import { Edit2, GraduationCap, Check, X } from 'lucide-react'

interface Education {
  degree: string
  university: string
  year: string
}

interface EducationEditorProps {
  education: Education
  onChange: (education: Education) => void
  className?: string
}

export default function EducationEditor({ education, onChange, className = '' }: EducationEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempEducation, setTempEducation] = useState<Education>({ ...education })

  const handleEdit = () => {
    setTempEducation({ ...education })
    setIsEditing(true)
  }

  const handleSave = () => {
    onChange(tempEducation)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempEducation({ ...education })
    setIsEditing(false)
  }

  const handleFieldChange = (field: keyof Education, value: string) => {
    setTempEducation(prev => ({ ...prev, [field]: value }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-1">
          Education
        </h2>
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors ${
            isEditing 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'opacity-0 group-hover:opacity-100 bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4" />
              Save
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3 p-4 border border-blue-400 rounded-lg bg-blue-50">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <input
              type="text"
              value={tempEducation.degree}
              onChange={(e) => handleFieldChange('degree', e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
            <input
              type="text"
              value={tempEducation.university}
              onChange={(e) => handleFieldChange('university', e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., University of California, Berkeley"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
            <input
              type="text"
              value={tempEducation.year}
              onChange={(e) => handleFieldChange('year', e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2020 or May 2020"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4 inline mr-1" />
              Save Education
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4 inline mr-1" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {(education.degree || education.university || education.year) ? (
            <div>
              <h3 className="font-semibold text-gray-900">{education.degree || 'Degree not specified'}</h3>
              <p className="text-gray-600">{education.university || 'University not specified'}</p>
              <p className="text-sm text-gray-500">{education.year || 'Year not specified'}</p>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No education added yet</p>
              <button
                onClick={handleEdit}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your education
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
