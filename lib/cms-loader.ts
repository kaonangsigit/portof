import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const contentDirectory = path.join(process.cwd(), "content");

export type Certificate = {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  image?: string;
  credentialUrl?: string;
  description: string;
  skills: string[];
  content: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
  featured: boolean;
  content: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
  tags: string[];
  content: string;
};

export type PersonalData = {
  name: string;
  title: string;
  email: string;
  phone?: string;
  bio: string;
  availability: string;
  location?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
};

export type SkillData = {
  category: string;
  skills: {
    name: string;
    level: number;
    icon?: string;
  }[];
};

export type ExperienceData = {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  achievements: string[];
};

function getContentPath(type: "certificates" | "projects" | "blog" | "data"): string {
  return path.join(contentDirectory, type);
}

export function getAllCertificates(): Certificate[] {
  try {
    const certificatesPath = getContentPath("certificates");
    
    if (!fs.existsSync(certificatesPath)) {
      return [];
    }

    const fileNames = fs.readdirSync(certificatesPath);
    const certificates = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(certificatesPath, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || "",
          issuer: data.issuer || "",
          date: data.date || "",
          image: data.image,
          credentialUrl: data.credentialUrl,
          description: data.description || "",
          skills: data.skills || [],
          content: marked(content) as string,
        };
      });

    return certificates.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error loading certificates:", error);
    return [];
  }
}

export function getCertificate(slug: string): Certificate | null {
  try {
    const fullPath = path.join(getContentPath("certificates"), `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      issuer: data.issuer || "",
      date: data.date || "",
      image: data.image,
      credentialUrl: data.credentialUrl,
      description: data.description || "",
      skills: data.skills || [],
      content: marked(content) as string,
    };
  } catch (error) {
    console.error(`Error loading certificate ${slug}:`, error);
    return null;
  }
}

export function getAllProjects(): Project[] {
  try {
    const projectsPath = getContentPath("projects");
    
    if (!fs.existsSync(projectsPath)) {
      return [];
    }

    const fileNames = fs.readdirSync(projectsPath);
    const projects = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(projectsPath, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || "",
          description: data.description || "",
          image: data.image,
          githubUrl: data.githubUrl,
          demoUrl: data.demoUrl,
          technologies: data.technologies || [],
          featured: data.featured || false,
          content: marked(content) as string,
        };
      });

    return projects;
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

export function getAllBlogPosts(): BlogPost[] {
  try {
    const blogPath = getContentPath("blog");
    
    if (!fs.existsSync(blogPath)) {
      return [];
    }

    const fileNames = fs.readdirSync(blogPath);
    const posts = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(blogPath, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || "",
          description: data.description || "",
          date: data.date || "",
          author: data.author || "",
          image: data.image,
          tags: data.tags || [],
          content: marked(content) as string,
        };
      });

    return posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}

export function getPersonalData(): PersonalData | null {
  try {
    const dataPath = path.join(getContentPath("data"), "personal.json");
    
    if (!fs.existsSync(dataPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading personal data:", error);
    return null;
  }
}

export function getSkillsData(): SkillData[] {
  try {
    const dataPath = path.join(getContentPath("data"), "skills.json");
    
    if (!fs.existsSync(dataPath)) {
      return [];
    }

    const fileContents = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading skills data:", error);
    return [];
  }
}

export function getExperienceData(): ExperienceData[] {
  try {
    const dataPath = path.join(getContentPath("data"), "experience.json");
    
    if (!fs.existsSync(dataPath)) {
      return [];
    }

    const fileContents = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading experience data:", error);
    return [];
  }
}

// ─── CMS JSON Store (Admin Panel) ────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentType = "certificates" | "projects" | "personal" | "skills" | "experience" | "education" | "achievements" | "testimonials" | "stats";

/**
 * Read a JSON file from the content/ folder.
 * Throws if the file does not exist or cannot be parsed.
 */
export async function readContent<T>(type: ContentType): Promise<T> {
  const filePath = path.join(CONTENT_DIR, `${type}.json`);
  const raw = await fsPromises.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Write data as pretty-printed JSON to the content/ folder.
 */
export async function writeContent<T>(type: ContentType, data: T): Promise<void> {
  const filePath = path.join(CONTENT_DIR, `${type}.json`);
  await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Ensure the content/ directory exists (creates it recursively if needed).
 */
export async function ensureContentDir(): Promise<void> {
  await fsPromises.mkdir(CONTENT_DIR, { recursive: true });
}
