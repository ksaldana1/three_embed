import {
  DragControls,
  GizmoHelper,
  GizmoViewport,
  KeyboardControls,
  KeyboardControlsEntry,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import { useMemo } from "react";
import { World } from "./World";

import { useAppContext } from "../context/app";

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}

export function Scene() {
  const { state } = useAppContext();
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  if (!state.embeddings?.length) {
    return null;
  }
  return (
    <KeyboardControls map={map}>
      <Stage>
        <OrbitControls makeDefault />
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <DragControls>
          <World />
        </DragControls>
      </Stage>
    </KeyboardControls>
  );
}
