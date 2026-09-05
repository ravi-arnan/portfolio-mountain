"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useFrame } from "@react-three/fiber";
import { gsap } from "@/lib/gsap";
import { useExperienceStore } from "@/store/experience";
import { MODE_TARGETS, sceneState } from "@/store/scene";
import { updateAtmosphere } from "@/lib/atmosphere";

export function SceneController() {
  const pathname = usePathname();
  const mode = useExperienceStore((s) => s.mode);
  const setMode = useExperienceStore((s) => s.setMode);

  useEffect(() => {
    if (pathname === "/") setMode("hero");
    else if (pathname.startsWith("/work")) setMode("work");
    else if (pathname === "/about") setMode("about");
    else if (pathname === "/contact") setMode("contact");
  }, [pathname, setMode]);

  useEffect(() => {
    if (pathname === "/") return; // homepage is scroll-scrubbed by <HomeChoreography />
    const tween = gsap.to(sceneState.current, { ...MODE_TARGETS[mode], duration: 1.8, ease: "power3.inOut", overwrite: "auto" });
    return () => { tween.kill(); };
  }, [mode, pathname]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    sceneState.hover += (sceneState.hoverTarget - sceneState.hover) * Math.min(1, delta * 6);
    updateAtmosphere(sceneState.current.time);
  });
  return null;
}
