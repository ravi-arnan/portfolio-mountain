"use client";
import { createElement, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useExperienceStore } from "@/store/experience";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  trigger?: "load" | "scroll";
  delay?: number;
  stagger?: number;
};

export default function RevealText({ children, as = "p", className = "", trigger = "scroll", delay = 0, stagger = 0.04 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const words = children.split(" ");

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(".reveal-word");
    if (prefersReducedMotion()) { gsap.set(targets, { yPercent: 0 }); return; }
    gsap.set(targets, { yPercent: 115 });
    const play = () => gsap.to(targets, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger, delay, overwrite: true });
    if (trigger === "load") {
      if (useExperienceStore.getState().isLoaded) { play(); return; }
      const unsub = useExperienceStore.subscribe((s) => { if (s.isLoaded) { play(); unsub(); } });
      return unsub;
    }
    const st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: play });
    return () => st.kill();
  }, [trigger, delay, stagger]);

  return createElement(
    as,
    { ref, className, "aria-label": children },
    words.map((w, i) => (
      <span key={i} className="reveal-line" aria-hidden>
        <span className="reveal-word">{w}</span>
        {i < words.length - 1 ? "\u00A0" : ""}
      </span>
    ))
  );
}
