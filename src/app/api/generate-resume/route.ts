import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { role, skills, experience, education } = await request.json();

    // Validate required fields
    if (!role || !skills || !experience) {
      return NextResponse.json(
        { error: 'Role, skills, and experience are required' },
        { status: 400 }
      );
    }

    // Create the prompt for Groq
    const prompt = `Generate a professional, ATS-friendly resume for the following candidate:

ROLE: ${role}

SKILLS: ${skills}

EXPERIENCE: ${experience}

EDUCATION: ${education || 'Not specified'}

Please generate:
1. A compelling professional summary (3-4 sentences)
2. Key skills section (8-10 relevant skills)
3. Professional achievements (3-4 quantifiable achievements)
4. Experience bullet points (5-6 action-oriented bullet points)

Format the response as JSON with the following structure:
{
  "summary": "Professional summary here...",
  "skills": "Comma-separated list of key skills",
  "achievements": "3-4 professional achievements",
  "bulletPoints": "5-6 experience bullet points"
}

Make sure the content is:
- ATS-optimized with relevant keywords
- Professional and concise
- Action-oriented with strong verbs
- Quantifiable where possible
- Tailored to the specified role`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and career coach. You create professional, ATS-optimized resumes that help candidates land interviews. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from Groq API');
    }

    // Parse the JSON response
    const resumeData = JSON.parse(responseContent);

    return NextResponse.json({
      success: true,
      data: resumeData
    });

  } catch (error) {
    console.error('Error generating resume:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Resume Generator API - POST to /api/generate-resume with role, skills, experience, and education'
  });
}
