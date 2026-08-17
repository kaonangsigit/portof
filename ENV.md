# Environment Variables

This file contains all the environment variables needed for the portfolio project.

## Required Variables

### GitHub API Integration

```bash
# GitHub Personal Access Token
# Generate at: https://github.com/settings/tokens
# Permissions needed: None (for public repos) or "repo" scope for private repos
GITHUB_TOKEN=your_github_token_here

# Your GitHub username
GITHUB_USERNAME=your_username_here
```

## Optional Variables

### Site Configuration

```bash
# Base URL of your deployed site (for sitemap and SEO)
NEXT_PUBLIC_SITE_URL=https://yourportfolio.com

# Google Analytics ID (if you want to track visitors)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Contact email (shown in the contact section)
NEXT_PUBLIC_CONTACT_EMAIL=your.email@example.com
```

### API Configuration

```bash
# GitHub API base URL (usually not needed to change)
GITHUB_API_URL=https://api.github.com

# Rate limit for GitHub API (default: 5000/hour with token)
GITHUB_API_RATE_LIMIT=5000
```

## Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required variables in `.env`

3. Restart your development server after changing environment variables:
   ```bash
   npm run dev
   ```

## Production Deployment

### Vercel
Add environment variables in: Project Settings > Environment Variables

### Netlify
Add environment variables in: Site Settings > Build & Deploy > Environment

### Other Platforms
Refer to your hosting platform's documentation for adding environment variables.

## Security Notes

- Never commit `.env` files to version control
- `.env` is already in `.gitignore`
- Use `.env.example` to document required variables
- Rotate your GitHub token if it's ever exposed
- Use minimal permissions for your GitHub token
