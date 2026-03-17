import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { role, company, skills, experience } = await request.json();

    // Validate required fields
    if (!role || !company || !skills) {
      return NextResponse.json(
        { error: 'Role, company, and skills are required' },
        { status: 400 }
      );
    }

    // Create the prompt for cover letter generation
    const prompt = `Generate a professional cover letter for the following application:

ROLE: ${role}
COMPANY: ${company}
SKILLS: ${skills}
EXPERIENCE: ${experience || 'Not specified'}

Please create a compelling cover letter that:
1. Is tailored to the specific role and company
2. Highlights relevant skills and experience
3. Shows enthusiasm for the position
4. Maintains professional tone
5. Is concise and impactful (250-300 words)
6. Includes proper greeting and closing

Format the response as a single JSON object with this structure:
{
  "coverLetter": "Full cover letter text here..."
}

Make sure the cover letter is:
- Professional and well-structured
- Customized to the role and company
- Action-oriented with clear call to action
- Free of generic cliches
- Appropriate for the industry level`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor and professional writer. You create compelling, personalized cover letters that help candidates land interviews. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from Groq API');
    }

    // Parse the JSON response
    const coverLetterData = JSON.parse(responseContent);

    return NextResponse.json({
      success: true,
      data: coverLetterData
    });

  } catch (error) {
    console.error('Error generating cover letter:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate cover letter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Cover Letter Generator API - POST to /api/generate-cover-letter with role, company, skills, and experience'
  });
}
