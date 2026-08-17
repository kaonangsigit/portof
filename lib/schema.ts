export const personSchema = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kaonang Sigit Prakoso',
  jobTitle: 'QA Engineer & Backend Developer',
  url: siteUrl,
  sameAs: [
    'https://github.com/kaonangsigit',
    'https://linkedin.com/in/kaonang-sigit-prakoso'
  ],
  image: `${siteUrl}/og-image.jpg`,
  description: 'QA Engineer and Backend Developer with 2+ years experience in software testing, API development, and data analysis.'
});

export const creativeWorkSchema = (project: {
  name: string;
  description: string;
  url: string;
  languages: string[];
}, creator: string) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: project.name,
  description: project.description,
  url: project.url,
  creator: {
    '@type': 'Person',
    name: creator
  },
  programmingLanguage: project.languages
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url
  }))
});

export const organizationSchema = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kaonang Sigit Prakoso',
  url: siteUrl,
  sameAs: [
    'https://github.com/kaonangsigit',
    'https://linkedin.com/in/kaonang-sigit-prakoso'
  ]
});
