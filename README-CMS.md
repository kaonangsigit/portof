# Portfolio CMS Guide

This portfolio uses a **file-based CMS** system. You can easily manage content by adding/editing markdown and JSON files.

## 📁 Content Structure

```
/content/
  ├── /certificates/     # Certificate markdown files
  ├── /projects/         # Project markdown files
  ├── /blog/            # Blog post markdown files
  └── /data/            # JSON data files
      ├── personal.json
      ├── skills.json
      └── experience.json
```

---

## 🎓 Adding Certificates

Create a new `.md` file in `/content/certificates/`:

**Example: `/content/certificates/my-cert.md`**

```markdown
---
title: "Your Certificate Name"
issuer: "Issuing Organization"
date: "2024-01-15"
image: "/images/certificates/cert.jpg"
credentialUrl: "https://verify-url.com"
description: "Brief description of the certificate"
skills: ["Skill 1", "Skill 2", "Skill 3"]
---

# Certificate Details

Add detailed information about what you learned, achievements, etc.

## Key Topics
- Topic 1
- Topic 2
```

**Required fields:**
- `title`: Certificate name
- `issuer`: Organization that issued it
- `date`: Issue date (YYYY-MM-DD)
- `description`: Short description
- `skills`: Array of related skills

**Optional fields:**
- `image`: Path to certificate image
- `credentialUrl`: Link to verify certificate

---

## 🚀 Adding Projects

Create a new `.md` file in `/content/projects/`:

**Example: `/content/projects/my-project.md`**

```markdown
---
title: "Project Name"
description: "Short project description"
image: "/images/projects/project.jpg"
githubUrl: "https://github.com/user/repo"
demoUrl: "https://demo.example.com"
technologies: ["React", "Node.js", "MongoDB"]
featured: true
---

# Project Overview

Detailed project description goes here.

## Features
- Feature 1
- Feature 2

## Technical Details
- Built with X
- Deployed on Y
```

**Required fields:**
- `title`: Project name
- `description`: Short description
- `technologies`: Array of technologies used
- `featured`: true/false (show on homepage)

**Optional fields:**
- `image`: Project screenshot
- `githubUrl`: GitHub repository link
- `demoUrl`: Live demo link

---

## 📝 Adding Blog Posts

Create a new `.md` file in `/content/blog/`:

**Example: `/content/blog/my-post.md`**

```markdown
---
title: "Blog Post Title"
description: "Post summary"
date: "2024-01-20"
author: "Your Name"
image: "/images/blog/post.jpg"
tags: ["Tag1", "Tag2", "Tag3"]
---

# Introduction

Your blog content here with full markdown support.

## Section 1
Content...

## Section 2
More content...
```

**Required fields:**
- `title`: Post title
- `description`: Summary
- `date`: Publication date (YYYY-MM-DD)
- `author`: Author name
- `tags`: Array of tags

---

## ⚙️ Editing Personal Data

Edit `/content/data/personal.json`:

```json
{
  "name": "Your Name",
  "title": "Your Job Title",
  "email": "your@email.com",
  "phone": "+1 234 567 8900",
  "bio": "Your professional bio",
  "availability": "Available for hire",
  "location": "Your City, Country",
  "socialLinks": {
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername",
    "twitter": "https://twitter.com/yourusername"
  }
}
```

---

## 🎯 Editing Skills

Edit `/content/data/skills.json`:

```json
[
  {
    "category": "Frontend Development",
    "skills": [
      { "name": "React", "level": 95 },
      { "name": "TypeScript", "level": 90 }
    ]
  },
  {
    "category": "Backend Development",
    "skills": [
      { "name": "Node.js", "level": 85 }
    ]
  }
]
```

**Level**: 0-100 (represents proficiency percentage)

---

## 💼 Editing Experience

Edit `/content/data/experience.json`:

```json
[
  {
    "company": "Company Name",
    "position": "Job Title",
    "startDate": "2022-01",
    "endDate": null,
    "description": "Role description",
    "technologies": ["React", "Node.js"],
    "achievements": [
      "Achievement 1",
      "Achievement 2"
    ]
  }
]
```

**Note**: Set `endDate` to `null` for current positions.

---

## 🔄 Auto-Reloading

The portfolio automatically detects file changes during development:

1. Edit any content file
2. Save the file
3. Page auto-refreshes with new content

No server restart needed!

---

## 📸 Adding Images

Store images in `/public/images/`:

```
/public/images/
  ├── /certificates/
  ├── /projects/
  └── /blog/
```

Reference in markdown:
```markdown
image: "/images/certificates/my-cert.jpg"
```

---

## 🔗 GitHub Auto-Integration

Your GitHub repos are **automatically fetched** every hour:

- Latest repositories
- Stars, forks, watchers
- Primary language
- Last updated date
- Commit activity

**Configuration**: Set your GitHub username in `.env.local`:

```
NEXT_PUBLIC_GITHUB_USERNAME=yourusername
GITHUB_TOKEN=your_github_token (optional, for higher API limits)
```

---

## ✅ Quick Checklist

To add new content:

- [ ] Create `.md` file in appropriate folder
- [ ] Add frontmatter (YAML between `---`)
- [ ] Write content in markdown
- [ ] Add images to `/public/images/` if needed
- [ ] Save and check auto-reload

---

## 🆘 Troubleshooting

**Content not showing?**
- Check file has `.md` extension
- Verify frontmatter format (YAML between `---`)
- Check required fields are present
- Look for syntax errors in JSON files

**Images not loading?**
- Ensure images are in `/public/images/`
- Use absolute paths: `/images/folder/file.jpg`
- Check file extensions match

**GitHub data not updating?**
- Verify `.env.local` has correct username
- Check API rate limits (add GITHUB_TOKEN for higher limits)
- Cache refreshes every 1 hour

---

## 📚 Markdown Support

All content files support:

- **Bold** and *italic*
- [Links](https://example.com)
- `Code blocks`
- Lists (ordered/unordered)
- Headers (H1-H6)
- Blockquotes
- Images
- Tables

---

## 🚀 Next Steps

1. **Replace example content** with your real data
2. **Add your certificates** in `/content/certificates/`
3. **Add your projects** in `/content/projects/`
4. **Update personal info** in `/content/data/personal.json`
5. **Update skills** in `/content/data/skills.json`
6. **Update experience** in `/content/data/experience.json`
7. **Set GitHub username** in `.env.local`
8. **Add blog posts** (optional) in `/content/blog/`

Your portfolio will automatically update as you add content!
