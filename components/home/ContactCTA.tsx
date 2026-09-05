"use client";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export default function ContactCTA() {
  return (
    <section data-shot="contact" className="relative flex min-h-screen flex-col justify-center px-6 py-32 md:px-12">
      <div data-shot="approach" className="absolute left-0 top-0 h-px w-px" aria-hidden />
      <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-cream/70">03 / Contact</p>
      <h2 className="text-[14vw] font-medium leading-[0.9] tracking-[-0.04em] md:text-[9vw]">
        <RevealText as="span" className="block" stagger={0.08}>Let’s make</RevealText>
        <RevealText as="span" className="block text-accent transition-colors duration-700" stagger={0.08}>something.</RevealText>
      </h2>
      <Reveal className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <Button href="/contact">Start a project</Button>
        <a href="mailto:hello@raviarnan.dev" className="link-underline text-lg text-bone/70">hello@raviarnan.dev</a>
      </Reveal>
    </section>
  );
}
