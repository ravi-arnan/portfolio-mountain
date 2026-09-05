"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { useExperienceStore } from "@/store/experience";
import { prefersReducedMotion } from "@/lib/motion";

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const pendingHref = useExperienceStore((s) => s.pendingHref);
  const setPendingHref = useExperienceStore((s) => s.setPendingHref);
  const layerA = useRef<HTMLDivElement>(null);
  const layerB = useRef<HTMLDivElement>(null);
  const covered = useRef(false);
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (!pendingHref) return;
    if (prefersReducedMotion()) { router.push(pendingHref); setPendingHref(null); return; }
    getLenis()?.stop();
    gsap.set([layerA.current, layerB.current], { yPercent: 100 });
    const tl = gsap.timeline({ onComplete: () => { covered.current = true; router.push(pendingHref); } });
    tl.to(layerB.current, { yPercent: 0, duration: 0.55, ease: "expo.inOut" })
      .to(layerA.current, { yPercent: 0, duration: 0.55, ease: "expo.inOut" }, "-=0.45");
    return () => { tl.kill(); };
  }, [pendingHref, router, setPendingHref]);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    window.scrollTo(0, 0);
    getLenis()?.scrollTo(0, { immediate: true });
    if (!covered.current) { ScrollTrigger.refresh(); return; }
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      const tl = gsap.timeline({
        onComplete: () => {
          covered.current = false; setPendingHref(null); getLenis()?.start();
          gsap.set([layerA.current, layerB.current], { yPercent: 100 });
        },
      });
      tl.to(layerA.current, { yPercent: -100, duration: 0.65, ease: "expo.inOut" })
        .to(layerB.current, { yPercent: -100, duration: 0.65, ease: "expo.inOut" }, "-=0.5");
    }, 60);
    return () => clearTimeout(t);
  }, [pathname, setPendingHref]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div ref={layerB} className="absolute inset-0 bg-nebula translate-y-full border-t-2 border-ember" />
      <div ref={layerA} className="absolute inset-0 bg-void translate-y-full" />
    </div>
  );
}
