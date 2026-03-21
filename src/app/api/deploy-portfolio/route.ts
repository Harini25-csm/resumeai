import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export async function POST(req: Request) {
  try {
    const { portfolioData, githubToken, vercelToken } = await req.json()
    
    if (!portfolioData) {
      return NextResponse.json({ error: 'Missing portfolio data' }, { status: 400 })
    }

    // Create deployment directory
    const deployDir = join(process.cwd(), 'deployments')
    if (!existsSync(deployDir)) {
      mkdirSync(deployDir, { recursive: true })
    }

    // Generate portfolio site files
    const siteDir = join(deployDir, 'portfolio-site')
    if (!existsSync(siteDir)) {
      mkdirSync(siteDir, { recursive: true })
    }

    // Create app directory
    const appDir = join(siteDir, 'app')
    if (!existsSync(appDir)) {
      mkdirSync(appDir, { recursive: true })
    }

    // Create package.json for the portfolio site
    const packageJson = {
      name: 'portfolio-site',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start'
      },
      dependencies: {
        next: '14.2.35',
        react: '^18',
        'react-dom': '^18',
        'lucide-react': '^0.263.1'
      },
      devDependencies: {
        'tailwindcss': '^3.3.0',
        'autoprefixer': '^10.0.1',
        'postcss': '^8.4.24'
      }
    }

    writeFileSync(join(siteDir, 'package.json'), JSON.stringify(packageJson, null, 2))

    // Generate portfolio HTML page
    const htmlContent = generatePortfolioHTML(portfolioData)
    writeFileSync(join(appDir, 'page.tsx'), generateNextJSPage(portfolioData))
    writeFileSync(join(siteDir, 'next.config.js'), generateNextConfig())

    // Create layout.tsx
    const layoutContent = `
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '${portfolioData.contact?.name || 'Portfolio'} - Professional Portfolio',
  description: '${portfolioData.introduction || 'Professional Portfolio'}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
    `
    writeFileSync(join(appDir, 'layout.tsx'), layoutContent)

    // Create globals.css
    const globalsCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
    `
    writeFileSync(join(appDir, 'globals.css'), globalsCSS)

    // Create tailwind.config.js
    const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
    `
    writeFileSync(join(siteDir, 'tailwind.config.js'), tailwindConfig)

    // Create postcss.config.js
    const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
    `
    writeFileSync(join(siteDir, 'postcss.config.js'), postcssConfig)

    // Instructions for manual deployment
    const instructions = `
=== PORTFOLIO DEPLOYMENT INSTRUCTIONS ===

Your portfolio has been generated! To deploy to Vercel:

OPTION 1: EASIEST - Vercel CLI
1. Install Vercel CLI: npm i -g vercel
2. cd ${siteDir}
3. Run: vercel --prod
4. Follow the prompts to deploy

OPTION 2: GitHub + Vercel (Recommended)
1. Push your portfolio to GitHub:
   cd ${siteDir}
   git init
   git add .
   git commit -m "Add portfolio site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main

2. Connect to Vercel:
   - Go to vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Deploy automatically

OPTION 3: Manual Upload
1. Build the site: cd ${siteDir} && npm run build
2. Upload the 'out' folder to any hosting service

Generated portfolio files are ready at: ${siteDir}
`

    return NextResponse.json({
      success: true,
      message: 'Portfolio site generated successfully',
      instructions: instructions.trim(),
      sitePath: siteDir,
      nextSteps: [
        '1. The portfolio site has been generated in the deployments folder',
        '2. Use Vercel CLI for easiest deployment: vercel --prod',
        '3. Or push to GitHub and connect to Vercel for automatic deployments',
        '4. Your portfolio includes all your projects with enhanced descriptions'
      ]
    })

  } catch (error) {
    console.error('Deployment error:', error)
    return NextResponse.json(
      { error: 'Failed to generate portfolio for deployment' },
      { status: 500 }
    )
  }
}

function generatePortfolioHTML(portfolioData: any) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.contact?.name || 'Portfolio'} - Professional Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-6xl mx-auto px-4 py-6">
                <h1 class="text-3xl font-bold text-gray-900">${portfolioData.contact?.name || 'Your Name'}</h1>
                <p class="text-gray-600 mt-2">${portfolioData.introduction || 'Professional Portfolio'}</p>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-6xl mx-auto px-4 py-8">
            <!-- Contact Section -->
            <section class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-2xl font-bold mb-4">Contact Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Email:</strong> ${portfolioData.contact?.email || 'your.email@example.com'}</div>
                    <div><strong>Phone:</strong> ${portfolioData.contact?.phone || 'Your Phone'}</div>
                    <div><strong>Address:</strong> ${portfolioData.contact?.address || 'Your Address'}</div>
                    <div><strong>LinkedIn:</strong> ${portfolioData.contact?.linkedinUrl || '#'}</div>
                </div>
            </section>

            <!-- Skills Section -->
            ${portfolioData.skills && portfolioData.skills.length > 0 ? `
            <section class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-2xl font-bold mb-4">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${portfolioData.skills.map((skill: string) => `<span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${skill}</span>`).join('')}
                </div>
            </section>` : ''}

            <!-- Projects Section -->
            ${portfolioData.projects && portfolioData.projects.length > 0 ? `
            <section class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-2xl font-bold mb-4">Featured Projects</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${portfolioData.projects.map((project: any) => `
                    <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <h3 class="font-bold text-lg mb-2">${project.name}</h3>
                        <p class="text-gray-600 mb-3">${project.description}</p>
                        ${project.tech_stack && project.tech_stack.length > 0 ? `
                        <div class="flex flex-wrap gap-1 mb-3">
                            ${project.tech_stack.map((tech: string) => `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${tech}</span>`).join('')}
                        </div>` : ''}
                        ${project.key_features && project.key_features.length > 0 ? `
                        <ul class="text-sm text-gray-600">
                            ${project.key_features.map((feature: string) => `<li class="mb-1">• ${feature}</li>`).join('')}
                        </ul>` : ''}
                    </div>`).join('')}
                </div>
            </section>` : ''}
        </main>
    </div>
</body>
</html>
  `
}

function generateNextJSPage(portfolioData: any) {
  return `
'use client'

import { useState } from 'react'

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState('about')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">${portfolioData.contact?.name || 'Your Name'}</h1>
          <p className="text-gray-600 mt-2">${portfolioData.introduction || 'Professional Portfolio'}</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button onClick={() => setActiveSection('about')} className="py-4 border-b-2 border-blue-500 text-blue-600">About</button>
            <button onClick={() => setActiveSection('skills')} className="py-4 border-b-2 border-transparent hover:border-gray-300">Skills</button>
            <button onClick={() => setActiveSection('projects')} className="py-4 border-b-2 border-transparent hover:border-gray-300">Projects</button>
            <button onClick={() => setActiveSection('contact')} className="py-4 border-b-2 border-transparent hover:border-gray-300">Contact</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Contact Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Email:</strong> ${portfolioData.contact?.email || 'your.email@example.com'}</div>
            <div><strong>Phone:</strong> ${portfolioData.contact?.phone || 'Your Phone'}</div>
            <div><strong>Address:</strong> ${portfolioData.contact?.address || 'Your Address'}</div>
            <div><strong>LinkedIn:</strong> ${portfolioData.contact?.linkedinUrl || '#'}</div>
          </div>
        </section>

        {/* Skills Section */}
        ${portfolioData.skills && portfolioData.skills.length > 0 ? `
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            ${portfolioData.skills.map((skill: string) => `<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${skill}</span>`).join('')}
          </div>
        </section>` : ''}

        {/* Projects Section */}
        ${portfolioData.projects && portfolioData.projects.length > 0 ? `
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${portfolioData.projects.map((project: any) => `
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-2">${project.name}</h3>
              <p className="text-gray-600 mb-3">${project.description}</p>
              ${project.tech_stack && project.tech_stack.length > 0 ? `
              <div className="flex flex-wrap gap-1 mb-3">
                ${project.tech_stack.map((tech: string) => `<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${tech}</span>`).join('')}
              </div>` : ''}
              ${project.key_features && project.key_features.length > 0 ? `
              <ul className="text-sm text-gray-600">
                ${project.key_features.map((feature: string) => `<li className="mb-1">• ${feature}</li>`).join('')}
              </ul>` : ''}
            </div>`).join('')}
          </div>
        </section>` : ''}
      </main>
    </div>
  )
}
  `
}

function generateNextConfig() {
  return `
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
  `
}
