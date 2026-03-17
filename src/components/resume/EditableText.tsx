'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit2, Check, X } from 'lucide-react'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  multiline?: boolean
  isEditing?: boolean
  onEditToggle?: (editing: boolean) => void
  showEditIcon?: boolean
}

export default function EditableText({
  value,
  onChange,
  className = '',
  placeholder = '',
  multiline = false,
  isEditing: externalIsEditing,
  onEditToggle,
  showEditIcon = true
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const editing = externalIsEditing !== undefined ? externalIsEditing : isEditing

  useEffect(() => {
    setTempValue(value)
  }, [value])

  const handleEdit = () => {
    setTempValue(value)
    if (onEditToggle) {
      onEditToggle(true)
    } else {
      setIsEditing(true)
    }
    // Focus the input after state update
    setTimeout(() => {
      if (multiline) {
        textareaRef.current?.focus()
      } else {
        inputRef.current?.focus()
      }
    }, 0)
  }

  const handleSave = () => {
    onChange(tempValue)
    if (onEditToggle) {
      onEditToggle(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setTempValue(value)
    if (onEditToggle) {
      onEditToggle(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleBlur = () => {
    // Small delay to allow save button click
    setTimeout(() => {
      if (editing) {
        handleSave()
      }
    }, 200)
  }

  return (
    <div className={`group relative ${className}`}>
      {editing ? (
        <div className="flex items-center gap-2">
          {multiline ? (
            <textarea
              ref={textareaRef}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="flex-1 px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          ) : (
            <input
              ref={inputRef}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="flex-1 px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="flex-1">
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
