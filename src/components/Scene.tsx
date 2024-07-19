import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import { World } from "./World";
import { Embedding } from "../common/types";

interface SceneProps {
  selected: Embedding | null;
  onClick: (embedding: Embedding | null) => void;
}

export function Scene({ selected, onClick }: SceneProps) {
  return (
    <Stage>
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      <World selected={selected} onClick={onClick} />
    </Stage>
  );
}
