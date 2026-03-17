'use client'

import { useState } from 'react'
import { Target, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface OptimizationResult {
  score: number
  missing_keywords: string[]
  optimized_resume: any
}

interface ResumeData {
  summary: string
  experience: Array<{
    title: string
    company: string
    dates: string
    bullets: string[]
  }>
  skills: string[]
  education: Array<{
    degree: string
    school: string
    dates: string
  }>
}

export default function JobOptimizationPanel({ resumeData, onOptimized }: { resumeData: ResumeData, onOptimized: (data: any) => void }) {
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)

  const analyzeAndOptimize = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description')
      return
    }

    setIsAnalyzing(true)
    setResult(null)

    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          jobDescription
        })
      })

      if (!response.ok) {
        throw new Error('Failed to optimize resume')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let jsonText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          jsonText += decoder.decode(value)
        }
      }

      // Parse the JSON response
      const optimizationResult: OptimizationResult = JSON.parse(jsonText)
      setResult(optimizationResult)
    } catch (error) {
      console.error('Error optimizing resume:', error)
      alert('Failed to optimize resume. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const applyOptimization = () => {
    if (result) {
      onOptimized(result.optimized_resume)
    }
  }

  const CircularProgress = ({ score }: { score: number }) => {
    const radius = 60
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className={`text-2xl font-bold ${
              score >= 80 ? 'text-green-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'
            }`}>
              {score}
            </span>
            <div className="text-xs text-gray-500">Match Score</div>
          </div>
        </div>
      </div>
    )
  }

  const KeywordBadge = ({ keyword, included }: { keyword: string, included: boolean }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      included 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {included ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertCircle className="w-3 h-3 inline mr-1" />}
      {keyword}
    </span>
  )

  const BulletDiff = ({ original, optimized }: { original: string, optimized: string }) => {
    if (original === optimized) return null

    return (
      <div className="border-l-4 border-blue-500 pl-4 py-2">
        <div className="text-sm text-gray-500 mb-1">Before:</div>
        <div className="text-sm bg-red-50 p-2 rounded mb-2 line-through text-red-700">
          {original}
        </div>
        <div className="text-sm text-gray-500 mb-1">After:</div>
        <div className="text-sm bg-green-50 p-2 rounded text-green-700">
          {optimized}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Target className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold">Optimize for Job</h3>
      </div>

      {/* Job Description Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to optimize your resume..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyzeAndOptimize}
        disabled={isAnalyzing || !jobDescription.trim()}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing & Optimizing...</span>
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4" />
            <span>Analyze & Optimize</span>
          </>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Score */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Match Score</h4>
              <p className="text-sm text-gray-600">How well your resume matches this job</p>
            </div>
            <CircularProgress score={result.score} />
          </div>

          {/* Keywords */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Keywords Analysis</h4>
            <div className="flex flex-wrap gap-2">
              {result.missing_keywords.map((keyword) => (
                <KeywordBadge key={keyword} keyword={keyword} included={false} />
              ))}
            </div>
            {result.missing_keywords.length === 0 && (
              <p className="text-sm text-green-600">✅ All important keywords are included!</p>
            )}
          </div>

          {/* Before/After Toggle */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Optimization Changes</h4>
            <button
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showBeforeAfter ? 'Hide' : 'Show'} Changes
            </button>
          </div>

          {/* Before/After Diff */}
          {showBeforeAfter && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900">Bullet Point Improvements:</h5>
              {resumeData.experience.map((exp, expIndex) => (
                <div key={expIndex}>
                  {exp.bullets.map((bullet, bulletIndex) => {
                    const optimizedBullet = result.optimized_resume.experience[expIndex]?.bullets[bulletIndex]
                    return (
                      <BulletDiff
                        key={bulletIndex}
                        original={bullet}
                        optimized={optimizedBullet || bullet}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Apply Optimization Button */}
          <button
            onClick={applyOptimization}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Apply Optimization to Resume</span>
          </button>
        </div>
      )}
    </div>
  )
}
