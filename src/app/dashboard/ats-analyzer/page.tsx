'use client'

import { useState } from 'react'
import ATSScoreDisplay from '@/components/ATSScoreDisplay'

export default function ATSDemoPage() {
  const [resumeText, setResumeText] = useState(
    `John Doe
Software Engineer
San Francisco, CA | john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5 years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and improving system performance by 40%.

EXPERIENCE
Senior Software Engineer | Tech Corp | San Francisco, CA
June 2020 - Present
- Developed and maintained microservices architecture serving 1M+ users
- Led team of 4 engineers to launch new product features
- Improved application performance by 40% through optimization
- Implemented CI/CD pipelines reducing deployment time by 60%
- Collaborated with cross-functional teams to deliver projects on time

Software Engineer | StartupXYZ | Palo Alto, CA
Jan 2018 - June 2020
- Built responsive web applications using React and TypeScript
- Designed RESTful APIs for mobile and web platforms
- Optimized database queries improving response time by 30%
- Participated in agile development process

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley
Graduated: May 2017

SKILLS
Technical: JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL, Git
Soft Skills: Leadership, Communication, Problem Solving, Project Management`
  )

  const [jobDescription, setJobDescription] = useState(
    `We are looking for a Senior Software Engineer to join our growing team. The ideal candidate will have experience with modern web technologies, cloud platforms, and microservices architecture.

Requirements:
- 5+ years of software development experience
- Strong proficiency in JavaScript, React, and Node.js
- Experience with cloud platforms (AWS, Azure, or GCP)
- Knowledge of microservices and RESTful APIs
- Experience with containerization (Docker, Kubernetes)
- Strong problem-solving skills and attention to detail
- Excellent communication and teamwork abilities
- Bachelor's degree in Computer Science or related field

Responsibilities:
- Design and develop scalable web applications
- Lead technical projects and mentor junior developers
- Implement best practices for code quality and testing
- Collaborate with product managers and designers
- Optimize application performance and security`
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          ATS Score Analyzer Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full h-96 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your resume text here..."
            />
          </div>

          {/* Job Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-96 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste the job description here..."
            />
          </div>
        </div>

        {/* ATS Score Display */}
        <ATSScoreDisplay
          resumeText={resumeText}
          jobDescription={jobDescription}
          showDetails={true}
        />
      </div>
    </div>
  )
}
