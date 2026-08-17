# Customization Guide

This guide will help you customize your portfolio with your personal information.

## 1. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourportfolio.com
NEXT_PUBLIC_SITE_NAME="Your Name"

# GitHub Configuration
NEXT_PUBLIC_GITHUB_USERNAME=yourgithubusername
GITHUB_TOKEN=ghp_yourpersonalaccesstoken

# Contact
NEXT_PUBLIC_CONTACT_EMAIL=your.email@example.com
```

### Getting a GitHub Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `public_repo`, `read:user`
4. Copy the token to your `.env.local` file

## 2. Site Configuration (`lib/config.ts`)

Update the following in `lib/config.ts`:

```typescript
export const siteConfig = {
  name: "Your Name",
  title: "Your Title - Full-Stack Developer",
  description: "Your portfolio description",
  url: "https://yourportfolio.com",
  author: {
    name: "Your Full Name",
    email: "your.email@example.com",
    github: "yourusername",
    linkedin: "yourusername",
    twitter: "yourusername",
  },
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    email: "mailto:your.email@example.com",
  },
};
```

## 3. Hero Section (`components/Hero.tsx`)

Update your hero content:
- Your name and title
- Brief introduction
- CTA button text and links
- Background gradient colors (if desired)

## 4. About Section (`components/About.tsx`)

Update:
- Your bio/description
- Skills highlights
- Years of experience
- Any personal details you want to share

## 5. Experience Section (`components/Experience.tsx`)

Replace the mock data with your actual work experience:

```typescript
const experiences: ExperienceItem[] = [
  {
    id: "1",
    company: "Your Company Name",
    position: "Your Position",
    location: "City, State/Country or Remote",
    startDate: "Jan 2023",
    endDate: "Present",
    description: "Brief description of your role",
    achievements: [
      "Key achievement 1",
      "Key achievement 2",
      "Key achievement 3",
    ],
    technologies: ["React", "Node.js", "AWS", "etc."],
  },
  // Add more experiences...
];
```

## 6. Education Section (`components/Education.tsx`)

Update with your educational background:

```typescript
const education: EducationItem[] = [
  {
    id: "1",
    institution: "Your University",
    degree: "Bachelor of Science",
    field: "Computer Science",
    startDate: "2016",
    endDate: "2020",
    description: "Brief description",
    achievements: [
      "Academic achievement 1",
      "Academic achievement 2",
    ],
    gpa: "3.8/4.0", // Optional
  },
];
```

## 7. Projects Section (`components/Projects.tsx`)

Your projects should be automatically pulled from GitHub, but you can customize:
- Featured projects list
- Project descriptions
- Display order
- Number of projects shown

## 8. Achievements Section (`components/Achievements.tsx`)

Add your certifications and awards:

```typescript
const achievements: Achievement[] = [
  {
    id: "1",
    title: "Certification Name",
    issuer: "Issuing Organization",
    date: "2024",
    description: "What this certification demonstrates",
    type: "certification",
    credentialUrl: "https://credential-url.com",
    icon: "certificate",
  },
];
```

## 9. Testimonials Section (`components/Testimonials.tsx`)

Add testimonials from colleagues or clients:

```typescript
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Person Name",
    role: "Their Position",
    company: "Their Company",
    content: "Their testimonial about you",
    rating: 5,
  },
];
```

## 10. Blog Section (`components/Blog.tsx`)

### Option A: Use Mock Data
Keep the current mock data and manually update it.

### Option B: Integrate with dev.to
Replace the fetch logic with:

```typescript
const response = await fetch(
  `https://dev.to/api/articles?username=${yourUsername}`
);
const articles = await response.json();
```

### Option C: Integrate with Medium RSS
Use an RSS parser to fetch your Medium posts.

## 11. Contact Section (`components/Contact.tsx`)

Update:
- Contact form endpoint (if using a service)
- Social media links
- Contact email
- Any additional contact methods

## 12. Navigation (`components/Navigation.tsx`)

The navigation is automatically updated. You can customize:
- Logo text/icon
- Navigation item order
- Styling and colors

## 13. Footer (`components/Footer.tsx`)

Update:
- Copyright information
- Social media links
- Any additional footer content

## 14. SEO and Metadata (`app/layout.tsx`)

Update metadata for better SEO:
- Page title
- Meta description
- Open Graph images
- Twitter card data

## 15. Styling

### Colors
Customize your brand colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-primary-color',
      secondary: '#your-secondary-color',
    },
  },
}
```

### Fonts
Update fonts in `app/globals.css` or `app/layout.tsx`.

## Testing Your Changes

1. Run the development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000` to see your changes

3. Test all sections and links

4. Check mobile responsiveness

5. Verify GitHub stats are loading correctly

## Deployment Checklist

- [ ] All environment variables set
- [ ] Personal information updated
- [ ] Social media links working
- [ ] GitHub stats displaying correctly
- [ ] Contact form working (if applicable)
- [ ] All images optimized
- [ ] SEO metadata complete
- [ ] Tested on multiple devices
- [ ] Analytics configured (if using)

## Common Issues

### GitHub Stats Not Loading
- Check your `NEXT_PUBLIC_GITHUB_USERNAME` is correct
- Verify your `GITHUB_TOKEN` has correct permissions
- Check API rate limits

### Images Not Displaying
- Ensure images are in `public/` directory
- Use correct paths (starting with `/`)
- Optimize image sizes for web

### Styling Issues
- Clear your browser cache
- Rebuild the project: `npm run build`
- Check Tailwind configuration

## Need Help?

Refer to the main README.md or documentation files for additional information.
