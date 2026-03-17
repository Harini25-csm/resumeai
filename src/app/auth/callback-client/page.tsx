'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CallbackClient() {
  useEffect(() => {
    const supabase = createClient()
    
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const error = hashParams.get('error')
    const errorDescription = hashParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('OAuth Error:', error, errorDescription)
      window.location.replace(`/auth/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || 'Authentication failed')}`)
      return
    }

    // Handle successful authentication
    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ error }: { error: any }) => {
        if (!error) {
          console.log('Session set successfully, redirecting to dashboard')
          window.location.replace('/dashboard')
        } else {
          console.error('Session setting failed:', error)
          window.location.replace('/auth/login?error=session_failed')
        }
      }).catch((err: any) => {
        console.error('Session setting error:', err)
        window.location.replace('/auth/login?error=session_failed')
      })
    } else {
      // Fallback: check existing session
      supabase.auth.getSession().then(({ data: { session }, error }: { data: { session: any }, error: any }) => {
        if (error) {
          console.error('Session check error:', error)
          window.location.replace('/auth/login?error=session_check_failed')
          return
        }
        
        if (session) {
          console.log('Existing session found, redirecting to dashboard')
          window.location.replace('/dashboard')
        } else {
          console.log('No session found, redirecting to login')
          window.location.replace('/auth/login?error=no_session')
        }
      }).catch((err) => {
        console.error('Session check error:', err)
        window.location.replace('/auth/login?error=session_check_failed')
      })
    }
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
      <p style={{ color: '#6B7280', fontSize: '1rem' }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
