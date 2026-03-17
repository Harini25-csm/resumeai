'use client'

import { useState } from 'react'
import { calculateATSScore, getScoreColor, getProgressColor, type ATSScoreResult } from '@/utils/atsScore'
import { TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface ATSScoreDisplayProps {
  resumeText: string
  jobDescription: string
  showDetails?: boolean
}

export default function ATSScoreDisplay({ resumeText, jobDescription, showDetails = false }: ATSScoreDisplayProps) {
  const [atsResult, setAtsResult] = useState<ATSScoreResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = calculateATSScore(resumeText, jobDescription)
    setAtsResult(result)
    setIsAnalyzing(false)
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-500" />
    return <AlertCircle className="w-5 h-5 text-red-500" />
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! Your resume is well-optimized for ATS.'
    if (score >= 60) return 'Good! Your resume has decent ATS optimization.'
    return 'Needs improvement. Consider optimizing for better ATS performance.'
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">ATS Score Analyzer</h2>
        </div>
        <button
          onClick={analyzeResume}
          disabled={isAnalyzing || (!resumeText && !jobDescription)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Analyze Resume
            </>
          )}
        </button>
      </div>

      {/* Score Display */}
      {atsResult && (
        <div className="space-y-6">
          {/* Main Score */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getScoreIcon(atsResult.score)}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">ATS Score</h3>
                  <p className={`text-sm ${getScoreColor(atsResult.score)}`}>
                    {getScoreMessage(atsResult.score)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${getScoreColor(atsResult.score)}`}>
                  {atsResult.score}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${getProgressColor(atsResult.score)}`}
                style={{ width: `${atsResult.score}%` }}
              />
            </div>
          </div>

          {/* Detailed Analysis */}
          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Matched Keywords ({atsResult.matchedKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {atsResult.matchedKeywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Missing Keywords ({atsResult.missingKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {atsResult.missingKeywords.slice(0, 10).map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                  {atsResult.missingKeywords.length > 10 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                      +{atsResult.missingKeywords.length - 10} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Verbs */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Action Verbs Found ({atsResult.actionVerbs.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {atsResult.actionVerbs.map((verb: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section Headings */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Sections Found ({atsResult.sectionHeadings.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {atsResult.sectionHeadings.map((section: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {atsResult.suggestions.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Optimization Suggestions
              </h4>
              <ul className="space-y-2">
                {atsResult.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-yellow-800">
                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!atsResult && !isAnalyzing && (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready to optimize your resume?
          </h3>
          <p className="text-gray-600 mb-4">
            Click "Analyze Resume" to get your ATS score and optimization suggestions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Keyword Matching</h4>
              <p className="text-sm text-gray-600">
                We'll check how well your resume matches the job description keywords.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Action Verbs</h4>
              <p className="text-sm text-gray-600">
                Strong action verbs help your resume stand out to ATS systems.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Structure Analysis</h4>
              <p className="text-sm text-gray-600">
                Proper section headings ensure your resume is parsed correctly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
