import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Check if Groq API key is available
const groqApiKey = process.env.GROQ_API_KEY

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

    if (!groqApiKey) {
      // Fallback response when Groq API key is not available
      console.warn('GROQ_API_KEY not found, using fallback LinkedIn profile generation')
      return generateFallbackLinkedInProfile(username)
    }

    const groq = new Groq({ apiKey: groqApiKey })

    // For demo purposes, we'll simulate LinkedIn data extraction
    // In a real implementation, you might use LinkedIn API or web scraping
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: 'You are an expert at extracting professional information from LinkedIn profiles. Based on the LinkedIn username provided, create a realistic professional profile with common LinkedIn data points. Return JSON format with professional details.'
      }, {
        role: 'user',
        content: `Create a professional LinkedIn profile simulation for username: ${username}\n\nReturn JSON with this structure:
{
  "name": "Full Name",
  "headline": "Professional headline",
  "summary": "Professional summary/bio",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - Present",
      "description": "Brief description of role and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "year": "Graduation Year"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "location": "City, Country"
}`
      }],
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = completion.choices[0].message.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to generate LinkedIn profile' }, { status: 500 })
    }

    const linkedinProfile = JSON.parse(jsonMatch[0])
    
    return NextResponse.json({ profile: linkedinProfile })
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
  // Generate a basic LinkedIn profile without AI
  const firstName = username.charAt(0).toUpperCase() + username.slice(1).split(/[0-9]/)[0]
  const lastName = 'Developer'
  
  const profile = {
    name: `${firstName} ${lastName}`,
    headline: "Full-Stack Developer | Software Engineer | Open Source Contributor",
    summary: `Passionate software developer with expertise in modern web technologies. I love building innovative solutions and contributing to open-source projects. With a strong foundation in both frontend and backend development, I create scalable and user-friendly applications that solve real-world problems.`,
    experience: [
      {
        title: "Senior Full-Stack Developer",
        company: "Tech Innovation Labs",
        duration: "2022 - Present",
        description: "Leading development of enterprise web applications and mentoring junior developers"
      },
      {
        title: "Software Engineer",
        company: "Digital Solutions Inc",
        duration: "2020 - 2022",
        description: "Developed and maintained multiple client projects using React, Node.js, and cloud technologies"
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of Technology",
        year: "2020"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "MongoDB", "Git"],
    location: "San Francisco, CA"
  }
  
  return NextResponse.json({ profile })
}
