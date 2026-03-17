import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'User not found or no repositories' }, { status: 404 })
    }

    const repos = await response.json()
    
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count,
      html_url: repo.html_url,
      homepage: repo.homepage
    }))

    return NextResponse.json({ repos: formattedRepos })
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}
