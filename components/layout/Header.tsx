"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import TransitionLink from "@/components/ui/TransitionLink";
import Magnetic from "@/components/ui/Magnetic";
import { useExperienceStore } from "@/store/experience";
import { prefersReducedMotion } from "@/lib/motion";

export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isLoaded = useExperienceStore((s) => s.isLoaded);

  useEffect(() => {
    if (!ref.current) return;
    if (prefersReducedMotion()) { gsap.set(ref.current, { y: 0, opacity: 1 }); return; }
    gsap.set(ref.current, { y: -24, opacity: 0 });
    if (isLoaded) gsap.to(ref.current, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.4 });
  }, [isLoaded]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        const shouldHide = self.direction === 1 && self.scroll() > 140;
        if (shouldHide !== hidden) { hidden = shouldHide; gsap.to(ref.current, { yPercent: hidden ? -110 : 0, duration: 0.6, ease: "power3.out" }); }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 text-cream">
      <div className="on-scene flex items-start justify-between px-6 py-5 md:px-12">
        <div className="flex flex-col gap-3">
          <TransitionLink href="/" className="text-sm font-medium tracking-[0.2em]">RAVI ARNAN</TransitionLink>
          <nav aria-label="Primary" className="flex gap-2">
            {[{ href: "/work", label: "Work" }, { href: "/about", label: "About" }].map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <TransitionLink key={l.href} href={l.href} aria-current={active ? "page" : undefined}
                  className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${active ? "border-cream bg-cream text-slate" : "border-cream/50 hover:border-cream"}`}>
                  {l.label}
                </TransitionLink>
              );
            })}
          </nav>
        </div>
        <Magnetic strength={0.2}>
          <TransitionLink href="/contact" className="border border-cream bg-cream px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-slate transition-colors duration-300 hover:bg-transparent hover:text-cream">
            Start a project
          </TransitionLink>
        </Magnetic>
      </div>
    </header>
  );
}
