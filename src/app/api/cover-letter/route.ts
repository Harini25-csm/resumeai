import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
export async function POST(request: NextRequest) {
  try {
    const { role, company, skills, experience, tone = 'professional' } = await request.json()
    
    if (!role || !company) {
      return NextResponse.json({ error: 'Role and company are required' }, { status: 400 })
    }
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: 'You are an expert cover letter writer. Write professional, personalized cover letters.'
      }, {
        role: 'user',
        content: `Write a ${tone} cover letter for ${role} position at ${company}. Skills: ${skills || 'Not specified'}. Experience: ${experience || 'Not specified'}. Write 3 paragraphs. Return only the cover letter text, no subject line, no extra formatting.` 
      }],
      temperature: 0.7,
      max_tokens: 800
    })
    const letter = completion.choices[0].message.content || ''
    return NextResponse.json({ letter })
  } catch (error) {
    console.error('Cover letter error:', error)
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
  }
}
