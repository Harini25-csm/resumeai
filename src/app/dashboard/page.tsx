'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, FileText, Target, TrendingUp, Github, Eye, Settings, LogOut, User, ChevronDown } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
  const supabase = createClient()
  supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
    if (!session) {
      window.location.href = '/auth/login'
      return
    }
    setUser(session.user)
  }).catch(() => {
    window.location.href = '/auth/login'
  })
}, [])

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.profile-menu-container')) {
      setShowProfileMenu(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

  const getUserName = () => {
    return user?.user_metadata?.full_name || 
           user?.user_metadata?.name || 
           user?.email?.split('@')[0] || 
           'User'
  }

  const getUserInitial = () => {
    const name = getUserName()
    return name.charAt(0).toUpperCase()
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">ResumeAI</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard/templates')}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Templates
              </button>
              <button
                onClick={() => router.push('/dashboard/optimizer')}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Optimizer
              </button>
              <button
                onClick={() => router.push('/dashboard/cover-letter')}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cover Letter
              </button>
              <button
                onClick={() => router.push('/dashboard/portfolio')}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Portfolio
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="profile-menu-container relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                {getUserInitial()}
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={() => router.push('/dashboard/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </div>
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/settings')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </div>
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-indigo-600">{getUserName()}</span>!
          </h1>
          <p className="text-gray-600">Your professional resume dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ATS Score</h3>
                <p className="text-2xl font-bold text-blue-600">0%</p>
                <p className="text-sm text-gray-600">Latest resume optimization</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Resumes Created</h3>
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">Total resumes generated</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Github className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Status</h3>
                <p className="text-lg font-medium text-purple-600">Not deployed</p>
                <p className="text-sm text-gray-600">Projects not imported yet</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profile Views</h3>
                <p className="text-2xl font-bold text-orange-600">0</p>
                <p className="text-sm text-gray-600">Portfolio visitors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/dashboard/templates')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Build Resume
            </button>
            
            <button
              onClick={() => router.push('/dashboard/optimizer')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Target className="h-5 w-5 mr-2" />
              Optimize for Job
            </button>
            
            <button
              onClick={() => router.push('/dashboard/cover-letter')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Cover Letter
            </button>
            
            <button
              onClick={() => router.push('/dashboard/portfolio')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Github className="h-5 w-5 mr-2" />
              Portfolio
            </button>
          </div>
        </div>

        {/* Recent Resumes */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Resumes</h2>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No resumes created yet</p>
              <button
                onClick={() => router.push('/dashboard/templates')}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Create Your First Resume
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
