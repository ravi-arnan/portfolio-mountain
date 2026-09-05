"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const beats = [
  { shot: "skim",   n: "01", line: "Perspective, first." },
  { shot: "behind", n: "02", line: "Then the hard part." },
  { shot: "rise",   n: "03", line: "Then the view." },
];

export default function Flyover() {
  const root = useRef<HTMLElement>(null);
  const [isStatic, setStatic] = useState(false);

  useEffect(() => {
    if (!root.current) return;
    if (prefersReducedMotion()) { setStatic(true); return; }
    const ctx = gsap.context(() => {
      root.current!.querySelectorAll<HTMLElement>("[data-beat]").forEach((marker) => {
        const cap = root.current!.querySelector<HTMLElement>(`[data-caption="${marker.dataset.beat}"]`);
        if (!cap) return;
        gsap.timeline({ scrollTrigger: { trigger: marker, start: "top 70%", end: "bottom 30%", scrub: 0.4 } })
          .fromTo(cap, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "none" })
          .to(cap, { opacity: 0, y: -40, ease: "none" }, "+=0.6");
      });
    }, root);
    return () => ctx.revert();
  }, []);

  if (isStatic) {
    return (
      <section className="px-6 py-32 md:px-12">
        <ul className="space-y-10">
          {beats.map((b) => (
            <li key={b.shot}>
              <span className="font-mono text-xs text-muted">{b.n}</span>
              <p className="mt-2 text-4xl font-medium tracking-tight md:text-6xl">{b.line}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={root} className="relative">
      <div className="pointer-events-none sticky top-0 flex h-screen items-center px-6 md:px-12">
        {beats.map((b) => (
          <div key={b.shot} data-caption={b.shot} className="absolute inset-x-6 opacity-0 md:inset-x-12">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{b.n}</span>
            <p className="mt-4 max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight md:text-7xl">{b.line}</p>
          </div>
        ))}
      </div>
      {beats.map((b) => (
        <div key={b.shot} data-beat={b.shot} data-shot={b.shot} className="h-screen" aria-hidden />
      ))}
    </section>
  );
}
