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

    // For demo purposes, always use the fast fallback for MITS student
    // This ensures consistent, fast response every time
    console.log('Using fast fallback for MITS student profile')
    return generateFallbackLinkedInProfile(username)

    // Only use Groq API if explicitly enabled (for future use)
    // if (groqApiKey) {
    //   const groq = new Groq({ apiKey: groqApiKey })

    //   // For demo purposes, we'll simulate LinkedIn data extraction
    //   // In a real implementation, you might use LinkedIn API or web scraping
    //   const completion = await groq.chat.completions.create({
    //     model: 'llama-3.3-70b-versatile',
    //     messages: [{
    //       role: 'system',
    //       content: 'You are an expert at creating LinkedIn profiles. Generate a student profile for Madanapalle Institute of Technology & Science (MITS). Return ONLY valid JSON, no explanations.'
    //     }, {
    //       role: 'user',
    //       content: `Generate a LinkedIn profile for a Computer Science student at MITS Madanapalle, Andhra Pradesh, India. Expected graduation 2025. Return JSON:
    // {
    //   "name": "Student",
    //   "headline": "Computer Science Student at MITS | Aspiring Developer", 
    //   "summary": "Computer Science student at Madanapalle Institute of Technology & Science passionate about software development and modern web technologies.",
    //   "experience": [{"title": "Computer Science Student", "company": "MITS Madanapalle", "duration": "2021-2025", "description": "B.Tech student focused on software development and algorithms."}],
    //   "education": [{"degree": "B.Tech Computer Science", "school": "Madanapalle Institute of Technology & Science", "year": "Expected 2025"}],
    //   "skills": ["JavaScript", "React", "Node.js", "Python", "TypeScript", "HTML/CSS", "Git"],
    //   "location": "Madanapalle, Andhra Pradesh, India"
    // }`
    //     }],
    //     temperature: 0.3, // Lower temperature for more consistent output
    //     max_tokens: 500, // Reduced tokens for faster response
    //     stream: false
    //   }, {
    //     timeout: 5000 // Reduced timeout to 5 seconds
    //   })

    //   const content = completion.choices[0]?.message?.content || ''
    //   console.log('Groq response content:', content)
    
    //   if (!content) {
    //     console.error('Empty response from Groq API')
    //     return generateFallbackLinkedInProfile(username)
    //   }
    
    //   const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    //   if (!jsonMatch) {
    //     console.error('No valid JSON found in response:', content)
    //     return generateFallbackLinkedInProfile(username)
    //   }

    //   let linkedinProfile
    //   try {
    //     linkedinProfile = JSON.parse(jsonMatch[0])
    //   } catch (parseError) {
    //     console.error('JSON parse error:', parseError)
    //     return generateFallbackLinkedInProfile(username)
    //   }
    
    //   return NextResponse.json({ profile: linkedinProfile })
    // }
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
    location: "Madanapalle, Andhra Pradesh"
  }
  
  return NextResponse.json({ profile })
}
