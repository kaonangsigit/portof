/**
 * Portfolio Data - Update with your personal information
 */

export const siteMetadata = {
  title: "Kaonang Sigit Prakoso - Full Stack Developer",
  description:
    "Full Stack Developer specializing in React, Next.js, and Node.js. Explore my projects, skills, and experience.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Web Developer",
    "Portfolio",
  ],
  author: "Kaonang Sigit Prakoso",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://kaonang.dev",
  locale: "en_US",
  twitterHandle: "@kaonangsigit",
};

export const personalInfo = {
  name: "Kaonang Sigit Prakoso",
  title: "Full Stack Developer",
  subtitle: "Building modern web experiences",
  bio: "I'm a passionate Full Stack Developer with experience in building scalable web applications. I love working with React, Next.js, and Node.js to create clean, efficient, and user-friendly solutions.",
  email: "kaonang@example.com",
  location: "Indonesia",
  availability: "Open to opportunities",
  profileImage: "/profile.jpg",
  resumeUrl: "/resume.pdf",
  socialLinks: {
    github: "https://github.com/kaonangsigit",
    linkedin: "https://linkedin.com/in/kaonang-sigit-prakoso",
    twitter: "https://twitter.com/kaonangsigit",
    instagram: "https://instagram.com/kaonangsigit",
  },
};

export const skills = [
  {
    category: "Frontend",
    items: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 88 },
      { name: "TypeScript", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML/CSS", level: 95 },
      { name: "JavaScript", level: 92 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 82 },
      { name: "Express.js", level: 80 },
      { name: "REST API", level: 85 },
      { name: "GraphQL", level: 70 },
      { name: "Python", level: 65 },
    ],
  },
  {
    category: "Database",
    items: [
      { name: "PostgreSQL", level: 78 },
      { name: "MongoDB", level: 75 },
      { name: "MySQL", level: 75 },
      { name: "Redis", level: 65 },
    ],
  },
  {
    category: "DevOps & Tools",
    items: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 72 },
      { name: "CI/CD", level: 70 },
      { name: "Vercel", level: 85 },
      { name: "Linux", level: 70 },
    ],
  },
];

export const experiences = [
  {
    id: 1,
    company: "Tech Startup",
    role: "Full Stack Developer",
    period: "2022 - Present",
    description:
      "Developed and maintained web applications using React, Next.js, and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.",
    achievements: [
      "Improved application performance by 40% through code optimization",
      "Led migration from REST to GraphQL API",
      "Mentored 2 junior developers",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    current: true,
  },
  {
    id: 2,
    company: "Digital Agency",
    role: "Frontend Developer",
    period: "2020 - 2022",
    description:
      "Built responsive and interactive web interfaces for various clients. Worked closely with designers to implement pixel-perfect UI components.",
    achievements: [
      "Delivered 15+ client projects on time",
      "Reduced page load time by 30%",
      "Implemented accessibility improvements (WCAG 2.1)",
    ],
    technologies: ["React", "JavaScript", "CSS/SCSS", "Tailwind", "Figma"],
    current: false,
  },
  {
    id: 3,
    company: "Freelance",
    role: "Web Developer",
    period: "2019 - 2020",
    description:
      "Provided web development services to small businesses. Created websites and web applications based on client requirements.",
    achievements: [
      "Completed 20+ freelance projects",
      "Maintained 100% client satisfaction rate",
      "Developed reusable component library",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "WordPress", "PHP"],
    current: false,
  },
];

export const education = [
  {
    id: 1,
    institution: "State University",
    degree: "Bachelor of Computer Science",
    period: "2015 - 2019",
    description:
      "Studied computer science fundamentals including algorithms, data structures, software engineering, and web development.",
    achievements: [
      "GPA: 3.8/4.0",
      "Dean's List for 4 consecutive semesters",
      "Final project: E-commerce platform with React & Node.js",
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform with product management, cart, and payment integration. Built with Next.js, Node.js, and Stripe.",
    longDescription:
      "Complete e-commerce solution featuring product catalog, shopping cart, user authentication, order management, and Stripe payment integration.",
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
    githubUrl: "https://github.com/kaonangsigit/ecommerce",
    liveUrl: "https://ecommerce-demo.vercel.app",
    image: "/projects/ecommerce.png",
    featured: true,
    category: "Full Stack",
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "A collaborative task management tool with real-time updates, drag-and-drop functionality, and team collaboration features.",
    longDescription:
      "Built with React and Firebase for real-time collaboration. Features include kanban board, task assignment, deadline tracking, and notifications.",
    technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/kaonangsigit/taskmanager",
    liveUrl: "https://taskmanager-demo.vercel.app",
    image: "/projects/taskmanager.png",
    featured: true,
    category: "Frontend",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description:
      "A weather dashboard app that shows current and forecast weather data with beautiful visualizations.",
    longDescription:
      "Built with Next.js and OpenWeatherMap API. Features include 7-day forecast, weather maps, and location search.",
    technologies: ["Next.js", "React", "TypeScript", "Chart.js"],
    githubUrl: "https://github.com/kaonangsigit/weather",
    liveUrl: "https://weather-demo.vercel.app",
    image: "/projects/weather.png",
    featured: false,
    category: "Frontend",
  },
  {
    id: 4,
    title: "REST API Server",
    description:
      "A RESTful API server with authentication, authorization, and CRUD operations for a blog platform.",
    longDescription:
      "Built with Node.js, Express, and PostgreSQL. Features JWT authentication, role-based access control, and full CRUD operations.",
    technologies: ["Node.js", "Express", "PostgreSQL", "JWT"],
    githubUrl: "https://github.com/kaonangsigit/api-server",
    liveUrl: null,
    image: "/projects/api.png",
    featured: false,
    category: "Backend",
  },
];

export const achievements = [
  {
    id: 1,
    title: "AWS Certified Developer",
    organization: "Amazon Web Services",
    year: "2023",
    description: "Associate level certification for AWS cloud development",
    icon: "🏆",
  },
  {
    id: 2,
    title: "Open Source Contributor",
    organization: "GitHub",
    year: "2022",
    description: "Contributed to 10+ open source projects",
    icon: "⭐",
  },
  {
    id: 3,
    title: "Hackathon Winner",
    organization: "TechFest 2022",
    year: "2022",
    description: "1st place in 48-hour hackathon with 200+ participants",
    icon: "🥇",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Ahmad Rizki",
    role: "CTO at Tech Startup",
    company: "TechStartup Co.",
    content:
      "Kaonang is an exceptional developer who consistently delivers high-quality work. His attention to detail and problem-solving skills are outstanding.",
    avatar: "/testimonials/ahmad.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "Digital Agency",
    content:
      "Working with Kaonang was a pleasure. He understood our requirements quickly and delivered beyond expectations. Highly recommended!",
    avatar: "/testimonials/sarah.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Founder",
    company: "E-Commerce Store",
    content:
      "The e-commerce platform Kaonang built for us exceeded all our expectations. Professional, fast, and communicative throughout the project.",
    avatar: "/testimonials/budi.jpg",
    rating: 5,
  },
];

export const stats = [
  { label: "Years Experience", value: "5+", icon: "📅" },
  { label: "Projects Completed", value: "50+", icon: "🚀" },
  { label: "Happy Clients", value: "30+", icon: "😊" },
  { label: "Technologies", value: "20+", icon: "⚡" },
];

export const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 14 App Router",
    excerpt:
      "A comprehensive guide to understanding the new App Router in Next.js 14 and how to migrate from the Pages Router.",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["Next.js", "React", "Tutorial"],
    slug: "nextjs-14-app-router",
    coverImage: "/blog/nextjs.png",
  },
  {
    id: 2,
    title: "TypeScript Best Practices for React Developers",
    excerpt:
      "Learn the most important TypeScript patterns and best practices to write cleaner and more maintainable React code.",
    date: "2023-12-20",
    readTime: "6 min read",
    tags: ["TypeScript", "React", "Best Practices"],
    slug: "typescript-react-best-practices",
    coverImage: "/blog/typescript.png",
  },
  {
    id: 3,
    title: "Building REST APIs with Node.js and Express",
    excerpt:
      "Step-by-step tutorial on building production-ready REST APIs with authentication, validation, and proper error handling.",
    date: "2023-11-10",
    readTime: "10 min read",
    tags: ["Node.js", "Express", "API"],
    slug: "nodejs-express-rest-api",
    coverImage: "/blog/nodejs.png",
  },
];
