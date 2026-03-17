import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
export async function POST(request: NextRequest) {
  try {
    const { jobDescription, resumeData } = await request.json()
    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description required' }, { status: 400 })
    }
    const resumeText = resumeData ? JSON.stringify(resumeData) : 'No resume data provided'
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Analyze this resume against the job description and return ONLY a JSON object with no explanation, no markdown, no code blocks.
Resume: ${resumeText}
Job Description: ${jobDescription}
Return exactly this JSON structure:
{"score": 75, "missing_keywords": ["react", "node.js"], "matched_keywords": ["javascript", "css"], "improvements": ["Add React experience", "Mention Node.js projects"]}`
      }],
      temperature: 0.3,
      max_tokens: 1000
    })
    const content = completion.choices[0].message.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ score: 0, missing_keywords: [], matched_keywords: [], improvements: [] })
    }
    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (error) {
    console.error('Optimize error:', error)
    return NextResponse.json({ score: 0, missing_keywords: [], matched_keywords: [], improvements: [] })
  }
}
