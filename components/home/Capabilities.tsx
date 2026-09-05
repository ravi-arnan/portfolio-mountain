import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import RevealText from "@/components/ui/RevealText";

const items = [
  { n: "01", title: "Creative development", body: "React, Next.js, TypeScript, WebGL, Three.js, GSAP — production-grade front-ends with motion built in." },
  { n: "02", title: "Interface design", body: "Typography-led layouts, design systems and prototypes that survive contact with real content." },
  { n: "03", title: "3D & motion", body: "Real-time scenes, shaders, and scroll choreography tuned for performance on every device." },
];

export default function Capabilities() {
  return (
    <section data-shot="about" className="px-6 py-24 md:px-12 md:py-40">
      <SectionHeading index="02 / About" title="What I do" />
      <div className="grid gap-16 md:grid-cols-[1fr_1.5fr]">
        <RevealText as="p" className="text-xl leading-relaxed text-bone/70 md:text-2xl" stagger={0.015}>
          I’m Ravi — an independent developer and designer. I partner with founders, studios and teams who want a website that performs as well as it looks.
        </RevealText>
        <ul className="divide-y divide-bone/10">
          {items.map((it, i) => (
            <li key={it.n}>
              <Reveal delay={i * 0.1} className="grid gap-3 py-8 md:grid-cols-[4rem_1fr]">
                <span className="font-mono text-xs text-cream/70">{it.n}</span>
                <div>
                  <h3 className="text-2xl font-medium tracking-tight">{it.title}</h3>
                  <p className="mt-2 max-w-lg text-bone/60">{it.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
