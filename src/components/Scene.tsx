import {
  DragControls,
  GizmoHelper,
  GizmoViewport,
  KeyboardControls,
  KeyboardControlsEntry,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import { useMemo, useState } from "react";
import { World } from "./World";

import { Controls } from "../common/types";
import { useSelector } from "@xstate/store/react";
import store from "../context";

export function Scene() {
  const embeddings = useSelector(store, (store) => store.context.embeddings);
  // random seed for center functionality
  const [seed, setSeed] = useState(Math.random());
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

  if (!embeddings?.length) {
    return null;
  }

  return (
    <KeyboardControls map={map}>
      <Stage
        center={{
          cacheKey: seed.toString(),
        }}
      >
        <OrbitControls makeDefault />
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <DragControls>
          <World center={() => setSeed(Math.random())} />
        </DragControls>
      </Stage>
    </KeyboardControls>
  );
}
