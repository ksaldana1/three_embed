import { Line, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo } from "react";
import { Embedding, SCALING_FACTOR, UMAP } from "../common/types";
import { useAppContext } from "../context/app";
import { Embed } from "./Embedding";
import { Controls } from "./Scene";

export function World() {
  const { state, dispatch } = useAppContext();
  useKeyboard();

  const embeddings = state.embeddings;
  const { scale } = useControls({
    scale: {
      value: SCALING_FACTOR,
      min: 0,
      step: 1,
    },
  });

  const selectedEmbedding = useMemo(() => {
    return state.embeddings.find((e) => e.id === state?.selectedId);
  }, [state.embeddings, state.selectedId]);

  const [currentPosition, neighborPositions] = useMemo(() => {
    const currentPosition = selectedEmbedding?.umap.map((x) => x * scale) ?? [];
    const neighbors = selectedEmbedding?.neighbors
      ?.map((id) => embeddings.find((embedding) => embedding.id === id))
      .map((embedding) => embedding?.umap.map((v) => v * scale) ?? []);
    return [currentPosition as UMAP, neighbors as Array<UMAP>];
  }, [scale, embeddings, selectedEmbedding]);

  return (
    <group>
      {embeddings.map((embedding) => {
        const fade = !!(
          state.selectedId &&
          embedding.id !== state.selectedId &&
          !selectedEmbedding?.neighbors.includes(embedding.id)
        );

        return (
          <Embed
            embedding={embedding}
            onClick={(embedding: Embedding | null) => {
              dispatch({
                type: "USER_CLICK_EMBEDDING",
                payload: {
                  embeddingId: embedding?.id ?? null,
                },
              });
            }}
            key={embedding.id}
            scale={scale}
            fade={fade}
          />
        );
      })}
      {neighborPositions?.map((neighborPosition, index) => {
        return (
          <Line
            key={`${state.selectedId}-${index}`}
            points={[currentPosition, neighborPosition]}
            color="black"
            lineWidth={1}
          />
        );
      })}
    </group>
  );
}

function useKeyboard() {
  const { camera } = useThree();
  const forwardPressed = useKeyboardControls<Controls>(
    (state) => state.forward
  );
  const backwardsPressed = useKeyboardControls<Controls>((state) => state.back);
  useFrame(() => {
    if (forwardPressed) {
      camera.position.z -= 10;
    }
    if (backwardsPressed) {
      camera.position.z += 10;
    }
  });
}
