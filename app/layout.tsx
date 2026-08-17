import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/lib/data";
import { personSchema, organizationSchema } from "@/lib/schema";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const getSiteUrl = () => {
  const url = siteMetadata.siteUrl;
  if (!url || !url.startsWith('http')) {
    return 'https://kaonang.dev';
  }
  return url;
};

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  openGraph: {
    type: "website",
    locale: siteMetadata.locale,
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteUrl,
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Kaonang Sigit Prakoso - QA Engineer & Backend Developer'
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: siteMetadata.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  canonical: siteUrl,
  alternates: {
    canonical: siteUrl,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchemaData = personSchema(siteUrl);
  const orgSchemaData = organizationSchema(siteUrl);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchemaData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchemaData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
