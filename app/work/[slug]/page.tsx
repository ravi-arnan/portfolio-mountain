import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProjectBySlug, getAdjacentProject } from "@/lib/content";
import ProjectImage from "@/components/ui/ProjectImage";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import MdxImage from "@/components/ui/MdxImage";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() { return getAllProjects().map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params; const p = getProjectBySlug(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const next = getAdjacentProject(slug);

  return (
    <main className="pb-32 pt-36 md:pt-48">
      <div className="px-6 md:px-12">
        <Reveal trigger="load" y={10}>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted">{project.category} — {project.year}</p>
        </Reveal>
        <RevealText as="h1" trigger="load" delay={0.1} className="max-w-5xl text-5xl font-medium tracking-tight md:text-8xl" stagger={0.05}>{project.title}</RevealText>
        <Reveal trigger="load" delay={0.5} className="mt-8 max-w-2xl"><p className="text-xl leading-relaxed text-bone/70">{project.summary}</p></Reveal>
      </div>
      <div className="mt-16 px-6 md:mt-24 md:px-12">
        <ProjectImage accent={project.accent} src={project.heroImage} alt={project.title} priority className="aspect-[16/9] w-full" />
      </div>
      <div className="mt-24 grid gap-16 px-6 md:grid-cols-[1fr_2fr] md:px-12">
        <Reveal>
          <dl className="space-y-6 font-mono text-sm">
            <div><dt className="text-muted">Role</dt><dd className="mt-1">{project.category}</dd></div>
            <div>
              <dt className="text-muted">Services</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {project.services.map((s) => <span key={s} className="rounded-full border border-bone/20 px-3 py-1 text-xs">{s}</span>)}
              </dd>
            </div>
            <div><dt className="text-muted">Year</dt><dd className="mt-1">{project.year}</dd></div>
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="prose max-w-2xl"><MDXRemote source={project.content} components={{ img: MdxImage }} /></Reveal>
      </div>
      {next && (
        <div className="mt-40 px-6 md:px-12">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">Next project</p>
          <TransitionLink href={`/work/${next.slug}`} data-cursor="View" className="group block">
            <RevealText as="span" className="block text-5xl font-medium tracking-tight transition-colors group-hover:text-accent md:text-8xl">{next.title}</RevealText>
          </TransitionLink>
        </div>
      )}
    </main>
  );
}
