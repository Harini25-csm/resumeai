import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { repos, linkedinData, githubUsername } = await request.json()
    
    if (!repos || repos.length === 0) {
      return NextResponse.json({ error: 'Repositories are required' }, { status: 400 })
    }

    console.log('Generating portfolio for:', githubUsername || 'user')
    console.log('Using reliable fallback portfolio generation')
    
    // Always use the reliable fallback for production consistency
    return generateFallbackPortfolio(repos, linkedinData, githubUsername)
    
  } catch (error) {
    console.error('Portfolio generation error:', error)
    
    // Fallback to basic portfolio generation on error
    try {
      const { repos, linkedinData, githubUsername } = await request.json()
      return generateFallbackPortfolio(repos, linkedinData, githubUsername)
    } catch {
      return NextResponse.json({ error: 'Failed to parse request' }, { status: 400 })
    }
  }
}

function generateFallbackPortfolio(repos: any[], linkedinData: any, githubUsername: string) {
  // Create a comprehensive portfolio from GitHub repos and LinkedIn data
  const projects = repos.slice(0, 6).map((repo: any) => ({
    name: repo.name,
    description: repo.description || `A ${repo.language || 'software'} project with ${repo.stars} stars`,
    technologies: [repo.language, 'JavaScript', 'Git'].filter(Boolean),
    highlights: [
      `Built with ${repo.language || 'modern technologies'}`,
      `${repo.stars} GitHub stars`,
      'Clean, maintainable code',
      'Well-documented project'
    ]
  }))

  const skills = [
    'JavaScript',
    'React',
    'Node.js',
    'TypeScript',
    'Python',
    'HTML/CSS',
    'Git',
    'Web Development',
    'Problem Solving'
  ]

  const experience = [
    {
      title: 'Computer Science Student',
      company: 'MITS Madanapalle',
      duration: '2021 - 2025',
      description: 'Bachelor of Technology student focused on software development, algorithms, and modern web technologies. Working on academic projects and developing technical skills through coursework and personal projects.'
    }
  ]

  const portfolio = {
    introduction: `Passionate Computer Science student at MITS Madanapalle with a strong foundation in software development and modern web technologies. Currently exploring ${repos.slice(0, 3).map(r => r.name).join(', ')} and other innovative projects to build practical skills and contribute to the tech community.`,
    
    about: `I am a dedicated Computer Science student with a passion for creating innovative solutions through code. My journey in technology began with academic coursework and has expanded into personal projects and open-source contributions. I specialize in web development with expertise in JavaScript, React, and Node.js. I believe in continuous learning and enjoy tackling complex problems that push me to grow as a developer.`,
    
    skills: skills,
    
    experience: experience,
    
    projects: projects,
    
    contact: {
      github: githubUsername || 'your-github',
      linkedin: linkedinData?.name || 'Computer Science Student',
      email: 'your.email@example.com',
      phone: 'Your Phone Number',
      address: 'Your Address',
      linkedinUrl: linkedinData?.linkedinUrl || 'https://linkedin.com/in/yourprofile'
    }
  }

  return NextResponse.json({ portfolio })
}
