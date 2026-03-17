'use client'

import { useState } from 'react'
import { Plus, X, Code } from 'lucide-react'

interface SkillsSectionProps {
  skills: string[]
  onChange: (skills: string[]) => void
  className?: string
}

export default function SkillsSection({ skills, onChange, className = '' }: SkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempSkills, setTempSkills] = useState<string[]>([...skills])
  const [newSkill, setNewSkill] = useState('')

  const handleEdit = () => {
    setTempSkills([...skills])
    setIsEditing(true)
  }

  const handleSave = () => {
    onChange(tempSkills.filter(skill => skill.trim() !== ''))
    setIsEditing(false)
    setNewSkill('')
  }

  const handleCancel = () => {
    setTempSkills([...skills])
    setIsEditing(false)
    setNewSkill('')
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !tempSkills.includes(newSkill.trim())) {
      setTempSkills([...tempSkills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setTempSkills(tempSkills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-1">
          Skills
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
              <span>✓</span>
              Save
            </>
          ) : (
            <>
              <span>✏️</span>
              Edit
            </>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4 p-4 border border-blue-400 rounded-lg bg-blue-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a skill (e.g., JavaScript, React, Python)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tempSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm group"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 text-blue-600 hover:text-red-600 transition-colors"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              ✓ Save Skills
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="group relative px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => {
                      const updatedSkills = skills.filter(s => s !== skill)
                      onChange(updatedSkills)
                    }}
                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                    title="Remove skill"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No skills added yet</p>
              <button
                onClick={handleEdit}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your skills
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
