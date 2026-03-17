'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Rocket, Code, Star, Loader2, Sparkles, Globe } from 'lucide-react'

const languageColors: { [key: string]: string } = {
  'JavaScript': 'bg-yellow-100 text-yellow-800',
  'Python': 'bg-blue-100 text-blue-800',
  'Java': 'bg-orange-100 text-orange-800',
  'TypeScript': 'bg-blue-100 text-blue-800',
  'React': 'bg-cyan-100 text-cyan-800',
  'Vue': 'bg-green-100 text-green-800',
  'Angular': 'bg-red-100 text-red-800',
  'Node.js': 'bg-green-100 text-green-800',
  'Go': 'bg-cyan-100 text-cyan-800',
  'Rust': 'bg-orange-100 text-orange-800',
  'C++': 'bg-blue-100 text-blue-800',
  'C#': 'bg-purple-100 text-purple-800',
  'PHP': 'bg-purple-100 text-purple-800',
  'Ruby': 'bg-red-100 text-red-800',
  'Swift': 'bg-orange-100 text-orange-800',
  'Kotlin': 'bg-purple-100 text-purple-800',
  'Dart': 'bg-blue-100 text-blue-800',
  'Unknown': 'bg-gray-100 text-gray-800'
}

export default function PortfolioGenerator() {
  const [githubUsername, setGithubUsername] = useState('')
  const [repos, setRepos] = useState<any[]>([])
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')

  const fetchRepos = async () => {
    if (!githubUsername.trim()) {
      alert('Please enter a GitHub username')
      return
    }

    setIsFetching(true)
    try {
      const response = await fetch('/api/github-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: githubUsername.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch repositories')
      }

      const data = await response.json()
      setRepos(data.repos || [])
    } catch (error) {
      console.error('Error fetching repos:', error)
      alert('Failed to fetch repositories. Please check the username and try again.')
    } finally {
      setIsFetching(false)
    }
  }

  const generatePortfolioWithAI = async () => {
    if (repos.length === 0) {
      alert('Please fetch repositories first')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repos })
      })

      if (!response.ok) {
        throw new Error('Failed to generate portfolio')
      }

      const data = await response.json()
      setPortfolioData(data.portfolio)
    } catch (error) {
      console.error('Error generating portfolio:', error)
      alert('Failed to generate portfolio. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generatePortfolioSite = () => {
    const portfolioUrl = `https://portfolio-${githubUsername}.vercel.app`
    setDeployedUrl(portfolioUrl)
    alert(`Portfolio site generated! Share this link: ${portfolioUrl}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      {githubUsername && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <Github className="w-12 h-12 text-gray-900" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">{githubUsername}</h1>
            <p className="text-xl mb-4">@{githubUsername}</p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Full-stack developer passionate about building innovative solutions and contributing to open-source projects
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub Profile
              </a>
              <a
                href={`https://linkedin.com/in/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!githubUsername ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Portfolio Generator
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create a beautiful portfolio from your GitHub projects
            </p>
          </motion.div>
        ) : null}

        {/* GitHub Username Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your GitHub username
              </label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g., johndoe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && fetchRepos()}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchRepos}
                disabled={isFetching}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    Fetch My Projects
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {repos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
              <button
                onClick={generatePortfolioWithAI}
                disabled={isGenerating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Portfolio with AI
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.map((repo) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{repo.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-sm font-medium">{repo.stars}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {portfolioData?.projects?.find((p: any) => p.name === repo.name)?.description || repo.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${languageColors[repo.language] || languageColors['Unknown']}`}>
                      {repo.language}
                    </span>
                  </div>
                  
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Generated Portfolio Site */}
        {portfolioData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <button
              onClick={generatePortfolioSite}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Rocket className="w-5 h-5" />
              Generate Portfolio Site
            </button>
            
            {deployedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-green-800 font-medium">Portfolio site generated! 🎉</p>
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 underline"
                >
                  {deployedUrl}
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
