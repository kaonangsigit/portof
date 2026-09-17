/**
 * SEO utilities and metadata generation
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  twitterHandle?: string;
}

/**
 * Generate meta tags for SEO
 */
export function generateMetaTags(metadata: SEOMetadata): Record<string, string> {
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.join(", "),
    author: metadata.author,
    "og:title": metadata.title,
    "og:description": metadata.description,
    "og:type": metadata.type || "website",
    ...(metadata.image && { "og:image": metadata.image }),
    ...(metadata.url && { "og:url": metadata.url }),
    "twitter:card": "summary_large_image",
    "twitter:title": metadata.title,
    "twitter:description": metadata.description,
    ...(metadata.image && { "twitter:image": metadata.image }),
    ...(metadata.twitterHandle && { "twitter:creator": metadata.twitterHandle }),
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateJSONLD(
  type: "Person" | "Organization" | "BreadcrumbList",
  data: Record<string, unknown>
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return JSON.stringify(jsonLd);
}

/**
 * Generate Person schema
 */
export function generatePersonSchema(person: {
  name: string;
  title: string;
  email: string;
  image: string;
  url: string;
  sameAs: string[];
}) {
  return generateJSONLD("Person", {
    name: person.name,
    jobTitle: person.title,
    email: person.email,
    image: person.image,
    url: person.url,
    sameAs: person.sameAs,
  });
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(org: {
  name: string;
  url: string;
  logo: string;
  email: string;
  description: string;
}) {
  return generateJSONLD("Organization", {
    name: org.name,
    url: org.url,
    logo: org.logo,
    email: org.email,
    description: org.description,
  });
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return generateJSONLD("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * Generate sitemap XML
 */
export function generateSitemapXML(
  pages: Array<{
    url: string;
    lastmod?: string;
    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
  }>
): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ""}
    ${page.priority ? `<priority>${page.priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;
  return xml;
}

/**
 * SEO Best Practices Checker
 */
export interface SEOIssue {
  type: "error" | "warning" | "info";
  message: string;
  suggestion: string;
}

export function checkSEO(metadata: SEOMetadata): SEOIssue[] {
  const issues: SEOIssue[] = [];

  // Title checks
  if (!metadata.title) {
    issues.push({
      type: "error",
      message: "Missing page title",
      suggestion: "Add a descriptive title for SEO",
    });
  } else if (metadata.title.length < 30) {
    issues.push({
      type: "warning",
      message: "Title is too short",
      suggestion: "Use 30-60 characters for optimal SEO",
    });
  } else if (metadata.title.length > 60) {
    issues.push({
      type: "warning",
      message: "Title is too long",
      suggestion: "Keep title under 60 characters",
    });
  }

  // Description checks
  if (!metadata.description) {
    issues.push({
      type: "error",
      message: "Missing meta description",
      suggestion: "Add a compelling description (150-160 characters)",
    });
  } else if (metadata.description.length < 120) {
    issues.push({
      type: "warning",
      message: "Description is too short",
      suggestion: "Use 120-160 characters for optimal display",
    });
  } else if (metadata.description.length > 160) {
    issues.push({
      type: "warning",
      message: "Description is too long",
      suggestion: "Keep description under 160 characters",
    });
  }

  // Keywords checks
  if (!metadata.keywords || metadata.keywords.length === 0) {
    issues.push({
      type: "info",
      message: "No keywords defined",
      suggestion: "Add relevant keywords (5-10) for better SEO",
    });
  } else if (metadata.keywords.length < 3) {
    issues.push({
      type: "warning",
      message: "Only a few keywords",
      suggestion: "Add more relevant keywords",
    });
  }

  // URL checks
  if (!metadata.url) {
    issues.push({
      type: "warning",
      message: "No canonical URL provided",
      suggestion: "Add canonical URL for better indexing",
    });
  }

  // Image checks
  if (!metadata.image) {
    issues.push({
      type: "info",
      message: "No Open Graph image",
      suggestion: "Add an image for social media sharing",
    });
  }

  return issues;
}
