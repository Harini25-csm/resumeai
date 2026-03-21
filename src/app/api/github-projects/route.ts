import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    let allRepos: any[] = []
    let page = 1
    let hasMore = true

    // Fetch all repositories using pagination
    while (hasMore) {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100&page=${page}`)
      
      if (!response.ok) {
        if (page === 1) {
          return NextResponse.json({ error: 'User not found or no repositories' }, { status: 404 })
        }
        break
      }

      const repos = await response.json()
      
      if (repos.length === 0) {
        hasMore = false
      } else {
        allRepos = allRepos.concat(repos)
        page++
        
        // Stop if we got less than 100 repos (last page)
        if (repos.length < 100) {
          hasMore = false
        }
      }
    }
    
    const formattedRepos = allRepos.map((repo: any) => ({
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
