"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { sceneState } from "@/store/scene";
import { useExperienceStore } from "@/store/experience";
import { prefersReducedMotion } from "@/lib/motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        sceneState.scroll = max > 0 ? window.scrollY / max : 0;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    setLenis(lenis);
    const skewTo = gsap.quickTo("#main", "skewY", { duration: 0.6, ease: "power3.out" });
    lenis.on("scroll", (l: Lenis) => {
      sceneState.scroll = l.progress;
      sceneState.velocity = l.velocity;
      skewTo(gsap.utils.clamp(-2.5, 2.5, l.velocity * 0.03));
      ScrollTrigger.update();
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (!useExperienceStore.getState().isLoaded) lenis.stop();
    const unsub = useExperienceStore.subscribe((s, prev) => { if (s.isLoaded && !prev.isLoaded) lenis.start(); });

    return () => { unsub(); gsap.ticker.remove(raf); lenis.destroy(); setLenis(null); };
  }, []);
  return <>{children}</>;
}
