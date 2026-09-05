import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Project {
  slug: string; title: string; year: number; category: string; services: string[];
  summary: string; featured: boolean; order: number; accent: string; heroImage?: string; content: string;
}

const dir = path.join(process.cwd(), "content/work");

export function getAllProjects(): Project[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
    return {
      slug: data.slug ?? file.replace(/\.mdx$/, ""),
      title: data.title ?? "Untitled",
      year: data.year ?? new Date().getFullYear(),
      category: data.category ?? "",
      services: data.services ?? [],
      summary: data.summary ?? "",
      featured: data.featured ?? false,
      order: data.order ?? 0,
      accent: data.accent ?? "#6572FF",
      heroImage: data.heroImage,
      content,
    };
  }).sort((a, b) => a.order - b.order);
}

export const getProjectBySlug = (slug: string) => getAllProjects().find((p) => p.slug === slug);

export function getAdjacentProject(slug: string) {
  const all = getAllProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1 || all.length < 2) return null;
  return all[(i + 1) % all.length];
}
