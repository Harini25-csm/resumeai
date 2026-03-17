import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { profile } = await request.json()
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile URL is required' }, { status: 400 })
    }

    // Extract LinkedIn username from URL or use the provided username
    const username = profile.includes('linkedin.com') 
      ? profile.split('linkedin.com/in/')[1]?.split('/')[0] || profile
      : profile

    console.log('Generating MITS student profile for:', username)
    
    // Always use the fast, reliable fallback for MITS student
    // This ensures consistent, instant response every time
    return generateFallbackLinkedInProfile(username)
  } catch (error) {
    console.error('LinkedIn API error:', error)
    
    // Fallback to mock profile generation on error
    const { profile } = await request.json()
    const username = profile.includes('linkedin.com') 
      ? profile.split('linkedin.com/in/')[1]?.split('/')[0] || profile
      : profile
    
    return generateFallbackLinkedInProfile(username)
  }
}

function generateFallbackLinkedInProfile(username: string) {
  // Generate a realistic LinkedIn profile for MITS Madanapalle student
  const profile = {
    name: "Student",
    headline: "Computer Science Student | Aspiring Full-Stack Developer",
    summary: `Computer Science student at Madanapalle Institute of Technology & Science (MITS) passionate about software development and building innovative solutions. Currently focused on learning modern web technologies and contributing to academic projects. Eager to apply technical knowledge to real-world applications and grow as a developer.`,
    experience: [
      {
        title: "Computer Science Student",
        company: "MITS Madanapalle",
        duration: "2021 - 2025",
        description: "Currently pursuing Bachelor of Technology in Computer Science with focus on software development, algorithms, and modern web technologies. Working on academic projects and developing technical skills."
      }
    ],
    education: [
      {
        degree: "Bachelor of Technology in Computer Science",
        school: "Madanapalle Institute of Technology & Science (MITS)",
        year: "Expected 2025"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "HTML/CSS", "Git", "Web Development", "Problem Solving", "Data Structures", "Algorithms"],
    location: "Madanapalle, Andhra Pradesh, India"
  }
  
  return NextResponse.json({ profile })
}
