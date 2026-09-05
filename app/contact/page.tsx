import type { Metadata } from "next";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="px-6 pb-32 pt-36 md:px-12 md:pt-48">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted">Contact</p>
      <RevealText as="h1" trigger="load" className="max-w-5xl text-5xl font-medium leading-[1] tracking-tight md:text-8xl" stagger={0.05}>
        Tell me about your project.
      </RevealText>
      <div className="mt-24 grid gap-16 md:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="text-lg leading-relaxed text-bone/70">Prefer email? <a href="mailto:hello@raviarnan.dev" className="link-underline text-bone">hello@raviarnan.dev</a></p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-muted">Response within 2 working days</p>
        </Reveal>
        <Reveal delay={0.1}><ContactForm /></Reveal>
      </div>
    </main>
  );
}
