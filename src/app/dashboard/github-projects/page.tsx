'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Star, ExternalLink, Code } from 'lucide-react'

interface GitHubProject {
  name: string
  description: string
  html_url: string
  stargazers_count: number
  language: string
}

export default function GitHubProjects() {
  const [username, setUsername] = useState('')
  const [projects, setProjects] = useState<GitHubProject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchProjects = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    setIsLoading(true)
    setError('')
    setProjects([])

    try {
      const response = await fetch(`/api/github-projects?username=${encodeURIComponent(username)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch projects')
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        setProjects(result.data)
      } else {
        throw new Error(result.error || 'No data received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('GitHub fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProjects()
  }

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      Java: '#007396',
      'C++': '#00599c',
      Go: '#00add8',
      Rust: '#dea584',
      Ruby: '#cc342d',
      PHP: '#777bb4',
      Swift: '#fa7343',
      'C#': '#239120',
      HTML: '#e34c26',
      CSS: '#1572b6',
      Vue: '#4fc08d',
      React: '#61dafb',
      Angular: '#dd0031',
      'Node.js': '#339933'
    }
    return colors[language || ''] || '#6e7681'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            GitHub Portfolio Importer
          </h1>
          <p className="text-lg text-gray-600">
            Import your best projects to showcase in your resume
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Username
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g., johndoe"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Import Projects'
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </motion.div>

        {/* Projects Grid */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your Top Projects
              </h2>
              <p className="text-gray-600">
                Showing your most starred repositories (excluding forks)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {project.name}
                        </h3>
                        {project.language && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getLanguageColor(project.language) }}
                            />
                            {project.language}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{project.stargazers_count}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.description || 'No description available'}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on GitHub
                      </a>
                      <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                        <Code className="w-4 h-4" />
                        Add to Resume
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add to Resume Button */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200">
                Add Selected Projects to Resume
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!projects.length && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-12"
          >
            <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Import Your GitHub Projects
            </h3>
            <p className="text-gray-600 mb-4">
              Enter your GitHub username to showcase your best projects in your resume
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">🌟 Top Projects</h4>
                <p className="text-sm text-gray-600">
                  Automatically shows your most starred repositories
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">🚫 No Forks</h4>
                <p className="text-sm text-gray-600">
                  Excludes forked repositories to show your original work
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">📊 Rich Details</h4>
                <p className="text-sm text-gray-600">
                  Includes languages, stars, and project descriptions
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
