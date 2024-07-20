import {
  DragControls,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import { World } from "./World";
import { useAppContext } from "../context/app";

export function Scene() {
  const { embeddings } = useAppContext();

  if (!embeddings?.length) {
    return null;
  }
  return (
    <Stage>
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      <DragControls>
        <World />
      </DragControls>
    </Stage>
  );
}
