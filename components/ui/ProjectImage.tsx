"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type Props = { src?: string; alt: string; accent?: string; className?: string; priority?: boolean };

export default function ProjectImage({ src, alt, accent = "#6572FF", className = "", priority }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrap.current || !inner.current || prefersReducedMotion()) return;
    gsap.set(wrap.current, { clipPath: "inset(0 0 100% 0)" });
    gsap.set(inner.current, { scale: 1.25 });
    const st = ScrollTrigger.create({
      trigger: wrap.current, start: "top 85%", once: true,
      onEnter: () => {
        gsap.to(wrap.current, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.inOut" });
        gsap.to(inner.current, { scale: 1, duration: 1.8, ease: "expo.out", delay: 0.1 });
      },
    });
    return () => st.kill();
  }, []);
  return (
    <div ref={wrap} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        {src ? (
          <Image src={src} alt={alt} fill priority={priority} className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <div role="img" aria-label={alt} className="h-full w-full" style={{ background: `radial-gradient(120% 90% at 20% 10%, ${accent} 0%, #151923 60%, #090B10 100%)` }} />
        )}
      </div>
    </div>
  );
}
