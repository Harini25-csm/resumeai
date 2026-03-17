export interface ResumeData {
  personalInfo: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    linkedin: string
    portfolio: string
  }
  summary: string
  experience: Array<{
    id: string
    jobTitle: string
    company: string
    startDate: string
    endDate: string
    current: boolean
    location: string
    bullets: string[]
  }>
  education: Array<{
    id: string
    degree: string
    institution: string
    year: string
    grade: string
    achievements: string
  }>
  skills: {
    technical: string[]
    soft: string[]
  }
  projects: Array<{
    id: string
    name: string
    techStack: string
    liveUrl: string
    githubUrl: string
    bullets: string[]
  }>
  certifications: Array<{
    id: string
    name: string
    organization: string
    date: string
    url: string
  }>
  languages: Array<{
    id: string
    name: string
    proficiency: string
  }>
}
