import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Prevent static generation
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ 
      error: 'GROQ_API_KEY is not configured',
      details: 'Please add GROQ_API_KEY to your environment variables'
    }, { status: 500 })
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  try {
    const body = await request.json()
    const { jobDescription, currentResume, requestType = 'job_analysis' } = body
    
    console.log('Request type:', requestType)
    console.log('Resume provided:', !!currentResume)
    console.log('Job description provided:', !!jobDescription)

    if (!currentResume || currentResume.trim().length === 0) {
      return NextResponse.json({ error: 'Resume text is required for analysis' }, { status: 400 })
    }

    let prompt = ''
    
    if (requestType === 'career_analysis') {
      // Career role analysis without specific job description
      prompt = `You are a career advisor AI. Analyze this resume and provide comprehensive career guidance.

RESUME:
${currentResume}

Please provide a detailed analysis in this JSON format:
{
  "career_analysis": {
    "best_fit_roles": [
      {
        "role": "Front-end Developer",
        "match_score": 85,
        "reason": "Strong React, JavaScript, and CSS skills",
        "current_skills": ["React", "JavaScript", "CSS", "HTML"],
        "missing_skills": ["TypeScript", "Next.js", "Tailwind CSS"],
        "improvement_areas": ["Learn TypeScript for type safety", "Master modern CSS frameworks", "Build responsive design portfolio"]
      }
    ],
    "skill_assessment": {
      "technical_skills": ["JavaScript", "React", "Node.js", "Python"],
      "soft_skills": ["Communication", "Teamwork", "Problem Solving"],
      "experience_level": "Mid-level",
      "overall_score": 75
    },
    "career_recommendations": [
      "Focus on full-stack development to maximize opportunities",
      "Consider learning cloud technologies (AWS/Azure)",
      "Build more portfolio projects to showcase skills"
    ],
    "learning_path": {
      "short_term": ["Complete TypeScript course", "Build 2 portfolio projects"],
      "long_term": ["Learn cloud deployment", "Get AWS certification"]
    }
  }
}

Analyze the resume thoroughly and provide realistic, actionable career advice.`
    } else {
      // Job-specific analysis
      prompt = `You are an ATS and career advisor AI. Compare this resume against the job description and provide detailed analysis.

RESUME:
${currentResume}

JOB DESCRIPTION:
${jobDescription}

Please provide a detailed analysis in this JSON format:
{
  "job_analysis": {
    "match_score": 75,
    "matched_skills": ["JavaScript", "React", "Node.js"],
    "missing_skills": ["AWS", "Docker", "TypeScript"],
    "experience_match": "Good",
    "education_match": "Meets requirements",
    "strengths": [
      "Strong technical skills in required technologies",
      "Relevant project experience"
    ],
    "improvement_areas": [
      "Add cloud experience to resume",
      "Highlight specific achievements with metrics"
    ],
    "recommendations": [
      "Learn AWS basics to match requirements",
      "Add Docker to your skill set",
      "Quantify achievements in resume"
    ]
  }
}

Provide specific, actionable advice for improving the match.`
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 2000
    })

    const content = completion.choices[0]?.message?.content || '{}'
    
    // Try to extract JSON from the response
    let analysis
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // Fallback analysis
      analysis = {
        career_analysis: {
          best_fit_roles: [
            {
              role: "Software Developer",
              match_score: 70,
              reason: "General development skills detected",
              current_skills: ["Programming"],
              missing_skills: ["Specific technologies"],
              improvement_areas: ["Gain more specific experience"]
            }
          ],
          skill_assessment: {
            technical_skills: ["Programming"],
            soft_skills: ["Problem Solving"],
            experience_level: "Entry to Mid-level",
            overall_score: 70
          },
          career_recommendations: [
            "Specialize in a specific technology stack",
            "Build more projects"
          ]
        }
      }
    }

    console.log('Analysis completed successfully')
    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ 
      error: 'Failed to analyze resume',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function generateJobDescriptionAnalysis(jobDescription: string, currentResume?: string) {
  // Extract key requirements from job description
  const requirements = extractRequirements(jobDescription)
  
  // Generate improvement suggestions
  const suggestions = generateSuggestions(requirements, currentResume)
  
  // Create skill gap analysis
  const skillGap = analyzeSkillGap(requirements, currentResume)
  
  // Generate keyword optimization
  const keywords = extractKeywords(jobDescription)
  
  const analysis = {
    requirements: requirements,
    suggestions: suggestions,
    skillGap: skillGap,
    keywords: keywords,
    improvementAreas: identifyImprovementAreas(requirements, currentResume),
    resumeOptimization: generateResumeOptimization(requirements, keywords),
    interviewPrep: generateInterviewPrep(requirements),
    confidenceScore: calculateConfidenceScore(requirements, currentResume),
    actionItems: generateActionItems(skillGap, suggestions)
  }

  return NextResponse.json({ analysis })
}

function extractRequirements(jobDescription: string) {
  const requirements = {
    skills: [] as string[],
    experience: [] as string[],
    education: [] as string[],
    responsibilities: [] as string[],
    qualifications: [] as string[],
    tools: [] as string[],
    softSkills: [] as string[]
  }

  // Common skill keywords to look for
  const skillKeywords = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
    'Git', 'REST API', 'GraphQL', 'Machine Learning', 'Data Science',
    'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Kubernetes', 'Azure'
  ]

  // Experience level indicators
  const experienceLevels = ['entry level', 'junior', 'mid-level', 'senior', 'lead', 'principal', 'manager']
  
  // Education indicators
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'computer science', 'engineering']
  
  // Tool/technology keywords
  const toolKeywords = ['github', 'jira', 'slack', 'vs code', 'intellij', 'docker', 'kubernetes', 'aws', 'azure']

  // Extract skills
  skillKeywords.forEach((skill: string) => {
    if (jobDescription.toLowerCase().includes(skill.toLowerCase())) {
      requirements.skills.push(skill)
    }
  })

  // Extract experience level
  experienceLevels.forEach((level: string) => {
    if (jobDescription.toLowerCase().includes(level)) {
      requirements.experience.push(level)
    }
  })

  // Extract education requirements
  educationKeywords.forEach((edu: string) => {
    if (jobDescription.toLowerCase().includes(edu)) {
      requirements.education.push(edu)
    }
  })

  // Extract tools
  toolKeywords.forEach((tool: string) => {
    if (jobDescription.toLowerCase().includes(tool.toLowerCase())) {
      requirements.tools.push(tool)
    }
  })

  // Extract responsibilities (sentences with action verbs)
  const sentences = jobDescription.split(/[.!?]+/)
  const actionVerbs = ['develop', 'design', 'implement', 'create', 'manage', 'lead', 'coordinate', 'analyze', 'optimize']
  
  sentences.forEach(sentence => {
    const lowerSentence = sentence.trim().toLowerCase()
    if (actionVerbs.some(verb => lowerSentence.includes(verb))) {
      requirements.responsibilities.push(sentence.trim())
    }
  })

  // Extract soft skills
  const softSkillKeywords = ['communication', 'teamwork', 'leadership', 'problem-solving', 'analytical', 'creative', 'detail-oriented']
  softSkillKeywords.forEach(skill => {
    if (jobDescription.toLowerCase().includes(skill)) {
      requirements.softSkills.push(skill)
    }
  })

  return requirements
}

function generateSuggestions(requirements: any, currentResume?: string) {
  const suggestions = []

  // Skill-based suggestions
  if (requirements.skills.length > 0) {
    suggestions.push({
      type: 'skills',
      priority: 'high',
      title: 'Highlight Required Technical Skills',
      description: `Ensure your resume prominently features: ${requirements.skills.join(', ')}`,
      action: 'Add these skills to your skills section and project descriptions'
    })
  }

  // Experience suggestions
  if (requirements.experience.length > 0) {
    suggestions.push({
      type: 'experience',
      priority: 'high',
      title: 'Align Experience Level',
      description: `Position yourself as a ${requirements.experience[0]} candidate`,
      action: 'Adjust your language and examples to match the required experience level'
    })
  }

  // Tool suggestions
  if (requirements.tools.length > 0) {
    suggestions.push({
      type: 'tools',
      priority: 'medium',
      title: 'Showcase Tool Proficiency',
      description: `Demonstrate experience with: ${requirements.tools.join(', ')}`,
      action: 'Add specific examples of using these tools in your projects'
    })
  }

  // Soft skills suggestions
  if (requirements.softSkills.length > 0) {
    suggestions.push({
      type: 'softSkills',
      priority: 'medium',
      title: 'Emphasize Soft Skills',
      description: `Highlight: ${requirements.softSkills.join(', ')}`,
      action: 'Include examples that demonstrate these soft skills in action'
    })
  }

  return suggestions
}

function analyzeSkillGap(requirements: any, currentResume?: string) {
  const skillGap = {
    missing: [] as string[],
    strong: [] as string[],
    recommended: [] as string[]
  }

  // If no current resume, assume all skills are missing
  if (!currentResume) {
    skillGap.missing = [...requirements.skills, ...requirements.tools]
    skillGap.recommended = requirements.skills.slice(0, 5) // Recommend top 5 skills
  } else {
    // Analyze current resume against requirements
    const resumeText = currentResume.toLowerCase()
    
    requirements.skills.forEach((skill: string) => {
      if (resumeText.includes(skill.toLowerCase())) {
        skillGap.strong.push(skill)
      } else {
        skillGap.missing.push(skill)
      }
    })

    requirements.tools.forEach((tool: string) => {
      if (resumeText.includes(tool.toLowerCase())) {
        skillGap.strong.push(tool)
      } else {
        skillGap.missing.push(tool)
      }
    })

    // Recommend top missing skills
    skillGap.recommended = skillGap.missing.slice(0, 3)
  }

  return skillGap
}

function extractKeywords(jobDescription: string) {
  const keywords: string[] = []
  
  // Common technical keywords
  const techKeywords = [
    'full stack', 'frontend', 'backend', 'web development', 'mobile development',
    'cloud computing', 'devops', 'microservices', 'api development', 'database design'
  ]
  
  // Business keywords
  const businessKeywords = [
    'project management', 'team collaboration', 'client communication', 'agile methodology',
    'scrum', 'product development', 'user experience', 'business analysis'
  ]
  
  // Extract keywords
  const allKeywords = techKeywords.concat(businessKeywords)
  allKeywords.forEach((keyword: string) => {
    if (jobDescription.toLowerCase().includes(keyword)) {
      keywords.push(keyword)
    }
  })

  return keywords
}

function identifyImprovementAreas(requirements: any, currentResume?: string) {
  const areas = []

  if (requirements.skills.length > 5) {
    areas.push({
      area: 'Technical Skills',
      priority: 'high',
      description: 'Multiple technical skills required',
      improvement: 'Focus on showcasing your strongest technical skills and learning others'
    })
  }

  if (requirements.tools.length > 3) {
    areas.push({
      area: 'Tool Proficiency',
      priority: 'medium',
      description: 'Specific tools and platforms required',
      improvement: 'Gain hands-on experience with mentioned tools'
    })
  }

  if (requirements.softSkills.length > 0) {
    areas.push({
      area: 'Soft Skills',
      priority: 'medium',
      description: 'Soft skills emphasized in requirements',
      improvement: 'Prepare examples demonstrating these soft skills'
    })
  }

  return areas
}

function generateResumeOptimization(requirements: any, keywords: string[]) {
  return {
    summary: `Tailor your resume to highlight ${requirements.skills.slice(0, 3).join(', ')} and ${keywords.slice(0, 2).join(' ')}`,
    bulletPoints: [
      `Use keywords: ${keywords.join(', ')}`,
      `Quantify achievements with metrics`,
      `Match experience to ${requirements.responsibilities.length} key responsibilities`,
      `Highlight proficiency with ${requirements.tools.join(', ')}`
    ],
    sections: [
      'Skills section with required technologies',
      'Experience section with relevant projects',
      'Education alignment if specified',
      'Certifications for mentioned tools'
    ]
  }
}

function generateInterviewPrep(requirements: any) {
  return {
    technicalQuestions: [
      `Experience with ${requirements.skills.slice(0, 2).join(' and ')}`,
      `Projects using ${requirements.tools.slice(0, 2).join(' and ')}`,
      `Problem-solving approach for ${requirements.responsibilities[0] || 'key responsibilities'}`
    ],
    behavioralQuestions: [
      'Team collaboration examples',
      'Handling challenging situations',
      'Learning new technologies quickly',
      'Project management experience'
    ],
    preparationTips: [
      'Prepare STAR method examples',
      'Research company culture',
      'Prepare questions for interviewer',
      'Practice technical problem-solving'
    ]
  }
}

function calculateConfidenceScore(requirements: { skills: string[], tools: string[] }, currentResume?: string): { score: number, level: string, feedback: string } {
  let score = 50 // Base score
  
  if (!currentResume) return { score: 30, level: 'Low', feedback: 'No resume provided for analysis' }
  
  const resumeText = currentResume.toLowerCase()
  
  // Check skill alignment
  const matchingSkills = requirements.skills.filter((skill: string) => 
    resumeText.includes(skill.toLowerCase())
  ).length
  
  score += (matchingSkills / requirements.skills.length) * 30

  // Check tool alignment
  const matchingTools = requirements.tools.filter((tool: string) => 
    resumeText.includes(tool.toLowerCase())
  ).length
  
  score += (matchingTools / Math.max(requirements.tools.length, 1)) * 20

  let level = 'Low'
  if (score >= 80) level = 'High'
  else if (score >= 60) level = 'Medium'

  return {
    score: Math.round(score),
    level,
    feedback: score >= 70 ? 'Strong alignment with requirements' : 'Needs improvement to match requirements'
  }
}

function generateActionItems(skillGap: { missing: string[], needsImprovement?: string[] }, suggestions: { priority: string, action: string }[]) {
  const actions: { priority: string, action: string, timeline: string, resources: string }[] = []

  // High priority skill gaps
  skillGap.missing.slice(0, 3).forEach((skill: string) => {
    actions.push({
      priority: 'high',
      action: `Learn ${skill}`,
      timeline: '2-4 weeks',
      resources: `Online courses, documentation, practice projects`
    })
  })

  // Medium priority improvements
  if (skillGap.needsImprovement) {
    skillGap.needsImprovement.slice(0, 2).forEach((skill: string) => {
      actions.push({
        priority: 'medium',
        action: `Improve ${skill}`,
        timeline: '1-2 weeks',
        resources: `Practice exercises, tutorials, peer review`
      })
    })
  }

  // Resume optimization actions
  suggestions.forEach(suggestion => {
    actions.push({
      priority: suggestion.priority,
      action: suggestion.action,
      timeline: '1 week',
      resources: 'Resume templates, examples, professional review'
    })
  })

  return actions
}
