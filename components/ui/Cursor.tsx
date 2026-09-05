"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isTouchDevice, prefersReducedMotion } from "@/lib/motion";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  // 1) decide
  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;
    setEnabled(true);
  }, []);

  // 2) wire up only after the elements exist
  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.body.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power2.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power2.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    // start hidden until the first move, so nothing sits at (0,0)
    gsap.set([dot.current, ring.current], { opacity: 0 });
    let shown = false;

    const move = (e: MouseEvent) => {
      if (!shown) { shown = true; gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 }); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isField = !!t.closest("input, textarea, select");
      const el = t.closest<HTMLElement>("a, button, [data-cursor]");
      const text = el?.dataset.cursor ?? "";
      gsap.to(ring.current, {
        scale: text ? 3.2 : el ? 1.8 : 1,
        backgroundColor: text ? "rgba(242,235,225,1)" : "rgba(242,235,225,0)",
        opacity: isField ? 0 : 1, duration: 0.35, ease: "power3.out",
      });
      gsap.to(dot.current, { scale: el ? 0 : 1, opacity: isField ? 0 : 1, duration: 0.25 });
      if (label.current) { label.current.textContent = text; gsap.to(label.current, { opacity: text ? 1 : 0, duration: 0.2 }); }
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      document.body.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[95] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream mix-blend-difference" />
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[95] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/80 mix-blend-difference">
        <span ref={label} className="font-mono text-[9px] uppercase tracking-widest text-slate opacity-0" style={{ transform: "scale(0.31)" }} />
      </div>
    </>
  );
}
