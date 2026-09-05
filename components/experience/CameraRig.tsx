"use client";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { sceneState } from "@/store/scene";
import { terrainHeight } from "@/lib/terrain";

export function CameraRig() {
  const { size } = useThree();
  const pos = useMemo(() => new Vector3(0, 24, 105), []);
  const tgt = useMemo(() => new Vector3(0, 34, 0), []);
  const wantPos = useMemo(() => new Vector3(), []);
  const wantTgt = useMemo(() => new Vector3(), []);

  useFrame(({ camera }, delta) => {
    const c = sceneState.current;
    const k = 1 - Math.pow(0.02, delta);
    const narrow = size.width < 768;
    wantPos.set(c.cx, c.cy, c.cz);
    wantTgt.set(c.tx, c.ty + (narrow ? 10 : 0), c.tz); // phones: aim higher so the peak clears the copy
    pos.lerp(wantPos, k); tgt.lerp(wantTgt, k);

    camera.position.copy(pos);
    const minY = terrainHeight(camera.position.x, camera.position.z) + 6; // never clip into rock
    if (camera.position.y < minY) camera.position.y = minY;
    camera.lookAt(tgt);
    camera.translateX(sceneState.pointer.x * 1.4);
    camera.translateY(sceneState.pointer.y * 0.8);
    camera.lookAt(tgt);

    const pc = camera as PerspectiveCamera;
    const wantFov = c.fov - sceneState.hover * 3;
    if (Math.abs(pc.fov - wantFov) > 0.01) { pc.fov += (wantFov - pc.fov) * k; pc.updateProjectionMatrix(); }
  });
  return null;
}
