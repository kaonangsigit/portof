import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kao Nangprakoso - Full-Stack Developer Portfolio',
    short_name: 'Kao Portfolio',
    description: 'Full-stack developer specializing in React, Next.js, and Node.js. Explore my projects and skills.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['portfolio', 'developer', 'technology'],
    orientation: 'portrait-primary',
    lang: 'en-US',
  };
}
