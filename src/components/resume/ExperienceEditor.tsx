'use client'

import { useState } from 'react'
import { Edit2, Plus, Trash2, Check, X, Calendar, Building, Briefcase } from 'lucide-react'

interface Experience {
  id: string
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

interface ExperienceEditorProps {
  experiences: Experience[]
  onChange: (experiences: Experience[]) => void
  className?: string
}

export default function ExperienceEditor({ experiences, onChange, className = '' }: ExperienceEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [tempExperience, setTempExperience] = useState<Experience>({
    id: '',
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: ''
  })

  const handleAdd = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    setTempExperience(newExperience)
    setAddingNew(true)
  }

  const handleEdit = (experience: Experience) => {
    setTempExperience({ ...experience })
    setEditingId(experience.id)
  }

  const handleSave = () => {
    const updatedExperiences = experiences.filter(exp => exp.id !== tempExperience.id)
    
    if (tempExperience.title && tempExperience.company) {
      updatedExperiences.push(tempExperience)
      updatedExperiences.sort((a, b) => b.startDate.localeCompare(a.startDate))
      onChange(updatedExperiences)
    }

    setAddingNew(false)
    setEditingId(null)
    setTempExperience({
      id: '',
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    })
  }

  const handleCancel = () => {
    setAddingNew(false)
    setEditingId(null)
    setTempExperience({
      id: '',
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    })
  }

  const handleDelete = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id)
    onChange(updatedExperiences)
  }

  const isEditing = (id: string) => editingId === id

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
        {experiences.map((experience) => (
          <div key={experience.id} className="group relative">
            {isEditing(experience.id) ? (
              <div className="space-y-3 p-4 border border-blue-400 rounded-lg bg-blue-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={tempExperience.title}
                      onChange={(e) => setTempExperience(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={tempExperience.company}
                      onChange={(e) => setTempExperience(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Tech Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={tempExperience.startDate}
                      onChange={(e) => setTempExperience(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., June 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="text"
                      value={tempExperience.endDate}
                      onChange={(e) => setTempExperience(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Present or May 2023"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={tempExperience.description}
                    onChange={(e) => setTempExperience(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your role, achievements, and responsibilities..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    Save
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
              <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{experience.title}</h3>
                    <p className="text-gray-600">{experience.company}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {experience.startDate} - {experience.endDate}
                    </p>
                    <p className="text-gray-700 whitespace-pre-wrap">{experience.description}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(experience)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(experience.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {addingNew && (
          <div className="space-y-3 p-4 border border-blue-400 rounded-lg bg-blue-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={tempExperience.title}
                  onChange={(e) => setTempExperience(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={tempExperience.company}
                  onChange={(e) => setTempExperience(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Tech Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="text"
                  value={tempExperience.startDate}
                  onChange={(e) => setTempExperience(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., June 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="text"
                  value={tempExperience.endDate}
                  onChange={(e) => setTempExperience(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Present or May 2023"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={tempExperience.description}
                onChange={(e) => setTempExperience(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your role, achievements, and responsibilities..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4 inline mr-1" />
                Save
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
