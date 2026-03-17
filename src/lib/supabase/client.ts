import { createBrowserClient } from '@supabase/ssr'

// Create a singleton browser client
let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables. Please check your .env.local file.')
    // Return a dummy client that won't crash the app
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      }
    } as any
  }

  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createBrowserClient(
      supabaseUrl,
      supabaseKey
    )
  }
  return supabaseBrowserClient
}

// Export the singleton instance
export const supabase = createClient()
