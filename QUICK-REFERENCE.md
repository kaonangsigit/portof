# 📋 Quick Reference Card - Portfolio Setup

> **Print this or keep it handy while setting up your portfolio!**

---

## 🚀 30-Minute Setup Checklist

### ⏱️ Phase 1: Install (5 minutes)

```bash
# Check prerequisites
node -v        # Need 18.x or higher
git --version  # Need Git installed

# Clone and setup
git clone https://github.com/yourusername/portfolio.git
cd portfolio
npm run setup  # Automated setup (magic!)
```

✅ If setup succeeds, you'll see success messages!

---

### ⏱️ Phase 2: Customize (15 minutes)

**Edit `lib/data.ts` - ALL YOUR DATA IN ONE FILE!**

```typescript
// 1. Personal Info
name: 'Your Name'
title: 'Full Stack Developer'
bio: ['Paragraph 1', 'Paragraph 2']
profileImage: '/profile.jpg'

// 2. Social Links
GitHub: 'https://github.com/yourusername'
LinkedIn: 'https://linkedin.com/in/yourprofile'
Email: 'your.email@example.com'

// 3. Skills
Add/remove skills based on your expertise

// 4. GitHub Config
username: 'your-github-username'
```

**Edit `.env.local`**

```env
GITHUB_TOKEN=your_token_here
GITHUB_USERNAME=your_username
```

**Add Photo**
- Save photo as `public/profile.jpg`
- Recommended: 400x400px

---

### ⏱️ Phase 3: Test (2 minutes)

```bash
npm run dev
```

Open: **http://localhost:3000**

✅ Check all sections load
✅ Verify your data appears
✅ Test on mobile (resize browser)

---

### ⏱️ Phase 4: Deploy (10 minutes)

```bash
# Push to GitHub
git add .
git commit -m "My portfolio"
git push origin main
```

**Deploy to Vercel (FREE):**
1. Go to **vercel.com**
2. Sign up with GitHub
3. Import your repository
4. Add environment variables
5. Click Deploy
6. **DONE!** 🎉

---

## 🔑 Key Files

| File | What It Does | You Edit? |
|------|--------------|-----------|
| `lib/data.ts` | Your personal data | ✅ YES |
| `.env.local` | Environment variables | ✅ YES |
| `public/profile.jpg` | Your photo | ✅ YES |
| `tailwind.config.ts` | Colors/theme | 🔧 Optional |
| Everything else | Framework code | ❌ NO |

---

## 📝 Essential Commands

```bash
# Development
npm run dev              # Start local server
npm run build            # Test production build

# Verification
npm run verify           # Check setup
npm run predeploy        # Pre-deployment check
npm run type-check       # Check for errors

# Setup (first time)
npm run setup            # Auto setup (Unix)
npm run setup:windows    # Auto setup (Windows)
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `PORT=3001 npm run dev` |
| Module not found | `rm -rf node_modules && npm install` |
| GitHub projects not showing | Check `GITHUB_TOKEN` in `.env.local` |
| Images not loading | Verify files in `public/` folder |
| Build fails | `npm run build` to see errors |

---

## 🎯 Data Structure Quick Reference

```typescript
// lib/data.ts structure

personalInfo {
  name, title, tagline, bio,
  profileImage, yearsExperience,
  projectsCompleted, availability
}

socialLinks [
  { name, icon, href, username, color }
]

skillCategories [
  { title, skills: [{ name, icon, color }] }
]

workExperience [
  { company, position, period, location,
    description, technologies, achievements }
]

education [
  { institution, degree, field, period,
    location, gpa, achievements }
]

githubConfig {
  username, maxRepos, excludeRepos, sortBy
}

siteMetadata {
  title, description, keywords,
  author, siteUrl, locale, ogImage
}
```

---

## 🌐 Environment Variables

```env
# Required for GitHub Integration
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_USERNAME=yourusername

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AUTHOR_NAME="Your Name"
NEXT_PUBLIC_AUTHOR_EMAIL="your@email.com"
```

**Get GitHub Token:**
1. GitHub.com → Settings
2. Developer Settings
3. Personal Access Tokens
4. Generate new token (classic)
5. Select `public_repo` scope
6. Copy token to `.env.local`

---

## 📱 Testing Checklist

Before deploying:

- [ ] `npm run verify` passes
- [ ] `npm run predeploy` passes
- [ ] All personal data updated
- [ ] Photo added and displays
- [ ] Social links work
- [ ] GitHub projects load
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Build succeeds

---

## 🚀 Deployment Quick Guide

### Vercel (Recommended - FREE)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy**
   - Visit vercel.com
   - "New Project" → Import repo
   - Add env variables
   - Deploy (takes 2 min)

3. **Done!**
   - Your URL: `https://yourusername.vercel.app`
   - Update `NEXT_PUBLIC_SITE_URL`
   - Redeploy

---

## 📚 Documentation Map

| Document | When to Use |
|----------|-------------|
| **START-HERE.md** | First time visitor |
| **MULAI-DISINI.md** | Indonesian fresh grad |
| **README.md** | English main guide |
| **CUSTOMIZATION_GUIDE.md** | Detailed customization |
| **TROUBLESHOOTING.md** | When stuck |
| **DOCS-INDEX.md** | Find any document |

---

## 💡 Pro Tips

**Content:**
- ✅ Be honest about skills
- ✅ Use professional photo
- ✅ Write engaging bio (not generic)
- ✅ Keep projects updated monthly

**Technical:**
- ✅ Test on multiple devices
- ✅ Run predeploy before deploying
- ✅ Keep dependencies updated
- ✅ Monitor for errors

**Career:**
- ✅ Add URL to LinkedIn
- ✅ Include in CV/resume
- ✅ Share during interviews
- ✅ Update regularly

---

## 🆘 Get Help

1. **Check docs:** START-HERE.md
2. **Troubleshooting:** TROUBLESHOOTING.md
3. **FAQ:** FAQ.md
4. **GitHub Issues:** Create new issue
5. **Email:** your.email@example.com

---

## ⭐ Success Indicators

You'll know you're successful when:

✅ Portfolio loads at localhost:3000
✅ Your data shows correctly
✅ GitHub projects display
✅ Mobile version looks good
✅ Build completes without errors
✅ Deployed to Vercel
✅ URL works publicly
✅ Shared on LinkedIn

---

## 🎉 Post-Launch

After your portfolio is live:

**Week 1:**
- [ ] Share on LinkedIn
- [ ] Update CV
- [ ] Tell friends/mentors
- [ ] Add to email signature

**Week 2-4:**
- [ ] Add 3 quality projects
- [ ] Update GitHub READMEs
- [ ] Improve descriptions
- [ ] Get feedback

**Ongoing:**
- [ ] New project monthly
- [ ] Update skills quarterly
- [ ] Refresh content
- [ ] Monitor analytics

---

<div align="center">

## 📋 Quick Reference Card

**Setup Time:** 30 minutes  
**Cost:** FREE  
**Difficulty:** Easy  
**Result:** Professional Portfolio

---

**Questions?** Read MULAI-DISINI.md or README.md

**Stuck?** Check TROUBLESHOOTING.md

**Ready?** Let's go! 🚀

---

**Print this page and keep it handy!**

</div>
