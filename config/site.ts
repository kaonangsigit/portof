export const siteConfig = {
  name: "Portfolio",
  description: "Full-stack developer portfolio showcasing projects and skills",
  url: "https://yourportfolio.com", // Update with your domain
  ogImage: "https://yourportfolio.com/og.jpg",
  links: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    email: "mailto:your.email@example.com",
  },
  creator: {
    name: "Your Name",
    email: "your.email@example.com",
  },
};

export type SiteConfig = typeof siteConfig;
