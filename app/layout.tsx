import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/lib/data";
import { personSchema, organizationSchema } from "@/lib/schema";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const getSiteUrl = () => {
  const url = siteMetadata.siteUrl;
  if (!url || !url.startsWith("http")) return "https://kaonang.dev";
  return url;
};

const siteUrl = getSiteUrl();

// ── Viewport (separate export, required by Next 14) ──────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
  colorScheme: "dark",
};

// ── Main metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // Title with template for potential sub-pages
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.author}`,
  },

  description: siteMetadata.description,

  // Rich keywords for QA/Backend niche
  keywords: [
    ...siteMetadata.keywords,
    "Quality Assurance Engineer",
    "Software Quality Assurance",
    "API Testing",
    "Test Automation",
    "Selenium",
    "Postman",
    "FastAPI",
    "Backend Engineer Indonesia",
    "QA Engineer Indonesia",
    "Kaonang Sigit Prakoso",
    "kaonang",
    "portofolio QA",
    "portofolio developer Indonesia",
  ],

  authors: [{ name: siteMetadata.author, url: siteUrl }],
  creator: siteMetadata.author,
  publisher: siteMetadata.author,

  // Canonical + language alternates
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-US": siteUrl,
      "id-ID": siteUrl,
    },
  },

  // Open Graph — critical for social sharing
  openGraph: {
    type: "website",
    locale: siteMetadata.locale,
    alternateLocale: "id_ID",
    siteName: siteMetadata.author,
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteUrl,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${siteMetadata.author} — QA Engineer & Backend Developer Portfolio`,
        type: "image/jpeg",
      },
    ],
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    site: siteMetadata.twitterHandle,
    creator: siteMetadata.twitterHandle,
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: ["/og-image.jpg"],
  },

  // Robots — full crawl
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // App / manifest
  manifest: "/manifest.webmanifest",
  category: "technology",

  // Verification (add your actual codes when available)
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_CODE",
  //   yandex: "YOUR_YANDEX_CODE",
  // },
};

// ── Root layout ────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const personSchemaData = personSchema(siteUrl);
  const orgSchemaData = organizationSchema(siteUrl);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://ghchart.rshah.org" />

        {/* Person structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchemaData) }}
        />
        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchemaData) }}
        />
        {/* WebSite structured data for sitelinks search box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteMetadata.author,
              url: siteUrl,
              description: siteMetadata.description,
              author: {
                "@type": "Person",
                name: siteMetadata.author,
                url: siteUrl,
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
