import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
}

export async function generateResumeContent(userInput: string, jobDescription?: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are an expert resume writer. Help me create professional resume content based on the following information:

User Input: ${userInput}
${jobDescription ? `Target Job Description: ${jobDescription}` : ''}

Please generate professional, impactful resume content that:
1. Uses action verbs and quantifiable achievements
2. Is tailored to the target role if provided
3. Follows modern resume best practices
4. Is concise but comprehensive

Format the response in clear sections: Professional Summary, Experience, Education, and Skills.`
        }
      ]
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error('Error generating resume content:', error);
    throw new Error('Failed to generate resume content');
  }
}

export async function improveResumeContent(existingContent: string, feedback: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Please improve the following resume content based on this feedback:

Current Content:
${existingContent}

Feedback:
${feedback}

Please provide an improved version that addresses the feedback while maintaining professionalism and impact.`
        }
      ]
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  } catch (error) {
    console.error('Error improving resume content:', error);
    throw new Error('Failed to improve resume content');
  }
}
