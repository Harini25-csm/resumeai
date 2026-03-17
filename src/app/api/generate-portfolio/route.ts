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

    promptContent += `\nGitHub Username: ${githubUsername}\n\nIMPORTANT: Generate a STUDENT-FOCUSED portfolio. The person is currently studying computer science, not an experienced professional.\n\nReturn JSON with this structure:
{
  "introduction": "Student-focused introduction combining GitHub projects and academic background",
  "about": "About section emphasizing learning, academic projects, and skill development",
  "skills": ["Technical and learning-focused skills"],
  "experience": [{"title": "Student Role", "company": "University/Academic", "duration": "Student timeline", "description": "Description focused on learning and academic projects"}],
  "projects": [{"name": "Project Name", "description": "Academic/learning-focused description", "technologies": ["Tech stack"], "highlights": ["Learning achievements"]}],
  "contact": {
    "github": "${githubUsername}",
    "linkedin": "${linkedinData?.name || 'Computer Science Student'}",
    "email": "student@example.com"
  }
}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: 'You are an expert portfolio writer. Create a comprehensive, student-focused portfolio that combines GitHub projects and LinkedIn data to showcase a computer science student\'s learning journey and technical skills. Emphasize academic growth, learning, and potential rather than extensive professional experience. Make it compelling for internships, entry-level positions, or academic opportunities.'
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
      `Computer Science student with expertise in ${allSkills.slice(0, 3).join(', ')}. ` +
      `Building ${repos.length} open-source projects while learning modern web technologies and ` +
      `developing strong foundations in software engineering.`,
    
    about: linkedinData?.summary || 
      `I am a passionate Computer Science student focused on ${allSkills.slice(0, 2).join(' and ')}. ` +
      `Through my ${repos.length} GitHub projects, I'm developing practical skills in ` +
      `full-stack development and contributing to the open-source community while pursuing my degree.`,
    
    skills: allSkills.slice(0, 8),
    
    experience: linkedinData?.experience || [{
      title: "Student Developer",
      company: "University Projects",
      duration: "2023 - Present",
      description: `Developing ${repos.length} projects using ${allSkills.slice(0, 3).join(', ')} to build practical software engineering skills while pursuing Computer Science degree.`
    }],
    
    projects: repos.map(repo => ({
      name: repo.name,
      description: repo.description || `A ${repo.language || 'software'} project developed as part of my learning journey and academic exploration.`,
      technologies: [repo.language, 'JavaScript', 'Git'].filter(Boolean),
      highlights: [
        `Academic project showcasing ${repo.language || 'programming'} skills`,
        `Built with modern ${repo.language || 'web'} technologies`,
        'Student open-source contribution'
      ]
    })),
    
    contact: {
      github: githubUsername,
      linkedin: linkedinData?.name || 'Computer Science Student',
      email: 'student@example.com'
    }
  }
  
  return NextResponse.json({ portfolio })
}
