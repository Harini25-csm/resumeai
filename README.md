# ResumeAI

ResumeAI is an AI-powered resume and portfolio builder built with Next.js, React, TypeScript, Tailwind CSS, Supabase, and Groq. It helps users create professional resumes, improve ATS compatibility, generate cover letters, analyze job descriptions, and build portfolio content from GitHub and LinkedIn data.

## ✨ Features

- AI-generated resume content tailored to your experience
- ATS score and resume optimization suggestions
- Resume templates and preview experience
- Cover letter generation
- Job description analysis for better matching
- Portfolio generation using GitHub projects and profile data
- User authentication with Supabase
- Modern dashboard UI for managing resume-related workflows

## 🛠 Tech Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- UI/Animation: Framer Motion, Lucide React
- Backend/API: Next.js API Routes
- Authentication & Database: Supabase
- AI Services: Groq, Anthropic
- PDF/Document Export: React PDF Renderer, jsPDF, docx

## 📁 Project Structure

```bash
src/
├── app/
│   ├── api/                # API routes for AI, resume, portfolio, auth
│   ├── auth/               # Login, signup, callback pages
│   ├── dashboard/          # Main dashboard and feature pages
│   └── page.tsx            # Landing page
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Supabase and AI helpers
├── types/                  # TypeScript models
└── utils/                  # Utility helpers
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm or pnpm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and update it with your own credentials:

```bash
cp .env.example .env.local
```

Then fill in the required values for:

- GROQ_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL
- NEXTAUTH_SECRET

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🔐 Environment Variables

The app expects the following environment variables:

```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

## ▶️ Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the app for production
npm run start    # Start the production build
npm run lint     # Run lint checks
```

## 🧠 How the App Works

1. A user signs in or creates an account.
2. The user enters their background, experience, and target job information.
3. AI services generate or improve resume content.
4. The user can preview, edit, and export the result.
5. Optional features include cover letters, ATS scoring, and portfolio generation.

## 🔗 Integrations

ResumeAI integrates with:

- Supabase for authentication and data storage
- Groq and Anthropic for AI generation
- GitHub APIs for project-based portfolio generation
- LinkedIn-style profile data for portfolio content generation

## 🚢 Deployment

This project is ready for deployment on Vercel.

### Vercel deployment steps

1. Push the project to GitHub
2. Import it into Vercel
3. Add the required environment variables in Vercel project settings
4. Deploy

## 📝 Notes

- Do not commit your local .env.local file.
- The project uses Supabase auth, so authentication settings must be configured correctly.
- Some AI-powered features depend on valid API keys from the relevant providers.

## 🤝 Contributing

Contributions are welcome. If you want to improve the app:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## 📄 License

No license file has been added yet. If you plan to publish this project publicly, consider adding an appropriate open-source license.
