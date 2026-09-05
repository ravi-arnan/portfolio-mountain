"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState, SHOTS, type ShotName } from "@/store/scene";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Builds one scroll-scrubbed timeline through every [data-shot] marker on the page,
 * keyed to the scroll position where that marker is vertically centred.
 * Rebuilds on ScrollTrigger.refresh (resize, fonts, route return).
 */
export default function HomeChoreography() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let tl: gsap.core.Timeline | null = null;
    let st: ScrollTrigger | null = null;

    const build = () => {
      tl?.kill(); st?.kill();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const markers = Array.from(document.querySelectorAll<HTMLElement>("[data-shot]"));
      if (max <= 0 || !markers.length) return;

      const keys = markers
        .map((el) => {
          const r = el.getBoundingClientRect();
          const center = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
          return { shot: SHOTS[el.dataset.shot as ShotName], p: gsap.utils.clamp(0, 1, center / max) };
        })
        .filter((k) => k.shot)
        .sort((a, b) => a.p - b.p);

      tl = gsap.timeline({ paused: true });
      let prev = 0;
      keys.forEach((k, i) => {
        if (i === 0) { tl!.set(sceneState.current, { ...k.shot }, 0); prev = k.p; return; }
        tl!.to(sceneState.current, { ...k.shot, duration: Math.max(k.p - prev, 0.0001), ease: "sine.inOut" }, prev);
        prev = k.p;
      });
      if (prev < 1) tl.to({}, { duration: 1 - prev }, prev); // hold the final shot through the footer

      st = ScrollTrigger.create({ start: 0, end: "max", scrub: 0.6, animation: tl });
    };

    const id = requestAnimationFrame(build);
    ScrollTrigger.addEventListener("refresh", build);
    return () => {
      cancelAnimationFrame(id);
      ScrollTrigger.removeEventListener("refresh", build);
      tl?.kill(); st?.kill();
    };
  }, []);
  return null;
}
