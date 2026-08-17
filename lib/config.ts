/**
 * Centralised runtime configuration (reads from env vars)
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Portfolio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Full Stack Developer specializing in React, Next.js, and Node.js",

  github: {
    username: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "",
    token: process.env.GITHUB_TOKEN ?? "",
    reposLimit: parseInt(
      process.env.NEXT_PUBLIC_GITHUB_REPOS_LIMIT ?? "10",
      10
    ),
  },

  email: {
    provider: (process.env.EMAIL_PROVIDER ?? "resend") as "resend" | "sendgrid",
    from: process.env.EMAIL_FROM ?? "noreply@example.com",
    contactEmail: process.env.CONTACT_EMAIL ?? "",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    sendgridApiKey: process.env.SENDGRID_API_KEY ?? "",
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  },

  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/kaonangsigit",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ??
      "https://linkedin.com/in/kaonang-sigit-prakoso",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL ?? "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  },
};

export type SiteConfig = typeof siteConfig;
