"use client";
import TransitionLink from "./TransitionLink";
import ProjectImage from "./ProjectImage";
import Reveal from "./Reveal";
import { sceneState } from "@/store/scene";
import { useExperienceStore } from "@/store/experience";
import type { Project } from "@/lib/content";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const setHovered = useExperienceStore((s) => s.setHoveredProject);
  const enter = () => { sceneState.hoverTarget = 1; setHovered(project.slug); };
  const leave = () => { sceneState.hoverTarget = 0; setHovered(null); };
  return (
    <Reveal delay={index * 0.08} className="group">
      <TransitionLink href={`/work/${project.slug}`} onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave} data-cursor="View" className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <ProjectImage accent={project.accent} src={project.heroImage} alt={project.title} className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/20" />
          <span className="absolute left-4 top-4 font-mono text-xs text-bone/70">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="text-2xl font-medium tracking-tight transition-colors duration-500 group-hover:text-accent">{project.title}</h3>
          <span className="font-mono text-xs text-muted">{project.year}</span>
        </div>
        <p className="mt-1 text-sm text-muted">{project.category}</p>
      </TransitionLink>
    </Reveal>
  );
}
