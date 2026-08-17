import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/lib/data";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "block",
});

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  openGraph: {
    type: "website",
    locale: siteMetadata.locale,
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(siteMetadata.siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
