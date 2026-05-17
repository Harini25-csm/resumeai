import { NextResponse, type NextRequest } from 'next/server'
import { createClientInstance } from '@/lib/supabase'

// Prevent static generation
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { answers, template, color } = await request.json()

    if (!answers || !template) {
      return NextResponse.json({ error: 'Missing answers, template, or color' }, { status: 400 })
    }

    // Generate structured resume data from answers
    const resumeData = generateResumeFromAnswers(answers)

    // Save to Supabase (this would be implemented with actual database integration)
    const supabase = createClientInstance()
    // const { data, error } = await supabase
    //   .from('resumes')
    //   .insert([{
    //     template,
    //     color,
    //     data: resumeData,
    //     created_at: new Date().toISOString()
    //   }])

    // For now, just return the generated resume data
    return NextResponse.json({
      success: true,
      data: resumeData
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 })
  }
}

function generateResumeFromAnswers(answers: Record<string, string>) {
  const resumeData: any = {
    personalInfo: {
      fullName: answers['What is your full name and current job title?'] || '',
      jobTitle: '',
      email: answers['What is your email and phone number?']?.split(' ')[0] || '',
      phone: answers['What is your email and phone number?']?.split(' ')[1] || '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: answers['Write a 2-3 sentence professional summary about yourself'] || '',
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: []
    },
    projects: [],
    languages: []
  }

  // Parse experience from answer
  const jobAnswer = answers['Tell me about your most recent job — company name, your role, start and end dates, and 3 key achievements with numbers']
  if (jobAnswer) {
    resumeData.experience.push({
      id: Date.now().toString(),
      jobTitle: jobAnswer.match(/your role: ([^,]+)/)?.[1]?.trim() || 'Software Engineer',
      company: jobAnswer.match(/company name: ([^,]+)/)?.[1]?.trim() || 'Tech Company',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      bullets: jobAnswer.match(/achievements with numbers: ([^.]+)/)?.[1]?.trim().split(/\d+\./).filter(b => b.trim()) || []
    })
  }

  // Parse skills from answer
  const skillsAnswer = answers['List your top 5 technical skills and 3 soft skills']
  if (skillsAnswer) {
    const skills = skillsAnswer.split(',').map(skill => skill.trim())
    resumeData.skills.technical = skills.slice(0, 5)
    resumeData.skills.soft = skills.slice(5, 8)
  }

  // Parse education from answer
  const educationAnswer = answers['What is your highest education — university, degree, graduation year?']
  if (educationAnswer) {
    resumeData.education.push({
      id: Date.now().toString(),
      institution: educationAnswer.match(/university: ([^,]+)/)?.[1]?.trim() || 'State University',
      degree: educationAnswer.match(/degree: ([^,]+)/)?.[1]?.trim() || 'Bachelor of Science',
      field: '',
      startDate: '',
      endDate: educationAnswer.match(/graduation year: ([^\d]+)/)?.[0]?.trim() || '2020',
      gpa: ''
    })
  }

  // Parse project from answer
  const projectAnswer = answers['Describe your best project — name, what it does, technologies used, and its impact']
  if (projectAnswer) {
    resumeData.projects.push({
      id: Date.now().toString(),
      name: projectAnswer.match(/name: ([^,]+)/)?.[1]?.trim() || 'My Project',
      description: projectAnswer.match(/what it does: ([^.]+)/)?.[1]?.trim() || 'Project description',
      technologies: projectAnswer.match(/technologies used: ([^.]+)/)?.[1]?.trim().split(',').map(tech => tech.trim()) || [],
      url: '',
      impact: projectAnswer.match(/its impact: ([^.]+)/)?.[1]?.trim() || 'Project impact'
    })
  }

  return resumeData
}
