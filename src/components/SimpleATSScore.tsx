'use client'

import { useState } from 'react'
import { calculateATSScore, getScoreColor, getProgressColor } from '@/utils/atsScore'

export default function SimpleATSScore() {
  const [score, setScore] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const resumeText = `
    John Doe - Software Engineer
    Experienced developer with React, Node.js, and AWS skills.
    Led team projects and improved performance by 40%.
  `

  const jobDescription = `
    Looking for Senior Software Engineer with React, Node.js experience.
    Must have cloud knowledge and leadership skills.
  `

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = calculateATSScore(resumeText, jobDescription)
    setScore(result.score)
    setIsAnalyzing(false)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">ATS Score</h3>
      
      {score !== null ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
            <span className="text-sm text-gray-600">
              {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(score)}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={analyzeResume}
          disabled={isAnalyzing}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze ATS Score'}
        </button>
      )}
    </div>
  )
}
