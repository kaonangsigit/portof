# 📡 API Documentation

Complete documentation for the GitHub API routes and how to extend them.

## Table of Contents

1. [Overview](#overview)
2. [GitHub API Routes](#github-api-routes)
3. [Type Definitions](#type-definitions)
4. [Authentication](#authentication)
5. [Caching Strategy](#caching-strategy)
6. [Error Handling](#error-handling)
7. [Extending the API](#extending-the-api)
8. [Rate Limiting](#rate-limiting)

---

## Overview

This portfolio uses Next.js API routes to interact with the GitHub API. All API routes are located in `app/api/` and use the `@octokit/rest` package for GitHub integration.

### Architecture

```
app/api/
├── github/
│   ├── repos/
│   │   └── route.ts       # Fetch user repositories
│   └── profile/
│       └── route.ts       # Fetch user profile
```

---

## GitHub API Routes

### 1. Get Repositories

**Endpoint:** `GET /api/github/repos`

Fetches all public repositories for the authenticated GitHub user.

#### Request

```bash
curl http://localhost:3000/api/github/repos
```

#### Response

```json
[
  {
    "id": 123456789,
    "name": "portfolio",
    "description": "My personal portfolio website",
    "html_url": "https://github.com/username/portfolio",
    "homepage": "https://portfolio.com",
    "stargazers_count": 42,
    "forks_count": 5,
    "language": "TypeScript",
    "topics": ["nextjs", "portfolio", "react"],
    "updated_at": "2026-07-19T00:00:00Z",
    "created_at": "2026-01-01T00:00:00Z"
  }
]
```

#### Features

- Filters out forked repositories
- Sorts by star count (descending)
- Returns up to 100 repositories
- Cached for 1 hour

#### Usage in Components

```tsx
'use client';

import { useEffect, useState } from 'react';
import type { GitHubRepository } from '@/app/api/github/repos/route';

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/github/repos')
      .then((res) => res.json())
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching repos:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      {repos.map((repo) => (
        <div key={repo.id}>
          <h3>{repo.name}</h3>
          <p>{repo.description}</p>
          <span>{repo.stargazers_count} ⭐</span>
        </div>
      ))}
    </div>
  );
}
```

---

### 2. Get Profile

**Endpoint:** `GET /api/github/profile`

Fetches the GitHub profile information for the authenticated user.

#### Request

```bash
curl http://localhost:3000/api/github/profile
```

#### Response

```json
{
  "login": "username",
  "name": "Your Name",
  "avatar_url": "https://avatars.githubusercontent.com/u/12345?v=4",
  "bio": "Full Stack Developer",
  "location": "San Francisco, CA",
  "email": "your.email@example.com",
  "blog": "https://yourblog.com",
  "twitter_username": "yourusername",
  "public_repos": 42,
  "followers": 100,
  "following": 50,
  "html_url": "https://github.com/username"
}
```

#### Features

- Returns complete profile information
- Cached for 1 hour
- Includes social media links

#### Usage in Components

```tsx
'use client';

import { useEffect, useState } from 'react';
import type { GitHubProfile } from '@/app/api/github/profile/route';

export default function ProfileCard() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);

  useEffect(() => {
    fetch('/api/github/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) return null;

  return (
    <div>
      <img src={profile.avatar_url} alt={profile.name || ''} />
      <h2>{profile.name}</h2>
      <p>{profile.bio}</p>
      <p>{profile.public_repos} repositories</p>
    </div>
  );
}
```

---

## Type Definitions

### GitHubRepository

Located in `app/api/github/repos/route.ts`:

```typescript
export type GitHubRepository = {
  id: number;                    // Unique repository ID
  name: string;                  // Repository name
  description: string | null;    // Repository description
  html_url: string;              // GitHub repository URL
  homepage: string | null;       // Project homepage URL
  stargazers_count: number;      // Number of stars
  forks_count: number;           // Number of forks
  language: string | null;       // Primary programming language
  topics: string[];              // Repository topics/tags
  updated_at: string;            // Last update timestamp
  created_at: string;            // Creation timestamp
};
```

### GitHubProfile

Located in `app/api/github/profile/route.ts`:

```typescript
export type GitHubProfile = {
  login: string;                 // GitHub username
  name: string | null;           // Display name
  avatar_url: string;            // Profile picture URL
  bio: string | null;            // Profile bio
  location: string | null;       // Location
  email: string | null;          // Public email
  blog: string | null;           // Website/blog URL
  twitter_username: string | null; // Twitter handle
  public_repos: number;          // Number of public repos
  followers: number;             // Follower count
  following: number;             // Following count
  html_url: string;              // GitHub profile URL
};
```

---

## Authentication

### GitHub Personal Access Token

The API uses a GitHub Personal Access Token for authentication.

#### Required Permissions

- `public_repo` - Access public repositories
- `read:user` - Read user profile information

#### Setup

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select required scopes
4. Copy token to `.env.local`:

```env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=your_github_username
```

#### Security Notes

- Never commit `.env.local` to version control
- Token is only accessible server-side
- Token is not exposed to client
- Use environment variables in production

---

## Caching Strategy

### Server-Side Caching

All API routes use Next.js revalidation:

```typescript
export const revalidate = 3600; // 1 hour in seconds
```

This tells Next.js to cache the response for 1 hour.

### HTTP Cache Headers

Responses include Cache-Control headers:

```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  },
});
```

**What this means:**
- `public` - Response can be cached by CDN
- `s-maxage=3600` - Cache for 1 hour
- `stale-while-revalidate=7200` - Serve stale content for 2 hours while revalidating

### Custom Caching

To change cache duration:

```typescript
// Short cache (5 minutes)
export const revalidate = 300;

// Long cache (24 hours)
export const revalidate = 86400;

// No cache
export const revalidate = 0;
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Failed to fetch repositories",
  "message": "API rate limit exceeded"
}
```

### Common Errors

#### 1. Invalid Token

```json
{
  "error": "Failed to fetch repositories",
  "message": "Bad credentials"
}
```

**Solution:** Check that `GITHUB_TOKEN` is valid and has correct permissions.

#### 2. Username Not Found

```json
{
  "error": "Failed to fetch profile",
  "message": "Not Found"
}
```

**Solution:** Verify `GITHUB_USERNAME` is correct.

#### 3. Rate Limit Exceeded

```json
{
  "error": "Failed to fetch repositories",
  "message": "API rate limit exceeded"
}
```

**Solution:** Wait for rate limit to reset or use authenticated requests.

### Error Handling in Components

```tsx
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetch('/api/github/repos')
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }
      return res.json();
    })
    .then((data) => setRepos(data))
    .catch((error) => {
      setError(error.message);
      console.error('Error:', error);
    });
}, []);

if (error) {
  return <div>Error: {error}</div>;
}
```

---

## Extending the API

### Adding New GitHub Endpoints

#### Example: Get Repository Languages

Create `app/api/github/languages/[repo]/route.ts`:

```typescript
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: { repo: string } }
) {
  try {
    const username = process.env.GITHUB_USERNAME;
    
    if (!username) {
      return NextResponse.json(
        { error: "GitHub username not configured" },
        { status: 500 }
      );
    }

    const { data } = await octokit.repos.listLanguages({
      owner: username,
      repo: params.repo,
    });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}
```

Usage:

```bash
GET /api/github/languages/portfolio
```

---

### Adding Non-GitHub APIs

#### Example: Contact Form API

Create `app/api/contact/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email (using your email service)
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'portfolio@yourdomain.com',
    //   to: process.env.CONTACT_EMAIL,
    //   subject: `New message from ${name}`,
    //   text: message,
    // });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

Usage:

```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  });

  if (response.ok) {
    alert('Message sent!');
  }
};
```

---

## Rate Limiting

### GitHub API Rate Limits

- **Authenticated requests**: 5,000 requests per hour
- **Unauthenticated requests**: 60 requests per hour

### Checking Rate Limit

```typescript
const { data: rateLimit } = await octokit.rateLimit.get();

console.log('Remaining:', rateLimit.rate.remaining);
console.log('Limit:', rateLimit.rate.limit);
console.log('Reset:', new Date(rateLimit.rate.reset * 1000));
```

### Best Practices

1. **Use Authentication** - Always use a token for higher limits
2. **Cache Responses** - Implement caching to reduce API calls
3. **Handle Errors** - Gracefully handle rate limit errors
4. **Monitor Usage** - Check rate limit in API responses

### Rate Limit Response Headers

GitHub includes rate limit info in response headers:

```typescript
export async function GET() {
  const response = await octokit.repos.listForUser({ username });
  
  // Check rate limit headers
  const remaining = response.headers['x-ratelimit-remaining'];
  const limit = response.headers['x-ratelimit-limit'];
  const reset = response.headers['x-ratelimit-reset'];
  
  console.log(`Rate limit: ${remaining}/${limit}`);
  
  return NextResponse.json(response.data);
}
```

---

## Advanced Features

### Pagination

For large datasets, implement pagination:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('per_page') || '10');

  const { data } = await octokit.repos.listForUser({
    username,
    page,
    per_page: perPage,
  });

  return NextResponse.json(data);
}
```

Usage:

```bash
GET /api/github/repos?page=2&per_page=20
```

### Filtering

Add query parameters for filtering:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language');
  
  let { data } = await octokit.repos.listForUser({ username });
  
  if (language) {
    data = data.filter((repo) => repo.language === language);
  }
  
  return NextResponse.json(data);
}
```

Usage:

```bash
GET /api/github/repos?language=TypeScript
```

---

## Testing

### Manual Testing

Use curl or tools like Postman:

```bash
# Test repositories endpoint
curl http://localhost:3000/api/github/repos

# Test profile endpoint
curl http://localhost:3000/api/github/profile

# Test with query parameters
curl "http://localhost:3000/api/github/repos?language=TypeScript"
```

### Error Testing

Test error scenarios:

```bash
# Invalid token (set wrong token in .env)
curl http://localhost:3000/api/github/repos

# Missing username (unset GITHUB_USERNAME)
curl http://localhost:3000/api/github/profile
```

---

## Troubleshooting

### Issue: "GitHub username not configured"

**Solution:** Add `GITHUB_USERNAME` to `.env.local`

### Issue: "Bad credentials"

**Solution:** Check that `GITHUB_TOKEN` is valid and not expired

### Issue: API returns empty array

**Solution:** 
- Check that username has public repositories
- Verify token has `public_repo` permission
- Check if repos are being filtered out (forks)

### Issue: Slow response times

**Solution:**
- Verify caching is working
- Reduce `per_page` parameter
- Check GitHub API status

---

## Resources

- [Octokit REST API Documentation](https://octokit.github.io/rest.js/)
- [GitHub REST API Reference](https://docs.github.com/en/rest)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)

---

**Need help?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or create an issue on GitHub.
