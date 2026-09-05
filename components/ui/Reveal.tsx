"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useExperienceStore } from "@/store/experience";
import { prefersReducedMotion } from "@/lib/motion";

type Props = { children: React.ReactNode; className?: string; delay?: number; y?: number; trigger?: "load" | "scroll" };

export default function Reveal({ children, className = "", delay = 0, y = 40, trigger = "scroll" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (prefersReducedMotion()) { gsap.set(el, { opacity: 1, y: 0 }); return; }
    gsap.set(el, { opacity: 0, y });
    const play = () => gsap.to(el, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", delay, overwrite: true });
    if (trigger === "load") {
      if (useExperienceStore.getState().isLoaded) { play(); return; }
      const unsub = useExperienceStore.subscribe((s) => { if (s.isLoaded) { play(); unsub(); } });
      return unsub;
    }
    const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: play });
    return () => st.kill();
  }, [delay, y, trigger]);
  return <div ref={ref} className={className}>{children}</div>;
}
