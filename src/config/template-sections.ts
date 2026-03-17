export interface TemplateSection {
  id: string
  name: string
  question: string
  placeholder?: string
  validation?: string
}

export interface TemplateConfig {
  id: string
  name: string
  sections: TemplateSection[]
}

export const templateConfigs: TemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern',
    sections: [
      { id: 'personalInfo', name: 'Personal Information', question: 'What is your full name, job title, email, and phone number?' },
      { id: 'summary', name: 'Professional Summary', question: 'Write a 2-line summary about yourself and your career goals.' },
      { id: 'experience', name: 'Work Experience', question: 'What is your current or last job title and company?' },
      { id: 'skills', name: 'Skills', question: 'List your top 5 technical skills and 3 soft skills.' },
      { id: 'education', name: 'Education', question: 'Where did you study and what degree did you earn?' },
      { id: 'projects', name: 'Projects', question: 'Describe your best project and its impact.' }
    ]
  },
  {
    id: 'classic',
    name: 'Classic',
    sections: [
      { id: 'personalInfo', name: 'Personal Information', question: 'What is your full name, job title, email, and phone number?' },
      { id: 'summary', name: 'Professional Summary', question: 'Write a 2-line summary about yourself and your career goals.' },
      { id: 'experience', name: 'Work Experience', question: 'What is your current or last job title and company?' },
      { id: 'skills', name: 'Skills', question: 'List your top 5 technical skills and 3 soft skills.' },
      { id: 'education', name: 'Education', question: 'Where did you study and what degree did you earn?' }
    ]
  },
  {
    id: 'minimal',
    name: 'Minimal',
    sections: [
      { id: 'personalInfo', name: 'Personal Information', question: 'What is your full name, job title, email, and phone number?' },
      { id: 'summary', name: 'Professional Summary', question: 'Write a 2-line summary about yourself and your career goals.' },
      { id: 'experience', name: 'Work Experience', question: 'What is your current or last job title and company?' },
      { id: 'skills', name: 'Skills', question: 'List your top 5 technical skills and 3 soft skills.' },
      { id: 'education', name: 'Education', question: 'Where did you study and what degree did you earn?' }
    ]
  },
  {
    id: 'bold',
    name: 'Bold',
    sections: [
      { id: 'personalInfo', name: 'Personal Information', question: 'What is your full name, job title, email, and phone number?' },
      { id: 'summary', name: 'Professional Summary', question: 'Write a 2-line summary about yourself and your career goals.' },
      { id: 'experience', name: 'Work Experience', question: 'What is your current or last job title and company?' },
      { id: 'skills', name: 'Skills', question: 'List your top 5 technical skills and 3 soft skills.' },
      { id: 'projects', name: 'Projects', question: 'Describe your best project and its impact.' },
      { id: 'education', name: 'Education', question: 'Where did you study and what degree did you earn?' }
    ]
  },
  {
    id: 'creative',
    name: 'Creative',
    sections: [
      { id: 'personalInfo', name: 'Personal Information', question: 'What is your full name, job title, email, and phone number?' },
      { id: 'summary', name: 'Professional Summary', question: 'Write a 2-line summary about yourself and your career goals.' },
      { id: 'experience', name: 'Work Experience', question: 'What is your current or last job title and company?' },
      { id: 'skills', name: 'Skills', question: 'List your top 5 technical skills and 3 soft skills.' },
      { id: 'projects', name: 'Projects', question: 'Describe your best project and its impact.' },
      { id: 'education', name: 'Education', question: 'Where did you study and what degree did you earn?' },
      { id: 'languages', name: 'Languages', question: 'What languages do you speak and at what level?' }
    ]
  },
  {
    id: 'executive',
    name: 'Executive',
    sections: [
      { id: 'personalInfo', name: 'Personal Information', question: 'What is your full name, job title, email, and phone number?' },
      { id: 'summary', name: 'Executive Summary', question: 'Write a 2-line executive summary highlighting your leadership experience.' },
      { id: 'experience', name: 'Work Experience', question: 'What is your current or last executive role and company?' },
      { id: 'skills', name: 'Skills', question: 'List your top 5 leadership skills and 3 technical competencies.' },
      { id: 'education', name: 'Education', question: 'Where did you study and what degree did you earn?' },
      { id: 'certifications', name: 'Certifications', question: 'What professional certifications do you hold?' }
    ]
  }
]

export function getTemplateConfig(templateId: string): TemplateConfig | null {
  return templateConfigs.find(config => config.id === templateId) || null
}
