'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [supabaseClient, setSupabaseClient] = useState<any>(null)

  useEffect(() => {
    // Check for OAuth errors in URL parameters
    const oauthError = searchParams.get('error')
    const description = searchParams.get('description')
    
    if (oauthError) {
      let errorMessage = 'Authentication failed'
      if (oauthError === 'access_denied') {
        errorMessage = 'Access denied. Please try again.'
      } else if (oauthError === 'session_failed') {
        errorMessage = 'Failed to establish session. Please try logging in again.'
      } else if (oauthError === 'no_session') {
        errorMessage = 'No session found. Please log in.'
      } else if (description) {
        errorMessage = description
      }
      setError(errorMessage)
    }

    // Dynamically import Supabase client only on client side
    import('@/lib/supabase/client').then(({ createClient }) => {
      setSupabaseClient(createClient())
    })
  }, [searchParams])

  const handleGoogleLogin = async () => {
    if (!supabaseClient) return
    setGoogleLoading(true)
    setError('')
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback-client`,
          skipBrowserRedirect: false
        }
      })
      if (error) {
        setError('Google login failed')
      }
    } catch (err: any) {
      setError('Google login failed')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabaseClient) return
    setEmailLoading(true)
    setError('')

    try {
      // Debug: Check if environment variables are loaded
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        setError(error.message)
      } else {
        console.log('Login successful, checking session...')
        // Wait for session to be established
        const { data: { session } } = await supabaseClient.auth.getSession()
        console.log('Session check result:', !!session)
        if (session) {
          console.log('Redirecting to dashboard...')
          window.location.href = '/dashboard'
        } else {
          setError('Login successful but session not established. Please try again.')
        }
      }
    } catch (err: any) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '0.5rem'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#718096', fontSize: '0.875rem' }}>
            Sign in to continue to ResumeAI
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.5rem 0',
          gap: '1rem'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#e5e7eb'
          }} />
          <span style={{
            color: '#9ca3af',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            OR
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            backgroundColor: '#e5e7eb'
          }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || !supabaseClient}
          style={{
            width: '100%',
            backgroundColor: 'white',
            color: '#374151',
            padding: '0.875rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            border: '1px solid #d1d5db',
            cursor: (googleLoading || !supabaseClient) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s',
            marginBottom: '1.5rem'
          }}
          onMouseOver={(e) => {
            if (!googleLoading && supabaseClient) {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#9ca3af'
            }
          }}
          onMouseOut={(e) => {
            if (!googleLoading && supabaseClient) {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#d1d5db'
            }
          }}
        >
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#4285f4',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            G
          </div>
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9ca3af'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={emailLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  opacity: emailLoading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9ca3af'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={emailLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  opacity: emailLoading ? 0.6 : 1
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={emailLoading}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: emailLoading ? 'not-allowed' : 'pointer',
                  padding: 0,
                  color: '#9ca3af'
                }}
              >
                {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c53030',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={emailLoading || !supabaseClient}
            style={{
              width: '100%',
              backgroundColor: (emailLoading || !supabaseClient) ? '#a0aec0' : '#667eea',
              color: 'white',
              padding: '0.875rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: (emailLoading || !supabaseClient) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
          >
            {emailLoading ? 'Signing in...' : (
              <>
                Sign In
                <ArrowRight style={{ width: '20px', height: '20px' }} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#718096', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <button
              onClick={() => window.location.href = '/auth/signup'}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontWeight: '500',
                textDecoration: 'underline'
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
