"use client";
import { useEffect, useRef } from "react";
import { sceneState } from "@/store/scene";
import { atmo } from "@/lib/atmosphere";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Instruments() {
  const alt = useRef<HTMLSpanElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const temp = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const c = sceneState.current;
      const metres = Math.round(2210 + c.cy * 9);
      const hours = 5.65 + atmo.time * (23.5 - 5.65);
      const h = Math.floor(hours), m = Math.floor((hours - h) * 60);
      const deg = Math.round(6 - atmo.time * 20 - atmo.snow * 4);
      if (alt.current) alt.current.textContent = `${metres.toLocaleString("en").replace(/,/g, " ")} M`;
      if (time.current) time.current.textContent = `${pad(h)}:${pad(m)}`;
      if (temp.current) temp.current.textContent = `${deg > 0 ? "+" : ""}${deg}°C`;
      if (bar.current) bar.current.style.transform = `scaleX(${atmo.time})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed bottom-6 left-6 z-40 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-cream/90 on-scene md:block md:left-12">
      <div className="flex gap-6">
        <span>ALT <span ref={alt} className="tabular-nums text-cream">2 426 M</span></span>
        <span>TIME <span ref={time} className="tabular-nums text-cream">05:39</span></span>
        <span>TEMP <span ref={temp} className="tabular-nums text-cream">+6°C</span></span>
      </div>
      <div className="mt-2 h-px w-48 bg-cream/35">
        <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
