# Centralized Data Configuration

## Overview

All portfolio data is now centralized in a single file: **`lib/data.ts`**

This makes it incredibly easy to customize your portfolio without touching the component code.

## What's Included

### ✅ Centralized in `lib/data.ts`:

- **Personal Information** - Name, title, bio, profile image, experience
- **Social Media Links** - GitHub, LinkedIn, Instagram, Email, Twitter, etc.
- **Skills & Technologies** - Organized by categories (Frontend, Backend, Database, Tools)
- **About Features** - Your key characteristics/strengths
- **Work Experience** - Complete work history with achievements
- **Education** - Academic background
- **Certifications** - Professional certifications
- **Navigation Items** - Menu items
- **Site Metadata** - SEO settings, Open Graph, Twitter cards
- **Featured Projects** - Manual project entries (fallback for GitHub API)
- **Content Text** - All labels, buttons, and text content
- **GitHub Configuration** - Settings for fetching repositories
- **Testimonials** - Client/colleague recommendations (optional)

## Updated Components

All components now use data from `lib/data.ts`:

- ✅ `components/Hero.tsx` - Uses personalInfo, socialLinks, content
- ✅ `components/About.tsx` - Uses personalInfo, aboutFeatures, content
- ✅ `components/Skills.tsx` - Uses skillCategories, content
- ✅ `components/Contact.tsx` - Uses contactSocialLinks, content, personalInfo
- ✅ `components/Footer.tsx` - Uses socialLinks, navItems, content, personalInfo
- ✅ `components/Navigation.tsx` - Uses navItems
- ✅ `app/layout.tsx` - Uses siteMetadata

## Key Features

### 🎯 Type Safety
All data structures are fully typed with TypeScript interfaces, preventing errors.

### 🌐 Internationalization Ready
All text content is in the `content` object, making it easy to translate to other languages.

### 🔄 Single Source of Truth
Change data in one place, and it updates everywhere automatically.

### 📝 Well Documented
Every section has Indonesian comments explaining what to change.

### 🎨 Icon Support
- Uses `lucide-react` for UI icons
- Uses `react-icons/si` for technology/brand icons

## Quick Start

1. Open `lib/data.ts`
2. Update `personalInfo` with your information
3. Update `socialLinks` with your social media URLs
4. Customize `skillCategories` with your skills
5. Add your work experience to `workExperience`
6. Update `siteMetadata` for SEO
7. Configure `githubConfig` with your GitHub username

## File Structure

```
lib/
└── data.ts          # 🎯 Main configuration file

components/          # Components using the data
├── Hero.tsx
├── About.tsx
├── Skills.tsx
├── Contact.tsx
├── Footer.tsx
└── Navigation.tsx

app/
└── layout.tsx       # Uses metadata
```

## Examples

### Adding a New Social Media:

```typescript
// 1. Import the icon
import { Twitter } from 'lucide-react';

// 2. Add to socialLinks array
{
  name: 'Twitter',
  icon: Twitter,
  href: 'https://twitter.com/yourhandle',
  username: '@yourhandle',
  color: 'hover:text-blue-400',
}
```

### Adding a New Skill:

```typescript
// 1. Import the icon
import { SiVuedotjs } from 'react-icons/si';

// 2. Add to the appropriate category
{
  title: 'Frontend',
  skills: [
    { name: 'Vue.js', icon: SiVuedotjs, color: 'text-green-500' },
    // ... other skills
  ],
}
```

### Changing Language to Indonesian:

Update the `content` object:

```typescript
export const content = {
  hero: {
    greeting: 'Hai, nama saya',
    cta: {
      primary: 'Lihat Karya Saya',
      secondary: 'Hubungi Saya',
    },
  },
  // ... translate other sections
};
```

## Benefits

### Before (Hardcoded):
- Data scattered across multiple components
- Hard to maintain consistency
- Risk of missing updates in some places
- Difficult to translate
- No type safety

### After (Centralized):
- ✅ All data in one file
- ✅ Update once, changes everywhere
- ✅ Full TypeScript type safety
- ✅ Easy to translate
- ✅ Well documented with Indonesian comments
- ✅ Easy to add/remove items

## Documentation

For detailed customization instructions, see:
- **`CUSTOMIZATION_GUIDE.md`** - Complete guide in Indonesian

## Validation

All data structures are validated by TypeScript types. If you make a mistake, TypeScript will warn you before runtime.

## Migration Path

If you need to revert to hardcoded values:
1. The old component code is preserved in git history
2. You can mix and match (some components use data file, others don't)
3. No breaking changes - all exports are optional

## Best Practices

1. **Always use TypeScript types** - They prevent errors
2. **Keep data.ts clean** - Don't add logic, only data
3. **Use meaningful names** - For easy identification
4. **Test after changes** - Verify in development mode
5. **Backup before major changes** - Safety first

## Future Enhancements

Potential additions to the data file:
- Blog posts configuration
- Testimonials
- Resume/CV data
- Timeline/career path
- Project categories
- Services offered
- Pricing tables

## Support

If you encounter issues:
1. Check `CUSTOMIZATION_GUIDE.md` for detailed help
2. Verify TypeScript types match
3. Check console for errors
4. Ensure all required fields are filled

---

**Created:** 2026-07-19
**Last Updated:** 2026-07-19
**Version:** 1.0.0
