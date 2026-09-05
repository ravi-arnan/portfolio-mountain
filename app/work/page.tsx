import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import ProjectCard from "@/components/ui/ProjectCard";
import RevealText from "@/components/ui/RevealText";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  const projects = getAllProjects();
  return (
    <main className="px-6 pb-32 pt-36 md:px-12 md:pt-48">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted">Work</p>
      <RevealText as="h1" trigger="load" className="mb-20 max-w-4xl text-5xl font-medium tracking-tight md:text-7xl" stagger={0.05}>
        Selected projects, experiments and collaborations.
      </RevealText>
      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
      </div>
    </main>
  );
}
