"use client";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section data-shot="hero" className="relative flex min-h-screen flex-col justify-end px-6 pb-16 pt-32 md:px-12 md:pb-24">
      <Reveal trigger="load" delay={0.3} y={16}>
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-cream/75 on-scene">Developer & Designer — Open for new work</p>
      </Reveal>
      <h1 className="on-scene max-w-5xl text-[13vw] font-medium leading-[0.92] tracking-[-0.03em] md:text-[7.5vw]">
        <RevealText as="span" className="block" trigger="load" delay={0.4} stagger={0.06}>Building immersive</RevealText>
        <RevealText as="span" className="block text-bone/60" trigger="load" delay={0.6} stagger={0.06}>digital experiences.</RevealText>
      </h1>
      <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal trigger="load" delay={0.9} y={20}>
          <p className="max-w-md text-lg leading-relaxed text-cream/85 on-scene">
            I design and build websites where motion, 3D and typography work together — with performance and clarity as non-negotiables.
          </p>
        </Reveal>
        <Reveal trigger="load" delay={1.05} y={20}>
          <div className="flex gap-4">
            <Button href="/work">Explore work</Button>
            <Button href="/contact" variant="ghost">Start a project</Button>
          </div>
        </Reveal>
      </div>
      <Reveal trigger="load" delay={1.4} y={0} className="absolute bottom-6 right-6 hidden md:block md:right-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cream/70">Begin the climb ↓</span>
      </Reveal>
    </section>
  );
}
