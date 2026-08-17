export const generateMetaDescription = (text: string, maxLength: number = 160): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const generateKeywords = (primary: string[], secondary?: string[]): string[] => {
  return [...primary, ...(secondary || [])];
};

export const seoKeywords = {
  primary: ['QA Engineer', 'Backend Developer', 'Software Testing', 'REST API', 'Node.js'],
  secondary: ['Data Analyst', 'Full Stack Developer', 'Python', 'Laravel', 'Cloud Computing'],
  location: ['Indonesia', 'Semarang']
};

export const generateOgDescription = (section: string): string => {
  const descriptions: Record<string, string> = {
    home: 'QA Engineer & Backend Developer with 2+ years experience. 200+ documents validated, 1000+ data records analyzed, 50+ APIs tested.',
    projects: 'Explore my flagship projects: SKIN-AJA API, BPOM automation, and full-stack web applications.',
    skills: 'Technical expertise in QA testing, backend development, data analysis, and cloud infrastructure.',
    contact: 'Get in touch. Available for QA, backend development, and data analysis opportunities.'
  };
  return descriptions[section] || descriptions.home;
};
