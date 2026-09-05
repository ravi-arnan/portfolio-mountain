import type { Metadata } from "next";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="px-6 pb-32 pt-36 md:px-12 md:pt-48">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted">About</p>
      <RevealText as="h1" trigger="load" className="max-w-5xl text-5xl font-medium leading-[1] tracking-tight md:text-8xl" stagger={0.05}>
        Developer, designer, and occasional 3D tinkerer.
      </RevealText>
      <div className="mt-24 grid gap-16 md:grid-cols-2">
        <Reveal>
          <div className="prose">
            <p>I’m Ravi Arnan. I build websites and interfaces that are fast, considered and a little bit alive.</p>
            <p>My background sits between design and engineering — which means I care as much about type and spacing as I do about bundle size and frame rate.</p>
            <p>This section is a placeholder. Replace it with your real background, experience and what you’re looking for next.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted">Toolkit</h2>
          <ul className="grid grid-cols-2 gap-y-3 text-lg">
            {["TypeScript", "React / Next.js", "Three.js / R3F", "GLSL", "GSAP", "Figma", "Blender", "Node.js"].map((t) => (
              <li key={t} className="border-b border-bone/10 pb-3">{t}</li>
            ))}
          </ul>
          <div className="mt-12"><Button href="/contact">Get in touch</Button></div>
        </Reveal>
      </div>
    </main>
  );
}
