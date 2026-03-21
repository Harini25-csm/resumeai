import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if this is an enhanced portfolio request
    if (body.projects && body.username && !body.repos) {
      return handleEnhancedPortfolio(body.projects, body.username, body.resumeData)
    }
    
    // Handle main portfolio generation
    return handleMainPortfolio(body)
    
  } catch (error) {
    console.error('Portfolio generation error:', error)
    return NextResponse.json({ error: 'Failed to generate portfolio' }, { status: 500 })
  }
}

async function handleMainPortfolio(body: any) {
  console.log('Main Portfolio Request:', body)
  const { repos, linkedinData, githubUsername, userName } = body
  
  if (!repos || repos.length === 0) {
    return NextResponse.json({ error: 'Repositories are required' }, { status: 400 })
  }

  console.log('Processing repos:', repos.length)
  console.log('LinkedIn data available:', !!linkedinData)
  console.log('GitHub username:', githubUsername)
  console.log('User name:', userName)

  // Create projects from repos - SHOW ALL PROJECTS
  const projects = repos.map((repo: any) => ({
    name: repo.name,
    description: repo.description || 'A ' + (repo.language || 'software') + ' project with ' + repo.stars + ' stars',
    technologies: [repo.language, 'JavaScript', 'Git'].filter(Boolean),
    highlights: [
      'Built with ' + (repo.language || 'modern technologies'),
      repo.stars + ' GitHub stars',
      'Clean, maintainable code',
      'Well-documented project'
    ],
    githubUrl: repo.html_url
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
      title: 'Software Developer',
      company: 'Professional Experience',
      duration: '2024 - Present',
      description: (userName || 'A passionate developer') + ' building innovative solutions and contributing to meaningful projects. Specializing in modern web technologies and creating impactful applications.'
    }
  ]

  const portfolio = {
    introduction: 'Passionate ' + (userName || 'developer') + ' with a strong foundation in software development and modern web technologies. Currently exploring ' + repos.slice(0, 3).map((r: any) => r.name).join(', ') + ' and other innovative projects to build practical skills and contribute to the tech community.',
    
    about: 'I am a dedicated ' + (userName || 'developer') + ' with a passion for creating innovative solutions through code. My journey in technology has expanded into personal projects and open-source contributions. I specialize in web development with expertise in JavaScript, React, and Node.js. I believe in continuous learning and enjoy tackling complex problems that push me to grow as a developer.',
    
    skills: skills,
    
    experience: experience,
    
    projects: projects,
    
    contact: {
      github: githubUsername || 'your-github',
      name: userName || linkedinData?.name || 'Professional Developer',
      linkedin: userName || linkedinData?.name || 'Professional Developer',
      email: 'your.email@example.com',
      phone: 'Your Phone Number',
      address: 'Your Address',
      linkedinUrl: linkedinData?.linkedinUrl || 'https://linkedin.com/in/yourprofile'
    }
  }

  console.log('Generated Portfolio:', portfolio)
  return NextResponse.json({ portfolio })
}

async function fetchProjectDetails(username: string, projectName: string) {
  try {
    // Fetch README content
    const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${projectName}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Generator'
      }
    })
    
    let readmeContent = ''
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json()
      readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8')
    }
    
    // Fetch repository contents to analyze file structure
    const contentsResponse = await fetch(`https://api.github.com/repos/${username}/${projectName}/contents`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Generator'
      }
    })
    
    let fileStructure = []
    if (contentsResponse.ok) {
      fileStructure = await contentsResponse.json()
    }
    
    // Analyze package.json for dependencies if it exists
    let dependencies: string[] = []
    const packageJsonFile = fileStructure.find((file: any) => file.name === 'package.json')
    if (packageJsonFile) {
      const packageResponse = await fetch(packageJsonFile.download_url)
      if (packageResponse.ok) {
        const packageData = await packageResponse.json()
        dependencies = [
          ...Object.keys(packageData.dependencies || {}),
          ...Object.keys(packageData.devDependencies || {})
        ]
      }
    }
    
    return {
      readme: readmeContent,
      fileStructure: fileStructure.map((f: any) => f.name),
      dependencies: dependencies
    }
  } catch (error) {
    console.error(`Error fetching details for ${projectName}:`, error)
    return {
      readme: '',
      fileStructure: [],
      dependencies: []
    }
  }
}

async function handleEnhancedPortfolio(projects: any[], username: string, resumeData: any) {
  try {
    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: 'No projects provided' }, { status: 400 })
    }
    
    // Fetch detailed information for each project
    const projectsWithDetails = await Promise.all(
      projects.map(async (project: any) => {
        const details = await fetchProjectDetails(username, project.name)
        return {
          ...project,
          readme: details.readme,
          fileStructure: details.fileStructure,
          dependencies: details.dependencies
        }
      })
    )
    
    // Create detailed project list for AI analysis
    const projectList = projectsWithDetails.map((p: any) => {
      let details = `- ${p.name}: language=${p.language || 'Unknown'}, stars=${p.stars || 0}`
      details += `, description=${p.description || 'No description'}`
      
      if (p.readme) {
        details += `\nREADME: ${p.readme.substring(0, 500)}...`
      }
      
      if (p.dependencies && p.dependencies.length > 0) {
        details += `\nDependencies: ${p.dependencies.slice(0, 10).join(', ')}`
      }
      
      if (p.fileStructure && p.fileStructure.length > 0) {
        details += `\nFiles: ${p.fileStructure.slice(0, 15).join(', ')}`
      }
      
      return details
    }).join('\n\n')

    let enhancedProjects

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: 'You are a senior software engineer and portfolio expert. Analyze these GitHub projects by ' + username + ' and create professional, detailed descriptions based on the actual project content.\n\nFor each project, perform deep technical analysis and extract:\n1. **Technical Architecture**: Design patterns, architectural styles (MVC, MVP, Microservices, etc.)\n2. **Frontend Technologies**: Frameworks (React, Vue, Angular), libraries, CSS frameworks (Tailwind, Bootstrap), state management\n3. **Backend Technologies**: Server-side languages, frameworks (Express, Django, Spring), API design\n4. **Database Technologies**: SQL (MySQL, PostgreSQL), NoSQL (MongoDB, Supabase), ORMs used\n5. **Development Tools**: Build tools (Webpack, Vite), version control, testing frameworks, CI/CD\n6. **Cloud/DevOps**: AWS, Vercel, Docker, deployment strategies\n7. **Key Technical Features**: Authentication, real-time features, data processing, algorithms implemented\n8. **Performance Optimizations**: Caching, lazy loading, database optimization, code splitting\n9. **Problem-Solving Approach**: How technical challenges were solved\n\nIMPORTANT: Analyze the README content, file structure, and dependencies to extract REAL technical details. Don\'t make generic assumptions. Be specific about what the project actually does.\n\nProjects with Details:\n' + projectList + '\n\nFor each project, return a JSON object with:\n- "name": project name\n- "enhanced_description": Professional 3-4 sentence description highlighting actual technical expertise, architecture, and business impact based on the project content\n- "key_features": Array of 6-8 specific technical features based on actual implementation (e.g., "JWT authentication system", "React hooks for state management", "PostgreSQL database integration", "Tailwind CSS responsive design", "RESTful API endpoints", "Real-time WebSocket features")\n- "tech_stack": Array of all technologies actually used in the project (from dependencies and file analysis)\n\nCRITICAL: Extract technologies from the dependencies list and file structure. Include specific frameworks, libraries, and tools actually used. Return ONLY a valid JSON array with NO explanation:'
        }],
        temperature: 0.7,
        max_tokens: 4000
      })

      const content = completion.choices[0].message.content || '[]'
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('Invalid AI response format')
      }
      const enhancedData = JSON.parse(jsonMatch[0])

      // Merge enhanced data with original projects
      enhancedProjects = projects.map((project: any) => {
        const enhanced = enhancedData.find((e: any) =>
          e.name.toLowerCase() === project.name.toLowerCase()
        )
        return {
          ...project,
          description: enhanced?.enhanced_description || project.description || 'No description available',
          key_features: enhanced?.key_features || [],
          tech_stack: enhanced?.tech_stack || [project.language].filter(Boolean)
        }
      })

    } catch (aiError) {
      console.error('AI service unavailable, using enhanced fallback:', aiError)
      
      // Enhanced fallback that analyzes actual project data
      enhancedProjects = projectsWithDetails.map((project: any) => {
        const language = project.language || 'modern technologies'
        const description = project.description || 'No description available'
        
        // Analyze dependencies for real technologies
        let techStack: string[] = [project.language, 'Git'].filter(Boolean)
        let keyFeatures: string[] = []
        let enhancedDescription = description
        
        // Extract technologies from dependencies
        if (project.dependencies && project.dependencies.length > 0) {
          techStack = techStack.concat(project.dependencies)
          
          // Categorize dependencies
          const frontendFrameworks = project.dependencies.filter((dep: string) => 
            ['react', 'vue', 'angular', 'svelte', 'next', 'nuxt'].includes(dep.toLowerCase())
          )
          const cssFrameworks = project.dependencies.filter((dep: string) => 
            ['tailwind', 'bootstrap', 'bulma', 'material-ui', 'ant-design'].includes(dep.toLowerCase())
          )
          const backendFrameworks = project.dependencies.filter((dep: string) => 
            ['express', 'django', 'flask', 'spring', 'rails', 'laravel'].includes(dep.toLowerCase())
          )
          const databases = project.dependencies.filter((dep: string) => 
            ['mongoose', 'prisma', 'sequelize', 'typeorm', 'knex'].includes(dep.toLowerCase())
          )
          const buildTools = project.dependencies.filter((dep: string) => 
            ['webpack', 'vite', 'rollup', 'parcel', 'esbuild'].includes(dep.toLowerCase())
          )
          const testing = project.dependencies.filter((dep: string) => 
            ['jest', 'mocha', 'cypress', 'vitest', 'playwright'].includes(dep.toLowerCase())
          )
          
          // Build key features based on actual dependencies
          if (frontendFrameworks.length > 0) {
            keyFeatures.push(`${frontendFrameworks.join(', ')} framework implementation`)
          }
          if (cssFrameworks.length > 0) {
            keyFeatures.push(`${cssFrameworks.join(', ')} for responsive design`)
          }
          if (backendFrameworks.length > 0) {
            keyFeatures.push(`${backendFrameworks.join(', ')} backend framework`)
          }
          if (databases.length > 0) {
            keyFeatures.push(`${databases.join(', ')} database integration`)
          }
          if (buildTools.length > 0) {
            keyFeatures.push(`${buildTools.join(', ')} build system`)
          }
          if (testing.length > 0) {
            keyFeatures.push(`${testing.join(', ')} testing framework`)
          }
          
          // Add common features based on file structure
          if (project.fileStructure) {
            if (project.fileStructure.some((file: string) => file.includes('auth'))) {
              keyFeatures.push('Authentication system implementation')
            }
            if (project.fileStructure.some((file: string) => file.includes('api'))) {
              keyFeatures.push('RESTful API development')
            }
            if (project.fileStructure.some((file: string) => file.includes('config'))) {
              keyFeatures.push('Configuration management')
            }
            if (project.fileStructure.some((file: string) => file.includes('test'))) {
              keyFeatures.push('Comprehensive test coverage')
            }
          }
          
          // Create enhanced description based on actual tech stack
          if (frontendFrameworks.length > 0 || backendFrameworks.length > 0) {
            enhancedDescription = `A ${language} project utilizing ${techStack.slice(0, 5).join(', ')}${techStack.length > 5 ? ' and more' : ''}. ${description}`
          }
        }
        
        // Add default features if none found
        if (keyFeatures.length === 0) {
          keyFeatures = [
            `${language} development`,
            'Version control with Git',
            'Clean code architecture',
            'Problem-solving implementation'
          ]
        }
        
        return {
          ...project,
          description: enhancedDescription,
          key_features: keyFeatures.slice(0, 8), // Limit to 8 features
          tech_stack: Array.from(new Set(techStack)) // Remove duplicates
        }
      })
    }

    return NextResponse.json({ enhancedProjects })
  } catch (error) {
    console.error('Enhanced portfolio generation error:', error)
    return NextResponse.json({ error: 'Failed to generate enhanced portfolio' }, { status: 500 })
  }
}
