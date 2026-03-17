import { NextResponse, type NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClientInstance } from '@/lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const personaInstructions: Record<string, { focus: string; summary: string; keywords: string; skills: string }> = {
  'Software Engineer': {
    focus: 'technical skills, programming languages, frameworks, system design, algorithms, and development methodologies',
    summary: 'software development expertise and technical achievements',
    keywords: 'full stack, backend, frontend, devops, databases',
    skills: 'JavaScript, TypeScript, React, Node.js, Python'
  },
  'Product Manager': {
    focus: 'product strategy, roadmap planning, stakeholder management, metrics, and go-to-market strategies',
    summary: 'product management experience and successful launches',
    keywords: 'product strategy, agile, scrum, kpis, user research',
    skills: 'Product management, roadmap planning, stakeholder management'
  },
  'Data Scientist': {
    focus: 'machine learning, statistical analysis, data visualization, python, and experimental design',
    summary: 'data science expertise and analytical insights',
    keywords: 'machine learning, python, statistics, data analysis, modeling',
    skills: 'Python, machine learning, data analysis, statistics'
  },
  'Designer': {
    focus: 'user experience, interface design, prototyping, design systems, and visual communication',
    summary: 'design expertise and user-centered solutions',
    keywords: 'ux design, ui design, prototyping, figma, design systems',
    skills: 'UX design, UI design, prototyping, Figma, design systems'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { persona } = await request.json()

    if (!persona || !(persona in personaInstructions)) {
      return NextResponse.json({ error: 'Invalid persona' }, { status: 400 })
    }

    // Get current user
    const supabase = createClientInstance()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's latest resume
    const { data: resumeData } = await supabase
      .from('resumes')
      .select('content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!resumeData?.content) {
      return NextResponse.json({ error: 'No resume found' }, { status: 400 })
    }

    const resume = resumeData.content
    const instructions = personaInstructions[persona as keyof typeof personaInstructions]

    const systemPrompt = `You are an expert resume writer specializing in tailoring resumes for specific professional roles. Your task is to rewrite the entire resume to perfectly align with the ${persona} persona.

Rewrite the resume following these guidelines:
1. Reframe all experience to highlight ${instructions.focus}
2. Emphasize ${instructions.summary} in the professional summary
3. Prioritize ${instructions.skills} in the skills section
4. Use industry-specific terminology and language appropriate for ${persona}
5. Maintain all factual information and dates, but rephrase achievements to match the persona
6. Ensure bullet points start with strong action verbs relevant to ${persona}
7. Keep the same structure but optimize content for the target role

Return ONLY valid JSON with this exact structure:
{
  "summary": "Rewritten professional summary",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company",
      "dates": "Dates",
      "bullets": ["Rewritten bullet 1", "Rewritten bullet 2"]
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "education": [
    {
      "degree": "Degree",
      "school": "School",
      "dates": "Dates"
    }
  ]
}

Make the resume compelling and perfectly tailored for a ${persona} position while maintaining authenticity.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Please rewrite this resume for the ${persona} persona:\n\n${JSON.stringify(resume, null, 2)}`
        }
      ],
      stream: false
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Invalid response format')
    }

    try {
      const rewrittenResume = JSON.parse(content.text)
      
      // Update the resume in database
      await supabase
        .from('resumes')
        .update({
          content: rewrittenResume,
          template_id: persona // Store the persona as template_id
        })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      return NextResponse.json({
        success: true,
        resume: rewrittenResume,
        persona
      })
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content.text)
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

  } catch (error) {
    console.error('Persona switch error:', error)
    return NextResponse.json(
      { error: 'Failed to switch persona' },
      { status: 500 }
    )
  }
}
