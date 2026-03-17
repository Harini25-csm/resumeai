'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CallbackClient() {
  useEffect(() => {
    const supabase = createClient()
    
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ error }: { error: any }) => {
        if (!error) {
          window.location.replace('/dashboard')
        } else {
          window.location.replace('/auth/login?error=session_failed')
        }
      })
    } else {
      supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
        if (session) {
          window.location.replace('/dashboard')
        } else {
          window.location.replace('/auth/login?error=no_session')
        }
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
