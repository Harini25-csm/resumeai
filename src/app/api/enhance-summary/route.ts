import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { summary } = await request.json()
    
    if (!summary) {
      return NextResponse.json({ error: 'Summary is required' }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: 'You are an expert resume writer. Enhance the given professional summary to make it more compelling, professional, and impactful. Keep it concise (under 500 characters) and maintain the original meaning while improving the language.'
      }, {
        role: 'user',
        content: `Enhance this professional summary: ${summary}`
      }],
      temperature: 0.7,
      max_tokens: 300
    })

    const enhancedSummary = completion.choices[0].message.content || ''
    
    return NextResponse.json({ enhancedSummary })
  } catch (error) {
    console.error('Enhance summary error:', error)
    return NextResponse.json({ error: 'Failed to enhance summary' }, { status: 500 })
  }
}
