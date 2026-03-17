'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit2, Check, X } from 'lucide-react'

interface EditableTextareaProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  rows?: number
  showEditIcon?: boolean
}

export default function EditableTextarea({
  value,
  onChange,
  className = '',
  placeholder = '',
  rows = 3,
  showEditIcon = true
}: EditableTextareaProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  const handleEdit = () => {
    setTempValue(value)
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  const handleSave = () => {
    onChange(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleBlur = () => {
    // Small delay to allow save button click
    setTimeout(() => {
      if (isEditing) {
        handleSave()
      }
    }, 200)
  }

  return (
    <div className={`group relative ${className}`}>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
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
        <div className="flex items-start">
          <span className="flex-1 whitespace-pre-wrap">
            {value || <span className="text-gray-400 italic">{placeholder}</span>}
          </span>
          {showEditIcon && (
            <button
              onClick={handleEdit}
              className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
