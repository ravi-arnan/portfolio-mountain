"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useExperienceStore } from "@/store/experience";
import { prefersReducedMotion } from "@/lib/motion";

const MIN_MS = 2800;       // climb duration — the "moment"
const HOLD_MS = 450;       // pause at the peak before the curtain
const MAX_WAIT_MS = 6000;  // never block if WebGL hangs
const PEAK_M = 2847;

function formatM(n: number) {
  return `${Math.round(n).toLocaleString("en").replace(/,/g, "\u00A0")} M`;
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const setLoaded = useExperienceStore((s) => s.setLoaded);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setLoaded(true);
      setDone(true);
      return;
    }
    if (sessionStorage.getItem("seen-intro") === "1") {
      setLoaded(true);
      setDone(true);
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const started = performance.now();
    const state = { n: 0 };
    let armed = false;
    let finished = false;
    let holdTimer = 0;
    let maxTimer = 0;
    let curtain: gsap.core.Timeline | null = null;

    const climb = gsap.to(state, {
      n: 100,
      duration: MIN_MS / 1000,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter.current) counter.current.textContent = formatM((state.n / 100) * PEAK_M);
        if (bar.current) bar.current.style.transform = `scaleX(${state.n / 100})`;
      },
    });

    const playCurtain = () => {
      if (finished) return;
      finished = true;
      sessionStorage.setItem("seen-intro", "1");
      setLoaded(true);
      curtain = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setDone(true);
        },
      });
      curtain
        .to(".preloader-inner", { yPercent: -120, opacity: 0, duration: 0.7, ease: "power3.in" })
        .to(root.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.2");
    };

    const arm = () => {
      if (armed) return;
      armed = true;
      const remaining = Math.max(0, MIN_MS - (performance.now() - started));
      holdTimer = window.setTimeout(playCurtain, remaining + HOLD_MS);
    };

    const unsub = useExperienceStore.subscribe((s) => {
      if (s.isCanvasReady) arm();
    });
    if (useExperienceStore.getState().isCanvasReady) arm();
    maxTimer = window.setTimeout(arm, MAX_WAIT_MS);

    return () => {
      unsub();
      window.clearTimeout(holdTimer);
      window.clearTimeout(maxTimer);
      climb.kill();
      curtain?.kill();
      document.documentElement.style.overflow = "";
      // Intentionally do NOT write sessionStorage here.
      // Strict Mode remounts in dev; the intro must be allowed to play again.
    };
  }, [setLoaded]);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[100] flex items-end justify-between bg-slate px-6 pb-8 md:px-12 md:pb-12"
    >
      <div className="preloader-inner">
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.3em] text-muted">Ascending</span>
        <span ref={counter} className="block font-mono text-6xl tabular-nums md:text-8xl">
          0&nbsp;M
        </span>
      </div>
      <div className="preloader-inner font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Ravi Arnan — Portfolio
      </div>
      <div className="absolute bottom-0 left-0 h-px w-full bg-cream/15">
        <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
