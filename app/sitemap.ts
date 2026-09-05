import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: base, lastModified: now },
    { url: `${base}/work`, lastModified: now },
    { url: `${base}/about`, lastModified: now },
    { url: `${base}/contact`, lastModified: now },
    ...getAllProjects().map((p) => ({ url: `${base}/work/${p.slug}`, lastModified: now })),
  ];
}
