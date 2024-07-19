import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import { World } from "./World";

export function Scene() {
  return (
    <Stage>
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      <World />
    </Stage>
  );
}
