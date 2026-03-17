import { NextResponse } from 'next/server'

export async function GET() {
  const env = {
    groq: !!process.env.GROQ_API_KEY,
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  return NextResponse.json(env)
}
