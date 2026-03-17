import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { repos } = await request.json()
    
    if (!repos || repos.length === 0) {
      return NextResponse.json({ error: 'Repositories are required' }, { status: 400 })
    }

    const repoDescriptions = repos.map((repo: any) => 
      `${repo.name}: ${repo.description} (Language: ${repo.language}, Stars: ${repo.stars})`
    ).join('\n')

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: 'You are an expert portfolio writer. Create a professional portfolio introduction and project descriptions based on the provided GitHub repositories. Make it compelling and professional. Return JSON format with introduction and projects array.'
      }, {
        role: 'user',
        content: `Create a portfolio from these GitHub repositories:\n${repoDescriptions}\n\nReturn JSON with this structure:\n{"introduction": "Professional introduction about the developer", "projects": [{"name": "Project Name", "description": "Professional description of the project"}]}`
      }],
      temperature: 0.7,
      max_tokens: 1000
    })

    const content = completion.choices[0].message.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to generate portfolio' }, { status: 500 })
    }

    const portfolio = JSON.parse(jsonMatch[0])
    
    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Portfolio generation error:', error)
    return NextResponse.json({ error: 'Failed to generate portfolio' }, { status: 500 })
  }
}
