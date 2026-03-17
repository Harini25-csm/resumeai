export interface ResumeData {
  summary: string
  experience: Array<{
    title: string
    company: string
    dates: string
    bullets: string[]
  }>
  skills: string[]
  education: Array<{
    degree: string
    school: string
    dates: string
  }>
  profilePhoto?: {
    name: string
    type: string
    data: string
  }
}
