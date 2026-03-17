import { NextResponse, type NextRequest } from 'next/server'
import { createClientInstance } from '@/lib/supabase'

// You'll need to install these packages: npm install pdf-parse mammoth
// For now, I'll create a basic version that you can enhance later

export async function POST(request: NextRequest) {
  try {
    const { file, fileType, content } = await request.json()

    if (!file || !fileType || !content) {
      return NextResponse.json({ error: 'Missing file, fileType, or content' }, { status: 400 })
    }

    let extractedText = ''
    
    // Basic text extraction based on file type
    if (fileType === 'pdf') {
      // In production, you'd use pdf-parse library
      extractedText = 'PDF content extracted - install pdf-parse package for full functionality'
    } else if (fileType === 'docx') {
      // In production, you'd use mammoth library
      extractedText = 'DOCX content extracted - install mammoth package for full functionality'
    } else {
      extractedText = content
    }

    // Basic resume parsing - in production, you'd send to Groq AI
    const parsedData = parseResumeText(extractedText)

    return NextResponse.json({
      success: true,
      data: parsedData
    })

  } catch (error) {
    console.error('Resume parsing error:', error)
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 })
  }
}

function parseResumeText(text: string) {
  const lines = text.split('\n').filter(line => line.trim())
  
  const personalInfo = {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: ''
  }
  
  const experience = []
  const education = []
  const skills = { technical: [] as string[], soft: [] as string[] }
  const projects: any[] = []
  const languages: any[] = []

  let currentSection = ''
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    
    // Extract basic info
    if (lowerLine.includes('name:') || lowerLine.includes('email:')) {
      const parts = line.split(':').map(part => part.trim())
      if (parts[0] && parts[1]) {
        const key = parts[0].toLowerCase()
        const value = parts[1].trim()
        if (key.includes('name')) personalInfo.fullName = value
        if (key.includes('email')) personalInfo.email = value
        if (key.includes('phone')) personalInfo.phone = value
        if (key.includes('location')) personalInfo.location = value
        if (key.includes('linkedin')) personalInfo.linkedin = value
        if (key.includes('portfolio')) personalInfo.portfolio = value
      }
    }
    
    // Extract job title
    else if (lowerLine.includes('title:') || lowerLine.includes('position:')) {
      const title = line.split(':').pop()?.trim() || ''
      if (title) personalInfo.jobTitle = title
    }
    
    // Extract experience
    else if (lowerLine.includes('experience:') || lowerLine.includes('work:')) {
      const expText = line.split(':').pop()?.trim() || ''
      if (expText) {
        experience.push({
          id: Date.now().toString(),
          jobTitle: '',
          company: '',
          startDate: '',
          endDate: '',
          current: false,
          location: '',
          bullets: [expText]
        })
      }
    }
    
    // Extract education
    else if (lowerLine.includes('education:') || lowerLine.includes('degree:')) {
      const eduText = line.split(':').pop()?.trim() || ''
      if (eduText) {
        education.push({
          id: Date.now().toString(),
          institution: '',
          degree: eduText,
          field: '',
          startDate: '',
          endDate: '',
          gpa: ''
        })
      }
    }
    
    // Extract skills
    else if (lowerLine.includes('skills:') || lowerLine.includes('technical:')) {
      const skillsText = line.split(':').pop()?.trim() || ''
      if (skillsText) {
        const skillList = skillsText.split(',').map(skill => skill.trim())
        skills.technical = [...skills.technical, ...skillList] as string[]
      }
    }
  }

  return {
    personalInfo,
    summary: lines[0] || '',
    experience,
    education,
    skills,
    projects,
    languages
  }
}
