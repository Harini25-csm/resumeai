import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Prevent static generation
export const dynamic = 'force-dynamic'

// Chat context and question flow
const onboardingFlow = [
  {
    question: "What's your current or most recent job title?",
    context: "job title",
    nextQuestion: (userInput: string) => `Great! As a ${userInput}, what are your main responsibilities and key achievements in this role?`
  },
  {
    question: "Tell me about your education background.",
    context: "education",
    nextQuestion: (userInput: string) => `Thanks for sharing! What technical skills and tools are you proficient with?`
  },
  {
    question: "What skills do you have?",
    context: "skills",
    nextQuestion: (userInput: string) => `Excellent! What are your career goals or the type of role you're targeting?`
  },
  {
    question: "What are your career goals?",
    context: "goals",
    nextQuestion: (userInput: string) => `Perfect! Is there a specific company or industry you're interested in?`
  },
  {
    question: "Any specific target companies or industries?",
    context: "target",
    nextQuestion: (userInput: string) => `Great! One last question - what makes you stand out from other candidates in your field?`
  }
]

export async function POST(req: Request) {
  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({
      error: 'GROQ_API_KEY is not configured',
      details: 'Please add GROQ_API_KEY to your environment variables'
    }, { status: 500 })
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  })
  try {
    const { messages } = await req.json()
    
    // Get the last user message
    const lastUserMessage = messages[messages.length - 1]
    
    if (!lastUserMessage || lastUserMessage.role !== 'user') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
    }

    // Count previous user messages to determine flow position
    const userMessageCount = messages.filter((m: any) => m.role === 'user').length
    
    let response = ''
    
    if (userMessageCount === 1) {
      // First response - continue with experience question
      response = onboardingFlow[0].nextQuestion(lastUserMessage.content)
    } else if (userMessageCount <= onboardingFlow.length) {
      // Continue with the flow
      const flowIndex = userMessageCount - 2 // Adjust for 0-based indexing
      if (flowIndex < onboardingFlow.length - 1) {
        response = onboardingFlow[flowIndex].nextQuestion(lastUserMessage.content)
      } else {
        // End of flow
        response = "Perfect! I have all the information I need. Click 'Generate my resume' to create your professional resume."
      }
    } else {
      // After the flow, provide helpful responses
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful career assistant. Provide concise, encouraging responses about resume building and career advice."
          },
          {
            role: "user",
            content: lastUserMessage.content
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      })
      
      response = chatCompletion.choices[0]?.message?.content || "I'm here to help with your resume!"
    }

    return NextResponse.json({
      role: 'assistant',
      content: response
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
