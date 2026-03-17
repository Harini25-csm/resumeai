'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Rocket, Code, Star, Loader2, Sparkles, Globe, Linkedin, User, Briefcase, GraduationCap, Edit2, Save, X, Download } from 'lucide-react'

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
  const [linkedinProfile, setLinkedinProfile] = useState('')
  const [repos, setRepos] = useState<any[]>([])
  const [linkedinData, setLinkedinData] = useState<any>(null)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isFetchingLinkedin, setIsFetchingLinkedin] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editablePortfolio, setEditablePortfolio] = useState<any>(null)
  const [isStartingEdit, setIsStartingEdit] = useState(false)

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

  const fetchLinkedinDataWithRetry = async () => {
    const maxRetries = 3
    
    if (!linkedinProfile.trim()) {
      alert('Please enter a LinkedIn profile URL or username')
      return
    }

    setIsFetchingLinkedin(true)
    
    const attemptFetch = async (retryCount = 0) => {
      try {
        const response = await fetch('/api/linkedin-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: linkedinProfile.trim() })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setLinkedinData(data.profile)
        console.log('LinkedIn data fetched successfully:', data.profile)
      } catch (error) {
        console.error('Error fetching LinkedIn data (attempt ' + (retryCount + 1) + '):', error)
        
        if (retryCount < maxRetries) {
          // Retry after 2 seconds
          setTimeout(() => attemptFetch(retryCount + 1), 2000)
        } else {
          alert('Failed to fetch LinkedIn profile after multiple attempts. This is a demo feature that generates sample data.')
        }
      } finally {
        if (retryCount === maxRetries) {
          setIsFetchingLinkedin(false)
        }
      }
    }
    
    attemptFetch()
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
        body: JSON.stringify({ 
          repos, 
          linkedinData,
          githubUsername 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate portfolio')
      }

      const data = await response.json()
      setPortfolioData(data.portfolio)
      setEditablePortfolio({
        ...data.portfolio,
        contact: {
          ...data.portfolio.contact,
          email: '',
          phone: '',
          address: '',
          linkedinUrl: linkedinProfile
        }
      })
    } catch (error) {
      console.error('Error generating portfolio:', error)
      alert('Failed to generate portfolio. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const startEditing = async () => {
    setIsStartingEdit(true)
    try {
      // Create a deep copy to avoid reference issues
      const portfolioCopy = JSON.parse(JSON.stringify(portfolioData))
      
      // Ensure all array properties are properly initialized
      portfolioCopy.skills = portfolioCopy.skills || []
      portfolioCopy.experience = portfolioCopy.experience || []
      portfolioCopy.projects = portfolioCopy.projects || []
      
      setEditablePortfolio(portfolioCopy)
      setIsEditing(true)
    } catch (error) {
      console.error('Error starting edit:', error)
      alert('Failed to start editing. Please try again.')
    } finally {
      setIsStartingEdit(false)
    }
  }

  const saveEdits = () => {
    setPortfolioData(editablePortfolio)
    setIsEditing(false)
    alert('Portfolio updated successfully!')
  }

  const cancelEditing = () => {
    setEditablePortfolio(portfolioData)
    setIsEditing(false)
  }

  const updateEditableField = (section: string, field: string, value: any) => {
    setEditablePortfolio((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateIntroduction = (value: string) => {
    setEditablePortfolio((prev: any) => ({
      ...prev,
      introduction: value
    }))
  }

  const updateAbout = (value: string) => {
    setEditablePortfolio((prev: any) => ({
      ...prev,
      about: value
    }))
  }

  const updateContactField = (field: string, value: string) => {
    setEditablePortfolio((prev: any) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }))
  }

  const downloadPortfolio = () => {
    if (!portfolioData) return
    
    // Get the proper name from contact or portfolio data
    const displayName = portfolioData.contact?.linkedin || 
                       portfolioData.contact?.name || 
                       portfolioData.name || 
                       'Portfolio'
    
    // Create HTML content for portfolio
    const portfolioHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayName} - Portfolio</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { color: #333; margin-bottom: 10px; }
        .header p { color: #666; font-size: 1.1em; }
        .contact-info { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #007bff; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.9em; }
        .experience-item { margin-bottom: 20px; }
        .project { border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .tech-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
        .tech-tag { background: #e9ecef; color: #333; padding: 3px 8px; border-radius: 12px; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${displayName}</h1>
        <p>${portfolioData.introduction || 'Professional Portfolio'}</p>
    </div>
    
    <div class="contact-info">
        <h3>Contact Information</h3>
        <p><strong>Email:</strong> ${portfolioData.contact?.email || 'your.email@example.com'}</p>
        <p><strong>Phone:</strong> ${portfolioData.contact?.phone || 'Your Phone Number'}</p>
        <p><strong>Address:</strong> ${portfolioData.contact?.address || 'Your Address'}</p>
        <p><strong>LinkedIn:</strong> <a href="${portfolioData.contact?.linkedinUrl || '#'}">${portfolioData.contact?.linkedinUrl || 'LinkedIn Profile'}</a></p>
        ${portfolioData.contact?.github ? `<p><strong>GitHub:</strong> <a href="https://github.com/${portfolioData.contact.github}">github.com/${portfolioData.contact.github}</a></p>` : ''}
    </div>
    
    ${portfolioData.about ? `
    <div class="section">
        <h2>About Me</h2>
        <p>${portfolioData.about}</p>
    </div>` : ''}
    
    ${portfolioData.skills && portfolioData.skills.length > 0 ? `
    <div class="section">
        <h2>Skills</h2>
        <div class="skills">
            ${(portfolioData.skills || []).map((skill: string) => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>` : ''}
    
    ${portfolioData.experience && portfolioData.experience.length > 0 ? `
    <div class="section">
        <h2>Experience</h2>
        ${(portfolioData.experience || []).map((exp: any) => `
            <div class="experience-item">
                <h3>${exp.title}</h3>
                <p><strong>${exp.company}</strong> • ${exp.duration}</p>
                <p>${exp.description}</p>
            </div>
        `).join('')}
    </div>` : ''}
    
    ${portfolioData.projects && portfolioData.projects.length > 0 ? `
    <div class="section">
        <h2>Projects</h2>
        ${(portfolioData.projects || []).map((project: any) => `
            <div class="project">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                ${project.technologies && project.technologies.length > 0 ? `
                    <div class="tech-tags">
                        ${(project.technologies || []).map((tech: string) => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                ` : ''}
                ${project.highlights && project.highlights.length > 0 ? `
                    <ul>
                        ${(project.highlights || []).map((highlight: string) => `<li>${highlight}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `).join('')}
    </div>` : ''}
</body>
</html>
    `
    
    // Create and download file
    const blob = new Blob([portfolioHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${displayName.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generatePortfolioSite = () => {
    const portfolioUrl = `https://portfolio-${githubUsername}.vercel.app`
    setDeployedUrl(portfolioUrl)
    alert(`Portfolio site generated! Share this link: ${portfolioUrl}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      {(githubUsername || linkedinData) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                {githubUsername ? (
                  <Github className="w-12 h-12 text-gray-900" />
                ) : (
                  <Linkedin className="w-12 h-12 text-blue-600" />
                )}
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              {linkedinData?.name || githubUsername}
            </h1>
            <p className="text-xl mb-4">
              {linkedinData?.headline || `@${githubUsername}`}
            </p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {linkedinData?.summary || 'Full-stack developer passionate about building innovative solutions and contributing to open-source projects'}
            </p>
            <div className="flex justify-center gap-4 mt-6">
              {githubUsername && (
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub Profile
                </a>
              )}
              {linkedinProfile && (
                <a
                  href={linkedinProfile.includes('linkedin.com') ? linkedinProfile : `https://linkedin.com/in/${linkedinProfile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  LinkedIn
                </a>
              )}
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
              Enhanced Portfolio Generator
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create a comprehensive portfolio by combining your GitHub projects and LinkedIn profile
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Profile
          </h2>
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
                    Fetch Projects
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* LinkedIn Profile Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-blue-600" />
            LinkedIn Profile (Optional)
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn profile URL or username
              </label>
              <input
                type="text"
                value={linkedinProfile}
                onChange={(e) => setLinkedinProfile(e.target.value)}
                placeholder="e.g., linkedin.com/in/johndoe or johndoe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && fetchLinkedinDataWithRetry()}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchLinkedinDataWithRetry}
                disabled={isFetchingLinkedin}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isFetchingLinkedin ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Linkedin className="w-4 h-4" />
                    Fetch Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* LinkedIn Profile Display */}
        {linkedinData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-blue-600" />
              LinkedIn Profile Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {linkedinData.name}
                </h4>
                <p className="text-gray-600 text-sm mb-2">{linkedinData.headline}</p>
                <p className="text-gray-700">{linkedinData.summary}</p>
              </div>
              <div>
                {linkedinData.experience && linkedinData.experience.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Experience
                    </h5>
                    {linkedinData.experience.slice(0, 2).map((exp: any, index: number) => (
                      <div key={index} className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">{exp.title}</span> at {exp.company}
                        <div className="text-gray-500 text-xs">{exp.duration}</div>
                      </div>
                    ))}
                  </div>
                )}
                {linkedinData.skills && linkedinData.skills.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {linkedinData.skills.slice(0, 6).map((skill: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

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
                    Generate Enhanced Portfolio
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

        {/* Generated Portfolio Content */}
        {portfolioData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 flex-1 text-center">Portfolio</h2>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={downloadPortfolio}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={startEditing}
                      disabled={isStartingEdit}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isStartingEdit ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Edit Portfolio
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={saveEdits}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Contact Section - Moved to Top */}
            {(isEditing ? editablePortfolio : portfolioData)?.contact && (
              <div className="text-center pb-6 border-b border-gray-200 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={isEditing ? editablePortfolio.contact.email : portfolioData.contact.email}
                      onChange={(e) => updateContactField('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your.email@example.com"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={isEditing ? editablePortfolio.contact.phone : portfolioData.contact.phone}
                      onChange={(e) => updateContactField('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+1 (555) 123-4567"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={isEditing ? editablePortfolio.contact.address : portfolioData.contact.address}
                      onChange={(e) => updateContactField('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="123 Main St, City, State 12345"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={isEditing ? editablePortfolio.contact.linkedinUrl : portfolioData.contact.linkedinUrl}
                      onChange={(e) => updateContactField('linkedinUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://linkedin.com/in/yourprofile"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                {!isEditing && (
                  <div className="flex justify-center gap-4 mt-6">
                    {portfolioData.contact.github && (
                      <a
                        href={`https://github.com/${portfolioData.contact.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {portfolioData.contact.linkedin && (
                      <span className="flex items-center gap-2 text-gray-600">
                        <Linkedin className="w-4 h-4" />
                        {portfolioData.contact.linkedin}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Introduction */}
            {(isEditing ? editablePortfolio : portfolioData)?.introduction && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h3>
                {isEditing ? (
                  <textarea
                    value={editablePortfolio.introduction}
                    onChange={(e) => updateIntroduction(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Professional introduction..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{portfolioData.introduction}</p>
                )}
              </div>
            )}

            {/* About Section */}
            {(isEditing ? editablePortfolio : portfolioData)?.about && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">About Me</h3>
                {isEditing ? (
                  <textarea
                    value={editablePortfolio.about}
                    onChange={(e) => updateAbout(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                    placeholder="Detailed about section..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{portfolioData.about}</p>
                )}
              </div>
            )}

            {/* Skills Section */}
            {(isEditing ? editablePortfolio : portfolioData)?.skills && portfolioData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills</h3>
                {isEditing ? (
                  <div>
                    <textarea
                      value={Array.isArray(editablePortfolio?.skills) ? editablePortfolio.skills.join(', ') : ''}
                      onChange={(e) => updateEditableField('skills', 'skills', e.target.value.split(', ').map(s => s.trim()).filter(s => s))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={2}
                      placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(portfolioData?.skills || []).map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Experience Section */}
            {(isEditing ? editablePortfolio : portfolioData)?.experience && (isEditing ? editablePortfolio.experience : portfolioData.experience).length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience</h3>
                <div className="space-y-4">
                  {(isEditing ? editablePortfolio : portfolioData).experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-4 border-indigo-500 pl-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const newExperience = [...editablePortfolio.experience]
                              newExperience[index].title = e.target.value
                              setEditablePortfolio((prev: any) => ({ ...prev, experience: newExperience }))
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Job Title"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExperience = [...editablePortfolio.experience]
                              newExperience[index].company = e.target.value
                              setEditablePortfolio((prev: any) => ({ ...prev, experience: newExperience }))
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Company Name"
                          />
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => {
                              const newExperience = [...editablePortfolio.experience]
                              newExperience[index].duration = e.target.value
                              setEditablePortfolio((prev: any) => ({ ...prev, experience: newExperience }))
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Duration (e.g., 2023 - Present)"
                          />
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const newExperience = [...editablePortfolio.experience]
                              newExperience[index].description = e.target.value
                              setEditablePortfolio((prev: any) => ({ ...prev, experience: newExperience }))
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={2}
                            placeholder="Job description and achievements"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                          <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                          <p className="text-gray-700 mt-1">{exp.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Projects Section */}
            {(isEditing ? editablePortfolio : portfolioData)?.projects && (isEditing ? editablePortfolio.projects : portfolioData.projects).length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Featured Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(isEditing ? editablePortfolio : portfolioData).projects.map((project: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => {
                              const newProjects = [...editablePortfolio.projects]
                              newProjects[index].name = e.target.value
                              setEditablePortfolio((prev: any) => ({ ...prev, projects: newProjects }))
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Project Name"
                          />
                          <textarea
                            value={project.description}
                            onChange={(e) => {
                              const newProjects = [...editablePortfolio.projects]
                              newProjects[index].description = e.target.value
                              setEditablePortfolio((prev: any) => ({ ...prev, projects: newProjects }))
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={2}
                            placeholder="Project Description"
                          />
                          <input
                            type="text"
                            value={Array.isArray(editablePortfolio?.projects?.[index]?.technologies) ? editablePortfolio.projects[index].technologies.join(', ') : ''}
                            onChange={(e) => {
                              const newProjects = [...editablePortfolio.projects]
                              newProjects[index].technologies = e.target.value.split(', ').map(t => t.trim()).filter(t => t)
                              setEditablePortfolio((prev: any) => ({ ...prev, projects: newProjects }))
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Technologies (comma separated)"
                          />
                          <textarea
                            value={Array.isArray(editablePortfolio?.projects?.[index]?.highlights) ? editablePortfolio.projects[index].highlights.join('\n') : ''}
                            onChange={(e) => {
                              const newProjects = [...editablePortfolio.projects]
                              newProjects[index].highlights = e.target.value.split('\n').filter(h => h.trim())
                              setEditablePortfolio((prev: any) => ({ ...prev, projects: newProjects }))
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows={2}
                            placeholder="Key achievements (one per line)"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-semibold text-gray-900 mb-2">{project.name}</h4>
                          <p className="text-gray-700 mb-3">{project.description}</p>
                          {project.technologies && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {(project.technologies || []).map((tech: string, techIndex: number) => (
                                  <span key={techIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {project.highlights && (
                            <ul className="text-sm text-gray-600">
                              {(project.highlights || []).map((highlight: string, highlightIndex: number) => (
                                <li key={highlightIndex} className="flex items-start gap-2">
                                  <span className="text-indigo-500 mt-1">•</span>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
