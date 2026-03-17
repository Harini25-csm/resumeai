import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Check if Groq API key is available
const groqApiKey = process.env.GROQ_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { repos, linkedinData, githubUsername } = await request.json()
    
    if (!repos || repos.length === 0) {
      return NextResponse.json({ error: 'Repositories are required' }, { status: 400 })
    }

    if (!groqApiKey) {
      // Fallback response when Groq API key is not available
      console.warn('GROQ_API_KEY not found, using fallback portfolio generation')
      return generateFallbackPortfolio(repos, linkedinData, githubUsername)
    }

    const groq = new Groq({ apiKey: groqApiKey })

    const repoDescriptions = repos.map((repo: any) => 
      `${repo.name}: ${repo.description} (Language: ${repo.language}, Stars: ${repo.stars})`
    ).join('\n')

    let promptContent = `Create a comprehensive portfolio from these GitHub repositories:\n${repoDescriptions}\n`
    
    if (linkedinData) {
      promptContent += `\nLinkedIn Profile Data:\n`
      promptContent += `Name: ${linkedinData.name}\n`
      promptContent += `Headline: ${linkedinData.headline}\n`
      promptContent += `Summary: ${linkedinData.summary}\n`
      if (linkedinData.experience) {
        promptContent += `Experience: ${linkedinData.experience.map((exp: any) => `${exp.title} at ${exp.company}`).join(', ')}\n`
      }
      if (linkedinData.skills) {
        promptContent += `Skills: ${linkedinData.skills.join(', ')}\n`
      }
    }

    promptContent += `\nGitHub Username: ${githubUsername}\n\nReturn JSON with this structure:
{
  "introduction": "Professional introduction that combines GitHub projects and LinkedIn experience",
  "about": "Detailed about section combining professional background and technical expertise",
  "skills": ["Technical and professional skills"],
  "experience": [{"title": "Role", "company": "Company", "duration": "Duration", "description": "Description combining GitHub contributions and LinkedIn experience"}],
  "projects": [{"name": "Project Name", "description": "Enhanced description that connects to professional experience", "technologies": ["Tech stack"], "highlights": ["Key achievements"]}],
  "contact": {
    "github": "${githubUsername}",
    "linkedin": "${linkedinData?.name || 'Professional'}",
    "email": "contact@example.com"
  }
}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: 'You are an expert portfolio writer. Create a comprehensive, professional portfolio that combines GitHub projects and LinkedIn experience to showcase the developer\'s full professional profile. Make it compelling, detailed, and suitable for attracting employers or clients.'
      }, {
        role: 'user',
        content: promptContent
      }],
      temperature: 0.7,
      max_tokens: 2000
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
    
    // Fallback to mock portfolio generation on error
    const { repos, linkedinData, githubUsername } = await request.json()
    return generateFallbackPortfolio(repos, linkedinData, githubUsername)
  }
}

function generateFallbackPortfolio(repos: any[], linkedinData: any, githubUsername: string) {
  // Generate a basic portfolio without AI
  const skills = new Set<string>()
  const languages = new Set<string>()
  
  repos.forEach(repo => {
    if (repo.language) languages.add(repo.language)
    // Extract skills from repo names and descriptions
    const repoText = `${repo.name} ${repo.description}`.toLowerCase()
    if (repoText.includes('react') || repoText.includes('next')) skills.add('React')
    if (repoText.includes('node') || repoText.includes('express')) skills.add('Node.js')
    if (repoText.includes('python')) skills.add('Python')
    if (repoText.includes('typescript')) skills.add('TypeScript')
    if (repoText.includes('javascript')) skills.add('JavaScript')
    if (repoText.includes('docker')) skills.add('Docker')
    if (repoText.includes('aws')) skills.add('AWS')
    if (repoText.includes('mongodb')) skills.add('MongoDB')
    if (repoText.includes('sql')) skills.add('SQL')
  })
  
  const allSkills = Array.from(skills).concat(Array.from(languages))
  
  const portfolio = {
    introduction: linkedinData?.summary || 
      `Passionate developer with expertise in ${allSkills.slice(0, 3).join(', ')}. ` +
      `Contributed to ${repos.length} open-source projects on GitHub with a focus on ` +
      `building innovative solutions and modern web applications.`,
    
    about: linkedinData?.summary || 
      `I am a dedicated developer with a strong background in ${allSkills.slice(0, 2).join(' and ')}. ` +
      `With ${repos.length} projects on GitHub, I demonstrate consistent contributions to the ` +
      `open-source community and a passion for solving complex problems through code.`,
    
    skills: allSkills.slice(0, 8),
    
    experience: linkedinData?.experience || [{
      title: "Full-Stack Developer",
      company: "Open Source Community",
      duration: "Present",
      description: `Developing and maintaining ${repos.length} open-source projects with focus on ${allSkills.slice(0, 3).join(', ')}`
    }],
    
    projects: repos.map(repo => ({
      name: repo.name,
      description: repo.description || `A ${repo.language || 'software'} project showcasing technical skills and problem-solving abilities.`,
      technologies: [repo.language, 'JavaScript', 'Git'].filter(Boolean),
      highlights: [
        `${repo.stars} stars on GitHub`,
        `Built with ${repo.language || 'modern technologies'}`,
        'Open source contribution'
      ]
    })),
    
    contact: {
      github: githubUsername,
      linkedin: linkedinData?.name || 'Professional Developer',
      email: 'contact@example.com'
    }
  }
  
  return NextResponse.json({ portfolio })
}
