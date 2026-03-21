import { NextResponse, type NextRequest } from 'next/server'
import { createClientInstance } from '@/lib/supabase'
import mammoth from 'mammoth'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    
    let extractedText = ''
    
    try {
      // Extract text based on file type
      if (file.type === 'text/plain') {
        extractedText = new TextDecoder().decode(bytes)
      } else if (file.type === 'application/pdf') {
        // For PDF, we'll use a simple approach - in production, you can install pdf2pic or pdf-reader
        // For now, let's try to extract basic text using a regex-based approach
        const buffer = Buffer.from(bytes)
        
        // Simple text extraction from PDF (basic approach)
        // PDF files have text objects that we can extract
        const pdfString = buffer.toString('latin1')
        
        // Extract text between common PDF text operators
        const textMatches = pdfString.match(/\(([^)]+)\)/g)
        if (textMatches) {
          extractedText = textMatches
            .map(match => match.slice(1, -1)) // Remove parentheses
            .join(' ')
            .replace(/\\n/g, '\n') // Handle newlines
            .replace(/\\t/g, ' ') // Handle tabs
            .trim()
        }
        
        // If no text found, provide a helpful message
        if (!extractedText) {
          extractedText = `PDF file "${file.name}" uploaded. The PDF appears to be complex or image-based. For best results, please copy and paste the text from your PDF directly into the text area, or save your PDF as a text file (.txt) and upload that instead.`
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Use mammoth for DOCX text extraction
        const result = await mammoth.extractRawText({ arrayBuffer: bytes })
        extractedText = result.value
      } else {
        extractedText = `Unsupported file type: ${file.type}. Please use .txt, .pdf, or .docx files.`
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError)
      extractedText = `Error parsing file: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
    }

    // Return the extracted text
    return NextResponse.json({
      text: extractedText
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
