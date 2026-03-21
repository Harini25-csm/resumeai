'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Linkedin, Globe, Edit2, Save, X, Check } from 'lucide-react'
import { createClientInstance } from '@/lib/supabase'

interface Profile {
  id?: string
  full_name: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  website?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  })
  const [originalProfile, setOriginalProfile] = useState<Profile>(profile)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientInstance()

  useEffect(() => {
    // Check if user is authenticated before fetching profile
    const checkAuth = async () => {
      let retryCount = 0
      const maxRetries = 3
      
      const attemptAuth = async () => {
        try {
          console.log(`Profile page: Checking authentication... Attempt ${retryCount + 1}/${maxRetries}`)
          
          // Try both getUser and getSession for better reliability
          const { data: { session } } = await supabase.auth.getSession()
          console.log('Profile page: Session check result:', !!session)
          
          if (session && session.user) {
            console.log('Profile page: User authenticated, fetching profile...')
            await fetchProfileForUser(session.user)
            return
          }
          
          // Fallback to getUser if session fails
          const { data: { user } } = await supabase.auth.getUser()
          console.log('Profile page: User fallback check:', !!user)
          
          if (user) {
            console.log('Profile page: User authenticated via fallback, fetching profile...')
            await fetchProfileForUser(user)
            return
          }
          
          throw new Error('No valid session or user found')
          
        } catch (error) {
          console.error(`Profile page: Auth attempt ${retryCount + 1} failed:`, error)
          retryCount++
          
          if (retryCount < maxRetries) {
            console.log(`Profile page: Retrying in 1 second...`)
            setTimeout(attemptAuth, 1000)
          } else {
            console.error('Profile page: Max retries reached, showing error')
            setError('Authentication failed. Please check your connection and try refreshing the page.')
            setLoading(false)
          }
        }
      }
      
      await attemptAuth()
    }
    
    checkAuth()
  }, [])

  const fetchProfileForUser = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        setError('Failed to load profile')
        return
      }

      if (data) {
        setProfile(data)
        setOriginalProfile(data)
      } else {
        // Create default profile if none exists
        const defaultProfile: Profile = {
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || ''
        }
        setProfile(defaultProfile)
        setOriginalProfile(defaultProfile)
        
        // Save default profile to database
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            ...defaultProfile
          })
        
        if (insertError) {
          console.error('Error creating default profile:', insertError)
          setError('Failed to create profile')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('User not authenticated')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile
        })

      if (error) {
        console.error('Error saving profile:', error)
        setError('Failed to save profile')
        return
      }

      setOriginalProfile(profile)
      setIsEditing(false)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error('Error:', error)
      setError('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setProfile(originalProfile)
    setIsEditing(false)
    setError('')
  }

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>Loading profile...</p>
        </div>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
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

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              Profile
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a67d8'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#667eea'
                }}
              >
                <Edit2 style={{ width: '16px', height: '16px' }} />
                Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    backgroundColor: saving ? '#a0aec0' : '#10b981',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {saving ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save style={{ width: '16px', height: '16px' }} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#667eea',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {getInitials(profile.full_name)}
            </div>

            <div style={{ flex: 1, width: '100%' }}>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      color: '#374151',
                      fontSize: '1rem'
                    }}>
                      {profile.full_name || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  ) : (
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      color: '#374151',
                      fontSize: '1rem'
                    }}>
                      {profile.email}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        color: '#374151',
                        fontSize: '1rem'
                      }}>
                        {profile.phone || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="San Francisco, CA"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        color: '#374151',
                        fontSize: '1rem'
                      }}>
                        {profile.location || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      LinkedIn
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={profile.linkedin || ''}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        color: '#374151',
                        fontSize: '1rem'
                      }}>
                        {profile.linkedin || 'Not set'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={profile.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    ) : (
                      <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        color: '#374151',
                        fontSize: '1rem'
                      }}>
                        {profile.website || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
          }}
        >
          <Check style={{ width: '20px', height: '20px' }} />
          Profile saved successfully!
        </motion.div>
      )}
    </div>
  )
}
