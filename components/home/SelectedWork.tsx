"use client";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import type { Project } from "@/lib/content";

export default function SelectedWork({ projects }: { projects: Project[] }) {
  return (
    <section data-shot="work" className="px-6 py-24 md:px-12 md:py-40">
      <SectionHeading index="01 / Work" title="Selected projects" />
      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
      </div>
      <Reveal className="mt-20 flex justify-center"><Button href="/work" variant="ghost">All projects</Button></Reveal>
    </section>
  );
}
